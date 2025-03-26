/**
 * Compatibility layer for old API
 * Forwards requests to the versioned API endpoint
 * @deprecated Use /api/v1/chats/[id] instead
 */

import { IDBService } from "$lib/services/idb.svelte";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { validateUuidParam } from "$lib/utils";
import { chatStore } from "../../../chats/(components)/ChatStore.svelte";

// Module-level cache for server-side chat access
const serverChatCache = new Map();

// Forward all requests to the versioned endpoint
export const GET: RequestHandler = async ({ request, fetch, params }) => {
  console.warn(
    "Deprecated API endpoint /api/chats/[id] used. Please migrate to /api/v1/chats/[id]",
  );

  return fetch(`/api/v1/chats/${params.id}`, {
    method: "GET",
    headers: request.headers,
  });
};

export const PUT: RequestHandler = async ({ request, fetch, params }) => {
  console.warn(
    "Deprecated API endpoint /api/chats/[id] used. Please migrate to /api/v1/chats/[id]",
  );

  return fetch(`/api/v1/chats/${params.id}`, {
    method: "PUT",
    headers: request.headers,
    body: request.body,
  });
};

export const DELETE: RequestHandler = async ({ request, fetch, params }) => {
  console.warn(
    "Deprecated API endpoint /api/chats/[id] used. Please migrate to /api/v1/chats/[id]",
  );

  return fetch(`/api/v1/chats/${params.id}`, {
    method: "DELETE",
    headers: request.headers,
  });
};
