<script lang="ts">
	import { chats, chatActions } from '$lib/stores/chatStore';
	import IconSend from 'lucide-svelte/icons/send-horizontal';
	import MagicWand from 'lucide-svelte/icons/wand';
	import { debounce } from '$lib/utils/debounce';

	// Props using runes - add optional onMessageSubmit callback
	let { chatId, onMessageSubmit } = $props<{ 
		chatId: string; 
		onMessageSubmit?: (message: string) => Promise<void> 
	}>();
	
	// State using runes
	let messageText = $state('');
	let isSubmitting = $state(false);
	let isError = $state(false);
	let aiMessageId = $state<string | null>(null);
	
	// Current chat derived from chatId
	const chat = $derived(() => {
		const allChats = $chats;
		return allChats.find(c => c.id === chatId);
	});
	
	// Reset message input when chat changes
	$effect(() => {
		if (chatId) messageText = '';
	});
	
	// Handle form submission
	async function handleSubmit(event?: Event) {
		if (event) event.preventDefault();
		if (!messageText.trim() || isSubmitting) return;
		
		const message = messageText.trim();
		messageText = '';
		isSubmitting = true;
		isError = false;
		
		try {
			// If callback is provided, use it (compatibility with existing code)
			if (onMessageSubmit) {
				await onMessageSubmit(message);
				isSubmitting = false;
				return;
			}
			
			// Otherwise use direct store interaction
			// Create user message object
			const userMessage = {
				id: crypto.randomUUID(),
				content: message,
				sender: 'user' as const,
				timestamp: new Date(),
				status: 'sent' as const
			};
			
			// Add user message to store
			chatActions.addMessage(chatId, userMessage);
			
			// Create AI message placeholder with ID
			aiMessageId = crypto.randomUUID();
			
			try {
				chatActions.addMessage(chatId, {
					id: aiMessageId,
					content: '',
					sender: 'ai' as const,
					timestamp: new Date(),
					status: 'streaming' as const
				});
				
				// Use streaming endpoint
				const response = await fetch('/api/ai/stream', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						message,
						context: chat,
						model: "gpt-4o"
					})
				});
				
				if (!response.ok) {
					throw new Error(`API error: ${response.status}`);
				}
				
				// Process the streaming response
				const reader = response.body?.getReader();
				if (!reader) throw new Error('Response body is not readable');
				
				const decoder = new TextDecoder();
				let fullContent = '';
				let sources = [];
				
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;
					
					// Decode the chunk
					const chunkText = decoder.decode(value, { stream: true });
					fullContent += chunkText;
					
					// Extract sources if present in the chunk
					if (chunkText.includes('**Source:**')) {
						try {
							const sourceMatch = chunkText.match(/\*\*Source:\*\* (\{.*?\})/);
							if (sourceMatch && sourceMatch[1]) {
								const sourceData = JSON.parse(sourceMatch[1]);
								if (sourceData.tool_call) {
									sources.push(sourceData);
								}
							}
						} catch (e) {
							console.error('Error parsing source:', e);
						}
						
						// Remove source information from displayed content
						fullContent = fullContent.replace(/\n\n\*\*Source:\*\* \{.*?\}\n\n/g, '');
					}
					
					// Update the message with the partial content
					if (aiMessageId) {
						chatActions.updateMessage(chatId, aiMessageId, {
							content: fullContent,
							status: 'streaming' as const,
							sources
						});
					}
				}
				
				// Update the message status to completed
				if (aiMessageId) {
					chatActions.updateMessage(chatId, aiMessageId, {
						content: fullContent,
						status: 'completed' as const,
						sources
					});
				}
				
			} catch (error) {
				console.error('Error:', error);
				isError = true;
				// Update message status if we have an ID
				if (aiMessageId) {
					chatActions.updateMessageStatus(chatId, aiMessageId, 'error');
				}
			}
		} finally {
			isSubmitting = false;
		}
	}
	
	// Keyboard handling
	function handleKeydown(event: KeyboardEvent) {
		// Submit on Enter without Shift key
		if (event.key === 'Enter' && !event.shiftKey) {
			handleSubmit();
			event.preventDefault();
		}
	}
	
	// Save drafts with debounce
	const saveDraft = debounce((text: string, id: string) => {
		localStorage.setItem(`draft-${id}`, text);
	}, 500);
	
	$effect(() => {
		if (messageText && chatId) {
			saveDraft(messageText, chatId);
		}
	});
	
	// Load draft when chat changes
	$effect(() => {
		if (chatId) {
			const savedDraft = localStorage.getItem(`draft-${chatId}`);
			if (savedDraft) messageText = savedDraft;
		}
	});
</script>

<section class="border-surface-200-800 bg-surface-100-900 sticky bottom-0 border-t-[1px] p-2">
	<div
		class="input-group divide-surface-200-800 rounded-container-token w-full grid grid-cols-[auto_1fr_auto] divide-x"
	>
		<div class="flex gap-1 p-2 py-4">
			<button type="button" class="input-group-cell preset-tonal p-2">+</button>
			<button type="button" class="input-group-cell preset-tonal p-2"><MagicWand /></button>
		</div>
		<form onsubmit={handleSubmit} class="w-full h-full">
			<textarea
				class="input resize-none w-full h-full min-h-[24px] max-h-32"
				placeholder="Type your message..."
				bind:value={messageText}
				onkeydown={handleKeydown}
				rows="2"
			></textarea>
		</form>
		<button
			type="button"
			class="input-group-cell preset-tonal-primary flex h-full items-center justify-center p-4"
			onclick={handleSubmit}
		>
			<IconSend />
		</button>
	</div>
</section>