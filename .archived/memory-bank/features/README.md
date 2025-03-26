# Memory Bank Feature

The Memory Bank is a system for storing, organizing, and retrieving important information and insights from chat conversations and other sources. It uses Svelte 5 runes for state management and provides a seamless way to capture and reuse knowledge.

## Key Components

### Stores

- **MemoryStore**: Central store for managing memory items using Svelte 5 runes
  - Handles CRUD operations for memories
  - Provides filtering and sorting capabilities
  - Maintains statistics about stored memories

### Services

- **MemoryStorageManager**: Handles persistence of memories in IndexedDB
  - Provides methods for saving, retrieving, and deleting memories
  - Implements indexing for efficient querying
  - Handles data sanitization and validation

- **MemoryExtractionService**: Extracts potential memories from various sources
  - Analyzes chat conversations to identify insights
  - Categorizes content based on patterns
  - Extracts relevant tags automatically

### Components

- **MemoryBank**: Main component for displaying and managing memories
  - Shows a filterable list of all memories
  - Provides statistics and filtering options
  - Allows creating, editing, and deleting memories

- **MemoryDetail**: Component for viewing and editing a single memory
  - Shows detailed information about a memory
  - Provides editing capabilities
  - Displays metadata and related information

- **MemoryExtractor**: Component for extracting memories from chats
  - Can be integrated into the chat interface
  - Provides options for automatic or manual extraction
  - Shows extraction status and results

## Data Types

The memory bank uses the following key data types:

- **MemoryItem**: Represents a single memory entry
  - Contains content, category, source, and tags
  - Includes metadata about origin and relevance
  - Tracks creation and update timestamps

- **MemoryCategory**: Classification of memory type
  - fact, insight, question, action, reference, custom

- **MemorySource**: Where the memory originated from
  - chat, user, document, web, system

## Usage

### Extracting Memories from Chat

```svelte
<script>
  import { MemoryExtractor } from '$lib/features/memory-bank';
  import type { Chat } from '$lib/types/chat';
  
  let chat: Chat;
</script>

<MemoryExtractor 
  {chat} 
  onComplete={(memoryIds) => {
    console.log(`Extracted ${memoryIds.length} memories`);
  }}
/>
```

### Displaying the Memory Bank

```svelte
<script>
  import { MemoryBank } from '$lib/features/memory-bank';
</script>

<MemoryBank />
```

### Viewing a Specific Memory

```svelte
<script>
  import { MemoryDetail } from '$lib/features/memory-bank';
  
  let memoryId = 'some-memory-id';
</script>

<MemoryDetail {memoryId} />
```

### Using the Memory Store Directly

```typescript
import { memoryStore } from '$lib/features/memory-bank';

// Create a new memory
const memoryId = await memoryStore.createMemory(
  'Important insight about market trends',
  'insight',
  'user',
  ['market', 'trends']
);

// Update a memory
await memoryStore.updateMemory(memoryId, {
  content: 'Updated content',
  tags: ['market', 'trends', 'updated']
});

// Delete a memory
await memoryStore.deleteMemory(memoryId);

// Filter memories
memoryStore.updateFilter({
  searchTerm: 'market',
  categories: ['insight', 'fact'],
  sortBy: 'updatedAt',
  sortDirection: 'desc'
});

// Access filtered memories
const filteredMemories = memoryStore.filteredMemories;
```

## Integration with Chat

The Memory Bank feature integrates with the chat interface to allow extracting insights from conversations. The `MemoryExtractor` component can be added to the chat interface to provide this functionality.

## Future Enhancements

- **AI-powered extraction**: Improve memory extraction using AI models
- **Semantic search**: Add vector-based search for more relevant results
- **Memory suggestions**: Suggest relevant memories during chat conversations
- **Collaborative memories**: Share and collaborate on memories with team members