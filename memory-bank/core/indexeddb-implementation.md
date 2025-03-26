# IndexedDB Implementation

## Overview

The application uses IndexedDB for client-side data persistence, allowing for offline functionality and improved performance. This document outlines the implementation details.

## Service Implementation

The IndexedDB service is implemented in `src/lib/services/idb.svelte` using the `idb` library for simplified access.

## Database Structure

### Object Stores

- **chats**: Stores chat sessions
  - Key: UUID
  - Value: Chat object with metadata and messages
- **settings**: Stores user preferences
  - Key: Setting name
  - Value: Setting value

## Data Models

```typescript
interface Chat {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}
```

## CRUD Operations

### Create

```typescript
async function createChat(chat: Chat) {
  const db = await openDB();
  await db.add('chats', chat);
  return chat;
}
```

### Read

```typescript
async function getChat(id: string) {
  const db = await openDB();
  return db.get('chats', id);
}

async function getAllChats() {
  const db = await openDB();
  return db.getAll('chats');
}
```

### Update

```typescript
async function updateChat(chat: Chat) {
  const db = await openDB();
  await db.put('chats', chat);
  return chat;
}
```

### Delete

```typescript
async function deleteChat(id: string) {
  const db = await openDB();
  await db.delete('chats', id);
}
```

## Integration with Svelte 5

The IndexedDB service is integrated with Svelte 5 runes for reactive state management:

```typescript
// In a component or store
import { getChat, updateChat } from '$lib/services/idb';

let currentChat = $state(null);

async function loadChat(id) {
  currentChat = await getChat(id);
}

$effect(() => {
  if (currentChat) {
    updateChat(currentChat);
  }
});
```

## Offline Synchronization

When the application is offline:
1. Changes are stored in IndexedDB
2. A queue of pending operations is maintained
3. When online connectivity is restored, pending operations are processed

## Error Handling

The service includes comprehensive error handling:
- Database connection errors
- Transaction failures
- Data validation errors

Each error is logged and appropriate user feedback is provided.