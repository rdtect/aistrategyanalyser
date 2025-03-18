<script>
  import '../app.css'
  let { children } = $props();
</script>

<div class="flex flex-col h-full mx-auto ">
  <header class="border-b border-surface-200-700dark:border-surface-500 px-4 py-2 flex items-center justify-between">
    <div class="flex items-center gap-2 m-2">
      <a href="/" class="text-xl font-bold">AI Strategy Analyzer</a>
    </div>
    <nav class="hidden sm:flex gap-4">
      <a href="/" class="hover:underline">Home</a>
      <a href="/chats/new" class="hover:underline">New Analysis</a>
    </nav>
  </header>
  
  <main class="flex-1 container mx-auto my-auto bg-surface-500/20 rounded-xl h-[90vh] overflow-hidden">
    {@render children()}
  </main>
  
  <footer class="border-t border-surface-200-700 dark:border-surface-500 p-2 text-center text-sm h-fit " >
    <p>© {new Date().getFullYear()} AI Strategy Analyzer</p>
  </footer>
</div>