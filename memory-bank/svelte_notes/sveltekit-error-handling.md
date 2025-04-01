# SvelteKit Error Handling Best Practices

## Core SvelteKit Utilities

SvelteKit provides several utilities for handling errors and responses in API routes and server-side operations:

### 1. `error` Function

```typescript
import { error } from "@sveltejs/kit";

// Usage
throw error(status, message);
```

The `error` function creates an HTTP error response with a status code and message. When thrown:

- In a server route (API endpoint), it generates an HTTP response with the specified status code
- In a `load` function, it triggers the nearest error boundary
- Provides type safety and consistency across your application

### 2. `json` Function

```typescript
import { json } from "@sveltejs/kit";

// Usage
return json(data, options);
```

The `json` function creates a JSON response with proper content-type headers:

- `data`: The payload to serialize as JSON
- `options`: Optional configuration including status and headers

## Best Practices

### API Routes

```typescript
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url }) => {
  const id = url.searchParams.get("id");

  // Validate inputs with error function
  if (!id) {
    throw error(400, "Missing required ID parameter");
  }

  try {
    const data = await getDataById(id);

    // Return not found with error function
    if (!data) {
      throw error(404, `Item with ID ${id} not found`);
    }

    // Return successful response with json function
    return json({ success: true, data });
  } catch (err) {
    console.error("Error fetching data:", err);

    // Handle unexpected errors
    throw error(500, "Server error while processing request");
  }
};
```

### Error Handling with withErrorHandling Utility

We've created a `withErrorHandling` utility to standardize error handling across API routes:

```typescript
export const POST: RequestHandler = withErrorHandling(async ({ request }) => {
  // Implementation
  if (!validData) {
    throw error(400, "Invalid data provided");
  }

  return json({ success: true });
});
```

This ensures consistent logging and error format across all API endpoints.

### Error Boundaries

For client-side error handling, create error boundaries at appropriate levels:

```svelte
<!-- src/routes/chats/+error.svelte -->
<script>
  import { page } from '$app/stores';
</script>

<div class="error-container">
  <h1>Error {$page.status}</h1>
  <p>{$page.error?.message || 'An unexpected error occurred'}</p>
  <a href="/chats">Return to chats</a>
</div>
```

## Common Error Patterns

### Input Validation

```typescript
if (!payload.name || typeof payload.name !== "string") {
  throw error(400, "Name is required and must be a string");
}
```

### Resource Not Found

```typescript
const item = await getItem(id);
if (!item) {
  throw error(404, `Item with ID ${id} not found`);
}
```

### Unauthorized Access

```typescript
if (!user || !user.canAccessResource(id)) {
  throw error(403, "You do not have permission to access this resource");
}
```

### Server Errors

```typescript
try {
  // Complex operation
} catch (err) {
  console.error("Operation failed:", err);
  throw error(500, "Server error occurred while processing the request");
}
```

## Advanced Error Handling

### Custom Error Types

```typescript
// src/lib/errors.ts
export class ValidationError extends Error {
  constructor(
    message: string,
    public fields: string[],
  ) {
    super(message);
  }
}

// In API route
if (!isValid) {
  throw error(400, {
    message: "Validation failed",
    fields: ["name", "email"],
  });
}
```

### Error Serialization

The `error` function automatically handles serialization/deserialization of error data between server and client.

## Testing Error Handling

When testing API routes, verify error responses:

```typescript
// Test invalid input
const response = await app.fetch("/api/users", {
  method: "POST",
  body: JSON.stringify({}), // Missing required fields
});

expect(response.status).toBe(400);
const data = await response.json();
expect(data.message).toContain("required");
```
