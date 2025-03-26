# Core Directory Structure (Zen of Python Aligned)

This directory follows a flattened, simplified structure inspired by the Zen of Python principles:

```
core/
├── api/               # API-related functionality
│   ├── mockService.ts         # Development mocks (separate special cases)
│   ├── responseFormatter.ts   # Unified API responses (one obvious way)
│   └── openaiClient.svelte    # OpenAI integration
├── shared/            # Consolidated utilities (flatter structure)
│   └── index.ts                # Re-exports from services, config, types
├── ui/                # Shared UI components
├── utils/             # Utility functions
│   └── serverUtils.ts          # Server-side utilities (avoid duplication)
└── ...other directories
```

## Zen of Python Principles Applied

### 1. Flat is better than nested
- Created `shared` directory to consolidate related functionality
- Reduced nesting levels for improved navigation

### 2. Simple is better than complex
- Unified API response formatting with `responseFormatter.ts`
- Simplified server-side data loading with shared utilities

### 3. Explicit is better than implicit
- Clear error type definitions
- Explicit API response structure

### 4. There should be one obvious way to do it
- Standardized approach to API responses
- Consistent error handling throughout the application

### 5. Special cases aren't special enough to break the rules
- Moved mock logic to a dedicated service
- Development utilities are consistent with production patterns

### 6. Namespaces are one honking great idea
- Proper use of barrel files for clean exports
- Logical grouping of related functionality

## Usage Guidelines

### API Responses
Use the response formatter utilities for all API endpoints:
```typescript
import { createSuccessResponse, createErrorResponse } from '$lib/core/api';

// Success response
return createSuccessResponse(data);

// Error response
return createErrorResponse('Error message', ErrorType.VALIDATION);
```

### Server Utilities
Use shared server utilities to avoid duplication:
```typescript
import { loadAllChats, loadChatById } from '$lib/core/utils';

// Load all chats
const chats = loadAllChats();

// Load specific chat
const { chats, currentChat } = loadChatById(chatId);
```

### Imports
Prefer importing from barrel files for cleaner imports:
```typescript
// Good
import { ErrorType } from '$lib/core/utils';
import { createErrorResponse } from '$lib/core/api';

// Avoid
import { ErrorType } from '$lib/core/utils/errorHandling';
import { createErrorResponse } from '$lib/core/api/responseFormatter';
```