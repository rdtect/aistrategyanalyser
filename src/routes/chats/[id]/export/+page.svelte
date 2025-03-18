<script lang="ts">
  import { saveAs } from 'file-saver';
  
  let { data } = $props<{ 
    data: { 
      chat: any,
      analysis: any,
      markdown: string,
      html: string
    }
  }>();
  
  // Save as markdown file
  function downloadMarkdown() {
    const blob = new Blob([data.markdown], { type: 'text/markdown;charset=utf-8' });
    saveAs(blob, `${data.chat.name.replace(/\s+/g, '_')}_analysis.md`);
  }
  
  // Save as HTML file
  function downloadHTML() {
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
    
    const blob = new Blob([htmlDoc], { type: 'text/html;charset=utf-8' });
    saveAs(blob, `${data.chat.name.replace(/\s+/g, '_')}_analysis.html`);
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
    </div>
  </header>
  
  <div class="card p-6">
    <div class="prose max-w-none">
      {@html data.html}
    </div>
  </div>
</div> 