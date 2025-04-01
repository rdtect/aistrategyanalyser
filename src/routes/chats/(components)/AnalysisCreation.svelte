<script lang="ts">
  import { goto } from '$app/navigation';
  import type { ChatContext } from '$lib/types';
  import type { CategoryQuestions, Question } from '$lib/data/category_question_prompts';
  import { chatStore } from './ChatStore.svelte';
  import { browser } from "$app/environment";
  
  // Icons
  import IconX from '@lucide/svelte/icons/x';
  import IconChecks from '@lucide/svelte/icons/check-check';
  import IconUsers from '@lucide/svelte/icons/users';
  import IconEdit from '@lucide/svelte/icons/edit';
  import IconArrowLeft from '@lucide/svelte/icons/arrow-left';
  import IconArrowRight from '@lucide/svelte/icons/arrow-right';
  import IconBuilding from '@lucide/svelte/icons/building';
  import IconTarget from '@lucide/svelte/icons/target';
  import IconGlobe2 from '@lucide/svelte/icons/globe-2';
  
  // Import the new step component
  import FrameworkStep from './AnalysisCreationSteps/FrameworkStep.svelte';
  import ContextStep from './AnalysisCreationSteps/ContextStep.svelte';
  import QuestionsStep from './AnalysisCreationSteps/QuestionsStep.svelte';
  import ReviewStep from './AnalysisCreationSteps/ReviewStep.svelte';
  
  // Props
  let { onClose, categories } = $props<{
    onClose?: () => void;
    categories: CategoryQuestions;
  }>();
  
  // Form state
  let analysisName = $state('');
  let nameManuallyEdited = $state(false);
  let context = $state<ChatContext>({
    id: '',
    name: '',
    company: '',
    industry: '',
    region: 'Global',
    additionalInfo: '',
    competitors: []
  });
  let customIndustry = $state('');
  let showCustomIndustry = $derived(context.industry === 'Other');
  let customRegion = $state('');
  let showCustomRegion = $derived(context.region === 'Other');
  let selectedFramework = $state<string>('');
  let step = $state(0); // Start at index 0 for Skeleton pattern
  let isSubmitting = $state(false);
  let error = $state('');
  let competitorInput = $state('');
  let windowHeight = $state(browser ? window.innerHeight : 800);
  
  // Question selection state
  let selectedQuestions = $state<Record<string, boolean>>({});
  
  // Step definitions
  const steps = [
    { label: 'Framework', description: 'Select analysis framework' },
    { label: 'Context', description: 'Add company and market details' },
    { label: 'Questions', description: 'Select analysis questions' },
    { label: 'Review', description: 'Confirm analysis details' }
  ];
  
  // Define framework options here to pass to the step component
  // Using icon names directly for easier serialization/passing
  // Note: Ensure the icon component names match what FrameworkStep expects
  const frameworkOptionsData = [
    { id: 'all', name: '4C\'s Complete Analysis', description: 'Analyze all aspects: Consumer, Company, Competitors, and Context', icon: { name: 'IconBox' } },
    { id: 'consumer', name: 'Consumer Analysis', description: 'Focus on understanding customer needs, behaviors, and demographics', icon: { name: 'IconUsers' } },
    { id: 'company', name: 'Company Analysis', description: 'Evaluate internal capabilities, strengths, and weaknesses', icon: { name: 'IconBuilding' }, disabled: true },
    { id: 'competitors', name: 'Competitor Analysis', description: 'Assess market competitors and their strategies', icon: { name: 'IconTarget' }, disabled: true },
    { id: 'context', name: 'Context Analysis', description: 'Examine market trends and external factors', icon: { name: 'IconGlobe2' }, disabled: true }
  ];
  
  // Define Industry and Region options data
  const industryOptionsData = [
    'Technology',
    'Finance',
    'Healthcare',
    'Manufacturing',
    'Retail',
    'Energy',
    'Education',
    'Entertainment',
    'Transportation',
    'Other'
  ];

  const regionOptionsData = [
    'Global',
    'North America',
    'Europe',
    'Asia Pacific',
    'Latin America',
    'Middle East & Africa',
    'Other'
  ];
  
  // Derived step properties 
  const isFirstStep = $derived(step === 0);
  const isLastStep = $derived(step === steps.length - 1);
  
  // Find the 'all' option reactively
  const allFrameworkOption = $derived(frameworkOptionsData.find(opt => opt.id === 'all'));
  
  // Determine if on the current step
  function isCurrentStep(index: number): boolean {
    return step === index;
  }
  
  // Jump to a particular step
  function setStep(index: number): void {
    if (validateStep()) {
      step = index;
    }
  }
  
  // Select framework
  function selectFramework(id: string) {
    selectedFramework = id;
    // Reset question selection when framework changes
    selectedQuestions = {}; 

    // Optional: Add back logic here to pre-select questions for specific frameworks if desired
    // Example (pre-selecting consumer questions):
    // if (id === 'consumer') {
    //   const consumerCategoryKey = Object.keys(categories).find(key => key.toLowerCase().includes('customer'));
    //   if (consumerCategoryKey) {
    //     const newSelection = { ...selectedQuestions }; // Start fresh or from current?
    //     categories[consumerCategoryKey].forEach((q: Question) => { newSelection[q.id] = true; });
    //     selectedQuestions = newSelection;
    //   }
    // }
  }

  // Handle window resize
  $effect(() => {
    if (!browser) return;

    const handleResize = () => {
      windowHeight = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  });

  // Auto-derive name from context whenever context changes
  $effect(() => {
    if (!nameManuallyEdited) {
      autoDeriveName();
    }
  });
  
  // Watch for manual name edits
  function handleNameInput() {
    nameManuallyEdited = true;
  }

  // Auto-generate name from context
  function autoDeriveName() {
    let nameParts = [];
    
    if (context.company) {
      nameParts.push(context.company);
    }
    
    if (context.industry) {
      if (context.industry === 'Other' && customIndustry) {
        nameParts.push(customIndustry);
      } else if (context.industry !== 'Other') {
        nameParts.push(context.industry);
      }
    }
    
    if (context.region && context.region !== 'Global') {
      nameParts.push(context.region === 'Other' ? customRegion : context.region);
    }
    
    if (selectedFramework === 'consumer') {
      nameParts.push('Consumer Analysis');
    } else if (selectedFramework === 'company') {
      nameParts.push('Company Analysis');
    } else if (selectedFramework === 'competitors') {
      nameParts.push('Competitor Analysis');
    } else if (selectedFramework === 'context') {
      nameParts.push('Context Analysis');
    } else if (selectedFramework === 'all') {
      nameParts.push('4C\'s Analysis');
    }
    
    if (nameParts.length > 0) {
      analysisName = nameParts.join(' | ');
    } else {
      analysisName = 'New Strategic Analysis';
    }
  }
  
  // Reset manual edit flag and regenerate name
  function generateName() {
    nameManuallyEdited = false;
    autoDeriveName();
  }
  
  // Adding a competitor
  function addCompetitor() {
    if (!competitorInput.trim()) return;
    if (!context.competitors) context.competitors = [];
    if (!context.competitors.includes(competitorInput)) {
      context.competitors = [...context.competitors, competitorInput];
    }
    competitorInput = '';
  }
  
  // Removing a competitor
  function removeCompetitor(competitor: string) {
    if (!context.competitors) return;
    context.competitors = context.competitors.filter(c => c !== competitor);
  }

  // Get total selected questions count
  const selectedQuestionsCount = $derived(
    Object.values(selectedQuestions).filter(Boolean).length
  );
  
  // Validate current step
  function validateStep(): boolean {
    error = '';
    
    if (step === 0) { // Framework step
      if (!selectedFramework) {
        error = 'Please select a framework';
        return false;
      }
    } else if (step === 1) { // Context step
      // Validate company and industry
      if (!context.company) {
        error = 'Please enter a company name';
        return false;
      }
      if (!context.industry) {
        error = 'Please select an industry';
        return false;
      }
    } else if (step === 2) { // Questions step
      // Validate that at least one question is selected
      if (selectedQuestionsCount === 0) {
        error = 'Please select at least one question';
        return false;
      }
    }
    
    return true;
  }
  
  // Progress to the next step
  function nextStep() {
    if (validateStep()) {
      step++;
      if (step === 3) { // Review step
        // Always generate a name for the final step if we can derive it from context
        if (!nameManuallyEdited || !analysisName.trim()) {
          generateName();
        }
      }
    }
  }
  
  // Progress to the previous step
  function prevStep() {
    step--;
  }
  
  // Toggle question selection
  function toggleQuestion(id: string) {
    selectedQuestions[id] = !selectedQuestions[id];
  }
  
  // Show progress state
  let showProgress = $state(false);
  let progressMessage = $state('Creating your analysis...');
  
  // Prepare a typed array for the template loop using $state and $effect as a workaround for linter issues
  let categoryList = $state<{ name: string; questions: Question[] }[]>([]);
  
  $effect(() => {
    // Update the list whenever the categories prop changes
    categoryList = Object.entries(categories).map(([categoryName, questionsArray]) => {
      return {
        name: categoryName,
        questions: questionsArray as Question[] // Ensure questions are typed
      };
    });
  });
  
  // Add handlers for callbacks from ContextStep
  function handleContextChange(newContext: ChatContext) {
    // Prevent mutation, create new object if needed for reactivity downstream
    context = { ...newContext }; 
  }

  function handleCompetitorInputChange(newValue: string) {
    competitorInput = newValue;
  }
  
  // Extracted Welcome Message Generation
  function generateWelcomeMessage(finalContext: ChatContext, finalSelectedQuestionIds: string[]): string {
    let welcomeMessage = `# Welcome to your strategic analysis for ${finalContext.company}!\n\n`;
    welcomeMessage += "## Context Information\n";
    welcomeMessage += `- Company: ${finalContext.company}\n`;
    welcomeMessage += `- Industry: ${finalContext.industry}\n`; // Assumes finalIndustry is part of finalContext
    welcomeMessage += `- Region: ${finalContext.region}\n`; // Assumes finalRegion is part of finalContext

    if (finalContext.competitors?.length) {
      welcomeMessage += `- Competitors: ${finalContext.competitors.join(', ')}\n`;
    }
    if (finalContext.additionalInfo) {
      welcomeMessage += `\n### Additional Context\n${finalContext.additionalInfo}\n`;
    }

    let hasQuestions = false;
    let promptSection = "";
    if (finalSelectedQuestionIds.length > 0) {
      promptSection += "\n## Initial Analysis Prompts\n";
      promptSection += "Please begin by addressing the following analysis points based on the provided details:\n";

      Object.entries(categories).forEach(([category, questions]) => {
        const typedQuestions = questions as Question[];
        const selectedInCategory = typedQuestions.filter((q: Question) => finalSelectedQuestionIds.includes(q.id));
        if (selectedInCategory.length > 0) {
          promptSection += `\n### ${category}\n`;
          hasQuestions = true;
          selectedInCategory.forEach((q: Question) => {
             promptSection += `\n**Question:** ${q.question}\n`;
              if (q.prompt && Object.keys(q.prompt).length > 0) {
                promptSection += "> _Prompt Details:_\n";
                for (const [key, value] of Object.entries(q.prompt)) {
                  if (value) {
                    const formattedKey = key.replace(/([A-Z])/g, ' $1').trim();
                    promptSection += `> - **${formattedKey}:** ${value}\n`;
                  }
                }
              } else {
                promptSection += "> _(No specific prompt details provided)_\n";
              }
          });
        }
      });
    }

    if (hasQuestions) {
       welcomeMessage += promptSection;
    } else {
      welcomeMessage += "\n## Starting Analysis\nNo specific questions were pre-selected. Starting with a general strategic analysis.\n";
    }
    welcomeMessage += "\n## Next Steps\n";
    welcomeMessage += "What would you like to explore first? You can ask me to address one of the prompts above, or ask a different question.";
    return welcomeMessage;
  }
  
  // Handle form submission
  async function handleSubmit() {
    if (!validateStep()) return;
    
    isSubmitting = true;
    error = '';
    
    // Pass control to the automated analysis logic if needed, e.g., after chat creation
    // Maybe add a flag to the navigation?
    const navigateToChat = (id: string) => {
      // Append query parameter to trigger analysis on the chat page
      const url = `/chats/${id}?startAnalysis=true`;
      goto(url);
    };
    
    try {
      // Use context directly, assuming custom values handled if needed
      const finalContext = JSON.parse(JSON.stringify({ ...context }));
      const finalSelectedQuestionIds = Object.entries(selectedQuestions)
        .filter(([, isSelected]) => isSelected)
        .map(([id]) => id);

      // Show progress indicator
      showProgress = true;
      progressMessage = 'Creating your analysis...';

      // Create chat with the entered name, context, and selected question IDs
      const chatId = await chatStore.createChat(
        analysisName || "New Strategic Analysis",
        finalContext,
        finalSelectedQuestionIds
      );
      console.log(`Created new chat with ID: ${chatId}`);

      // Add a welcome message that references the context
      if (chatId) {
        progressMessage = 'Setting up your analysis...';

        // Set the active chat so we can add messages
        await chatStore.setActiveChat(chatId);
        console.log(`Set active chat to: ${chatId}`);

        // Generate and add welcome message
        const welcomeMessage = generateWelcomeMessage(finalContext, finalSelectedQuestionIds);
        try {
          await chatStore.addMessage(welcomeMessage, 'assistant');
          console.log('Added welcome message to chat');
        } catch (messageError) {
          console.error('Error adding welcome message:', messageError);
          // Continue even if message fails - we can still navigate to the chat
        }

        // Always create a localStorage backup before navigating
        if (typeof localStorage !== 'undefined') {
          try {
            const backupChat = chatStore.activeChat;
            if (backupChat) {
              const chatJson = JSON.stringify(backupChat);
              localStorage.setItem(`chat_backup_${chatId}`, chatJson);
              console.log(`Backup of chat ${chatId} saved to localStorage`);

              // Also save just the chat ID to remember it exists
              const knownChats = localStorage.getItem('known_chat_ids') || '[]';
              const chatIds = JSON.parse(knownChats);
              if (!chatIds.includes(chatId)) {
                chatIds.push(chatId);
                localStorage.setItem('known_chat_ids', JSON.stringify(chatIds));
              }
            }
          } catch (backupError) {
            console.error('Error creating backup:', backupError);
          }
        }

        // Simplified navigation
        progressMessage = 'Redirecting to your new analysis...';
        console.log(`Navigating to chat ${chatId} and triggering analysis...`);

        setTimeout(() => {
          navigateToChat(chatId);
        }, 1000);

      } else {
        error = 'Failed to create analysis';
        showProgress = false;
      }
    } catch (err) {
      console.error('Error creating analysis:', err);
      error = err instanceof Error ? err.message : String(err);
      showProgress = false;
    } finally {
      isSubmitting = false;
    }
  }

  let showNameModal = $state(false);
</script>

<style>
  /* Animations for step transitions */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  /* Custom scrollbar */
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
  
  /* Enhanced modal style */
  .modal-container {
    max-height: 85vh;
    width: 90%;
    max-width: 750px;
    border-radius: var(--theme-rounded-container-token);
    box-shadow: var(--theme-shadow-xl);
    background: linear-gradient(to bottom right, var(--color-primary-500/10), var(--color-surface-900/20));
    backdrop-filter: blur(8px);
    border: 1px solid var(--color-primary-800);
    margin: 1.5rem auto;
    padding: 1.5rem;
  }
  
  /* Enhanced input styles */
  :global(.enhanced-input) {
    border: 1px solid var(--color-primary-600) !important;
    outline: none !important;
  }
  :global(.enhanced-input:focus) {
    border: 2px solid var(--color-primary-600) !important;
    box-shadow: 0 0 0 2px rgba(var(--color-primary-500-rgb), 0.2) !important;
  }
  
  /* Progress overlay */
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
    to { transform: rotate(360deg); }
  }
</style>

<div class="card variant-glass-primary shadow-xl rounded my-auto modal-container mx-auto border-primary-600/40">
  <!-- Header -->
  <header class="flex justify-between items-center mb-5">
    <div class="flex flex-col">
      <div class="flex gap-1 items-center">
      <h2 class="text-xl font-medium">
        {analysisName || 'New Strategic Analysis'}
      </h2>
       
        <button 
          type="button"
          class="btn btn-icon preset-tonal-primary" 
          onclick={() => showNameModal = true}
          aria-label="Edit analysis name"
        >
          <IconEdit size={14} />
        </button>
      </div>
    </div>
    {#if onClose}
      <button 
        type="button"
        class="btn btn-sm preset-tonal-surface" 
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
      <!-- Numerals -->
      <div class="flex justify-between items-center gap-4">
        {#each steps as s, i}
          <!-- Numeral Button -->
          <button
            type="button"
            class="btn-icon btn-icon-sm rounded-full {isCurrentStep(i) ? 'preset-filled-primary-500' : 'preset-filled-surface-500'}"
            onclick={() => setStep(i)}
            disabled={i > step}
            title={s.label}
          >
            <span class="font-bold">{i + 1}</span>
          </button>
        {/each}
      </div>
      <!-- Line -->
      <hr class="hr !border-surface-300-600-token absolute top-[50%] left-0 right-0 z-[-1]" />
    </div>
    
    <!-- Step Content -->
    <div class="custom-scrollbar overflow-y-auto pr-2" style="max-height: calc(85vh - 240px);">
      {#if isCurrentStep(0)}
        <!-- Step 1: Render FrameworkStep Component -->
        <FrameworkStep 
          frameworkOptions={frameworkOptionsData} 
          selectedFrameworkId={selectedFramework} 
          onSelectFramework={selectFramework} 
          allFrameworkOption={allFrameworkOption}
        />
      {:else if isCurrentStep(1)}
        <!-- Step 2: Render ContextStep Component -->
        <ContextStep 
          context={context} 
          competitorInput={competitorInput} 
          industryOptions={industryOptionsData} 
          regionOptions={regionOptionsData}
          onAddCompetitor={addCompetitor}
          onRemoveCompetitor={removeCompetitor}
          onContextChange={handleContextChange}          
          onCompetitorInputChange={handleCompetitorInputChange}
        />
      {:else if isCurrentStep(2)}
        <!-- Step 3: Render QuestionsStep Component -->
        <QuestionsStep 
          categoryList={categoryList} 
          bind:selectedQuestions={selectedQuestions} 
          selectedQuestionsCount={selectedQuestionsCount}
          selectedFramework={selectedFramework}
          onToggleQuestion={toggleQuestion}
        />
      {:else if isCurrentStep(3)}
        <!-- Step 4: Render ReviewStep Component -->
        <ReviewStep 
          analysisName={analysisName}
          selectedFramework={selectedFramework}
          context={context}
          selectedQuestionsCount={selectedQuestionsCount}
          categoryList={categoryList}
          selectedQuestions={selectedQuestions}
        />
      {/if}
    </div>
  
    <!-- Error message -->
    {#if error}
      <div class="alert preset-filled-error-500 py-2">
        {error}
      </div>
    {/if}
    
    <!-- Navigation Buttons -->
    <nav class="flex justify-between items-center sticky bottom-0 pt-3 bg-surface-100-800-token/30 backdrop-blur-sm">
      <!-- Back Button -->
      <button 
        type="button" 
        class="btn preset-tonal-surface" 
        onclick={prevStep} 
        disabled={isFirstStep || isSubmitting}
      >
        <IconArrowLeft size={18} />
        <span>Previous</span>
      </button>
      
      <!-- Next/Submit Button -->
      {#if isLastStep}
        <button 
          type="button" 
          class="btn preset-filled-primary-500" 
          onclick={handleSubmit} 
          disabled={isSubmitting}
        >
          {#if isSubmitting}
            <div class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
            <span>Creating...</span>
          {:else}
            <IconChecks class="mr-2" />
            <span>Create Analysis</span>
          {/if}
        </button>
      {:else}
        <button 
          type="button" 
          class="btn preset-filled-primary-500" 
          onclick={nextStep} 
          disabled={isSubmitting}
        >
          <span>Next</span>
          <IconArrowRight size={18} />
        </button>
      {/if}
    </nav>
  </div>
  
  <!-- Name edit modal (controlled by state) -->
  {#if showNameModal}
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
      <div class="flex items-center justify-center h-full">
        <div class="card p-4 w-full max-w-md border border-primary-600">
          <h3 class="h4 mb-4">Edit Analysis Name</h3>
          <label class="label">
            <span>Analysis Name</span>
            <input type="text" class="input enhanced-input" bind:value={analysisName} placeholder="Enter a name for your analysis" />
          </label>
          <div class="flex justify-end gap-2 mt-4">
            <button 
              type="button"
              class="btn preset-tonal-surface"
              onclick={() => showNameModal = false}
            >
              Cancel
            </button>
            <button 
              type="button"
              class="btn preset-filled-primary-500"
              onclick={() => { nameManuallyEdited = true; showNameModal = false; }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
  
  <!-- Progress overlay -->
  {#if showProgress}
    <div class="progress-overlay">
      <div class="progress-spinner"></div>
      <p class="text-white text-lg mt-4">{progressMessage}</p>
    </div>
  {/if}
</div> 