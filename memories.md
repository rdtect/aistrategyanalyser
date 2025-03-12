# AI Strategy Analyzer - System Context & Memory

## Project Overview
- SvelteKit application for AI-powered analysis of brand strategies
- Uses Svelte 5 runes ($state, $derived) for state management
- Built with Tailwind CSS and Skeleton UI components

## Chat System Architecture

### ChatManager Class
- Singleton pattern implementation (`chatManager`)
- Manages all chat-related state and operations
- Located in: `src/lib/components/chat/Chat.svelte.ts`

### State Management
- `chats`: Array of Chat objects ($state)
- `currentChatId`: Active chat ID ($state)
- `isLoading`: Loading state indicator ($state)
- `currentChat`: Derived state for active chat
- `messages`: Derived state for current chat messages

### Core Operations
1. Message Handling
   - Processes both user and AI messages
   - Supports markdown formatting
   - Maintains message status ('sending', 'sent')
   - Generates unique message IDs

2. Chat Management
   - Create new chats
   - Delete existing chats
   - Switch between chats
   - Preserve chat history

### Data Types
```typescript
interface Message {
    id: number;
    sender: 'user' | 'ai';
    content: string;
    timestamp: string;
    status: string;
}

interface Chat {
    id: number;
    name: string;
    messages: Message[];
    createdAt: string;
}
```

## UI Layout Implementation

### Chat Component Structure
- `Chat.svelte`: Main container with message display
- `ChatInput.svelte`: Text input for sending messages
- `ChatSidebar.svelte`: Sidebar with chat history
- `Chat.svelte.ts`: Business logic and state management

### Layout Optimizations
1. **Isolated Scrolling**
   - Only the message section is scrollable
   - Chat input and header remain fixed
   - Implemented using `overflow-y-auto` on message container only
   - Parent containers use `overflow-hidden` to prevent double scrolling

2. **Responsive Design**
   - Sidebar collapses on mobile screens
   - Uses Tailwind's responsive grid: `grid-cols-1 lg:grid-cols-[30%_1fr]`
   - Full height layout with proper constraints

3. **Markdown Rendering**
   - Uses the `marked` library for parsing markdown
   - Content is rendered as HTML with `{@html marked(message.content)}`
   - Custom styling for markdown elements in chat bubbles

4. **Auto-scrolling**
   - Messages automatically scroll to bottom on new content
   - Uses `$effect` hook for reactive scrolling
   - Implements smooth scrolling on new messages

### CSS Implementation Details
- Fixed height containers with `h-full` and `max-h-[calc(100vh-2rem)]`
- Flex layout for vertical sections: `flex flex-col`
- Grid layout for horizontal sections: `grid grid-cols-1 lg:grid-cols-[30%_1fr]`
- Proper overflow handling: `overflow-y-auto` for scrollable sections, `overflow-hidden` for containers

## Integration Points
- AI Service: `$lib/services/aiService`
- Sample Data: `$lib/data/sampleChats`
- Markdown Processing: Uses `marked` library

## Future Considerations
- Message persistence
- Chat export functionality
- User authentication
- Real-time collaboration features