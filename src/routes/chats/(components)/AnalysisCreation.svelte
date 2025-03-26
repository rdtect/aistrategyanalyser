<script lang="ts">
  import { Avatar, Accordion } from '@skeletonlabs/skeleton-svelte';
  import { goto } from '$app/navigation';
  import type { ChatContext } from '../types';
  import { chatStore } from './ChatStore.svelte';
  import { browser } from "$app/environment";
  
  // Icons
  import IconX from '@lucide/svelte/icons/x';
  import IconChecks from '@lucide/svelte/icons/check-check';
  import IconBuildingSkyscraper from '@lucide/svelte/icons/building-2';
  import IconFactory from '@lucide/svelte/icons/factory';
  import IconGlobe from '@lucide/svelte/icons/globe';
  import IconPlus from '@lucide/svelte/icons/plus';
  import IconBox from '@lucide/svelte/icons/box';
  import IconLightbulb from '@lucide/svelte/icons/lightbulb';
  import IconUsers from '@lucide/svelte/icons/users';
  import IconBarChart from '@lucide/svelte/icons/bar-chart-2';
  import IconWand from '@lucide/svelte/icons/wand';
  import IconEdit from '@lucide/svelte/icons/edit';
  import IconArrowLeft from '@lucide/svelte/icons/arrow-left';
  import IconArrowRight from '@lucide/svelte/icons/arrow-right';
  import IconShoppingBag from '@lucide/svelte/icons/shopping-bag';
  import IconBuilding from '@lucide/svelte/icons/building';
  import IconTarget from '@lucide/svelte/icons/target';
  import IconUsers2 from '@lucide/svelte/icons/users-2';
  import IconGlobe2 from '@lucide/svelte/icons/globe-2';
  
  // Props
  let { onClose } = $props<{
    onClose?: () => void;
  }>();
  
  // Form state
  let analysisName = $state('');
  let nameManuallyEdited = $state(false);
  let context = $state<ChatContext>({
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
  
  // 4C's selection
  let selectedC = $state<string>('consumer');
  
  // Editable dropdown state
  let showIndustryInput = $state(false);
  let editableIndustry = $state('');
  let showRegionInput = $state(false); 
  let editableRegion = $state('');
  
  // Question selection state
  let selectedQuestions = $state<Record<string, boolean>>({});
  
  // Step definitions
  const steps = [
    { label: 'Framework', description: 'Select analysis framework' },
    { label: 'Context', description: 'Add company and market details' },
    { label: 'Questions', description: 'Select analysis questions' },
    { label: 'Review', description: 'Confirm analysis details' }
  ];
  
  // 4C's framework options
  const frameworkOptions = [
    { id: 'all', name: '4C\'s Complete Analysis', description: 'Analyze all aspects: Consumer, Company, Competitors, and Context', icon: IconShoppingBag },
    { id: 'consumer', name: 'Consumer Analysis', description: 'Focus on understanding customer needs, behaviors, and demographics', icon: IconUsers2 },
    { id: 'company', name: 'Company Analysis', description: 'Evaluate internal capabilities, strengths, and weaknesses', icon: IconBuilding },
    { id: 'competitors', name: 'Competitor Analysis', description: 'Assess market competitors and their strategies', icon: IconTarget },
    { id: 'context', name: 'Context Analysis', description: 'Examine market trends and external factors', icon: IconGlobe2 }
  ];
  
  // Derived step properties 
  const isFirstStep = $derived(step === 0);
  const isLastStep = $derived(step === steps.length - 1);
  
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
  
  // Sample questions by category (replace with your actual questions data)
  const questionCategories: Record<string, Array<{id: string, question: string}>> = {
    'Market Analysis': [
      { id: 'q1', question: 'What is the current market size and growth rate?' },
      { id: 'q2', question: 'Who are the key competitors and what are their market shares?' },
      { id: 'q3', question: 'What are the main market segments and their characteristics?' }
    ],
    'Competitive Strategy': [
      { id: 'q4', question: 'What are the strengths and weaknesses of the company?' },
      { id: 'q5', question: 'What competitive advantages does the company have?' },
      { id: 'q6', question: 'How does the company\'s pricing strategy compare to competitors?' }
    ],
    'Growth Opportunities': [
      { id: 'q7', question: 'What new markets could the company enter?' },
      { id: 'q8', question: 'What product innovations could drive growth?' },
      { id: 'q9', question: 'What strategic partnerships could be beneficial?' }
    ]
  };

  // Consumer-focused questions
  const consumerQuestions: Array<{id: string, question: string}> = [
    { id: 'c1', question: 'What are the key demographics of our target consumers?' },
    { id: 'c2', question: 'What are the main needs and pain points of our customers?' },
    { id: 'c3', question: 'How do consumer buying behaviors influence our product strategy?' },
    { id: 'c4', question: 'What trends are emerging in consumer preferences in our industry?' },
    { id: 'c5', question: 'How do consumers perceive our brand compared to competitors?' }
  ];

  // Region options
  const regionOptions = [
    'Global',
    'North America',
    'Europe',
    'Asia Pacific',
    'Latin America',
    'Middle East & Africa',
    'Other'
  ];
  
  // Industry options
  const industryOptions = [
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
  
  // Select framework
  function selectFramework(id: string) {
    selectedFramework = id;
    if (id === 'consumer') {
      selectedC = 'consumer';
      // Pre-select consumer questions
      consumerQuestions.forEach(q => {
        selectedQuestions[q.id] = true;
      });
    }
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

  // Apply a template
  function applyTemplate(templateName: string) {
    analysisName = templateName;
    nameManuallyEdited = true;
  }
  
  // Get total selected questions count
  const selectedQuestionsCount = $derived(
    Object.values(selectedQuestions).filter(Boolean).length
  );
  
  // Validate current step
  function validateStep(): boolean {
    error = '';
    
    // Process any pending editable inputs first
    if (showIndustryInput) {
      processIndustryInput();
    }
    if (showRegionInput) {
      processRegionInput();
    }
    
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
      if (context.industry === 'Other' && !customIndustry) {
        error = 'Please enter a custom industry';
        return false;
      }
      if (context.region === 'Other' && !customRegion) {
        error = 'Please enter a custom region';
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
    selectedQuestions = {...selectedQuestions}; // trigger reactivity
  }
  
  // Toggle editable industry input
  function toggleIndustryInput() {
    showIndustryInput = !showIndustryInput;
    if (showIndustryInput) {
      if (context.industry && context.industry !== 'Other') {
        editableIndustry = context.industry;
      }
    } else {
      // When switching back to dropdown, if user entered a custom value
      if (editableIndustry && !industryOptions.includes(editableIndustry)) {
        customIndustry = editableIndustry;
        context.industry = 'Other';
      } else if (editableIndustry) {
        context.industry = editableIndustry;
      }
    }
  }
  
  // Toggle editable region input
  function toggleRegionInput() {
    showRegionInput = !showRegionInput;
    if (showRegionInput) {
      if (context.region && context.region !== 'Other') {
        editableRegion = context.region;
      }
    } else {
      // When switching back to dropdown, if user entered a custom value
      if (editableRegion && !regionOptions.includes(editableRegion)) {
        customRegion = editableRegion;
        context.region = 'Other';
      } else if (editableRegion) {
        context.region = editableRegion;
      }
    }
  }
  
  // Process editable industry input
  function processIndustryInput() {
    if (editableIndustry && !industryOptions.includes(editableIndustry)) {
      customIndustry = editableIndustry;
      context.industry = 'Other';
    } else if (editableIndustry) {
      context.industry = editableIndustry;
    }
    showIndustryInput = false;
  }
  
  // Process editable region input
  function processRegionInput() {
    if (editableRegion && !regionOptions.includes(editableRegion)) {
      customRegion = editableRegion;
      context.region = 'Other';
    } else if (editableRegion) {
      context.region = editableRegion;
    }
    showRegionInput = false;
  }
  
  // Show progress state
  let showProgress = $state(false);
  let progressMessage = $state('Creating your analysis...');
  
  // Handle form submission
  async function handleSubmit() {
    if (!validateStep()) return;
    
    isSubmitting = true;
    error = '';
    
    try {
      // Set the final region and industry
      let finalRegion = context.region;
      let finalIndustry = context.industry;
      
      if (context.region === 'Other') {
        finalRegion = customRegion;
      }
      
      if (context.industry === 'Other') {
        finalIndustry = customIndustry;
      }
      
      // Update context with final values - make sure to serialize to avoid proxy objects
      const finalContext = JSON.parse(JSON.stringify({
        ...context,
        region: finalRegion,
        industry: finalIndustry
      }));
      
      // Show progress indicator
      showProgress = true;
      progressMessage = 'Creating your analysis...';
      
      // Create chat with the entered name and context
      const chatId = await chatStore.createChat(analysisName || "New Strategic Analysis", finalContext);
      console.log(`Created new chat with ID: ${chatId}`);
      
      // Add a welcome message that references the context
      if (chatId) {
        progressMessage = 'Setting up your analysis...';
        
        // Set the active chat so we can add messages
        await chatStore.setActiveChat(chatId);
        console.log(`Set active chat to: ${chatId}`);
        
        // Create a personalized welcome message based on context and selected questions
        let welcomeMessage = `# Welcome to your strategic analysis for ${finalContext.company}!\n\n`;
        
        // Add context-specific details
        welcomeMessage += "## Context Information\n";
        welcomeMessage += `- Company: ${finalContext.company}\n`;
        welcomeMessage += `- Industry: ${finalIndustry}\n`;
        welcomeMessage += `- Region: ${finalRegion}\n`;
        
        if (finalContext.competitors?.length) {
          welcomeMessage += `- Competitors: ${finalContext.competitors.join(', ')}\n`;
        }
        
        if (finalContext.additionalInfo) {
          welcomeMessage += `\n### Additional Context\n${finalContext.additionalInfo}\n`;
        }
        
        // Add selected questions
        welcomeMessage += "\n## Selected Questions for Analysis\n";
        
        let hasQuestions = false;
        
        // Process each category and its questions
        Object.entries(questionCategories).forEach(([category, questions]) => {
          const categoryQuestions = questions.filter(q => selectedQuestions[q.id]);
          
          if (categoryQuestions.length > 0) {
            welcomeMessage += `\n### ${category}\n`;
            
            categoryQuestions.forEach(q => {
              welcomeMessage += `- ${q.question}\n`;
              hasQuestions = true;
            });
          }
        });
        
        // Add consumer questions if selected
        if (selectedFramework === 'consumer') {
          welcomeMessage += "\n### Consumer Analysis\n";
          consumerQuestions.forEach(q => {
            if (selectedQuestions[q.id]) {
              welcomeMessage += `- ${q.question}\n`;
              hasQuestions = true;
            }
          });
        }
        
        if (!hasQuestions) {
          welcomeMessage += "No specific questions were selected. I'll provide a general strategic analysis.\n";
        }
        
        welcomeMessage += "\n## What would you like to explore first?\n";
        welcomeMessage += "1. SWOT Analysis\n";
        welcomeMessage += "2. Market positioning\n";
        welcomeMessage += "3. Competitive landscape\n";
        welcomeMessage += "4. Growth opportunities";
        
        progressMessage = 'Finalizing your analysis...';
        
        try {
          // Add this welcome message from the AI
          await chatStore.addMessage(welcomeMessage, 'ai');
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
        
        // Check if we should try to verify the chat in IndexedDB
        let shouldCheckIdb = true;
        
        // Skip verification if we're running low on time or had previous errors
        if (error) {
          shouldCheckIdb = false;
          console.log('Skipping IDB verification due to previous errors');
        }
        
        if (shouldCheckIdb) {
          // Verify the chat exists in IDB before navigating
          progressMessage = 'Verifying analysis creation...';
          console.log(`Verifying chat ${chatId} exists in storage`);
          
          try {
            // Try direct API access to verify
            const verifyResponse = await fetch(`/api/chats/${chatId}/direct`);
            
            if (verifyResponse.ok) {
              console.log(`Chat ${chatId} verified in storage`);
              progressMessage = 'Redirecting to your new analysis...';
              
              // Navigate to the new chat after a short delay
              setTimeout(() => {
                goto(`/chats/${chatId}`);
              }, 500);
            } else {
              // If first verification fails, wait and try once more
              progressMessage = 'Retrying verification...';
              console.log('First verification failed, retrying after delay...');
              
              await new Promise(resolve => setTimeout(resolve, 1000));
              const retryResponse = await fetch(`/api/chats/${chatId}/direct`);
              
              if (retryResponse.ok) {
                console.log(`Chat ${chatId} verified after retry`);
                progressMessage = 'Redirecting to your new analysis...';
                
                setTimeout(() => {
                  goto(`/chats/${chatId}`);
                }, 500);
              } else {
                // Even if verification fails, we can still try to navigate
                // The backup in localStorage should help recover the chat
                console.warn(`Verification failed but proceeding anyway`);
                error = `Note: The chat may not have been saved to persistent storage, but we'll try to load it anyway.`;
                
                setTimeout(() => {
                  goto(`/chats/${chatId}`);
                }, 1000);
              }
            }
          } catch (verifyError) {
            console.error('Error during verification:', verifyError);
            
            // Still redirect but warn the user
            error = `Note: There was an issue saving your analysis, but we'll still try to show it.`;
            progressMessage = 'Redirecting to your analysis...';
            
            setTimeout(() => {
              goto(`/chats/${chatId}`);
            }, 1000);
          }
        } else {
          // Skip verification and just navigate
          progressMessage = 'Redirecting to your analysis...';
          console.log(`Skipping verification, navigating to chat ${chatId}`);
          
          setTimeout(() => {
            goto(`/chats/${chatId}`);
          }, 1000);
        }
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
</script>

<style>
  /* Animations for step transitions */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .step-content {
    animation: fadeIn 0.3s ease-out forwards;
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
  
  /* Question selection styles */
  .question-item {
    transition: all 0.2s ease;
  }
  .question-item:hover {
    background-color: rgba(var(--color-primary-500-rgb), 0.05);
  }
  .question-item.selected {
    background-color: rgba(var(--color-primary-500-rgb), 0.15);
    border-left: 3px solid rgb(var(--color-primary-500-rgb));
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
  
  /* Info box styles */
  .info-box {
    background-color: rgba(var(--color-primary-500-rgb), 0.1);
    border-left: 4px solid var(--color-primary-500);
    padding: 0.75rem;
    margin: 0.75rem 0;
    border-radius: 0.25rem;
  }
  
  /* Framework card styles */
  .framework-card {
    cursor: pointer;
    transition: all 0.2s ease;
    border: 2px solid transparent;
  }
  
  .framework-card:hover {
    transform: translateY(-2px);
  }
  
  .framework-card.selected {
    border-color: var(--color-primary-500);
    background-color: rgba(var(--color-primary-500-rgb), 0.1);
  }
  
  .framework-card.disabled {
    opacity: 0.6;
    cursor: not-allowed;
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
          onclick={() => {
            const modal = document.getElementById('nameModal');
            if (modal) modal.style.display = 'block';
          }}
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
        <!-- Step 1: Framework Selection -->
        <div class="space-y-4 step-content">
          <div class="card bg-primary-500/10 p-4 rounded-container-token mb-4">
            <h3 class="h4 mb-2">Select Analysis Framework</h3>
            <p class="text-sm">
              Choose a framework to guide your strategic analysis. Each framework provides different insights.
            </p>
          </div>
          
          <div class="mb-4">
            <button 
              type="button" 
              class="w-full p-4 rounded-container-token framework-card flex gap-4 items-center {selectedFramework === 'all' ? 'selected' : ''}"
              onclick={() => selectFramework('all')}
            >
              <div class="bg-primary-500/20 p-3 rounded-full">
                <IconBox size={24} class="text-primary-700" />
              </div>
              <div class="flex-1">
                <h4 class="font-medium">4C's Complete Analysis</h4>
                <p class="text-sm">Analyze all aspects: Consumer, Company, Competitors, and Context</p>
              </div>
            </button>
          </div>
          
          <h4 class="font-medium text-sm px-2">Or select a specific focus:</h4>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <!-- Consumer Analysis -->
            <button 
              type="button"
              class="p-4 rounded-container-token framework-card {selectedFramework === 'consumer' ? 'selected' : ''}"
              onclick={() => selectFramework('consumer')}
            >
              <div class="flex items-center gap-3 mb-2">
                <div class="bg-primary-500/20 p-2 rounded-full">
                  <IconUsers size={20} class="text-primary-700" />
                </div>
                <h4 class="font-medium">Consumer</h4>
              </div>
              <p class="text-sm">Focus on understanding customer needs, behaviors, and demographics</p>
            </button>
            
            <!-- Company Analysis -->
            <button
              type="button" 
              class="p-4 rounded-container-token framework-card disabled"
              disabled
            >
              <div class="flex items-center gap-3 mb-2">
                <div class="bg-surface-500/20 p-2 rounded-full">
                  <IconBuilding size={20} class="text-surface-700" />
                </div>
                <h4 class="font-medium">Company</h4>
              </div>
              <p class="text-sm">Evaluate internal capabilities, strengths, and weaknesses</p>
              <p class="text-xs italic mt-2 text-primary-500">Coming soon</p>
            </button>
            
            <!-- Competitors Analysis -->
            <button 
              type="button"
              class="p-4 rounded-container-token framework-card disabled"
              disabled
            >
              <div class="flex items-center gap-3 mb-2">
                <div class="bg-surface-500/20 p-2 rounded-full">
                  <IconTarget size={20} class="text-surface-700" />
                </div>
                <h4 class="font-medium">Competitors</h4>
              </div>
              <p class="text-sm">Assess market competitors and their strategies</p>
              <p class="text-xs italic mt-2 text-primary-500">Coming soon</p>
            </button>
            
            <!-- Context Analysis -->
            <button
              type="button" 
              class="p-4 rounded-container-token framework-card disabled"
              disabled
            >
              <div class="flex items-center gap-3 mb-2">
                <div class="bg-surface-500/20 p-2 rounded-full">
                  <IconGlobe2 size={20} class="text-surface-700" />
                </div>
                <h4 class="font-medium">Context</h4>
              </div>
              <p class="text-sm">Examine market trends and external factors</p>
              <p class="text-xs italic mt-2 text-primary-500">Coming soon</p>
            </button>
          </div>
          
          <div class="info-box mt-4">
            <p class="text-sm">
              {#if selectedFramework === 'consumer'}
                The Consumer analysis focuses on understanding your customers' needs, behaviors, and preferences.
              {:else if selectedFramework === 'all'}
                The 4C's framework provides a comprehensive view of your strategic position in the market.
              {:else}
                Select a framework to begin your strategic analysis.
              {/if}
            </p>
          </div>
        </div>
      {:else if isCurrentStep(1)}
        <!-- Step 2: Context -->
        <div class="space-y-4 step-content">
          <div class="card bg-primary-500/10 p-3 rounded-container-token mb-4">
            <p class="text-sm">
              Please provide information about the company for your strategic analysis.
              This helps the AI provide more relevant insights.
            </p>
          </div>
          
          <label class="label">
            <span>Company Name <span class="text-error-500">*</span></span>
            <div class="input-group grid-cols-[auto_1fr] rounded-container-token">
              <div class="ig-cell preset-filled-surface-500">
                <IconBuildingSkyscraper size={16} />
              </div>
              <input
                type="text"
                class="ig-input bg-transparent enhanced-input"
                bind:value={context.company}
                placeholder="Enter company name"
                required
              />
            </div>
          </label>
          
          <label class="label">
            <span>Industry <span class="text-error-500">*</span></span>
            <div class="input-group grid-cols-[auto_1fr_auto] rounded-container-token">
              <div class="ig-cell preset-filled-surface-500">
                <IconFactory size={16} />
              </div>
              <input
                type="text"
                class="ig-input bg-transparent enhanced-input"
                bind:value={context.industry}
                placeholder="Enter industry"
                list="industry-options"
                required
              />
              <datalist id="industry-options">
                {#each industryOptions as industry}
                  <option value={industry}>{industry}</option>
                {/each}
              </datalist>
              <button 
                type="button"
                onclick={() => context.industry = ''} 
                class="ig-cell preset-filled-surface-500"
                aria-label="Clear industry"
              >
                <IconX size={16} />
              </button>
            </div>
          </label>
          
          <label class="label">
            <span>Region <span class="text-error-500">*</span></span>
            <div class="input-group grid-cols-[auto_1fr_auto] rounded-container-token">
              <div class="ig-cell preset-filled-surface-500">
                <IconGlobe size={16} />
              </div>
              <input
                type="text"
                class="ig-input bg-transparent enhanced-input"
                bind:value={context.region}
                placeholder="Enter region"
                list="region-options"
                required
              />
              <datalist id="region-options">
                {#each regionOptions as region}
                  <option value={region}>{region}</option>
                {/each}
              </datalist>
              <button 
                type="button"
                onclick={() => context.region = 'Global'} 
                class="ig-cell preset-filled-surface-500"
                aria-label="Reset to Global"
              >
                <IconX size={16} />
              </button>
            </div>
          </label>
          
          <label class="label">
            <span>Competitors</span>
            <div class="input-group grid-cols-[auto_1fr_auto] rounded-container-token">
              <div class="ig-cell preset-filled-surface-500">
                <IconUsers size={16} />
              </div>
              <input
                type="text"
                class="ig-input bg-transparent enhanced-input"
                bind:value={competitorInput}
                onkeydown={(e) => e.key === 'Enter' && addCompetitor()}
                placeholder="Add competitors (optional, press Enter to add)"
              />
              <button 
                type="button"
                onclick={addCompetitor} 
                class="ig-cell preset-filled-surface-500"
                aria-label="Add competitor"
              >
                <IconPlus size={16} />
              </button>
            </div>
          </label>
          
          {#if context.competitors?.length}
            <div class="flex flex-wrap gap-1 mt-2">
              {#each context.competitors as competitor}
                <div class="tag preset-filled-primary px-2 py-1 text-xs rounded-token flex items-center gap-1">
                  <span>{competitor}</span>
                  <button 
                    type="button"
                    onclick={() => removeCompetitor(competitor)} 
                    class="text-xs hover:text-error-500"
                    aria-label="Remove {competitor}"
                  >
                    <IconX size={12} />
                  </button>
                </div>
              {/each}
            </div>
          {/if}
          
          <label class="label">
            <span>Additional Context</span>
            <textarea
              class="textarea enhanced-input"
              rows="3"
              bind:value={context.additionalInfo}
              placeholder="Provide any additional information that might be relevant..."
            ></textarea>
          </label>
        </div>
      {:else if isCurrentStep(2)}
        <!-- Step 3: Question Selection with Accordion -->
        <div class="space-y-4 step-content">
          <div class="card bg-primary-500/10 p-3 rounded-container-token mb-4">
            <p class="text-sm">
              {#if selectedFramework === 'consumer'}
                Select the consumer analysis questions you'd like to address.
              {:else}
                Select the questions you'd like to address in your strategic analysis.
              {/if}
              These will help guide the AI's responses to your specific needs.
            </p>
          </div>
          
          <div class="flex justify-between items-center">
            <h3 class="h5">Selected Questions: {selectedQuestionsCount}</h3>
          </div>
          
          <div class="space-y-4">
            {#if selectedFramework === 'consumer'}
              <Accordion>
                <div data-type="AccordionItem" class="mb-4">
                  <div class="text-token flex items-center p-4" role="button" tabindex="0" data-type="accordion-control">
                    <div class="mr-4">
                      <div class="bg-primary-500/20 p-2 rounded-full">
                        <IconUsers size={20} class="text-primary-700" />
                      </div>
                    </div>
                    <span>Consumer Analysis</span>
                    <div class="ml-auto">
                      <svg class="w-6 h-6 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9 6 6 6-6"></path>
                      </svg>
                    </div>
                  </div>
                  <div class="p-4 pt-0">
                    <div class="space-y-1 py-2">
                      {#each consumerQuestions as { id, question }}
                        <button 
                          type="button"
                          class="question-item p-2 rounded w-full text-left flex items-start {selectedQuestions[id] ? 'selected' : ''}"
                          onclick={() => toggleQuestion(id)}
                          aria-pressed={selectedQuestions[id] || false}
                        >
                          <div class="checkbox mr-2 mt-0.5">
                            <input type="checkbox" checked={selectedQuestions[id] || false} />
                            <span class="checkbox-mark"></span>
                          </div>
                          <span class="text-sm">{question}</span>
                        </button>
                      {/each}
                    </div>
                  </div>
                </div>
              </Accordion>
            {:else}
              <Accordion>
                {#each Object.entries(questionCategories) as [category, questions], i}
                  <div data-type="AccordionItem" class="mb-4">
                    <div class="text-token flex items-center p-4" role="button" tabindex="0" data-type="accordion-control">
                      <div class="mr-4">
                        <div class="bg-primary-500/20 p-2 rounded-full">
                          {#if category === 'Market Analysis'}
                            <IconBarChart size={20} class="text-primary-700" />
                          {:else if category === 'Competitive Strategy'}
                            <IconTarget size={20} class="text-primary-700" />
                          {:else}
                            <IconLightbulb size={20} class="text-primary-700" />
                          {/if}
                        </div>
                      </div>
                      <span>{category}</span>
                      <div class="ml-auto">
                        <svg class="w-6 h-6 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9 6 6 6-6"></path>
                        </svg>
                      </div>
                    </div>
                    <div class="p-4 pt-0">
                      <div class="space-y-1 py-2">
                        {#each questions as { id, question }}
                          <button 
                            type="button"
                            class="question-item p-2 rounded w-full text-left flex items-start {selectedQuestions[id] ? 'selected' : ''}"
                            onclick={() => toggleQuestion(id)}
                            aria-pressed={selectedQuestions[id] || false}
                          >
                            <div class="checkbox mr-2 mt-0.5">
                              <input type="checkbox" checked={selectedQuestions[id] || false} />
                              <span class="checkbox-mark"></span>
                            </div>
                            <span class="text-sm">{question}</span>
                          </button>
                        {/each}
                      </div>
                    </div>
                  </div>
                {/each}
              </Accordion>
            {/if}
          </div>
        </div>
      {:else if isCurrentStep(3)}
        <!-- Step 4: Confirm -->
        <div class="space-y-4 step-content">
          <h3 class="h4 mb-4">Review Analysis Details</h3>
          
          <div class="card preset-tonal-primary p-4 rounded-container-token border border-primary-600">
            <dl class="space-y-2">
              <div class="grid grid-cols-[120px_1fr]">
                <dt class="font-medium">Name:</dt>
                <dd>{analysisName || 'Auto-generated from context'}</dd>
              </div>
              
              <div class="grid grid-cols-[120px_1fr]">
                <dt class="font-medium">Framework:</dt>
                <dd>
                  {#if selectedFramework === 'consumer'}
                    Consumer Analysis
                  {:else if selectedFramework === 'company'}
                    Company Analysis
                  {:else if selectedFramework === 'competitors'}
                    Competitor Analysis
                  {:else if selectedFramework === 'context'}
                    Context Analysis
                  {:else if selectedFramework === 'all'}
                    4C's Complete Analysis
                  {/if}
                </dd>
              </div>
              
              <div class="grid grid-cols-[120px_1fr]">
                <dt class="font-medium">Company:</dt>
                <dd>{context.company}</dd>
              </div>
              
              <div class="grid grid-cols-[120px_1fr]">
                <dt class="font-medium">Industry:</dt>
                <dd>{context.industry}</dd>
              </div>
              
              <div class="grid grid-cols-[120px_1fr]">
                <dt class="font-medium">Region:</dt>
                <dd>{context.region}</dd>
              </div>
              
              {#if context.competitors?.length}
                <div class="grid grid-cols-[120px_1fr]">
                  <dt class="font-medium">Competitors:</dt>
                  <dd>
                    <div class="flex flex-wrap gap-1">
                      {#each context.competitors as competitor}
                        <span class="tag preset-filled-primary-500 px-2 py-1 text-xs rounded-token">
                          {competitor}
                        </span>
                      {/each}
                    </div>
                  </dd>
                </div>
              {/if}
              
              {#if context.additionalInfo}
                <div class="col-span-2 mt-2">
                  <dt class="font-medium mb-1">Additional Context:</dt>
                  <dd class="bg-surface-200-800-token p-2 rounded text-sm">{context.additionalInfo}</dd>
                </div>
              {/if}
            </dl>
          </div>
          
          <div class="card p-3 rounded-container-token border border-primary-600">
            <h4 class="text-sm font-medium mb-2">Selected Questions:</h4>
            <div class="space-y-3">
              {#if selectedFramework === 'consumer'}
                <div>
                  <h5 class="text-xs font-medium text-primary-500">Consumer Analysis Questions</h5>
                  <ul class="list-disc list-inside">
                    {#each consumerQuestions.filter(q => selectedQuestions[q.id]) as { question }}
                      <li class="text-sm">{question}</li>
                    {/each}
                  </ul>
                </div>
              {:else}
                {#each Object.entries(questionCategories) as [category, questions]}
                  {@const categoryQuestions = questions.filter(q => selectedQuestions[q.id])}
                  {#if categoryQuestions.length > 0}
                    <div>
                      <h5 class="text-xs font-medium text-primary-500">{category}</h5>
                      <ul class="list-disc list-inside">
                        {#each categoryQuestions as { question }}
                          <li class="text-sm">{question}</li>
                        {/each}
                      </ul>
                    </div>
                  {/if}
                {/each}
              {/if}
              
              {#if selectedQuestionsCount === 0}
                <p class="text-sm">No specific questions selected. A general analysis will be provided.</p>
              {/if}
            </div>
          </div>
          
          <div class="info-box">
            <div class="flex items-start gap-2">
              <IconChecks class="mt-0.5 text-primary-500" size={16} />
              <p class="text-sm">
                The AI assistant will use this information to provide targeted strategic analysis. You can always add more details during your conversation.
              </p>
            </div>
          </div>
        </div>
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
  
  <!-- Name edit modal -->
  <div id="nameModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" style="display: none;">
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
            onclick={() => {
              const modal = document.getElementById('nameModal');
              if (modal) modal.style.display = 'none';
            }}
          >
            Cancel
          </button>
          <button 
            type="button"
            class="btn preset-filled-primary-500"
            onclick={() => {
              nameManuallyEdited = true;
              const modal = document.getElementById('nameModal');
              if (modal) modal.style.display = 'none';
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Progress overlay -->
  {#if showProgress}
    <div class="progress-overlay">
      <div class="progress-spinner"></div>
      <p class="text-white text-lg mt-4">{progressMessage}</p>
    </div>
  {/if}
</div> 