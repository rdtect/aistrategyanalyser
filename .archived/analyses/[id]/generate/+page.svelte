<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { chatStore } from "$lib/stores/chatStore.svelte";
  
  // Import the functions directly from chatStore
  const { createNewChat, handleMessageSubmit, deleteChat } = chatStore;
  
  // Create wrapper functions with the correct signature
  const chatActions = {
    // Add a wrapper for createChat that combines name and options
    createChat: async (name: string, options: any) => {
      return await createNewChat({
        name,
        company: options.company,
        industry: options.industry,
        region: options.region,
        context: ''  // Add empty context since it's required in the signature
      });
    },
    
    // Add a wrapper for sendMessage to handle the chatId and message together
    sendMessage: (chatId: string, message: any) => {
      if (!chatId) {
        console.error("Cannot send message: No chat ID provided");
        throw new Error("Cannot send message: Invalid chat ID");
      }

      // First make sure the right chat is selected
      chatStore.switchChat(chatId);
      
      // Validate that the chat exists and is selected
      if (chatStore.currentChatId !== chatId) {
        console.error(`Failed to switch to chat ${chatId}`);
        throw new Error("Failed to switch to chat");
      }
      
      // Then send the message content
      return handleMessageSubmit(message.content);
    },
    
    // Keep deleteChat as is
    deleteChat
  };
  
  // Get analysis data and questions
  let { data } = $props<{ data: { analysis: any, questions: any[] } }>();
  
  // Progress state
  let currentQuestion = $state(0);
  let responses = $state<Array<{ id: string, question: string, answer: string }>>([]);
  let isGenerating = $state(true);
  let error = $state<string | null>(null);
  
  // Computed values
  const totalQuestions = $derived(data.questions.length);
  const progress = $derived(Math.round((currentQuestion / totalQuestions) * 100));
  const currentQuestionText = $derived(
    currentQuestion < totalQuestions 
      ? data.questions[currentQuestion].question 
      : ''
  );
  
  // Generate all responses
  async function generateResponses() {
    try {
      // Create a new chat for this analysis
      const chatName = `${data.analysis.company} | ${data.analysis.industry} | ${data.analysis.region}`;
      
      console.log("Creating new chat:", chatName);
      const chatId = await chatActions.createChat(chatName, {
        company: data.analysis.company,
        industry: data.analysis.industry,
        region: data.analysis.region
      });
      
      console.log("Created chat with ID:", chatId);
      
      if (!chatId) {
        throw new Error("Failed to create chat - no ID returned");
      }
      
      // Add initial message with analysis info
      chatActions.sendMessage(chatId, {
        id: crypto.randomUUID(),
        content: `# Strategic Analysis\n\n**Company:** ${data.analysis.company}\n**Industry:** ${data.analysis.industry}\n**Region:** ${data.analysis.region}\n\n${data.analysis.additionalContext ? `**Additional Context:** ${data.analysis.additionalContext}` : ''}`,
        sender: 'user',
        timestamp: new Date(),
        status: 'sent'
      });
      
      // Process each question
      for (let i = 0; i < data.questions.length; i++) {
        currentQuestion = i;
        const question = data.questions[i];
        
        // Call OpenAI Responses API
        const response = await fetch('/api/ai/response', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: question.prompt,
            options: {
              model: "gpt-4o",
              tools: [{ type: "web_search_preview" }],
              system: `You are performing a strategic analysis using the 4C's framework. Your response should be comprehensive and well-structured for ${data.analysis.company} in the ${data.analysis.industry} industry. Include specific insights, data points, and actionable takeaways. Cite sources when possible.`
            }
          })
        });
        
        if (!response.ok) throw new Error(`Failed to generate response for question ${i+1}`);
        
        const result = await response.json();
        
        // Store response
        responses.push({
          id: question.id,
          question: question.question,
          answer: result.response.content
        });
        
        // Add Q&A to chat
        chatActions.sendMessage(chatId, {
          id: crypto.randomUUID(),
          content: `## ${question.question}`,
          sender: 'user',
          timestamp: new Date(),
          status: 'sent'
        });
        
        chatActions.sendMessage(chatId, {
          id: crypto.randomUUID(),
          content: result.response.content,
          sender: 'ai',
          timestamp: new Date(),
          status: 'completed'
        });
      }
      
      // Update progress and save responses
      currentQuestion = totalQuestions;
      await saveResponses(chatId);
      
      // Navigate to chat
      setTimeout(() => {
        goto(`/chats/${chatId}`);
      }, 2000);
      
    } catch (err: unknown) {
      console.error('Error generating analysis:', err);
      error = err instanceof Error ? err.message : 'Failed to generate analysis';
      isGenerating = false;
    }
  }
  
  // Save responses to database
  async function saveResponses(chatId: string) {
    try {
      await fetch(`/api/analyses/${data.analysis.id}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          responses,
          chatId
        })
      });
    } catch (err) {
      console.error('Error saving responses:', err);
    }
  }
  
  // Function to handle retry button click
  function handleRetry() {
    window.location.reload();
  }
  
  // Start generation on mount
  onMount(() => {
    generateResponses();
  });
</script>

<div class="container mx-auto max-w-2xl p-4 text-center">
  <h1 class="text-2xl font-bold mb-6">Generating Strategic Analysis</h1>
  
  <div class="card p-6">
    <div class="progress-track">
      <div 
        class="progress-bar bg-primary-500" 
        style="width: {progress}%;"
      ></div>
    </div>
    
    <div class="mt-4">
      <p class="text-lg font-medium">
        {isGenerating ? (
          currentQuestion < totalQuestions 
            ? `Analyzing: ${currentQuestionText}`
            : 'Finalizing analysis...'
        ) : (
          error 
            ? 'Analysis generation failed' 
            : 'Analysis complete!'
        )}
      </p>
      
      <p class="text-sm text-surface-600 mt-2">
        {currentQuestion}/{totalQuestions} questions processed
      </p>
    </div>
    
    {#if error}
      <div class="mt-6 text-red-500">
        <p>{error}</p>
        <button 
          onclick={handleRetry}
          class="btn variant-soft-primary mt-4"
        >
          Retry
        </button>
      </div>
    {/if}
  </div>
</div> 