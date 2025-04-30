<script lang="ts">
  import type { ChatContext } from '$lib/types';

  // Icons needed for this step
  import IconX from '@lucide/svelte/icons/x';
  import IconBuildingSkyscraper from '@lucide/svelte/icons/building-2';
  import IconFactory from '@lucide/svelte/icons/factory';
  import IconGlobe from '@lucide/svelte/icons/globe';
  import IconPlus from '@lucide/svelte/icons/plus';
  import IconUsers from '@lucide/svelte/icons/users';

  // Props from parent
  let { 
    context,
    competitorInput,
    industryOptions, 
    regionOptions,
    onAddCompetitor,
    onRemoveCompetitor,
    onContextChange,
    onCompetitorInputChange
  } = $props<{ 
    context: ChatContext; 
    competitorInput: string;
    industryOptions: string[];
    regionOptions: string[];
    onAddCompetitor: () => void;
    onRemoveCompetitor: (competitor: string) => void;
    onContextChange: (newContext: ChatContext) => void;
    onCompetitorInputChange: (newValue: string) => void;
  }>();

  // Local state mirroring the props
  let localContext = $state({ ...context });
  let localCompetitorInput = $state(competitorInput);

  // Effect to update local state when props change from parent
  $effect(() => {
    if (JSON.stringify(localContext) !== JSON.stringify(context)) {
        localContext = { ...context };
    }
  });
  $effect(() => {
    if (localCompetitorInput !== competitorInput) {
        localCompetitorInput = competitorInput;
    }
  });

  // Effect to notify parent when local context changes
  $effect(() => {
    if (JSON.stringify(localContext) !== JSON.stringify(context)) {
        onContextChange({ ...localContext });
    }
  });

  // Effect to notify parent when local competitor input changes
  $effect(() => {
    if (localCompetitorInput !== competitorInput) {
        onCompetitorInputChange(localCompetitorInput);
    }
  });

  // Helper for keyboard competitor entry
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission if wrapped in form
      onAddCompetitor();
    }
  }

</script>

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
        bind:value={localContext.company}
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
        bind:value={localContext.industry}
        placeholder="Enter industry"
        list="industry-options-step2"
        required
      />
      <datalist id="industry-options-step2">
        {#each industryOptions as industryOpt}
          <option value={industryOpt}>{industryOpt}</option>
        {/each}
      </datalist>
      <button 
        type="button"
        onclick={() => localContext.industry = ''}
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
        bind:value={localContext.region}
        placeholder="Enter region"
        list="region-options-step2"
        required
      />
      <datalist id="region-options-step2">
        {#each regionOptions as regionOpt}
          <option value={regionOpt}>{regionOpt}</option>
        {/each}
      </datalist>
      <button 
        type="button"
        onclick={() => localContext.region = 'Global'}
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
        bind:value={localCompetitorInput}
        onkeydown={handleKeyDown}
        placeholder="Add competitors (optional, press Enter to add)"
      />
      <button 
        type="button"
        onclick={onAddCompetitor} 
        class="ig-cell preset-filled-surface-500"
        aria-label="Add competitor"
      >
        <IconPlus size={16} />
      </button>
    </div>
  </label>
  
  {#if localContext.competitors?.length}
    <div class="flex flex-wrap gap-1 mt-2">
      {#each localContext.competitors as competitor (competitor)}
        <div class="tag preset-filled-primary px-2 py-1 text-xs rounded-token flex items-center gap-1">
          <span>{competitor}</span>
          <button 
            type="button"
            onclick={() => onRemoveCompetitor(competitor)} 
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
      bind:value={localContext.additionalInfo}
      placeholder="Provide any additional information that might be relevant..."
    ></textarea>
  </label>
</div>

<style>
  /* Styles from parent, potentially scope or move to global */
  /* Assuming step-content animation is handled by parent or global */
  /* Ensure input styles are available if not global */
</style>
