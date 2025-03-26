import { supabase } from "$lib/core/utils/db/supabase";
import type { User } from "@supabase/supabase-js";
import { writable } from "svelte/store";

const isBrowser = typeof window !== "undefined";

// Create stores with writable to properly support store operations
export const user = writable<User | null>(null);
export const isLoading = writable(true);

// Initialize the store
export async function initAuth() {
  if (!isBrowser) {
    isLoading.set(false);
    return;
  }

  const { data } = await supabase.auth.getSession();
  user.set(data.session?.user || null);
  isLoading.set(false);

  // Listen for auth changes
  supabase.auth.onAuthStateChange((_, session) => {
    user.set(session?.user || null);
  });
}

export async function signInWithEmail(email: string, password: string) {
  if (!isBrowser) {
    return { error: new Error("Cannot sign in during server-side rendering") };
  }
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error };
}

export async function signUpWithEmail(email: string, password: string) {
  if (!isBrowser) {
    return { error: new Error("Cannot sign up during server-side rendering") };
  }
  const { error } = await supabase.auth.signUp({ email, password });
  return { error };
}

export async function signOut() {
  if (!isBrowser) {
    return { error: new Error("Cannot sign out during server-side rendering") };
  }
  const { error } = await supabase.auth.signOut();
  return { error };
}
