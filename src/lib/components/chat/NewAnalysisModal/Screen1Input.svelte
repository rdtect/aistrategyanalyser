<script lang="ts">
    import { ChevronRight } from 'lucide-svelte';

    let { 
        formData = $bindable(),
        error = '',
        onNext = () => {},
        onClose = () => {}
    } = $props();

    function handleSubmit(e: Event) {
        e.preventDefault();
        
        if (!formData.company || !formData.industry || !formData.region) {
            error = 'Please fill in all required fields';
            return;
        }
        
        error = '';
        onNext();
    }
</script>

<form class="space-y-4" onsubmit={handleSubmit}>
    <label class="label">
        <span>Company Name*</span>
        <input
            type="text"
            bind:value={formData.company}
            class="input"
            placeholder="e.g. Apple Inc."
            required
        />
    </label>
    
    <label class="label">
        <span>Industry/Category*</span>
        <input
            type="text"
            bind:value={formData.industry}
            class="input"
            placeholder="e.g. Technology"
            required
        />
    </label>
    
    <label class="label">
        <span>Region*</span>
        <input
            type="text"
            bind:value={formData.region}
            class="input"
            placeholder="e.g. North America"
            required
        />
    </label>
    
    <label class="label">
        <span>Additional Context (Optional)</span>
        <textarea
            bind:value={formData.context}
            class="textarea"
            rows="3"
            placeholder="Any specific focus areas or additional information..."
        ></textarea>
    </label>
    
    {#if error}
        <p class="text-error-500">{error}</p>
    {/if}

    <div class="flex justify-end space-x-2">
        <button 
            type="button" 
            class="btn variant-soft" 
            onclick={(e: MouseEvent) => onClose()}
        >
            Cancel
        </button>
        <button type="submit" class="btn variant-filled-primary">
            Next
            <ChevronRight class="h-4 w-4" />
        </button>
    </div>
</form>