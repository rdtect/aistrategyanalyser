<script lang="ts">
    import { Accordion } from '@skeletonlabs/skeleton-svelte';
    import { ChevronRight, CheckSquare, Square } from 'lucide-svelte';
    import categoryQuestionPrompts from '$lib/data/category_question_prompts.json';

    interface QuestionData {
        id: string;
        question: string;
        method: string;
        prompt?: {
            'Role Definition': string;
            'Task Description': string;
            'Output Format': string;
            'Style Guidelines': string;
            Constraints: string;
        };
    }

    interface CategoryQuestions {
        [key: string]: QuestionData[];
    }

   
    let {selected,onUpdate,onNext,onBack,isValid} =$props()

    // Local state
    let error = $state('');
    let accordionValue = $state(['category1']);
    let formData = $state({
        selectedQuestions: selected
    });

    // Type assertion for the imported data
    const typedCategoryQuestionPrompts = categoryQuestionPrompts as CategoryQuestions;

    // Calculate selected questions per category
    const categoryStats = $derived(
        Object.entries(typedCategoryQuestionPrompts).reduce((acc, [category, questions]) => {
            const totalQuestions = questions.length;
            const selectedCount = questions.filter(q => formData.selectedQuestions[q.id]).length;
            acc[category] = {
                total: totalQuestions,
                selected: selectedCount,
                percentage: (selectedCount / totalQuestions) * 100
            };
            return acc;
        }, {} as Record<string, { total: number; selected: number; percentage: number }>)
    );

    function toggleAllQuestionsInCategory(categoryName: string, event: Event) {
        event.stopPropagation();
        const stats = categoryStats[categoryName];
        const shouldSelect = stats.selected === 0 || stats.selected < stats.total;
        
        const questions = typedCategoryQuestionPrompts[categoryName] || [];
        questions.forEach(question => {
            formData.selectedQuestions[question.id] = shouldSelect;
        });
        formData.selectedQuestions = { ...formData.selectedQuestions };
        onUpdate(formData.selectedQuestions);
    }

    function handleNext() {
        const hasSelection = Object.values(formData.selectedQuestions).some(Boolean);
        if (!hasSelection) {
            error = 'Please select at least one question';
            return;
        }
        error = '';
        onNext();
    }

    function getProgressColor(percentage: number): string {
        if (percentage === 0) return 'bg-surface-500/20';
        if (percentage === 100) return 'bg-primary-500';
        return 'bg-primary-500/50';
    }

    function handleClick(event: MouseEvent): void {
        onBack();
    }

    // Watch for changes in selected questions and update parent
    $effect(() => {
        onUpdate(formData.selectedQuestions);
    });
</script>

<div class="space-y-4">
    <Accordion
        value={accordionValue}
        onValueChange={(e) => accordionValue = e.value}
        multiple
        collapsible
    >
        {#each Object.entries(typedCategoryQuestionPrompts) as [categoryName, questions]}
            <Accordion.Item value={categoryName} base="relative">
                {#snippet lead()}
                    <div class="accordion-lead">{categoryName}</div>
                    <div 
                        class="absolute left-0 top-0 h-full transition-all duration-200 -z-10 {getProgressColor(categoryStats[categoryName].percentage)}"
                        style="width: {categoryStats[categoryName].percentage}%"
                    ></div>
                {/snippet}
                
                {#snippet control()}
                    <div class="flex items-center justify-between w-full">
                        <div class="flex-1">
                            <span class="font-semibold">{categoryName}</span>
                            <span class="text-sm opacity-70 ml-2">
                                ({categoryStats[categoryName].selected}/{categoryStats[categoryName].total})
                            </span>
                        </div>
                        <button 
                            type="button"
                            class="btn btn-sm variant-soft"
                            onclick={(event) => toggleAllQuestionsInCategory(categoryName, event)}
                        >
                            {#if categoryStats[categoryName].selected === categoryStats[categoryName].total}
                                <CheckSquare class="h-4 w-4 mr-2" />
                                Unselect All
                            {:else}
                                <Square class="h-4 w-4 mr-2" />
                                Select All
                            {/if}
                        </button>
                    </div>
                {/snippet}
                
                {#snippet panel()}
                    <div class="space-y-2 max-h-[200px] overflow-y-auto p-2">
                        {#each questions as question (question.id)}
                            <label class="flex items-start space-x-2 p-2 hover:bg-surface-800 rounded cursor-pointer">
                                <input
                                    type="checkbox"
                                    bind:checked={formData.selectedQuestions[question.id]}
                                    class="checkbox"
                                />
                                <span class="text-sm">{question.question}</span>
                            </label>
                        {/each}
                    </div>
                {/snippet}
            </Accordion.Item>
            <hr class="hr" />
        {/each}
    </Accordion>
    
    {#if error}
        <p class="text-error-500">{error}</p>
    {/if}

    <div class="flex justify-between space-x-2 mt-4">
        <button 
            type="button" 
            class="btn variant-soft"
            onclick={handleClick}
        >
            Back
        </button>
        <button 
            type="button" 
            class="btn variant-filled-primary"
            onclick={handleNext}
        >
            Start Analysis
        </button>
    </div>
</div>
