// src/routes/+page.server.ts
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export function load() {
    // Immediately redirect users from the root URL to the main chat interface
    console.log("Redirecting from / to /chats");
    redirect(307, '/chats'); 
}
