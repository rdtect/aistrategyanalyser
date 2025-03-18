<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  
  // Form state
  let company = $state('');
  let industry = $state('');
  let region = $state('Global');
  let additionalContext = $state('');
  
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
  
  // Custom region input
  let customRegion = $state('');
  let showCustomRegion = $derived(region === 'Other');
  
  // Validation state
  const isValid = $derived(!!company.trim() && !!industry.trim() && 
    (region !== 'Other' || !!customRegion.trim()));
  
  // Handle form submission
  async function handleSubmit(event: Event) {
    event.preventDefault();
    
    if (!isValid) return;
    
    // Prepare data
    const finalRegion = region === 'Other' ? customRegion : region;
    
    try {
      // Create analysis
      const response = await fetch('/api/analyses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company,
          industry,
          region: finalRegion,
          additionalContext
        })
      });
      
      if (!response.ok) throw new Error('Failed to create analysis');
      
      const { id } = await response.json();
      
      // Navigate to question selection
      goto(`/analyses/${id}/questions`);
    } catch (error) {
      console.error('Error creating analysis:', error);
    }
  }
</script>

<div class="container mx-auto max-w-2xl p-4">
  <h1 class="text-2xl font-bold mb-6">New Strategic Analysis</h1>
  
  <form onsubmit={handleSubmit} class="space-y-6">
    <div class="form-group">
      <label for="company" class="label">Company Name <span class="text-red-500">*</span></label>
      <input 
        id="company" 
        bind:value={company}
        class="input" 
        required
      />
    </div>
    
    <div class="form-group">
      <label for="industry" class="label">Industry <span class="text-red-500">*</span></label>
      <input 
        id="industry" 
        bind:value={industry}
        class="input" 
        required
      />
    </div>
    
    <div class="form-group">
      <label for="region" class="label">Region <span class="text-red-500">*</span></label>
      <select 
        id="region" 
        bind:value={region}
        class="select"
      >
        {#each regionOptions as option}
          <option value={option}>{option}</option>
        {/each}
      </select>
      
      {#if showCustomRegion}
        <div class="mt-2">
          <input 
            placeholder="Enter custom region" 
            bind:value={customRegion}
            class="input" 
          />
        </div>
      {/if}
    </div>
    
    <div class="form-group">
      <label for="additionalContext" class="label">Additional Context</label>
      <textarea 
        id="additionalContext" 
        bind:value={additionalContext}
        class="textarea" 
        rows="4"
        placeholder="Provide any additional context about the company or analysis needs..."
      ></textarea>
    </div>
    
    <button 
      type="submit" 
      class="btn variant-filled-primary w-full"
      disabled={!isValid}
    >
      Continue to Question Selection
    </button>
  </form>
</div> 