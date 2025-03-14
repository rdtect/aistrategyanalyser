<script lang="ts">
    import { fade } from 'svelte/transition';
    import Screen1Input from './Screen1Input.svelte';
    import Screen2Checklist from './Screen2Checklist.svelte';
    import Screen3Progress from './Screen3Progress.svelte';
    import { chatStore } from '../Chat.svelte.ts';
    
    let { open = false, onClose = () => {} } = $props();
    
    // Shared state
    let currentStep = $state(1);
    let error = $state('');
    let formData = $state({
        company: '',
        industry: '',
        region: '',
        context: '',
        selectedQuestions: {} as Record<string, boolean>
    });
    
    function handleNext() {
        currentStep++;
    }
    
    function handleBack() {
        currentStep--;
    }
    
    function resetForm() {
        formData = {
            company: '',
            industry: '',
            region: '',
            context: '',
            selectedQuestions: {}
        };
        currentStep = 1;
        error = '';
    } 
    
    $effect(() => {
        if (!open) resetForm();
    });

    
  
</script>

{#if open}
    <div 
        class="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm bg-black/50 p-4" 
        transition:fade={{ duration: 200 }}
    >
        <div class="w-full max-w-2xl max-h-[80vh] rounded-lg bg-surface-900 shadow-2xl">
            <div class="card flex flex-col h-full">
                <header class="card-header flex justify-between p-4 border-b border-surface-700">
                    <h3 class="h3 text-xl font-bold">
                        {#if currentStep === 1}
                            New Analysis
                        {:else if currentStep === 2}
                            Select Questions
                        {:else}
                            Analyzing
                        {/if}
                    </h3>
                </header>

                <div class="p-4">
                    {#if currentStep === 1}
                        <Screen1Input 
                            bind:formData
                            {error}
                            onNext={handleNext}
                            {onClose}
                        />
                    {:else if currentStep === 2}
                        <Screen2Checklist
                            bind:formData
                            {error}
                            onNext={handleNext}
                            onBack={handleBack}
                        />
                    {:else}
                        <Screen3Progress
                            {formData}
                            onComplete={onClose}
                            onError={() => currentStep = 2}
                        />
                    {/if}
                </div>
            </div>
        </div>
    </div>
{/if}