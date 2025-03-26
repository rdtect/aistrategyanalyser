<script lang="ts">
	import { onMount } from 'svelte';
	import IconSend from 'lucide-svelte/icons/send-horizontal';
	import MagicWand from 'lucide-svelte/icons/wand';
	import { createOpenAIClient } from '$lib/services/openaiClient.svelte';

	// Props
	let { chatId, onMessageSubmit, disabled = false } = $props<{ 
		chatId: string; 
		onMessageSubmit: (message: string) => Promise<void>;
		disabled?: boolean;
	}>();
	
	// State
	let messageText = $state('');
	let isSubmitting = $state(false);
	let isError = $state(false);
	let isLoading = $state(false);
	
	// Initialize OpenAI client
	const openaiClient = createOpenAIClient();
	
	// Reset message input when chat changes
	$effect(() => {
		if (chatId) {
			const savedDraft = localStorage.getItem(`draft-${chatId}`);
			messageText = savedDraft || '';
		}
	});
	
	// Save draft when message changes
	$effect(() => {
		if (messageText && chatId) {
			saveDraft();
		}
	});
	
	// Handle form submission
	async function handleSubmit() {
		if (!messageText.trim() || isSubmitting || disabled) return;
		
		const message = messageText.trim();
		messageText = '';
		isSubmitting = true;
		isError = false;
		
		try {
			// Clear draft
			localStorage.removeItem(`draft-${chatId}`);
			
			// Send message through callback
			await onMessageSubmit(message);
		} catch (error) {
			console.error('Error sending message:', error);
			isError = true;
			// Restore message if error
			messageText = message;
		} finally {
			isSubmitting = false;
		}
	}
	
	// Save draft with debounce
	let saveTimeout: NodeJS.Timeout;
	function saveDraft() {
		clearTimeout(saveTimeout);
		saveTimeout = setTimeout(() => {
			localStorage.setItem(`draft-${chatId}`, messageText);
		}, 500);
	}
</script>

<section class="border-surface-200-800 bg-surface-100-900 sticky bottom-0 border-t-[1px] p-2">
	<div
		class="input-group divide-surface-200-800 rounded-container-token w-full grid grid-cols-[auto_1fr_auto] divide-x"
	>
		<div class="flex gap-1 p-2 py-4">
			<button type="button" class="input-group-cell preset-tonal p-2">+</button>
			<button type="button" class="input-group-cell preset-tonal p-2"><MagicWand /></button>
		</div>
		<form 
			class="w-full h-full"
			onsubmit={(e) => {
				e.preventDefault();
				handleSubmit();
			}}
		>
			<textarea
				class="input resize-none w-full h-full min-h-[24px] max-h-32 {disabled ? 'opacity-70 cursor-not-allowed' : ''}"
				placeholder="Type your message..."
				bind:value={messageText}
				disabled={disabled}
				rows="2"
				onkeydown={(e) => {
					// Submit on Enter without Shift key
					if (e.key === 'Enter' && !e.shiftKey && !disabled) {
						e.preventDefault();
						handleSubmit();
					}
				}}
			></textarea>
		</form>
		<button
			type="button"
			class="input-group-cell preset-tonal-primary flex h-full items-center justify-center p-4 {disabled ? 'opacity-50' : ''}"
			onclick={handleSubmit}
			disabled={isSubmitting || !messageText.trim() || disabled}
		>
			<IconSend />
		</button>
	</div>
</section>