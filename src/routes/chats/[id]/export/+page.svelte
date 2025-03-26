<script lang="ts">
  // No more import for file-saver
  
  // Import type definitions imported in d.ts file
  
  let { data } = $props<{ 
    data: { 
      chat: any,
      analysis: any,
      markdown: string,
      html: string
    }
  }>();

  // Check if FileSystem Access API is supported
  const supportsFileSystemAccess = 'showSaveFilePicker' in window;
  
  // Save as markdown file using File System Access API
  async function downloadMarkdown() {
    const fileName = `${data.chat.name.replace(/\s+/g, '_')}_analysis.md`;
    const content = data.markdown;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    
    try {
      if (supportsFileSystemAccess && window.showSaveFilePicker) {
        // Use modern File System Access API
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: fileName,
          types: [{
            description: 'Markdown File',
            accept: {'text/markdown': ['.md']},
          }],
        });
        
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
      } else {
        // Fallback for browsers without File System Access API
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(link.href);
      }
    } catch (error) {
      console.error('Error exporting markdown:', error);
      alert('Failed to save file. Please try again.');
    }
  }
  
  // Save as HTML file using File System Access API
  async function downloadHTML() {
    // Create complete HTML document
    const htmlDoc = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${data.chat.name} - Strategic Analysis</title>
        <style>
          body { font-family: system-ui, sans-serif; line-height: 1.6; max-width: 900px; margin: 0 auto; padding: 2rem; }
          h1, h2, h3 { color: #333; }
          pre { background: #f5f5f5; padding: 1rem; border-radius: 4px; overflow-x: auto; }
          blockquote { border-left: 4px solid #ddd; padding-left: 1rem; color: #666; }
        </style>
      </head>
      <body>
        ${data.html}
      </body>
      </html>
    `;
    
    const fileName = `${data.chat.name.replace(/\s+/g, '_')}_analysis.html`;
    const blob = new Blob([htmlDoc], { type: 'text/html;charset=utf-8' });
    
    try {
      if (supportsFileSystemAccess && window.showSaveFilePicker) {
        // Use modern File System Access API
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: fileName,
          types: [{
            description: 'HTML File',
            accept: {'text/html': ['.html']},
          }],
        });
        
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
      } else {
        // Fallback for browsers without File System Access API
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(link.href);
      }
    } catch (error) {
      console.error('Error exporting HTML:', error);
      alert('Failed to save file. Please try again.');
    }
  }
  
  // Export JSON format
  async function downloadJSON() {
    const jsonData = {
      chat: data.chat,
      analysis: data.analysis,
      exportedAt: new Date().toISOString()
    };
    
    const fileName = `${data.chat.name.replace(/\s+/g, '_')}_analysis.json`;
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json;charset=utf-8' });
    
    try {
      if (supportsFileSystemAccess && window.showSaveFilePicker) {
        // Use modern File System Access API
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: fileName,
          types: [{
            description: 'JSON File',
            accept: {'application/json': ['.json']},
          }],
        });
        
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
      } else {
        // Fallback for browsers without File System Access API
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(link.href);
      }
    } catch (error) {
      console.error('Error exporting JSON:', error);
      alert('Failed to save file. Please try again.');
    }
  }
</script>

<div class="container mx-auto max-w-4xl p-4">
  <header class="mb-6">
    <h1 class="text-2xl font-bold">{data.chat.name} - Export</h1>
    <div class="flex gap-4 mt-4">
      <button onclick={downloadMarkdown} class="btn variant-filled-primary">
        Download Markdown
      </button>
      <button onclick={downloadHTML} class="btn variant-filled-secondary">
        Download HTML
      </button>
      <button onclick={downloadJSON} class="btn variant-filled">
        Download JSON
      </button>
    </div>
    {#if !supportsFileSystemAccess}
      <p class="text-sm text-orange-500 mt-2">
        Note: Your browser doesn't support the modern File System API. Files will download automatically.
      </p>
    {/if}
  </header>
  
  <div class="card p-6">
    <div class="prose max-w-none">
      {@html data.html}
    </div>
  </div>
</div> 