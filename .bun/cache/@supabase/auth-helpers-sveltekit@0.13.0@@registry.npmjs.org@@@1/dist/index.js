// src/supabaseLoadClient.ts
import {
  createSupabaseClient,
  isBrowser as isBrowser2
} from "@supabase/auth-helpers-shared";

// src/loadStorageAdapter.ts
import {
  BrowserCookieAuthStorageAdapter,
  isBrowser
} from "@supabase/auth-helpers-shared";
var SvelteKitLoadAuthStorageAdapter = class extends BrowserCookieAuthStorageAdapter {
  constructor(serverSession = null, cookieOptions) {
    super(cookieOptions);
    this.serverSession = serverSession;
  }
  getItem(key) {
    if (!isBrowser()) {
      return JSON.stringify(this.serverSession);
    }
    return super.getItem(key);
  }
};

// src/supabaseLoadClient.ts
var cachedBrowserClient;
function createSupabaseLoadClient({
  supabaseUrl,
  supabaseKey,
  event,
  serverSession,
  options,
  cookieOptions
}) {
  var _a;
  const browser = isBrowser2();
  if (browser && cachedBrowserClient) {
    return cachedBrowserClient;
  }
  const client = createSupabaseClient(supabaseUrl, supabaseKey, {
    ...options,
    global: {
      fetch: event.fetch,
      ...options == null ? void 0 : options.global,
      headers: {
        ...(_a = options == null ? void 0 : options.global) == null ? void 0 : _a.headers,
        "X-Client-Info": `${"@supabase/auth-helpers-sveltekit"}@${"0.13.0"}`
      }
    },
    auth: {
      storage: new SvelteKitLoadAuthStorageAdapter(serverSession, cookieOptions)
    }
  });
  if (browser) {
    cachedBrowserClient = client;
  }
  return client;
}

// src/supabaseServerClient.ts
import {
  createSupabaseClient as createSupabaseClient2
} from "@supabase/auth-helpers-shared";

// src/serverStorageAdapter.ts
import { CookieAuthStorageAdapter } from "@supabase/auth-helpers-shared";
var SvelteKitServerAuthStorageAdapter = class extends CookieAuthStorageAdapter {
  constructor(event, cookieOptions, expiryMargin = 60) {
    super(cookieOptions);
    this.event = event;
    this.expiryMargin = expiryMargin;
    this.isServer = true;
    this.isInitialDelete = true;
    this.currentSession = null;
  }
  getCookie(name) {
    return this.event.cookies.get(name);
  }
  setCookie(name, value) {
    this.event.cookies.set(name, value, {
      httpOnly: false,
      path: "/",
      ...this.cookieOptions
    });
  }
  deleteCookie(name) {
    this.event.cookies.delete(name, {
      httpOnly: false,
      path: "/",
      ...this.cookieOptions
    });
  }
  async getItem(key) {
    const sessionStr = await super.getItem(key);
    if (!sessionStr) {
      this.currentSession = null;
      return null;
    }
    const session = JSON.parse(sessionStr);
    this.currentSession = session;
    if (session == null ? void 0 : session.expires_at) {
      session.expires_at -= this.expiryMargin;
    }
    return JSON.stringify(session);
  }
  removeItem(key) {
    var _a;
    if (this.isInitialDelete && ((_a = this.currentSession) == null ? void 0 : _a.expires_at)) {
      const now = Math.round(Date.now() / 1e3);
      if (this.currentSession.expires_at < now + 10) {
        this.isInitialDelete = false;
        return;
      }
    }
    super.removeItem(key);
  }
};

// src/supabaseServerClient.ts
function createSupabaseServerClient({
  supabaseUrl,
  supabaseKey,
  event,
  options,
  cookieOptions,
  expiryMargin
}) {
  var _a;
  const client = createSupabaseClient2(supabaseUrl, supabaseKey, {
    ...options,
    global: {
      ...options == null ? void 0 : options.global,
      headers: {
        ...(_a = options == null ? void 0 : options.global) == null ? void 0 : _a.headers,
        "X-Client-Info": `${"@supabase/auth-helpers-sveltekit"}@${"0.13.0"}`
      }
    },
    auth: {
      storage: new SvelteKitServerAuthStorageAdapter(event, cookieOptions, expiryMargin)
    }
  });
  return client;
}
export {
  createSupabaseLoadClient,
  createSupabaseServerClient
};
//# sourceMappingURL=index.js.map