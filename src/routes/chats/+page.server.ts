import { chatActions } from '$lib/stores/chatStore';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  createChat: async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get('name')?.toString() || 'New Strategy Analysis';
    const company = formData.get('company')?.toString();
    const industry = formData.get('industry')?.toString();
    const region = formData.get('region')?.toString();
    
    if (!name) {
      return fail(400, { error: 'Chat name is required' });
    }
    
    try {
      const chatId = await chatActions.createChat(name, {
        company,
        industry,
        region
      });
      
      throw redirect(303, `/chats/${chatId}`);
    } catch (error) {
      console.error('Failed to create chat:', error);
      return fail(500, { error: 'Failed to create chat' });
    }
  }
}; 