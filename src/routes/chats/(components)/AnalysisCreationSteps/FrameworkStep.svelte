<script lang="ts">
  // Imports for Icons used in this step
  import IconBox from '@lucide/svelte/icons/box';
  import IconUsers from '@lucide/svelte/icons/users';
  import IconBuilding from '@lucide/svelte/icons/building';
  import IconTarget from '@lucide/svelte/icons/target';
  import IconGlobe2 from '@lucide/svelte/icons/globe-2';

  // Define the structure for framework options expected as a prop
  type FrameworkOption = {
    id: string;
    name: string;
    description: string;
    icon: any; // Using 'any' for simplicity, could be ComponentType if needed
    disabled?: boolean;
  };

  // Props received from the parent component
  let { 
    frameworkOptions, 
    selectedFrameworkId, 
    onSelectFramework,
    allFrameworkOption
  } = $props<{ 
    frameworkOptions: FrameworkOption[]; 
    selectedFrameworkId: string; 
    onSelectFramework: (id: string) => void; 
    allFrameworkOption?: FrameworkOption;
  }>();

  // Determine which icon component to render based on the prop
  // This avoids needing specific imports for each icon type passed in frameworkOptions
  const iconComponents: Record<string, any> = {
    IconBox,
    IconUsers,
    IconBuilding,
    IconTarget,
    IconGlobe2
    // Add other icons used by frameworkOptions here if necessary
  };

</script>

<div class="space-y-4 step-content">
  <div class="card bg-primary-500/10 p-4 rounded-container-token mb-4">
    <h3 class="h4 mb-2">Select Analysis Framework</h3>
    <p class="text-sm">
      Choose a framework to guide your strategic analysis. Each framework provides different insights.
    </p>
  </div>
  
  <!-- Render the 'all' option first if it exists -->
  {#if allFrameworkOption}
    {@const IconComponent = iconComponents[allFrameworkOption.icon.name]}
    <div class="mb-4">
      <button 
        type="button" 
        class="w-full p-4 rounded-container-token framework-card flex gap-4 items-center {selectedFrameworkId === allFrameworkOption.id ? 'selected' : ''}"
        onclick={() => onSelectFramework(allFrameworkOption.id)}
        disabled={allFrameworkOption.disabled}
      >
        <div class="bg-primary-500/20 p-3 rounded-full">
          <IconComponent size={24} class="text-primary-700" />
        </div>
        <div class="flex-1 text-left">
          <h4 class="font-medium">{allFrameworkOption.name}</h4>
          <p class="text-sm">{allFrameworkOption.description}</p>
          {#if allFrameworkOption.disabled}
            <p class="text-xs italic mt-2 text-primary-500">Coming soon</p>
          {/if}
        </div>
      </button>
    </div>
    <h4 class="font-medium text-sm px-2">Or select a specific focus:</h4>
  {/if}

  <!-- Grid for other options -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
    {#each frameworkOptions.filter((opt: FrameworkOption) => opt.id !== 'all') as option (option.id)} 
      {@const OptionIconComponent = iconComponents[option.icon.name]}
      <button 
        type="button"
        class="p-4 rounded-container-token framework-card {selectedFrameworkId === option.id ? 'selected' : ''} {option.disabled ? 'disabled' : ''}"
        onclick={() => onSelectFramework(option.id)}
        disabled={option.disabled}
      >
        <div class="flex items-center gap-3 mb-2">
          <div class="bg-primary-500/20 p-2 rounded-full {option.disabled ? '!bg-surface-500/20' : ''}">
            <OptionIconComponent size={20} class={option.disabled ? 'text-surface-700' : 'text-primary-700'} />
          </div>
          <h4 class="font-medium">{option.name}</h4>
        </div>
        <p class="text-sm">{option.description}</p>
        {#if option.disabled}
          <p class="text-xs italic mt-2 text-primary-500">Coming soon</p>
        {/if}
      </button>
    {/each}
  </div>

  <!-- Info box based on selected framework -->
  <div class="info-box mt-4">
    <p class="text-sm">
      {#if selectedFrameworkId}
        {@const selectedOption = frameworkOptions.find((opt: FrameworkOption) => opt.id === selectedFrameworkId)}
        {selectedOption?.description || 'Select a framework to begin.'}
      {:else}
        Select a framework to begin your strategic analysis.
      {/if}
    </p>
  </div>
</div>

<style>
  /* Basic styles for framework cards (can be enhanced) */
  .framework-card {
    cursor: pointer;
    transition: all 0.2s ease;
    border: 2px solid transparent;
    text-align: left;
  }
  
  .framework-card:hover:not(.disabled) {
    transform: translateY(-2px);
    background-color: rgba(var(--color-primary-500-rgb), 0.05);
  }
  
  .framework-card.selected {
    border-color: var(--color-primary-500);
    background-color: rgba(var(--color-primary-500-rgb), 0.1);
  }
  
  .framework-card.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Styles from parent, potentially scope or move to global */
  .info-box {
    background-color: rgba(var(--color-primary-500-rgb), 0.1);
    border-left: 4px solid var(--color-primary-500);
    padding: 0.75rem;
    margin: 0.75rem 0;
    border-radius: 0.25rem;
  }

  /* Assuming step-content animation is handled by parent or global */
</style>