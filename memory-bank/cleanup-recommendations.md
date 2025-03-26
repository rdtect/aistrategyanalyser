### Code to Delete or Archive

1. **Unused Components**

   - Any components marked as "archived" in the corrections.md file
   - ExportButton and ChatSidebar (mentioned in corrections.md as archived)

2. **Deprecated OpenAI Implementations**

   - Multiple OpenAI client implementations (now centralized)
   - Old non-streaming API endpoints if no longer used

3. **Legacy Svelte Patterns**

   - Components not yet updated to Svelte 5 runes syntax
   - Code using old event handling ($on:event instead of onevent)

4. **Temporary Development Files**
   - Debug logging and window.\_\_ exports
   - Commented-out code blocks
   - Mock implementations once real data is available
