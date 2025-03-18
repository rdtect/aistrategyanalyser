<script lang="ts">
    import { ProgressRing } from '@skeletonlabs/skeleton-svelte';
    import { analysisState, initializeAnalysis } from './contextState.svelte.ts';
    import { chatStore } from '../Chat.svelte.ts';

    let { onClose } = $props<{
        onClose: () => void;
    }>();

    let isPreparationComplete = $state(false);
    let error = $state<string | null>(null);

    async function prepareAnalysis() {
        try {
            await initializeAnalysis();
            isPreparationComplete = true;
        } catch (err) {
            error = err instanceof Error ? err.message : 'Failed to prepare analysis';
            console.error('Error preparing analysis:', err);
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
            <p><strong>Company:</strong> {analysisState.companyInfo.company}</p>
            <p><strong>Industry:</strong> {analysisState.companyInfo.industry}</p>
            <p><strong>Region:</strong> {analysisState.companyInfo.region}</p>
        </div>
    </div>

    <div class="flex flex-col items-center gap-4">
        {#if error}
            <div class="alert variant-filled-error">
                <span>Error: {error}</span>
            </div>
        {:else}
            <ProgressRing 
                value={isPreparationComplete ? 100 : 50}
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
                        onclick={onClose}
                    >
                        Go to Analysis Chat
                    </button>
                </div>
            {:else}
                <p>Preparing analysis questions...</p>
            {/if}
        {/if}
    </div>
</div>