<script lang="ts">
    import { ProgressRing } from '@skeletonlabs/skeleton-svelte';
    import { analysisState, processAnalysis } from './contextState.svelte.ts';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    
    let { onComplete } = $props<{onComplete: () => void}>();
    
    let progressValue = $state(0);
    let processing = $state(true);
    let error = $state<string | null>(null);
    
    // Calculate progress based on completed questions
    $effect(() => {
        const { completed, total } = analysisState.analysisProgress;
        progressValue = Math.round((completed / total) * 100);
    });
    
    // Start processing when the component mounts
    onMount(async () => {
        try {
            const chatId = await processAnalysis();
            processing = false;
            
            // Dispatch a custom event to update UI in other components
            if (browser) {
                window.dispatchEvent(
                    new CustomEvent("userChatsUpdated", {
                        detail: { newChatId: chatId }
                    })
                );
            }
            
            // Navigate to the new chat with a small delay to ensure state updates
            setTimeout(() => {
                goto(`/chats/${chatId}`);
                onComplete();
            }, 300);
        } catch (error) {
            console.error('Failed to process analysis:', error);
            processing = false;
            error = error instanceof Error ? error.message : 'Failed to process analysis';
        }
    });
</script>

<div class="flex flex-col items-center justify-center space-y-4 p-4">
    <div class="w-32 h-32">
        <ProgressRing
            value={progressValue}
            strokeWidth="4px"
            meterStroke="stroke-primary-500"
            trackStroke="stroke-surface-500/30"
        >
            <span class="font-bold">{progressValue}%</span>
        </ProgressRing>
    </div>
    
    <div class="text-center">
        {#if processing}
            <p>Analyzing {analysisState.companyInfo.company}...</p>
            <p class="text-sm opacity-70">Processing question {analysisState.analysisProgress.currentIndex + 1} of {analysisState.analysisProgress.total}</p>
        {:else if error}
            <p class="text-error-500">Error: {error}</p>
            <button class="btn variant-soft mt-2" onclick={() => analysisState.step = 2}>Go Back</button>
        {:else}
            <p>Analysis complete!</p>
            <p class="text-sm opacity-70">Redirecting to chat...</p>
        {/if}
    </div>
</div>