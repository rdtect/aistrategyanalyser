<script lang="ts">
  // Define the result type
  interface SearchResult {
    title: string;
    snippet: string;
    url: string;
  }
  
  let searchQuery = $state('');
  let searchResults = $state<SearchResult[]>([]);
  let isSearching = $state(false);
  
  async function performSearch(event?: Event) {
    if (event) event.preventDefault();
    if (!searchQuery.trim() || isSearching) return;
    
    isSearching = true;
    
    try {
      const response = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });
      
      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      searchResults = data.results;
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      isSearching = false;
    }
  }
</script>

<div class="research-panel">
  <h2>Web Research</h2>
  
  <form onsubmit={performSearch}>
    <input 
      type="text" 
      placeholder="Search the web..." 
      bind:value={searchQuery}
    />
    <button type="submit" disabled={isSearching}>
      {isSearching ? 'Searching...' : 'Search'}
    </button>
  </form>
  
  <div class="results">
    {#each searchResults as result}
      <div class="result-item">
        <h3>{result.title}</h3>
        <p>{result.snippet}</p>
        <a href={result.url} target="_blank" rel="noopener">Read more</a>
      </div>
    {/each}
  </div>
</div> 