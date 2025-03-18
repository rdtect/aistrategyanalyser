<script lang="ts">
  import { goto } from '$app/navigation';
  import CheckSquare from 'lucide-svelte/icons/check-square';
  import Square from 'lucide-svelte/icons/square';
  
  // Load analysis data
  let { data } = $props<{ data: { analysis: any } }>();
  
  // Available questions with prompts
  const availableQuestions = $state([
    {
      id: 'company_overview',
      question: 'Company Overview & Business Model',
      prompt: `Provide a comprehensive overview of ${data.analysis.company} and its business model. Include primary products/services, revenue streams, key markets, and value proposition.`,
      selected: true
    },
    {
      id: 'competitor_analysis',
      question: 'Competitor Analysis',
      prompt: `Analyze the key competitors of ${data.analysis.company} in the ${data.analysis.industry} industry. Identify their strengths, weaknesses, market share, and competitive advantages.`,
      selected: true
    },
    {
      id: 'customer_insights',
      question: 'Customer Analysis',
      prompt: `Analyze the customer base of ${data.analysis.company}. Identify key customer segments, needs, behaviors, and trends in the ${data.analysis.industry} industry.`,
      selected: true
    },
    {
      id: 'industry_context',
      question: 'Industry & Market Context',
      prompt: `Analyze the ${data.analysis.industry} industry landscape in ${data.analysis.region}, including market size, growth rates, trends, regulations, and technological disruptions.`,
      selected: true
    },
    {
      id: 'opportunities',
      question: 'Strategic Opportunities',
      prompt: `Based on the 4C's analysis, identify strategic opportunities for ${data.analysis.company} in the ${data.analysis.industry} industry. Consider growth areas, innovation possibilities, and competitive gaps.`,
      selected: false
    },
    {
      id: 'threats',
      question: 'Threats & Challenges',
      prompt: `Identify key threats and challenges facing ${data.analysis.company} in the ${data.analysis.industry} industry. Consider market, competitive, regulatory, and technological challenges.`,
      selected: false
    },
    {
      id: 'recommendations',
      question: 'Strategic Recommendations',
      prompt: `Provide strategic recommendations for ${data.analysis.company} based on the 4C's analysis. Include specific actionable steps to improve competitive positioning.`,
      selected: false
    }
  ]);
  
  // Custom question input
  let customQuestion = $state('');
  let customPrompt = $state('');
  
  // Selected questions count
  const selectedCount = $derived(
    availableQuestions.filter(q => q.selected).length
  );
  
  // Toggle question selection
  function toggleQuestion(index: number) {
    availableQuestions[index].selected = !availableQuestions[index].selected;
  }
  
  // Add custom question
  function addCustomQuestion() {
    if (!customQuestion.trim()) return;
    
    availableQuestions.push({
      id: `custom_${availableQuestions.length}`,
      question: customQuestion,
      prompt: customPrompt || customQuestion,
      selected: true
    });
    
    customQuestion = '';
    customPrompt = '';
  }
  
  // Start analysis with selected questions
  async function startAnalysis() {
    if (selectedCount === 0) return;
    
    const selectedQuestions = availableQuestions.filter(q => q.selected);
    
    try {
      // Save selected questions
      const response = await fetch(`/api/analyses/${data.analysis.id}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions: selectedQuestions })
      });
      
      if (!response.ok) throw new Error('Failed to save questions');
      
      // Navigate to analysis generation page
      goto(`/analyses/${data.analysis.id}/generate`);
    } catch (error) {
      console.error('Error saving questions:', error);
    }
  }
</script>

<div class="container mx-auto max-w-3xl p-4">
  <h1 class="text-2xl font-bold mb-2">Select Analysis Questions</h1>
  <p class="text-surface-600 mb-6">
    For {data.analysis.company} in {data.analysis.industry} ({data.analysis.region})
  </p>
  
  <div class="card p-4 mb-6">
    <h2 class="h4 mb-2">Standard Questions</h2>
    <p class="text-sm text-surface-600 mb-4">
      Select the questions you'd like included in your strategic analysis.
    </p>
    
    <div class="space-y-3">
      {#each availableQuestions as question, i}
        <button 
          class="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-hover cursor-pointer w-full text-left"
          onclick={() => toggleQuestion(i)}
          aria-pressed={question.selected}
        >
          <div class="mt-0.5">
            {#if question.selected}
              <CheckSquare class="text-primary-500" />
            {:else}
              <Square class="text-surface-400" />
            {/if}
          </div>
          <div>
            <h3 class="font-medium">{question.question}</h3>
            <p class="text-sm text-surface-600">{question.prompt}</p>
          </div>
        </button>
      {/each}
    </div>
  </div>
  
  <div class="card p-4 mb-6">
    <h2 class="h4 mb-3">Add Custom Question</h2>
    
    <div class="space-y-3">
      <div class="form-group">
        <label for="customQuestion" class="label">Question</label>
        <input 
          id="customQuestion" 
          bind:value={customQuestion}
          class="input" 
          placeholder="Enter your custom question..."
        />
      </div>
      
      <div class="form-group">
        <label for="customPrompt" class="label">Prompt (Optional)</label>
        <textarea 
          id="customPrompt" 
          bind:value={customPrompt}
          class="textarea" 
          rows="3"
          placeholder="Enter a specific prompt for the AI to answer this question..."
        ></textarea>
      </div>
      
      <button 
        onclick={addCustomQuestion}
        class="btn variant-soft-primary"
        disabled={!customQuestion.trim()}
      >
        Add Question
      </button>
    </div>
  </div>
  
  <div class="flex justify-between items-center">
    <span class="text-sm">
      {selectedCount} question{selectedCount !== 1 ? 's' : ''} selected
    </span>
    
    <button 
      onclick={startAnalysis}
      class="btn variant-filled-primary"
      disabled={selectedCount === 0}
    >
      Start Analysis
    </button>
  </div>
</div> 