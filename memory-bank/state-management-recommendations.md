# State Management Recommendations

## Svelte 5 Runes Best Practices

1. **Immutable State Updates**
   ```typescript
   // ❌ Don't mutate state directly
   chats.splice(index, 1);
   chats[index] = newValue;
   
   // ✅ Create new arrays/objects for state updates
   chats = chats.filter((_, i) => i !== index);
   chats = [...chats.slice(0, index), newValue, ...chats.slice(index + 1)];
   ```

2. **Batch Related State Updates**
   ```typescript
   // ❌ Multiple separate updates
   chats = newChats;
   activeChatId = newId;
   isLoading = false;
   
   // ✅ Single function for related updates
   function updateChatState(newChats, newId) {
     chats = newChats;
     activeChatId = newId;
     isLoading = false;
   }
   ```

3. **Derived State**
   ```typescript
   // ❌ Manual derivation in render
   {#each Object.values(chats).sort((a, b) => 
     new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
   ) as chat}
   
   // ✅ Use $derived for automatic updates
   const sortedChats = $derived(
     Object.values(chats).sort(
       (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
     )
   );
   ```

4. **State Initialization**
   ```typescript
   // ❌ Mutable initialization
   let chats = $state({});
   Object.assign(chats, initialChats);
   
   // ✅ Immutable initialization
   let chats = $state(initialChats || {});
   ```

5. **Array Operations**
   ```typescript
   // ❌ Array mutations
   messages.push(newMessage);
   messages.splice(index, 1);
   messages.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
   
   // ✅ Immutable array operations
   messages = [...messages, newMessage];
   messages = messages.filter((_, i) => i !== index);
   messages = [...messages].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
   ```

6. **Object Updates**
   ```typescript
   // ❌ Nested mutations
   chats[id].messages.push(newMessage);
   chats[id].updatedAt = new Date().toISOString();
   
   // ✅ Immutable object updates
   chats = {
     ...chats,
     [id]: {
       ...chats[id],
       messages: [...chats[id].messages, newMessage],
       updatedAt: new Date().toISOString()
     }
   };
   ```

7. **State Access in Effects**
   ```typescript
   // ❌ Complex logic in effects
   $effect(() => {
     if (activeChatId && chats[activeChatId]) {
       localStorage.setItem('activeChat', activeChatId);
       console.log(`Active chat: ${chats[activeChatId].name}`);
     }
   });
   
   // ✅ Use derived values and focused effects
   const activeChat = $derived(activeChatId ? chats[activeChatId] : null);
   
   $effect(() => {
     if (activeChatId) {
       localStorage.setItem('activeChat', activeChatId);
     }
   });
   
   $effect(() => {
     if (activeChat) {
       console.log(`Active chat: ${activeChat.name}`);
     }
   });
   ```

8. **Props with Defaults**
   ```typescript
   // ❌ Old export let syntax
   export let name = 'Default';
   export let count = 0;
   
   // ✅ New $props syntax with defaults
   let { name = 'Default', count = 0 } = $props();
   ```

## Implementation Guidelines

1. **State Organization**
   - Use module-level `$state` for global state
   - Use component-level `$state` for component-specific state
   - Use `$derived` for computed values
   - Document state shape with TypeScript interfaces

2. **State Updates**
   - Always create new references for state updates
   - Use immutable update patterns
   - Create helper functions for complex state updates

3. **Performance Considerations**
   - Use `$derived` to avoid recalculating values
   - Avoid unnecessary object/array creation
   - Split large components into smaller ones with focused state

4. **Error Handling**
   - Include error state in your state objects
   - Use `try/catch` in async functions
   - Provide user feedback for state update failures

5. **IndexedDB Integration**
   - Use the `idb` library for IndexedDB access
   - Create a service layer for database operations
   - Sync state with IndexedDB in `$effect` blocks

6. **Testing**
   - Test state updates with different scenarios
   - Verify derived state calculations
   - Test error handling and edge cases

## Svelte 5 Store Pattern

```typescript
// Module-level state
let count = $state(0);
const doubled = $derived(count * 2);

// Actions
function increment() {
  count += 1;
}

function decrement() {
  count -= 1;
}

// Getters
function getCount() {
  return count;
}

function getDoubled() {
  return doubled;
}

// Export actions and getters
export { increment, decrement, getCount, getDoubled };
```