// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

// Explicitly declare the modules instead of using imports
declare module "virtual:pwa-info" {
  const pwaInfo:
    | {
        webManifest: {
          linkTag: string;
          href: string;
          useCredentials: boolean;
        };
      }
    | undefined;

  export { pwaInfo };
}

declare module "virtual:pwa-assets/head" {
  interface Link {
    rel: string;
    href: string;
    sizes?: string;
    type?: string;
    media?: string;
    [key: string]: any;
  }

  const pwaAssetsHead: {
    themeColor?: {
      content: string;
      media?: string;
    };
    links: Link[];
  };

  export { pwaAssetsHead };
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

  export function register(options?: RegisterSWOptions): () => Promise<void>;
}

declare module "virtual:pwa-register/svelte" {
  import type { Readable } from "svelte/store";

  export interface RegisterSWOptions {
    immediate?: boolean;
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
    onRegistered?: (
      registration: ServiceWorkerRegistration | undefined,
    ) => void;
    onRegisterError?: (error: any) => void;
  }

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: Readable<boolean>;
    offlineReady: Readable<boolean>;
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
  };
}

export {};
