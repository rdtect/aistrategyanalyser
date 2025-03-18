// Register service worker for PWA support
export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("SW registered:", registration);

          // Check for updates to the service worker
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  // New service worker is installed but waiting to activate
                  // You can notify the user or trigger immediate activation
                  if (confirm("New version available! Reload to update?")) {
                    // If user accepts, skip waiting and reload
                    newWorker.postMessage({ type: "SKIP_WAITING" });
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error("SW registration failed:", error);
        });

      // Handle controller change (when a new service worker takes over)
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        console.log("New service worker activated");
      });
    });
  }
}
