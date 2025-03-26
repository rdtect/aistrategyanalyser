<script lang="ts">
    let { onUpdate, onNext, onClose } = $props<{
        onUpdate: (data: any) => void;
        onNext: () => void;
        onClose: () => void;
    }>();

    let companyName = $state('');
    let industry = $state('');
    let region = $state('');
    let context = $state('');

    function handleSubmit() {
        onUpdate({
            companyName,
            industry,
            region,
            context
        });
        onNext();
    }
</script>

<div class="space-y-4">
    <header class="flex justify-between items-center">
        <h2 class="h2">New Analysis</h2>
        <button class="btn-icon hover:variant-soft" onclick={onClose}>✕</button>
    </header>

    <div class="space-y-4">
        <label class="label">
            <span>Company Name</span>
            <input 
                type="text" 
                class="input" 
                bind:value={companyName} 
                placeholder="Enter company name"
            />
        </label>

        <label class="label">
            <span>Industry</span>
            <input 
                type="text" 
                class="input" 
                bind:value={industry} 
                placeholder="Enter industry"
            />
        </label>

        <label class="label">
            <span>Region</span>
            <input 
                type="text" 
                class="input" 
                bind:value={region} 
                placeholder="Enter region"
            />
        </label>

        <label class="label">
            <span>Context</span>
            <textarea 
                class="textarea" 
                bind:value={context} 
                placeholder="Enter analysis context"
                rows="4"
            ></textarea>
        </label>
    </div>

    <footer class="flex justify-end gap-2">
        <button class="btn variant-soft" onclick={onClose}>Cancel</button>
        <button 
            class="btn variant-filled-primary" 
            onclick={handleSubmit}
            disabled={!companyName || !industry || !region || !context}
        >
            Next
        </button>
    </footer>
</div>
