# Chat Component Documentation

## Component Overview

### Core Components
- `Chat.svelte`: Main chat interface component
- `ChatInput.svelte`: Message input component with submit handling
- `ChatSidebar.svelte`: Chat history and navigation sidebar
- `Chat.svelte.ts`: State management and business logic

## Component Architecture

### Chat.svelte
Main container component that orchestrates the chat interface.

#### Key Features
- Responsive layout with collapsible sidebar
- Auto-scrolling message container
- Markdown rendering support
- Loading state indicators
- Message grouping by sender type

```typescript
// Key Props and Events
interface ChatProps {
    onMessageSubmit: (message: string) => Promise<void>;
}

// State Management
let elemChat: HTMLElement;  // Scroll container reference
```

### ChatInput.svelte
Handles message input and submission.

#### Key Features
- Multi-line input support
- Enter to submit (Shift+Enter for new line)
- Input validation
- Loading state handling

```typescript
// Props and Events
interface ChatInputProps {
    onMessageSubmit: (message: string) => void | Promise<void>;
}
```

### ChatSidebar.svelte
Manages chat history and navigation.

#### Key Features
- Chat list with active state
- Search functionality
- Responsive design (collapsible)

### Chat.svelte.ts
Core state management and business logic.

```typescript
interface ChatStore {
    messages: Message[];
    isLoading: boolean;
    currentChatId: number;
    handleMessageSubmit: (message: string) => Promise<void>;
    switchChat: (chatId: number) => void;
}
```

## Styling Guidelines

### Layout Classes
```css
/* Main container */
.chat-container {
    @apply card h-full overflow-hidden rounded-container bg-surface-100-900;
}

/* Message bubbles */
.chat-bubble-user {
    @apply rounded-tl-none card space-y-2 p-4 preset-tonal;
}

.chat-bubble-ai {
    @apply rounded-tr-none card space-y-2 p-4 preset-tonal-primary;
}
```

### Component Structure
```
<chat-container>
    ├── sidebar
    │   ├── header
    │   ├── chat-list
    │   └── footer
    └── main-chat
        ├── message-container
        │   ├── user-messages
        │   └── ai-messages
        └── input-container
```

## Usage Example

```svelte
<script>
    import { Chat } from '$lib/components/chat';
</script>

<div class="container mx-auto h-[90vh] my-auto p-4">
    <div class="card p-4 h-full">
        <Chat />
    </div>
</div>
```

## State Management

### Store Structure
```typescript
interface ChatState {
    messages: Message[];
    currentChatId: number;
    isLoading: boolean;
}

interface Message {
    id: number;
    sender: 'user' | 'ai';
    content: string;
    timestamp: string;
}
```

### Data Flow
1. User input captured in ChatInput
2. Message submitted to Chat component
3. State updated in Chat.svelte.ts
4. UI updates reactively through store subscriptions

## Accessibility Features
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader friendly message structure
- Focus management for chat interactions

## Performance Considerations
- Virtualized scrolling for large message lists
- Debounced scroll handlers
- Optimized markdown rendering
- Efficient state updates

## Future Improvements
- Message persistence
- Real-time updates
- User authentication integration
- Enhanced markdown support
- File attachment handling