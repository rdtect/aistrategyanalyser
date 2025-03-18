<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { chats, chatActions } from '$lib/stores/chatStore';
  
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
      const chatId = await chatActions.createChat(chatName, {
        company: data.analysis.company,
        industry: data.analysis.industry,
        region: data.analysis.region
      });
      
      // Add initial message with analysis info
      chatActions.addMessage(chatId, {
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
        chatActions.addMessage(chatId, {
          id: crypto.randomUUID(),
          content: `## ${question.question}`,
          sender: 'user',
          timestamp: new Date(),
          status: 'sent'
        });
        
        chatActions.addMessage(chatId, {
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
          onclick={() => window.location.reload()}
          class="btn variant-soft-primary mt-4"
        >
          Retry
        </button>
      </div>
    {/if}
  </div>
</div> 