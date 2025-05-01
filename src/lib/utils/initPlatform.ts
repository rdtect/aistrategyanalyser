// Platform initialization logic for SvelteKit root layout
import { browser } from '$app/environment';

export let isOnline = true;

export function initPlatform() {
  if (!browser) return;

  // Service Worker registration
  if ('serviceWorker' in navigator) {
    const isDev = import.meta.env.DEV;
    if (isDev) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        console.log(`Service workers registered: ${registrations.length}`);
      });
    } else {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service worker updated and controlling the page');
      });
      setInterval(() => {
        navigator.serviceWorker.getRegistration().then(registration => {
          if (registration) registration.update();
        });
      }, 60 * 60 * 1000);
    }
  }

  // Online/offline detection
  const updateOnlineStatus = () => {
    isOnline = navigator.onLine;
    if (isOnline) {
      document.documentElement.classList.remove('app-offline');
    } else {
      document.documentElement.classList.add('app-offline');
    }
  };
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();
}
