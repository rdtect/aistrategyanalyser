# Memory Bank: State & Reactivity Patterns (Svelte 5)

## Chat State Management (Svelte 5 Runes)

**Single Source of Truth:**
- All chat and message state is managed in a single `ChatManager` singleton (see `/src/routes/chats/(lib)/ChatManager.svelte.ts`).
- Uses a top-level `$state` SvelteMap for `chatsMap` (all chat objects, keyed by id).
- All mutations (add, delete, update messages) are done in-place on this map.
- No redundant `$state` or `$derived` needed for messages array—reassigning or mutating the map triggers reactivity everywhere.

**Key Patterns:**
- `$state` is used **once** at the top-level for the SvelteMap:
  ```ts
  chatsMap = $state(new SvelteMap<string, Chat>())
  ```
- Mutate the map in-place:
  ```ts
  this.chatsMap.set(chatId, updatedChat)
  this.chatsMap.delete(chatId)
  this.chatsMap.clear()
  ```
- `$derived` is used for computed state, e.g.:
  ```ts
  chatList = $derived(() => Array.from(this.chatsMap.values()))
  activeChat = $derived(() => this.activeChatId ? this.chatsMap.get(this.activeChatId) ?? null : null)
  ```
- In components, **never call** these as functions. Use as properties:
  ```svelte
  {#if chatManager.activeChat}
    {#each chatManager.activeChat.messages as msg}
      <ChatMessage message={msg} />
    {/each}
  {/if}
  ```

**Why this works:**
- SvelteMap is reactive: all mutations to the same instance are tracked by Svelte’s reactivity engine.
- `$state` at the top level ensures that all consumers (via `$derived` or direct access) update instantly.
- No need to wrap or reassign the map—mutate in-place for best performance and simplicity.

## Common Pitfalls Avoided
- **Don’t**: Use `$state` or `$derived` repeatedly for the same value.
- **Don’t**: Call `$derived` values as functions.
- **Don’t**: Replace the SvelteMap instance—mutate it instead.
- **Don’t**: Use `.get()` or `.set()` on undefined/null.
- **Do**: Use optional chaining for possibly-null objects/arrays in templates.

## Example: Message Flow
1. User sends a message in `ChatInput`.
2. `chatManager.sendMessage()` mutates the correct chat’s messages array in-place via the SvelteMap.
3. All UI components (`ChatWindow`, `ChatSidebar`, etc.) instantly reflect the new state—no reload required.

---

## Reference: Svelte 5 Runes State
- [Official Docs](https://svelte.dev/blog/runes)
- [Clean Architecture: State Modules](https://martinfowler.com/bliki/FeatureToggle.html)

---

_Last updated: 2025-04-30_