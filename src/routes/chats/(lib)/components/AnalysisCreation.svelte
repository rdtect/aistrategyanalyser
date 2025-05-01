<script lang="ts">
  import type {
    CategoryQuestions,
    Question,
  } from "../data/category_question_prompts";
  import type { ChatContext } from "$lib/types";
  // Removed browser import, not directly needed after refactor

  // Props
  let { onClose, categories } = $props<{
    onClose?: () => void;
    categories: CategoryQuestions;
  }>();

  // Icons
  import IconX from "@lucide/svelte/icons/x";
  import IconChecks from "@lucide/svelte/icons/check-check";
  import IconEdit from "@lucide/svelte/icons/edit";
  import IconArrowLeft from "@lucide/svelte/icons/arrow-left";
  import IconArrowRight from "@lucide/svelte/icons/arrow-right";

  // Step Components
  import FrameworkStep from "./analysis-creation/FrameworkStep.svelte";
  import ContextStep from "./analysis-creation/ContextStep.svelte";
  import QuestionsStep from "./analysis-creation/QuestionsStep.svelte";
  import ReviewStep from "./analysis-creation/ReviewStep.svelte";

  // Import the refactored Logic
  import {
    // Static Data (can still be imported if needed)
    steps,
    frameworkOptionsData,
    industryOptionsData,
    regionOptionsData,
    // Factory function and its type
    createAnalysisWizard,
    type AnalysisWizardApi,
  } from "./analysis-creation/AnalysisCreationLogic.svelte.ts";

  // Instantiate the wizard logic
  const wizard = createAnalysisWizard(); // TODO: Pass initial context if available

  // Derived state for UI mapping (remains in component)
  let categoryList = $derived(() =>
    Object.entries(categories).map(([categoryName, questionsArray]) => ({
      name: categoryName,
      questions: questionsArray as Question[],
    })),
  );

  // System prompt state for the analysis (default to average)
  let systemPrompt = $state<string>("");
  import { getAverageSystemPrompt } from '../../../../lib/utils/promptUtils/index';
  $effect(() => {
    if (!systemPrompt) {
      getAverageSystemPrompt().then(prompt => { systemPrompt = prompt; });
    }
  });

  // Handler to update system prompt from QuestionsStep
  function handleSystemPromptChange(prompt: string) {
    if (prompt) systemPrompt = prompt;
  }

  // --- Effects ---
  // Effect for auto-generating name based on wizard state
  $effect(() => {
    if (!wizard.state.nameManuallyEdited) {
      wizard.generateName();
    }
  });
</script>

<!-- Template: Use wizard object to access state and methods -->
<div
  class="card glass-primary shadow-xl rounded my-auto modal-container mx-auto border-primary-600/40"
>
  <!-- Header -->
  <header class="flex justify-between items-center mb-5">
    <div class="flex flex-col">
      <div class="flex gap-1 items-center">
        <h2 class="text-xl font-medium">
          {wizard.state.analysisName || "New Strategic Analysis"}
        </h2>
        <button
          type="button"
          class="btn btn-icon glass-primary"
          onclick={() => (wizard.state.showNameModal = true)}
          aria-label="Edit analysis name"
        >
          <IconEdit size={14} />
        </button>
      </div>
    </div>
    {#if onClose}
      <button
        type="button"
        class="btn btn-sm glass-surface"
        onclick={onClose}
        aria-label="Close"
      >
        <IconX />
      </button>
    {/if}
  </header>

  <!-- Stepper Component -->
  <div class="w-full space-y-8">
    <!-- Timeline -->
    <div class="relative">
      <div class="flex justify-between items-center gap-4">
        {#each steps as s, i}
          <button
            type="button"
            class="btn-icon btn-icon-sm rounded-full {wizard.isCurrentStep(i)
              ? 'glass-primary'
              : 'glass-surface'}"
            onclick={() => wizard.setStep(i)}
            disabled={i > wizard.state.step}
            title={s.name}
          >
            <span class="font-bold">{i + 1}</span>
          </button>
        {/each}
      </div>
      <hr
        class="hr !border-surface-300-600-token absolute top-[50%] left-0 right-0 z-[-1]"
      />
    </div>

    <!-- Step Content -->
    <div
      class="custom-scrollbar overflow-y-auto pr-2"
      style="max-height: calc(85vh - 240px);"
    >
      {#if wizard.isCurrentStep(0)}
        <FrameworkStep
          frameworkOptions={frameworkOptionsData}
          selectedFrameworkId={wizard.state.selectedFramework}
          onSelectFramework={wizard.selectFramework}
          allFrameworkOption={wizard.derived.allFrameworkOption}
        />
      {:else if wizard.isCurrentStep(1)}
        <ContextStep
          context={wizard.state.context}
          competitorInput={wizard.state.competitorInput}
          industryOptions={industryOptionsData}
          regionOptions={regionOptionsData}
          onAddCompetitor={wizard.addCompetitor}
          onRemoveCompetitor={wizard.removeCompetitor}
          onContextChange={wizard.handleContextChange}
          onCompetitorInputChange={wizard.handleCompetitorInputChange}
        />
      {:else if wizard.isCurrentStep(2)}
        <QuestionsStep
          categoryList={categoryList()}
          bind:selectedQuestions={wizard.state.selectedQuestions}
          selectedQuestionsCount={wizard.derived.selectedQuestionsCount}
          selectedFramework={wizard.state.selectedFramework}
          onToggleQuestion={wizard.toggleQuestion}
          onSystemPromptChange={handleSystemPromptChange}
        />
      {:else if wizard.isCurrentStep(3)}
        <ReviewStep
          analysisName={wizard.state.analysisName}
          selectedFramework={wizard.state.selectedFramework}
          context={wizard.state.context}
          selectedQuestionsCount={wizard.derived.selectedQuestionsCount}
          categoryList={categoryList()}
          selectedQuestions={wizard.state.selectedQuestions}
        />
      {/if}
    </div>

    <!-- Optionally show/edit system prompt -->
    <div class="mt-4">
      <label class="text-xs text-surface-400" for="systemPromptArea">System Prompt:</label>
      <textarea id="systemPromptArea" class="w-full rounded p-2 text-xs bg-surface-800 text-white border border-surface-700 mt-1" rows="6" bind:value={systemPrompt}></textarea>
    </div>

    <!-- Error message -->
    {#if wizard.state.error}
      <div class="alert glass-warning py-2">
        {wizard.state.error}
      </div>
    {/if}

    <!-- Navigation Buttons -->
    <nav
      class="flex justify-between items-center sticky bottom-0 pt-3 glass-surface backdrop-blur-sm"
    >
      <button
        type="button"
        class="btn glass-surface"
        onclick={wizard.prevStep}
        disabled={wizard.derived.isFirstStep || wizard.state.isSubmitting}
      >
        <IconArrowLeft size={18} />
        <span>Previous</span>
      </button>

      {#if wizard.derived.isLastStep}
        <button
          type="button"
          class="btn glass-primary"
          onclick={() => wizard.handleSubmit(categories)}
          disabled={wizard.state.isSubmitting}
        >
          {#if wizard.state.isSubmitting}
            <div
              class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"
            ></div>
            <span>Creating...</span>
          {:else}
            <IconChecks class="mr-2" />
            <span>Create Analysis</span>
          {/if}
        </button>
      {:else}
        <button
          type="button"
          class="btn glass-primary"
          onclick={wizard.nextStep}
          disabled={wizard.state.isSubmitting}
        >
          <span>Next</span>
          <IconArrowRight size={18} />
        </button>
      {/if}
    </nav>
  </div>

  <!-- Name edit modal -->
  {#if wizard.state.showNameModal}
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
      <div class="flex items-center justify-center h-full">
        <div
          class="card glass-surface p-4 w-full max-w-md border border-primary-600"
        >
          <h3 class="h4 mb-4">Edit Analysis Name</h3>
          <label class="label">
            <span>Analysis Name</span>
            <input
              type="text"
              class="input enhanced-input"
              value={wizard.state.analysisName}
              oninput={(e) => wizard.handleNameInput(e.currentTarget.value)}
              placeholder="Enter a name for your analysis"
            />
          </label>
          <div class="flex justify-end gap-2 mt-4">
            <button
              type="button"
              class="btn glass-surface"
              onclick={() => (wizard.state.showNameModal = false)}
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn glass-primary"
              onclick={() => {
                wizard.state.nameManuallyEdited = true;
                wizard.state.showNameModal = false;
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- Progress overlay -->
  {#if wizard.state.showProgress}
    <div class="progress-overlay">
      <div class="progress-spinner"></div>
      <p class="text-white text-lg mt-4">{wizard.state.progressMessage}</p>
    </div>
  {/if}
</div>

<style>
  /* Styles remain the same */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(var(--color-primary-500-rgb), 0.3) transparent;
  }
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(var(--color-primary-500-rgb), 0.3);
    border-radius: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(var(--color-primary-500-rgb), 0.75);
  }
  .modal-container {
    max-height: 85vh;
    width: 90%;
    max-width: 750px;
    border-radius: var(--theme-rounded-container-token);
    box-shadow: var(--theme-shadow-xl);
    background: linear-gradient(
      to bottom right,
      var(--color-primary-500/10),
      var(--color-surface-900/20)
    );
    backdrop-filter: blur(8px);
    border: 1px solid var(--color-primary-800);
    margin: 1.5rem auto;
    padding: 1.5rem;
  }
  :global(.enhanced-input) {
    border: 1px solid var(--color-primary-600) !important;
    outline: none !important;
  }
  :global(.enhanced-input:focus) {
    border: 2px solid var(--color-primary-600) !important;
    box-shadow: 0 0 0 2px rgba(var(--color-primary-500-rgb), 0.2) !important;
  }
  .progress-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(3px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }
  .progress-spinner {
    width: 60px;
    height: 60px;
    border: 5px solid rgba(var(--color-primary-500-rgb), 0.2);
    border-top-color: rgb(var(--color-primary-500-rgb));
    border-radius: 50%;
    animation: spin 1s ease-in-out infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
