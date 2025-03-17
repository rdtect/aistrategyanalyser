<script lang="ts">
    import { appStore } from '$lib/state/app.svelte';
    import { fade } from 'svelte/transition';

    // Local state for form validation
    let error = $state('');

    function validateAndNext(e: Event) {
        e.preventDefault();
        const { formData } = appStore.analysisState;
        if (appStore.analysisState.step === 1) {
            if (!formData.company || !formData.industry || !formData.region) {
                error = 'Please fill all required fields';
                return;
            }
        }
        if (appStore.analysisState.step === 2) {
            if (!Object.values(formData.selectedQuestions).some(Boolean)) {
                error = 'Please select at least one question';
                return;
            }
        }
        error = '';
        appStore.analysisState.step++;
    }
</script>

{#if appStore.analysisState?.isOpen}
    <div class="modal" transition:fade>
        <div class="modal-content">
            {#if appStore.analysisState.step === 1}
                <!-- Company Info Form -->
                <form onsubmit={validateAndNext}>
                    <input 
                        bind:value={appStore.analysisState.formData.company} 
                        placeholder="Company"
                    />
                    <!-- Other fields... -->
                </form>
            {:else if appStore.analysisState.step === 2}
                <!-- Question Selection -->
                <!-- Question checklist UI -->
            {:else}
                <!-- Progress Screen -->
                <!-- Progress UI -->
            {/if}

            {#if error}
                <p class="error">{error}</p>
            {/if}
        </div>
    </div>
{/if}