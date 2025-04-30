<script lang="ts">
  import { Accordion } from '@skeletonlabs/skeleton-svelte';
  import type { ChatContext } from "$lib/types";
  import type { Question } from '../../data/category_question_prompts';
  import { getSystemPromptFromQuestion } from '../utils/promptUtils/index';

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
    onToggleQuestion,
    onSystemPromptChange // <-- new prop
  } = $props<{ 
    categoryList: CategoryListItem[];
    selectedQuestions: Record<string, boolean>;
    selectedQuestionsCount: number;
    selectedFramework: string;
    onToggleQuestion: (id: string) => void;
    onSystemPromptChange?: (prompt: string) => void;
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

  // Effect: When a question is toggled, update the system prompt
  $effect(() => {
    // Find the first selected question
    const selected = Object.entries(selectedQuestions).find(([id, val]) => val);
    if (selected) {
      const [selectedId] = selected;
      const category = categoryList.find((cat: CategoryListItem) => cat.questions.some((q: Question) => q.id === selectedId));
      if (category) {
        const prompt = getSystemPromptFromQuestion(category.name, selectedId);
        onSystemPromptChange?.(prompt);
      }
    }
  });

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
  
  <div class="space-y-0">
    <Accordion multiple classes="space-y-1">
      {#each categoryList as categoryItem (categoryItem.name)} 
        {@const categoryName = categoryItem.name}
        {@const typedQuestions = categoryItem.questions}
        {@const CategoryIcon = getCategoryIcon(categoryName)} 
        
        <Accordion.Item 
          value={categoryName} 
          classes="border border-surface-500/10 rounded-lg"
          controlPadding="p-3" 
          panelPadding="p-3 pt-0"
        >
          {#snippet control()}
            <div class="flex items-center gap-3">
              <div class="bg-primary-500/20 p-2 rounded-full">
                <CategoryIcon size={20} class="text-primary-700" />
              </div>
              <span>{categoryName}</span>
            </div>
          {/snippet}
          
          {#snippet panel()}
            <div class="space-y-1 py-2 border-t border-surface-500/10 mt-2">
              {#each typedQuestions as questionItem (questionItem.id)} 
                <label 
                  for={'question-' + questionItem.id} 
                  class="question-item p-2 rounded w-full text-left flex items-start {selectedQuestions[questionItem.id] ? 'selected' : ''} cursor-pointer" 
                  aria-pressed={undefined}
                >
                  <div class="checkbox mr-2 mt-0.5">
                    <input 
                      type="checkbox" 
                      id={'question-' + questionItem.id}
                      bind:checked={selectedQuestions[questionItem.id]}
                      readonly={undefined}
                      tabindex={undefined}
                    />
                    <span class="checkbox-mark"></span>
                  </div>
                  <span class="text-sm">{questionItem.question}</span>
                </label>
              {/each}
            </div>
          {/snippet}
        </Accordion.Item>
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