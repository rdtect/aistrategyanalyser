# AI Strategy Analyzer: Refactoring TODO List

## Current Architecture Assessment

After reviewing your codebase, I can identify these architectural patterns:

### Strengths
- Well-organized folder structure following SvelteKit conventions
- Good separation of services (IDBService, OpenAIService)
- Clean component organization with progressive disclosure
- Early adoption of Svelte 5 runes in some parts

### Areas for Improvement
- Inconsistent state management (mix of singleton classes and component-local state)
- Limited use of new Svelte 5 features (snippets, bindable)
- Service coupling in components (direct OpenAIService usage)
- Mixed component responsibilities (UI + logic)

### Current Architecture Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                   AI Strategy Analyzer                        │
└──────────────────────────────────────────────────────────────┘
               │                       │
               ▼                       ▼
┌─────────────────────────┐   ┌────────────────────────┐
│       Components        │   │        Services        │
├─────────────────────────┤   ├────────────────────────┤
│                         │   │                        │
│ ┌─────────────────────┐ │   │ ┌──────────────────┐   │
│ │   ChatManager       │◄├───┼─┤   IDBService     │   │
│ │ (Singleton Class)   │ │   │ │                  │   │
│ └─────────────────────┘ │   │ └──────────────────┘   │
│          │              │   │                        │
│          ▼              │   │ ┌──────────────────┐   │
│ ┌─────────────────────┐ │   │ │  OpenAIService   │   │
│ │ Analysis Creation   │◄├───┼─┤                  │   │
│ │     Components      │ │   │ └──────────────────┘   │
│ └─────────────────────┘ │   │                        │
│          │              │   └────────────────────────┘
│          ▼              │
│ ┌─────────────────────┐ │
│ │  analysisState.js   │ │
│ │  (Local Runes)      │ │
│ └─────────────────────┘ │
│                         │
└─────────────────────────┘
```

## Phase 1: State Management Restructuring

### 1.1 Create State Directory
- [ ] Create `/src/lib/state/` directory to house all global state
- [ ] Move existing state from components to dedicated state modules

### 1.2 Create Core State Modules
- [x] `chatState.svelte.ts` - Chat data and operations
  ```typescript
  // Key exports
  export const chats = $state<Map<string, Chat>>(new Map());
  export const activeChatId = $state<string | null>(null);
  export const activeChat = $derived(activeChatId ? chats.get(activeChatId) : null);
  
  // Core operations
  export async function createChat(name: string, context = {}): Promise<Chat | null> { /* ... */ }
  export function selectChat(id: string | null): void { /* ... */ }
  export async function addMessage(chatId: string, message: Message): Promise<boolean> { /* ... */ }
  ```

- [ ] `analysisState.svelte.ts` - Analysis workflow state
  ```typescript
  export const isAnalyzing = $state(false);
  export const analysisProgress = $state(0);
  export const analysisStage = $state<string>("idle");
  
  export async function runAnalysis(callback: () => Promise<any>) { /* ... */ }
  export function setAnalysisProgress(progress: number) { /* ... */ }
  ```

- [ ] `eventBus.svelte.ts` - Application-wide event system
  ```typescript
  export const eventRegistry = $state<Record<string, ((data: any) => void)[]>>({});
  
  export function on<T>(eventName: string, handler: (data: T) => void) { /* ... */ }
  export function emit<T>(eventName: string, data: T) { /* ... */ }
  ```

- [ ] `frameworksState.svelte.ts` - Framework definitions and filtering
  ```typescript
  export const frameworkOptions = $state([/* framework options */]);
  
  // Add 4C's framework option
  {
    id: "4cs",
    name: "4C's Analysis",
    description: "Analyze Customers, Company, Competitors, and Context...",
    icon: null,
  }
  ```

### 1.3 Migrate Component Logic to State Modules
- [ ] Move `ChatManager.svelte.ts` logic to `chatState.svelte.ts`
  - Your current `ChatManager` uses a singleton with runes - move this to `chatState.svelte.ts`
  - Preserve the core methods but refactor to export functions directly
  
- [ ] Move analysis creation logic to dedicated state modules
  - Your `AnalysisCreationLogic.svelte.ts` should be split into:
    - `wizardState.svelte.ts` - Wizard state and navigation
    - `frameworksState.svelte.ts` - Framework options and filtering
    
- [ ] Refactor `AutomatedAnalysis.svelte.ts` to use new state modules
  - Currently uses OpenAIService directly - should instead use `openaiState.svelte.ts`
  - Access chat data via chatState rather than ChatManager

## Phase 2: Component Communication Patterns

### 2.1 Implement Snippet-Based Communication
- [ ] Update parent-child component pairs to use snippets for function passing
  ```svelte
  <!-- Parent (Currently AnalysisCreation.svelte) -->
  <FrameworkStep>
    {#snippet actions(onSelect)}
      <button onclick={() => onSelect(frameworkId)}>
        Select Framework
      </button>
    {/snippet}
  </FrameworkStep>
  
  <!-- Child (Currently FrameworkStep.svelte) -->
  <script>
    let { actions } = $props();
    function handleSelect(id) { /* ... */ }
  </script>
  {@render actions(handleSelect)}
  ```

### 2.2 Update Component Bindings
- [ ] Replace old-style bindings with `$bindable` where appropriate
  - Your current approach with `wizard.state.selectedQuestions` binding can be refactored
  - In `QuestionsStep.svelte`, use `$bindable()` for toggle functions

### 2.3 Connect Components to Global State
- [ ] Update components to use state modules directly
  - Instead of passing props through multiple levels, connect to state directly
  - Components like `AnalysisCreation.svelte` should import state from global modules

## Phase 3: 4C's Framework Implementation

### 3.1 Add Framework Option
- [ ] Add 4C's framework to `frameworkOptionsData` in `AnalysisCreationLogic.svelte.ts`
  - Can be added to existing array alongside other frameworks
  - Matches format of existing frameworks (id, name, description, icon)

### 3.2 Add Question Categories
- [ ] Add 4C's questions to `category_question_prompts.json`
  ```json
  "4C's Analysis": [
    {
      "id": "4c_cust_1",
      "question": "What are the customer's primary needs and wants?",
      "method": "12-Box",
      "prompt": {
        "Role Definition": "You are a customer insights analyst...",
        "Task Description": "Analyze the primary needs, wants..."
      }
    },
    // Add more questions for each C: Customer, Company, Competitors, Context
  ]
  ```

### 3.3 Add Framework Filtering Logic
- [ ] Implement question filtering based on selected framework
  - Currently does minimal filtering - update to filter by framework
  - Add category to the existing `categoryIcons` in `QuestionsStep.svelte`

## Phase 4: OpenAI Integration Refinement

### 4.1 Create OpenAI State Module
- [ ] Create `openaiState.svelte.ts` for OpenAI service integration
  - Reuse your existing OpenAIService but wrap with state management
  - Track request state (loading, error) in global state

### 4.2 Refactor Analysis Processing
- [ ] Update `triggerAutomatedAnalysis` to use state modules
  - Currently uses `openAIService` directly - should instead use state module
  - Add proper progress tracking and error handling

## Phase 5: UI Enhancement

### 5.1 Create Notification System
- [ ] Create notification state module
  - Add to track analysis errors and success messages
  - Connect to event bus for app-wide notifications

### 5.2 Add Progress Components
- [ ] Create `AnalysisProgress.svelte` component
  - Shows progress during analysis based on `analysisState`
  - Replace current progress overlay in `AnalysisCreation.svelte`

### 5.3 Improve Navigation Components
- [ ] Create `WizardNavigation.svelte` for consistent wizard navigation
  - Extract navigation from `AnalysisCreation.svelte`
  - Standardize button styles and behavior

## Phase 6: OpenAI Integration

- [ ] Extend `ChatManager.sendMessage` to call `openAIService.generateAIResponse` after persisting user message.
- [ ] Implement streaming with `useStream: true`: create provisional assistant message, update `streamingContent` on each chunk.
- [ ] Persist AI responses via `idbService.addMessageToChat` for atomic updates.
- [ ] Show typing indicator in `ChatWindow` using `chatManager.isStreaming`.
- [ ] Add cancellation support with `AbortController` for in-flight AI requests.
- [ ] Write unit/integration tests mocking `openAIService` and `idbService` to verify full message flow.

---

## OpenAI Streaming Integration Plan

### Goal
Enable real-time AI-powered chat with local-first persistence (Dexie) and OpenAI streaming for assistant responses.

### Steps
1. **User Message Handling**
    - On send, persist user message to Dexie via `idbService.addMessageToChat`.
    - Update `chatsMap` for immediate UI feedback.

2. **Trigger OpenAI Response**
    - Call `openAIService.generateAIResponse` with the full message history (use `useStream: true`).
    - Create a provisional assistant message (role: 'assistant', content: '').
    - Update `isStreaming` and `streamingContent` state for typing indicator.

3. **Streaming & Persistence**
    - As chunks arrive, append to the provisional assistant message.
    - Persist each chunk (or batch) using Dexie for resilience.
    - On stream end, finalize the assistant message and update Dexie/chat state.

4. **Cancellation & Error Handling**
    - Use `AbortController` to allow cancellation of in-flight AI requests.
    - On error, update chat with a system/error message and reset streaming state.

5. **Testing & Documentation**
    - Add unit/integration tests for the new flow (mocking Dexie/OpenAI).
    - Document the streaming pattern, error handling, and UI updates in the memory bank and README.

---

## Phase 6: OpenAI Integration (Checklist)
- [ ] Extend `ChatManager.sendMessage` to call `openAIService.generateAIResponse` after persisting user message.
- [ ] Implement streaming with `useStream: true`: create provisional assistant message, update `streamingContent` on each chunk.
- [ ] Persist AI responses via `idbService.addMessageToChat` for atomic updates.
- [ ] Show typing indicator in `ChatWindow` using `chatManager.isStreaming`.
- [ ] Add cancellation support with `AbortController` for in-flight AI requests.
- [ ] Write unit/integration tests mocking `openAIService` and `idbService` to verify full message flow.

## Refactored Architecture

```
┌───────────────────────────────────────────────────────────────────┐
│                      AI Strategy Analyzer                          │
└───────────────────────────────────────────────────────────────────┘
                 │                         │
                 ▼                         ▼
┌─────────────────────────────┐   ┌────────────────────────┐
│     State (.svelte.ts)      │   │        Services        │
├─────────────────────────────┤   ├────────────────────────┤
│                             │   │                        │
│ ┌─────────────────────────┐ │   │ ┌──────────────────┐   │
│ │   chatState.svelte.ts   │◄├───┼─┤   IDBService     │   │
│ │                         │ │   │ │                  │   │
│ └─────────────────────────┘ │   │ └──────────────────┘   │
│           │                 │   │                        │
│           │                 │   │ ┌──────────────────┐   │
│ ┌─────────────────────────┐ │   │ │  OpenAIService   │◄──┼───┐
│ │ wizardState.svelte.ts   │ │   │ │                  │   │   │
│ │                         │ │   │ └──────────────────┘   │   │
│ └─────────────────────────┘ │   │                        │   │
│           │                 │   └────────────────────────┘   │
│           │                 │                                │
│ ┌─────────────────────────┐ │                                │
│ │ openaiState.svelte.ts   │◄┼────────────────────────────────┘
│ │                         │ │             
│ └─────────────────────────┘ │   ┌────────────────────────┐
│           │                 │   │      Components        │
│           │                 │   ├────────────────────────┤
│ ┌─────────────────────────┐ │   │  ┌────────────────┐    │
│ │ eventBus.svelte.ts      │◄├───┼──┤ Parent Comps   │    │
│ │                         │ │   │  │                │    │
│ └─────────────────────────┘ │   │  └────────────────┘    │
│                             │   │          │             │
└─────────────────────────────┘   │          ▼             │
                                  │  ┌────────────────┐    │
                                  │  │ Child Comps    │    │
                                  │  │ ({@render})    │    │
                                  │  └────────────────┘    │
                                  └────────────────────────┘
```

## Test Plan for Current Components

### ChatManager Tests
```typescript
// Test file: ChatManager.test.ts
import { chatManager } from '../src/routes/chats/(lib)/ChatManager.svelte.ts';
import { idbService } from '../src/lib/services/IDBService';

// Mock IDBService
vi.mock('../src/lib/services/IDBService', () => ({
  idbService: {
    getAllChats: vi.fn().mockResolvedValue([]),
    saveChat: vi.fn().mockResolvedValue('test-id'),
    deleteChat: vi.fn().mockResolvedValue(true)
  }
}));

describe('ChatManager', () => {
  beforeEach(() => {
    // Reset state between tests
    chatManager.chatsMap = new Map();
    chatManager.activeChatId = null;
  });
  
  test('createChat adds a new chat', async () => {
    const chat = await chatManager.createChat('Test Chat');
    expect(chat).not.toBeNull();
    expect(chat?.name).toBe('Test Chat');
    expect(chatManager.chatsMap.size).toBe(1);
    expect(chatManager.activeChatId).toBe(chat?.id);
  });
  
  test('selectChat sets active chat', () => {
    chatManager.chatsMap.set('test-id', { id: 'test-id', name: 'Test', messages: [], createdAt: '', updatedAt: '' });
    chatManager.selectChat('test-id');
    expect(chatManager.activeChatId).toBe('test-id');
  });
});

```

### AnalysisState Tests
```typescript
// Test file: analysisState.test.ts
import { 
  isAnalyzing, 
  analysisProgress, 
  runAnalysis, 
  setAnalysisProgress, 
  resetAnalysisState 
} from '../src/routes/chats/(lib)/components/analysis-creation/analysisState.svelte.ts';

describe('Analysis State', () => {
  beforeEach(() => {
    resetAnalysisState();
  });
  
  test('runAnalysis sets and clears state correctly', async () => {
    const mockCallback = vi.fn().mockResolvedValue({ success: true });
    
    expect(isAnalyzing).toBe(false);
    
    const result = await runAnalysis(mockCallback);
    
    expect(mockCallback).toHaveBeenCalled();
    expect(result).toEqual({ success: true });
    
    // Allow the timeout to complete (isAnalyzing set to false after delay)
    await new Promise(resolve => setTimeout(resolve, 600));
    expect(isAnalyzing).toBe(false);
  });
  
  test('setAnalysisProgress updates progress correctly', () => {
    expect(analysisProgress).toBe(0);
    
    setAnalysisProgress(50);
    expect(analysisProgress).toBe(50);
    
    // Test bounds
    setAnalysisProgress(-10);
    expect(analysisProgress).toBe(0);
    
    setAnalysisProgress(110);
    expect(analysisProgress).toBe(100);
  });
});

```

## Performance Profile

Key bottlenecks in current implementation:

1. **ChatManager initialization** - Loads all chats on startup
   - Consider lazy loading or pagination

2. **Analysis processing** - Processes all questions in parallel
   - Consider batching requests to prevent rate limiting

3. **Component re-rendering** - Some props cascade deeply
   - Use global state to minimize prop drilling
   - Consider memoization for expensive computations

## Code Quality & Best Practices

The current codebase follows several good practices:

- **Services as singletons** - Good approach, maintain this pattern
- **Component structure** - Well-organized, keep current organization
- **TypeScript usage** - Good type definitions, continue using types
- **Error handling** - Generally good, add more precise error types

Areas needing improvement:

- **Component coupling** - Some components tightly bound to services
- **State management** - Inconsistent patterns across the app
- **Testing** - Limited test coverage evident in the codebase
- **Documentation** - Comments are sparse, especially for core logic

## Documentation Updates

- [ ] Update project README with state management patterns
- [ ] Document component communication approaches
- [ ] Add JSDoc comments to key functions and state modules
  ```typescript
  /**
   * Processes an analysis consisting of multiple strategic questions
   * @param callback - Function that performs the analysis work
   * @returns Result object with success status and optional error
   */
  export async function runAnalysis(callback: () => Promise<any>) { /* ... */ }
  ```