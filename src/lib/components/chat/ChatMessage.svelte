<script lang="ts">
  import { marked } from 'marked';
  
  // Props using runes
  let { message } = $props<{ 
    message: {
      id: string;
      content: string;
      sender: 'user' | 'ai';
      timestamp: Date | string;
      status?: string;
      sources?: Array<any>;
    }
  }>();
  
  // Format the timestamp
  function formatTime(timestamp: Date | string): string {
    const date = typeof timestamp === 'string' 
      ? new Date(timestamp) 
      : timestamp;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // Format content with markdown
  function formatContent(content: string, isUserMessage: boolean): string {
    if (isUserMessage) return content;
    try {
      // Cast to string to fix type error
      return marked.parse(content) as string;
    } catch (e) {
      console.error('Error parsing markdown:', e);
      return content;
    }
  }
</script>

<div class="flex {message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4">
  <div 
    class="max-w-[80%] rounded-lg {
      message.sender === 'user' 
        ? 'bg-primary-500 text-white' 
        : 'bg-surface-500/20 text-white'
    } p-4"
  >
    <div class="flex justify-between text-xs mb-2">
      <span class="font-semibold">{message.sender === 'user' ? 'You' : 'AI Assistant'}</span>
      <span class="opacity-75">{formatTime(message.timestamp)}</span>
    </div>
    
    <div class="prose prose-sm prose-invert">
      {@html formatContent(message.content, message.sender === 'user')}
    </div>
    
    {#if message.sources && message.sources.length > 0}
      <div class="mt-3 pt-2 border-t border-surface-300/30">
        <h4 class="text-xs font-bold mb-1 uppercase">Sources</h4>
        <ul class="text-xs space-y-1">
          {#each message.sources as source}
            <li>
              <a 
                href={source.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                class="text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                {source.title}
                <span class="i-lucide-external-link text-xs"></span>
              </a>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
    
    {#if message.status === 'error'}
      <div class="text-xs text-red-500 mt-1">
        Error generating response
      </div>
    {/if}
  </div>
</div> 