<script lang="ts">
    import { Accordion } from '@skeletonlabs/skeleton-svelte';
    import { Modal } from '@skeletonlabs/skeleton-svelte';
    import IconX from 'lucide-svelte/icons/x';
    import categoryQuestionPrompts from '$lib/data/category_question_prompts.json';
    import { analysisState } from './contextState.svelte.ts';
    import AnalysisProgress from './AnalysisProgress.svelte';

    // Type for the question data
    type QuestionData = {
        id: string;
        question: string;
        method: string;
        prompt: {
            [key: string]: string;
        };
    };

    let { open = false, onClose } = $props<{
        open: boolean;
        onClose: () => void;
    }>();
    

    function handleClose() {
        analysisState.step = 1;
        analysisState.companyInfo = {
            company: '',
            region: '',
            industry: '',
            context: ''
        };
        analysisState.selectedQuestions = {};
        onClose();
    }

    function handleCompanySubmit(event: SubmitEvent) {
        event.preventDefault();
        analysisState.step = 2;
    }

    function handleQuestionsSubmit(event: SubmitEvent) {
        event.preventDefault();
        analysisState.step = 3;
    }
</script>

<Modal
    {open}
    onOpenChange={(e) => {
        if (!e.open) onClose();
    }}
    backdropClasses="bg-black/50 backdrop-blur-sm"
    contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] aspect-[4/3] m-auto"
>
    {#snippet trigger()}
        <span class="btn variant-filled-primary">
            + New Analysis
        </span>
    {/snippet}

    {#snippet content()}
        <header class="flex justify-between items-center mb-4">
            <h3 class="h3">
                {analysisState.step === 1 ? 'Company Details' : 
                 analysisState.step === 2 ? 'Select Questions' : 
                 'Analysis Progress'}
            </h3>
            <button type="button" class="btn-icon" onclick={handleClose}>
                <IconX />
            </button>
        </header>

        {#if analysisState.step === 1}
            <form 
                class="space-y-4" 
                onsubmit={handleCompanySubmit}
            >
                <label class="label">
                    <span>Company</span>
                    <input 
                        bind:value={analysisState.companyInfo.company} 
                        class="input"
                        required
                    />
                </label>
                
                <label class="label">
                    <span>Region</span>
                    <input 
                        bind:value={analysisState.companyInfo.region} 
                        class="input"
                        required
                    />
                </label>

                <label class="label">
                    <span>Industry</span>
                    <input 
                        bind:value={analysisState.companyInfo.industry} 
                        class="input"
                        required
                    />
                </label>

                <label class="label">
                    <span>Additional Context (optional)</span>
                    <textarea 
                        bind:value={analysisState.companyInfo.context} 
                        class="textarea"
                    ></textarea>
                </label>

                <div class="flex justify-end gap-2">
                    <button 
                        type="button"
                        class="btn variant-filled" 
                        onclick={handleClose}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        class="btn variant-filled-primary" 
                    >
                        Next
                    </button>
                </div>
            </form>

        {:else if analysisState.step === 2}
            <form 
                class="space-y-4"
                onsubmit={handleQuestionsSubmit}
            >
                <div class="space-y-2">
                    <Accordion>
                        {#each Object.entries(categoryQuestionPrompts) as [category, questions]}
                            <Accordion.Item value={category}>
                                {#snippet lead()}<span class="badge variant-filled">
                                    {questions.filter(q => analysisState.selectedQuestions[q.id]).length}
                                </span>{/snippet}
                                {#snippet control()}{category}{/snippet}
                                {#snippet panel()}
                                    <div class="space-y-2">
                                        {#each questions as { id, question } (id)}
                                            <label class="flex items-start gap-2">
                                                <input
                                                    type="checkbox"
                                                    bind:checked={analysisState.selectedQuestions[id]}
                                                    class="checkbox"
                                                />
                                                <span>{question}</span>
                                            </label>
                                        {/each}
                                    </div>
                                {/snippet}
                            </Accordion.Item>
                        {/each}
                    </Accordion>
                </div>

                <div class="flex justify-end gap-2">
                    <button 
                        type="button"
                        class="btn variant-filled" 
                        onclick={() => analysisState.step = 1}
                    >
                        Back
                    </button>
                    <button 
                        type="submit"
                        class="btn variant-filled-primary" 
                        disabled={Object.values(analysisState.selectedQuestions).filter(Boolean).length === 0}
                    >
                        Start Analysis
                    </button>
                </div>
            </form>
        {:else if analysisState.step === 3}
            <AnalysisProgress
                onComplete={() => {
                    handleClose();
                    // Navigation now happens in the AnalysisProgress or Screen3Progress component
                    // No need to handle navigation here, as it would be redundant
                }}
                onError={() => {
                    // Handle error state
                    console.error("Analysis preparation failed");
                }}
            />
        {:else}
            <div>Analysis in progress...</div>
        {/if}
    {/snippet}
</Modal>
