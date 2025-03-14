<script lang="ts">
    import { ProgressRing } from '@skeletonlabs/skeleton-svelte';
    import { chatStore } from '../Chat.svelte.ts';
    import categoryQuestionPrompts from '$lib/data/category_question_prompts.json';
    import { X } from 'lucide-svelte';

    let { 
        formData,
        onComplete = () => {},
        onError = () => {}
    } = $props();

    let processedCount = $state(0);
    let error = $state<string>('');
    let isProcessing = $state(false);
    let abortController = $state<AbortController | null>(null);
    let currentStatus = $state('Preparing analysis...');
    let currentQuestionData = $state<{ question: string; status: 'asking' | 'researching' | 'receiving' } | null>(null);
    
    let selectedQuestionIds = $derived(
        Object.entries(formData.selectedQuestions)
            .filter(([_, selected]) => selected)
            .map(([id]) => id)
    );

    let totalQuestions = $derived(selectedQuestionIds.length);
    let progress = $derived(Math.round((processedCount / totalQuestions) * 100));

    async function processQuestionWithStatus(questionId: string, chatId: number) {
        const questionData = Object.values(categoryQuestionPrompts)
            .flat()
            .find(q => q.id === questionId);
        
        if (!questionData || !abortController) return;
        
        const question = questionData.question.trim();
        const prompt = questionData.prompt ? 
            `${questionData.prompt['Role Definition']}\n${questionData.prompt['Task Description']}\n\nRegarding ${formData.company} in the ${formData.industry} industry, ${formData.region} region:\n${question}` : 
            question;

        if (!question) return;

        try {
            currentQuestionData = { question, status: 'asking' };
            if (abortController.signal.aborted) return;
            await chatStore.handleMessageSubmit(prompt);
            
            currentQuestionData = { question, status: 'researching' };
            if (abortController.signal.aborted) return;
            const response = await chatStore.processQuestion(chatId, {
                question: questionId,
                prompt: prompt
            });
            
            if (response && !abortController.signal.aborted) {
                currentQuestionData = { question, status: 'receiving' };
                // @ts-ignore - handleAIResponse exists but TypeScript doesn't see it
                await chatStore.handleAIResponse(response);
            }
            
            if (!abortController.signal.aborted) {
                processedCount++;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        } catch (err) {
            if (!abortController.signal.aborted) {
                throw err;
            }
        }
    }

    async function startAnalysis() {
        if (isProcessing) return;
        isProcessing = true;
        abortController = new AbortController();
        
        try {
            currentStatus = 'Creating new analysis...';
            const chatName = `${formData.company} | ${formData.industry} | ${formData.region}`;
            const chatId: string = await chatStore.createNewChat({
                name: chatName,
                company: formData.company,
                industry: formData.industry,
                region: formData.region,
                context: formData.context
            }).toString(); // Convert to string if necessary
            
            for (const questionId of selectedQuestionIds) {
                if (abortController.signal.aborted) break;
                try {
                    await processQuestionWithStatus(questionId, Number(chatId));
                } catch (err) {
                    console.warn(`Question processing error (${questionId}):`, err);
                    throw err;
                }
            }
            
            if (!abortController.signal.aborted) {
                currentStatus = 'Analysis complete!';
                isProcessing = false;
                onComplete();
            }
        } catch (err) {
            if (!abortController.signal.aborted) {
                console.error('Analysis error:', err);
                error = err instanceof Error ? err.message : 'An unknown error occurred';
                isProcessing = false;
                onError();
            }
        }
    }

    async function handleCancel() {
        if (abortController) {
            try {
                abortController.abort();
                await chatStore.cancelCurrentRequest();
            } catch (err) {
                console.warn('Cancel request error:', err);
            } finally {
                isProcessing = false;
                error = 'Analysis cancelled';
                onError();
            }
        }
    }

    $effect.root(() => {
        startAnalysis();
        return () => {
            if (abortController) {
                try {
                    abortController.abort();
                    chatStore.cancelCurrentRequest();
                } catch (err) {
                    console.warn('Cleanup error:', err);
                }
            }
        };
    });

    $effect(() => {
        if (progress === 100 && !error) {
            // Add a small delay before closing to show the 100% state
            setTimeout(() => {
                onComplete();
            }, 1000);
        }
    });
</script>

<div class="flex flex-col items-center justify-center space-y-4 p-8">
    <div class="grid grid-cols-1 gap-4 justify-center">
        <ProgressRing 
            value={progress} 
            max={100}
        />
    </div>
    
    <p class="text-center">Analyzing {formData.company}...</p>
    
    <div class="flex flex-col items-center text-center">
        <p class="text-lg font-semibold">{progress}%</p>
        <p class="text-sm opacity-70">{currentStatus}</p>
        
        {#if currentQuestionData}
            <div class="mt-2 text-sm">
                <p class="font-medium">Q{processedCount + 1}: {currentQuestionData.question}</p>
                <p class="opacity-70">
                    {#if currentQuestionData.status === 'asking'}
                        Preparing question...
                    {:else if currentQuestionData.status === 'researching'}
                        Researching answer...
                    {:else if currentQuestionData.status === 'receiving'}
                        Processing response...
                    {/if}
                </p>
            </div>
        {/if}
    </div>
    {#if error}
        <div class="alert variant-filled-error">
            <p>{error}</p>
        </div>
    {/if}

    {#if isProcessing}
        <button 
            class="btn variant-soft-error"
            onclick={handleCancel}
        >
            <X class="w-4 h-4 mr-2" />
            Cancel Analysis
        </button>
    {/if}
</div>