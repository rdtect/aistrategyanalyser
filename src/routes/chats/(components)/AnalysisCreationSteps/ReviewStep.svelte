<script lang="ts">
  import type { ChatContext } from '$lib/types';
  import type { Question } from '$lib/data/category_question_prompts';

  // Icons used in this step
  import IconChecks from '@lucide/svelte/icons/check-check';

  // Type for the category list structure (assuming similar structure as passed)
  type CategoryListItem = {
    name: string;
    questions: Question[];
  };

  // Props from parent
  let { 
    analysisName, 
    selectedFramework, 
    context, 
    selectedQuestionsCount, 
    categoryList, 
    selectedQuestions 
  } = $props<{ 
    analysisName: string;
    selectedFramework: string;
    context: ChatContext;
    selectedQuestionsCount: number;
    categoryList: CategoryListItem[];
    selectedQuestions: Record<string, boolean>;
  }>();

</script>

<div class="space-y-4 step-content">
  <h3 class="h4 mb-4">Review Analysis Details</h3>
  
  <div class="card preset-tonal-primary p-4 rounded-container-token border border-primary-600">
    <dl class="space-y-2">
      <div class="grid grid-cols-[120px_1fr]">
        <dt class="font-medium">Name:</dt>
        <dd>{analysisName || 'Auto-generated from context'}</dd>
      </div>
      
      <div class="grid grid-cols-[120px_1fr]">
        <dt class="font-medium">Framework:</dt>
        <dd>
          {#if selectedFramework === 'consumer'}
            Consumer Analysis
          {:else if selectedFramework === 'company'}
            Company Analysis
          {:else if selectedFramework === 'competitors'}
            Competitor Analysis
          {:else if selectedFramework === 'context'}
            Context Analysis
          {:else if selectedFramework === 'all'}
            4C's Complete Analysis
          {:else}
            Framework Not Selected
          {/if}
        </dd>
      </div>
      
      <div class="grid grid-cols-[120px_1fr]">
        <dt class="font-medium">Company:</dt>
        <dd>{context.company || 'N/A'}</dd>
      </div>
      
      <div class="grid grid-cols-[120px_1fr]">
        <dt class="font-medium">Industry:</dt>
        <dd>{context.industry || 'N/A'}</dd>
      </div>
      
      <div class="grid grid-cols-[120px_1fr]">
        <dt class="font-medium">Region:</dt>
        <dd>{context.region || 'N/A'}</dd>
      </div>
      
      {#if context.competitors?.length}
        <div class="grid grid-cols-[120px_1fr]">
          <dt class="font-medium">Competitors:</dt>
          <dd>
            <div class="flex flex-wrap gap-1">
              {#each context.competitors as competitor}
                <span class="tag preset-filled-primary-500 px-2 py-1 text-xs rounded-token">
                  {competitor}
                </span>
              {/each}
            </div>
          </dd>
        </div>
      {/if}
      
      {#if context.additionalInfo}
        <div class="col-span-2 mt-2">
          <dt class="font-medium mb-1">Additional Context:</dt>
          <dd class="bg-surface-200-800-token p-2 rounded text-sm">{context.additionalInfo}</dd>
        </div>
      {/if}
    </dl>
  </div>
  
  <div class="card p-3 rounded-container-token border border-primary-600">
    <h4 class="text-sm font-medium mb-2">Selected Questions:</h4>
    <div class="space-y-3">
      {#each categoryList as categoryItem}
        {@const categoryName = categoryItem.name}
        {@const typedQuestions = categoryItem.questions}
        {@const categoryQuestions = typedQuestions.filter((q: Question) => selectedQuestions[q.id])}
        {#if categoryQuestions.length > 0}
          <div>
            <h5 class="text-xs font-medium text-primary-500">{categoryName}</h5>
            <ul class="list-disc list-inside">
              {#each categoryQuestions as questionItem (questionItem.id)}
                <li class="text-sm">{questionItem.question}</li>
              {/each}
            </ul>
          </div>
        {/if}
      {/each}
      
      {#if selectedQuestionsCount === 0}
        <p class="text-sm">No specific questions selected. A general analysis will be provided.</p>
      {/if}
    </div>
  </div>
  
  <div class="info-box">
    <div class="flex items-start gap-2">
      <IconChecks class="mt-0.5 text-primary-500 shrink-0" size={16} />
      <p class="text-sm">
        The AI assistant will use this information to provide targeted strategic analysis. You can always add more details during your conversation.
      </p>
    </div>
  </div>
</div>

<style>
  /* Styles from parent, potentially scope or move to global */
  .info-box {
    background-color: rgba(var(--color-primary-500-rgb), 0.1);
    border-left: 4px solid var(--color-primary-500);
    padding: 0.75rem;
    margin: 0.75rem 0;
    border-radius: 0.25rem;
  }

  /* Assuming step-content animation is handled by parent or global */
</style>
