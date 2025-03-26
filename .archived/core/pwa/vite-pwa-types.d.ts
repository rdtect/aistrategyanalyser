// Type declarations for virtual PWA modules
declare module "virtual:pwa-info" {
  export interface PwaInfo {
    webManifest: {
      href: string;
      useCredentials: boolean;
      linkTag: string;
    };
    registerSW: {
      shouldRegisterSW: boolean;
      inline: boolean;
      webManifest: {
        href: string;
        useCredentials: boolean;
      };
    };
  }

  export const pwaInfo: PwaInfo | undefined;
}

declare module "virtual:pwa-assets/head" {
  export interface PwaAssetsHead {
    themeColor?: {
      content: string;
    };
    links?: Array<Record<string, string>>;
  }

  export const pwaAssetsHead: PwaAssetsHead;
}

declare module "virtual:pwa-register" {
  export interface RegisterSWOptions {
    immediate?: boolean;
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
    onRegistered?: (
      registration: ServiceWorkerRegistration | undefined,
    ) => void;
    onRegisterError?: (error: any) => void;
  }

  export function registerSW(options?: RegisterSWOptions): {
    needRefresh: [boolean, (v: boolean) => void];
    offlineReady: [boolean, (v: boolean) => void];
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
  };

  export const register: (options?: RegisterSWOptions) => void;
}
