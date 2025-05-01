/** @type {import('@sveltejs/kit').ServerInit} */
export async function init() {
  // Service worker registration
  if ('serviceWorker' in navigator) {
    const isDev = import.meta.env.DEV;
    if (isDev) {
      navigator.serviceWorker.getRegistrations().then(regs => {
        console.log(`Service workers registered: ${regs.length}`);
      });
    } else {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service worker updated and controlling the page');
      });
      setInterval(() => {
        navigator.serviceWorker.getRegistration().then(reg => reg?.update());
      }, 60 * 60 * 1000);
    }
  }

  // Online/offline detection
  const updateOnlineStatus = () => {
    document.documentElement.classList.toggle('app-offline', !navigator.onLine);
  };
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();
};
