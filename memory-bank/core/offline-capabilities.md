# Offline Capabilities

## Overview

The application provides robust offline functionality, allowing users to continue working even when internet connectivity is lost. This document outlines the implementation details of these capabilities.

## Service Worker Implementation

The application uses service workers to:
- Cache static assets
- Intercept network requests
- Provide offline fallbacks

### Registration

The service worker is registered in the main application entry point:

```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(registration => {
      console.log('Service worker registered:', registration);
    })
    .catch(error => {
      console.error('Service worker registration failed:', error);
    });
}
```

### Caching Strategy

The application uses a combination of caching strategies:
- **Cache First**: For static assets (CSS, JS, images)
- **Network First**: For API requests with fallback to cached responses
- **Stale While Revalidate**: For semi-dynamic content

## Offline UI

### Offline Indicator

The application includes a visual indicator when offline:
- Status bar at the top of the application
- Visual cues in the UI (grayed out elements, disabled buttons)
- Toast notifications for connectivity changes

### Offline Page

A dedicated offline.html page is served when the user attempts to access a page that isn't cached:
- Simple, lightweight design
- Clear messaging about offline status
- Links to cached pages that are available offline

## Data Persistence

### IndexedDB Storage

All user data is stored in IndexedDB, allowing for:
- Complete access to historical chats while offline
- Creation of new chats while offline
- Editing existing content while offline

### Synchronization

When connectivity is restored:
1. Pending changes are synchronized with the server
2. Conflicts are resolved using a last-write-wins strategy
3. Users are notified of successful synchronization

## Network Detection

The application monitors network status using:

```javascript
window.addEventListener('online', handleOnline);
window.addEventListener('offline', handleOffline);
```

Additionally, periodic checks are performed to verify actual connectivity beyond the browser's online/offline events.

## Graceful Degradation

Features that require online connectivity (like new AI responses) gracefully degrade when offline:
- Clear messaging about limited functionality
- UI elements are disabled rather than removed
- Helpful suggestions for offline workflows

## Testing Offline Mode

The application includes tools for testing offline functionality:
- Network condition simulation in developer tools
- Automated tests for offline scenarios
- Manual testing checklist for offline features