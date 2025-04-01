# Chat Functionality Refactoring Plan (April 2024)

This plan outlines the steps to refactor and improve the chat functionality located primarily within `src/routes/chats/` and related services, based on code review findings.

## Goals:
- Improve Type Safety and Consistency
- Enhance Maintainability and Readability
- Increase Robustness and Reduce Potential Bugs
- Adhere to Best Practices (Svelte 5, Separation of Concerns)

## Steps:

1.  **Unify OpenAI Service Return Type:**
    *   **File:** `src/lib/services/openai.ts`
    *   **Action:** Modify `generateAIResponse`, `generateStandardResponse`, and `generateStreamingResponse` to ensure `generateAIResponse` consistently returns `Promise<{ response: { message: { content: string | null, tool_calls: any[] | undefined } }, metadata: any }>`. Update the function signature explicitly.

2.  **Remove Type Assertion in ChatLogic:**
    *   **File:** `src/routes/chats/[id]/ChatLogic.svelte.ts`
    *   **Action:** Remove the `as StandardResponseType` assertion after Step 1 is completed.

3.  **Enhance ChatService Type Safety:**
    *   **File:** `src/lib/services/ChatService.ts`
    *   **Action:** Implement data validation/hydration within `getChatById` and `getAllChats`. Ensure data loaded from `IDBService` strictly conforms to `Chat` and `Message` types (defined in `$lib/types.ts`) before returning. Add default values or log errors for non-conforming data. (May require reading `$lib/types.ts` for precise structure).

4.  **Refactor AnalysisCreation Component:**
    *   **File:** `src/routes/chats/(components)/AnalysisCreation.svelte`
    *   **Action:** Break down the large component into smaller sub-components based on the form steps (e.g., `AnalysisCreationSteps/FrameworkStep.svelte`, `ContextStep.svelte`, etc.).

5.  **Abstract Complex Logic:**
    *   **Files:** `AnalysisCreation.svelte`, `ChatService.ts`/`ChatStore.svelte.ts`, `ChatLogic.svelte.ts`
    *   **Action 1:** Move the complex storage verification logic (fetch retries for `/api/chats/.../direct`) from `handleSubmit` in `AnalysisCreation.svelte` into `ChatService` or `ChatStore`.
    *   **Action 2:** Improve intent detection (for tools/web search) in `ChatLogic.svelte.ts` using a more robust method than `content.includes(...)`.

6.  **Standardize Error Handling in ChatLogic:**
    *   **File:** `src/routes/chats/[id]/ChatLogic.svelte.ts`
    *   **Action:** Make the updates to the `error` state consistent (prefer direct assignment `error = ...`).

7.  **General Code Cleanup:**
    *   **Files:** Across `src/routes/chats/` and related components/services.
    *   **Action:** Remove unused imports, test removal of potentially unnecessary `setTimeout` delays, review `localStorage` key usage (`_backup_` vs `_fallback_`) for simplification.

*This plan should be executed sequentially.*
