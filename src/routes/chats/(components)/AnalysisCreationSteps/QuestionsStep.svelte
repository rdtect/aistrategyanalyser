<script lang="ts">
  import { Accordion } from '@skeletonlabs/skeleton-svelte';
  import type { Question } from '$lib/data/category_question_prompts';

  // Icons used in this step
  import IconLightbulb from '@lucide/svelte/icons/lightbulb';
  import IconUsers from '@lucide/svelte/icons/users'; 
  import IconBarChart from '@lucide/svelte/icons/bar-chart-2';
  import IconTarget from '@lucide/svelte/icons/target';

  // Type for the category list structure
  type CategoryListItem = {
    name: string;
    questions: Question[];
  };

  // Props from parent
  let { 
    categoryList, 
    selectedQuestions = $bindable(), // Make bindable
    selectedQuestionsCount,
    selectedFramework,
    onToggleQuestion
  } = $props<{ 
    categoryList: CategoryListItem[];
    selectedQuestions: Record<string, boolean>;
    selectedQuestionsCount: number;
    selectedFramework: string;
    onToggleQuestion: (id: string) => void;
  }>();

  // Map category names to icons (adjust as needed)
  const categoryIcons: Record<string, any> = {
    'Market Analysis': IconBarChart,
    'Market Structure Analysis': IconBarChart,
    'Competitor Profiling & Benchmarking': IconTarget,
    'Competitive Strategies & Positioning': IconTarget,
    'Customer & Category Insights': IconUsers,
    default: IconLightbulb // Fallback icon
  };

  function getCategoryIcon(categoryName: string) {
    // Try direct match or fallback
    return categoryIcons[categoryName] || categoryIcons.default;
  }

</script>

<div class="space-y-4 step-content">
  <div class="card bg-primary-500/10 p-3 rounded-container-token mb-4">
    <p class="text-sm">
      {#if selectedFramework === 'consumer'}
        Select the consumer analysis questions you'd like to address.
      {:else}
        Select the questions you'd like to address in your strategic analysis.
      {/if}
      These will help guide the AI's responses to your specific needs.
    </p>
  </div>
  
  <div class="flex justify-between items-center">
    <h3 class="h5">Selected Questions: {selectedQuestionsCount}</h3>
  </div>
  
  <div class="space-y-4">
    <Accordion>
      {#each categoryList as categoryItem (categoryItem.name)} 
        {@const categoryName = categoryItem.name}
        {@const typedQuestions = categoryItem.questions}
        {@const CategoryIcon = getCategoryIcon(categoryName)} 
        <div data-type="AccordionItem" class="mb-4">
          <div class="text-token flex items-center p-4" role="button" tabindex="0" data-type="accordion-control">
            <div class="mr-4">
              <div class="bg-primary-500/20 p-2 rounded-full">
                <CategoryIcon size={20} class="text-primary-700" />
              </div>
            </div>
            <span>{categoryName}</span>
            <div class="ml-auto">
              <svg class="w-6 h-6 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9 6 6 6-6"></path>
              </svg>
            </div>
          </div>
          <div class="p-4 pt-0">
            <div class="space-y-1 py-2">
              {#each typedQuestions as questionItem (questionItem.id)} 
                <button 
                  type="button"
                  class="question-item p-2 rounded w-full text-left flex items-start {selectedQuestions[questionItem.id] ? 'selected' : ''}"
                  onclick={() => onToggleQuestion(questionItem.id)}
                  aria-pressed={selectedQuestions[questionItem.id] || false}
                >
                  <div class="checkbox mr-2 mt-0.5">
                    <input 
                      type="checkbox" 
                      checked={selectedQuestions[questionItem.id] || false} 
                      tabindex="-1" 
                      readonly 
                    />
                    <span class="checkbox-mark"></span>
                  </div>
                  <span class="text-sm">{questionItem.question}</span>
                </button>
              {/each}
            </div>
          </div>
        </div>
      {/each}
    </Accordion>
  </div>
</div>

<style>
  /* Styles moved from parent */
  .question-item {
    transition: all 0.2s ease;
  }
  .question-item:hover {
    background-color: rgba(var(--color-primary-500-rgb), 0.05);
  }
  .question-item.selected {
    background-color: rgba(var(--color-primary-500-rgb), 0.15);
    border-left: 3px solid rgb(var(--color-primary-500-rgb));
  }
</style>