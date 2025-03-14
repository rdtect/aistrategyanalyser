<script lang="ts">
    import { onMount } from 'svelte';
    
    // State
    let indexingStatus = $state('Idle');
    let progress = $state(0);
    let totalItems = $state(0);
    let indexedItems = $state(0);
    let isLoading = $state(false);
    
    // Indexing status
    let questionsIndexed = $state(0);
    let totalQuestions = $state(0);
    let companiesIndexed = $state(0);
    let totalCompanies = $state(0);
    
    // Sample companies for indexing
    const sampleCompanies = [
        { name: 'Nike', industry: 'Athletic Footwear', region: 'North America', description: 'Global sports apparel and equipment manufacturer.' },
        { name: 'Starbucks', industry: 'Coffee Shops', region: 'Global', description: 'International coffee chain known for premium coffee beverages.' },
        { name: 'Tesla', industry: 'Electric Vehicles', region: 'Europe', description: 'Electric vehicle and clean energy company.' }
    ];
    
    onMount(async () => {
        await fetchIndexingStatus();
    });
    
    async function fetchIndexingStatus() {
        try {
            isLoading = true;
            const response = await fetch('/api/indexing');
            const status = await response.json();
            
            questionsIndexed = status.questions.indexed;
            totalQuestions = status.questions.total;
            companiesIndexed = status.companies.indexed;
            totalCompanies = status.companies.total;
            
            isLoading = false;
        } catch (error) {
            console.error('Error fetching indexing status:', error);
            indexingStatus = `Error: ${error.message}`;
            isLoading = false;
        }
    }
    
    async function indexQuestions() {
        try {
            indexingStatus = 'Indexing questions...';
            isLoading = true;
            progress = 0;
            
            const response = await fetch('/api/indexing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'indexQuestions' })
            });
            
            const result = await response.json();
            
            if (result.success) {
                indexingStatus = `Successfully indexed ${result.indexed} questions`;
                totalItems = result.total;
                indexedItems = result.indexed;
                progress = 100;
                
                // Update status
                await fetchIndexingStatus();
            } else {
                indexingStatus = `Error: ${result.error}`;
            }
            
            isLoading = false;
        } catch (error) {
            indexingStatus = `Error: ${error.message}`;
            isLoading = false;
        }
    }
    
    async function indexSampleCompanies() {
        try {
            indexingStatus = 'Indexing sample companies...';
            isLoading = true;
            progress = 0;
            
            const response = await fetch('/api/indexing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    action: 'indexCompanies',
                    data: { companies: sampleCompanies }
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                indexingStatus = `Successfully indexed ${result.indexed} companies`;
                totalItems = result.total;
                indexedItems = result.indexed;
                progress = 100;
                
                // Update status
                await fetchIndexingStatus();
            } else {
                indexingStatus = `Error: ${result.error}`;
            }
            
            isLoading = false;
        } catch (error) {
            indexingStatus = `Error: ${error.message}`;
            isLoading = false;
        }
    }
</script>

<div class="card p-4">
    <h2 class="h2 mb-4">Vector Embeddings Indexing</h2>
    
    <div class="flex flex-col gap-4">
        <div class="card variant-soft p-4">
            <h3 class="h3 mb-2">Indexing Status</h3>
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <h4 class="font-semibold">Analysis Questions</h4>
                    <p>{questionsIndexed} / {totalQuestions} indexed</p>
                    <div class="w-full bg-surface-300 h-2 mt-1 rounded-full">
                        <div 
                            class="bg-primary-500 h-full rounded-full"
                            style="width: {totalQuestions ? (questionsIndexed / totalQuestions * 100) : 0}%"
                        ></div>
                    </div>
                </div>
                
                <div>
                    <h4 class="font-semibold">Sample Companies</h4>
                    <p>{companiesIndexed} / {totalCompanies} indexed</p>
                    <div class="w-full bg-surface-300 h-2 mt-1 rounded-full">
                        <div 
                            class="bg-primary-500 h-full rounded-full"
                            style="width: {totalCompanies ? (companiesIndexed / totalCompanies * 100) : 0}%"
                        ></div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="card variant-soft p-4">
            <h3 class="h3 mb-2">Current Operation</h3>
            <p>Status: {indexingStatus}</p>
            
            {#if isLoading && totalItems > 0}
                <div class="w-full bg-surface-300 h-2 mt-2 rounded-full">
                    <div 
                        class="bg-primary-500 h-full rounded-full"
                        style="width: {progress}%"
                    ></div>
                </div>
                <p class="text-sm mt-1">{indexedItems} / {totalItems}</p>
            {/if}
        </div>
        
        <div class="flex gap-2">
            <button 
                class="btn variant-filled-primary" 
                on:click={indexQuestions}
                disabled={isLoading}
            >
                Index Analysis Questions
            </button>
            
            <button 
                class="btn variant-filled-primary" 
                on:click={indexSampleCompanies}
                disabled={isLoading}
            >
                Index Sample Companies
            </button>
        </div>
    </div>
</div>
