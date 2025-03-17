<script lang="ts">
    import { ProgressRing } from '@skeletonlabs/skeleton-svelte';
    import { analysisState, initializeAnalysis } from './contextState.svelte.ts';
    import { onMount } from 'svelte';
    import { chatStore } from '../Chat.svelte.ts';

    let { formData, onComplete } = $props<{
        formData: {
            company: string;
            region: string;
            industry: string;
            context: string;
            selectedQuestions: Record<string, boolean>;
        };
        onComplete: () => void;
    }>();

    let isPreparationComplete = $state(false);
    let newChatId = $state<number | null>(null);

    let progress = $derived(
        analysisState.analysisProgress.total === 0 
            ? 0 
            : Math.round(
                (analysisState.analysisProgress.completed / analysisState.analysisProgress.total) * 100
              )
    );

    async function prepareAnalysis() {
        try {
            newChatId = await initializeAnalysis();
            isPreparationComplete = true;
        } catch (error) {
            console.error('Error preparing analysis:', error);
        }
    }

    // Start preparation when component mounts
    $effect(() => {
        prepareAnalysis();
    });
</script>

<div class="space-y-6">
    <div class="card p-4 variant-filled-surface">
        <h4 class="h4 mb-2">Preparing Analysis</h4>
        <div class="space-y-1">
            <p><strong>Company:</strong> {formData.company}</p>
            <p><strong>Industry:</strong> {formData.industry}</p>
            <p><strong>Region:</strong> {formData.region}</p>
        </div>
    </div>

    <div class="flex flex-col items-center gap-4">
        <ProgressRing 
            value={progress}
            strokeWidth="4px"
            meterStroke="stroke-primary-500"
            trackStroke="stroke-surface-500/30"
            strokeLinecap="round"
            showLabel={true}
        />

        {#if isPreparationComplete}
            <div class="flex justify-center w-full">
                <button 
                    class="btn variant-filled-primary"
                    onclick={() => {
                        onComplete();
                        if (newChatId !== null) {
                            // You might want to add navigation to the new chat here
                            chatStore.switchChat(newChatId);
                        }
                    }}
                >
                    Go to Analysis Chat
                </button>
            </div>
        {:else}
            <p>Preparing questions...</p>
        {/if}
    </div>
</div>