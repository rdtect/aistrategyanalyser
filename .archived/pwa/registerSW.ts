// DEPRECATED: This file is no longer used as the service worker registration
// has been moved directly to +layout.svelte for better type safety and to reduce
// duplicate code. This file is kept for reference only and can be removed.

import { registerSW } from "virtual:pwa-register";

export function setupServiceWorker() {
  const { updateServiceWorker } = registerSW({
    onNeedRefresh() {
      // Show refresh notification to the user
      const shouldUpdate = confirm("New content available. Reload?");
      if (shouldUpdate) {
        updateServiceWorker(true);
      }
    },
    onOfflineReady() {
      // Show offline ready notification
      console.log("App ready to work offline");
    },
  });

  return { updateServiceWorker };
}
