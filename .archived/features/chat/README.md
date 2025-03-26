# Chat Module Architecture

This module implements the chat functionality for the AI Strategy Analyzer application, following clean architecture principles to separate concerns.

## Directory Structure

```
/src/lib/features/chat/
  ├── components/          # UI components
  │   ├── Chat.svelte      # Main chat interface
  │   ├── ChatInput.svelte # Message input component
  │   ├── ChatMessage.svelte # Individual message display
  │   └── ExportButton.svelte # Export functionality
  ├── services/            # Business logic services
  │   └── aiService.ts     # OpenAI API integration
  ├── stores/              # State management
  │   └── chatStore.svelte.ts # Main chat store with runes
  └── types/               # TypeScript type definitions
      └── chat.ts          # Chat and message types
```

## Key Features

- **UUID-based IDs**: All chats and messages use UUIDs for stable identification
- **Message Index**: Messages include an index field for maintaining order
- **OpenAI Integration**: Supports both Responses API and Chat Completions API
- **Fallback Mechanism**: If the Responses API fails, falls back to Chat Completions
- **Persistent Storage**: Chat history is stored in localStorage
- **Offline Support**: Works offline with saved chats
- **Reactive UI**: Built with Svelte 5 runes for fine-grained reactivity

## API Integration

### OpenAI Responses API

The chat system integrates with OpenAI's Responses API (primary) and falls back to Chat Completions API when needed.

Usage example:

```typescript
// Using OpenAI Responses API
const response = await client.responses.create({
  model: "gpt-4o",
  input: userMessage,
  instructions: systemPrompt,
  temperature: 0.7,
  max_tokens: 1500,
});
```

### API Key Setup

To use this module with OpenAI:

1. Create a `.env` file in the project root
2. Add your OpenAI API key: `OPENAI_API_KEY=your-key-here`
3. Make sure Vite is configured to expose the environment variable

## Development

### Required Dependencies

- `openai`: For API integration (`npm install openai`)
- `marked`: For Markdown rendering (`npm install marked`)

### Adding a New Component

1. Create new component in the `components/` directory
2. Use `getChatStore()` to access the chat store
3. Follow existing naming conventions and styling

### Extending AI Capabilities

To add new AI capabilities:

1. Modify `aiService.ts` to include new parameters or API calls
2. Update the chat store to use these new capabilities
3. Extend the UI components to expose these features to users

## Best Practices

- Use the chat store for all state management, avoid local state
- Always handle API errors gracefully with user feedback
- Keep UI components focused on presentation, logic in services
- Maintain TypeScript type safety throughout the codebase
