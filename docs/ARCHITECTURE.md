# Architecture Overview

This document outlines the high-level architecture of the AI Strategy Analyzer SvelteKit application.

## Core Principles

- **Separation of Concerns:** Logic is divided into distinct layers (UI, Service/Orchestration, State Management, Persistence, External APIs).
- **Reactivity:** Svelte 5 runes (`$state`, `$derived`) are used for managing reactive UI state.
- **Modularity:** Code is organized into features (e.g., `chats`, `settings`, `analysis-creation`) and shared libraries (`$lib`).
- **Server/Client:** SvelteKit's features for universal (`+page.js`) and server-only (`+page.server.js`, `$lib/server`) code are utilized.

## Key Layers & Data Flow (Chat Feature Example)

1.  **UI Layer (`src/routes/chats/.../*.svelte`)**
    *   **Components:** `+layout.svelte`, `+page.svelte`, `ChatWindow.svelte`, `ChatSidebar.svelte`, `ChatMessage.svelte`, `ChatInput.svelte`.
    *   **Responsibilities:**
        *   Render UI based on reactive state.
        *   Handle user input (clicks, text entry).
        *   Call functions from the Service/Orchestration layer (`ChatService`, `ChatActions`) to initiate actions.
        *   Read reactive state directly from the State Management layer (`ChatState`).

2.  **Service/Orchestration Layer (`src/routes/chats/(lib)/ChatService.ts`, `ChatActions.svelte.ts`)**
    *   **`ChatService.ts`:**
        *   **Responsibilities:** Orchestrates core chat data lifecycle operations.
        *   Coordinates between UI actions, the State Management layer (`ChatState`), and the Persistence layer (`IDBService`).
        *   Exports functions like `initializeChatState`, `createNewChat`, `selectChat`, `deleteChat`, `addMessage`.
        *   Calls Persistence layer first, then updates State layer on success.
    *   **`ChatActions.svelte.ts`:**
        *   **Responsibilities:** Manages interaction with the external AI API (e.g., OpenAI).
        *   Handles sending prompts and processing streaming responses.
        *   Calls `ChatService.addMessage` to persist user prompts and AI responses.
        *   Manages streaming-specific state (`isStreaming`, `streamingContent`).

3.  **State Management Layer (`src/routes/chats/(lib)/ChatState.svelte.ts`)**
    *   **Responsibilities:** Holds the single source of truth for *in-memory* reactive chat state.
    *   Uses `$state` for core data (`chatsMap`, `activeChatId`, `isLoading`, `initializationError`).
    *   Uses `$derived` for computed state (`activeChat`, `chatList`).
    *   Exports reactive state (or simple getters if needed due to export limitations).
    *   Exports internal *mutator* functions (`_setChatsFromDB`, `_addOrUpdateChatInMap`, etc.) to be called *only* by the Service layer after successful persistence/operations.
    *   **Does NOT** interact directly with the Persistence layer or external APIs.

4.  **Persistence Layer (`$lib/services/IDBService.ts`)**
    *   **Responsibilities:** Handles all direct interactions with IndexedDB (using Dexie.js).
    *   Provides async CRUD operations (`getAllChatsDB`, `getChatDB`, `saveChatDB`, `deleteChatDB`, `addMessageToChat`).
    *   Is unaware of Svelte's reactivity or the application's in-memory state.

5.  **External API Layer (`$lib/services/OpenAIService.ts`)**
    *   **Responsibilities:** Encapsulates logic for communicating with the OpenAI API (or other AI services).
    *   Handles request formatting, API key management (via `$env/static/private`), and response parsing.
    *   Called by `ChatActions.svelte.ts`.

## Data Flow Example: Sending a Message

1.  **User:** Types message in `ChatInput.svelte` and clicks Send.
2.  **`ChatInput.svelte`:** Calls `handleSend` prop.
3.  **`ChatWindow.svelte`:** `handleSend` function is triggered.
4.  **`ChatWindow.svelte`:** Calls `sendMessage` from `ChatActions.svelte.ts`.
5.  **`ChatActions.svelte.ts` (`sendMessage`):**
    *   Creates user `Message` object.
    *   Calls `ChatService.addMessage` with user message.
6.  **`ChatService.ts` (`addMessage`):**
    *   Updates chat object immutably.
    *   Calls `idbService.saveChatDB` (or `addMessageToChat`) to persist update.
    *   On success, calls `ChatState._addOrUpdateChatInMap`.
7.  **`ChatState.svelte.ts` (`_addOrUpdateChatInMap`):** Updates the reactive `chatsMap`.
8.  **UI Layer:** Components reading `activeChat` or `chatList` reactively update.
9.  **`ChatActions.svelte.ts` (`sendMessage` cont.):**
    *   Calls `OpenAIService.generateAIResponse`.
    *   Receives AI response (potentially streaming).
    *   Creates AI `Message` object.
    *   Calls `ChatService.addMessage` with AI message.
10. **`ChatService.ts` (`addMessage`):** (Repeats steps 6-8 for AI message).

## Analysis Creation Feature

- Uses a factory function (`createAnalysisWizard` in `AnalysisCreationLogic.svelte.ts`) to manage the multi-step wizard UI state.
- Step components (`ContextStep`, `FrameworkStep`, etc.) render UI based on wizard state.
- `handleSubmit` in the wizard orchestrates chat creation (`ChatService.createNewChat`), adding a welcome message (`ChatService.addMessage`), setting the chat active (`ChatService.selectChat`), and triggering the multi-question analysis (`triggerAutomatedAnalysis` from `AutomatedAnalysis.svelte.ts`).
- `analysisState.ts` manages the loading/error/progress state specifically for the analysis *initiation/submission* process.
- `AutomatedAnalysis.svelte.ts` contains the logic for the multi-question AI interaction, calling `OpenAIService` and persisting results via `ChatService.addMessage`.

## Key Decisions

- **State Management:** Primarily Svelte 5 runes (`$state`, `$derived`) for UI reactivity, centralized in feature-specific state modules (e.g., `ChatState.svelte.ts`). Avoided global stores where possible, leaning on context or service layers for cross-cutting concerns.
- **Persistence:** IndexedDB via Dexie.js, encapsulated in `IDBService.ts`.
- **Orchestration:** Introduced `ChatService.ts` to decouple state management from persistence side effects.
- **External APIs:** Encapsulated in dedicated service modules (`OpenAIService.ts`).
