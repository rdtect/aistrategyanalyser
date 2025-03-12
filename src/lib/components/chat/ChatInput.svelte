<script lang="ts">
	import IconSend from 'lucide-svelte/icons/send-horizontal';
	import MagicWand from 'lucide-svelte/icons/wand';

	/** Input value for the message input field */
	let inputValue = $state('');

	/** Function to call when a message is submitted */
	let { onMessageSubmit } = $props<{
		onMessageSubmit: (message: string) => void | Promise<void>;
	}>();

	/**
	 * Handles form submission for sending messages
	 * @param event Optional event object
	 */
	function handleSubmit(event?: Event) {
		if (inputValue.trim()) {
			onMessageSubmit(inputValue);
			inputValue = '';
		}
		event?.preventDefault();
	}

	/**
	 * Handles keydown events for the input field
	 * @param event Keyboard event
	 */
	function handleKeydown(event: KeyboardEvent) {
		// Submit on Enter without Shift key
		if (event.key === 'Enter' && !event.shiftKey) {
			handleSubmit();
			event.preventDefault();
		}
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
		<form onsubmit={handleSubmit} class="w-full h-full">
			<textarea
				class="input resize-none w-full h-full min-h-[24px] max-h-32"
				placeholder="Type your message..."
				bind:value={inputValue}
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