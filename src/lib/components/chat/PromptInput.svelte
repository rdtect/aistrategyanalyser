<script lang="ts">
	import IconSend from 'lucide-svelte/icons/send-horizontal';
	import MagicWand from 'lucide-svelte/icons/wand';

	// Props using Svelte 5 runes
	let { onMessageSubmit } = $props<{
		onMessageSubmit: (message: string) => void;
	}>();

	// State using Svelte 5 runes
	let currentMessage = $state('');

	function handleSubmit() {
		if (currentMessage.trim()) {
			onMessageSubmit(currentMessage);
			currentMessage = '';
		}
	}

	function onPromptKeydown(event: KeyboardEvent) {
		if (['Enter'].includes(event.code) && !event.shiftKey) {
			event.preventDefault();
			handleSubmit();
		}
	}
</script>

<section class="border-surface-200-800 bg-surface-100-900 sticky bottom-0 border-t-[1px] p-4">
	<div
		class="input-group divide-surface-200-800 rounded-container-token w-full grid-cols-[auto_1fr_auto] divide-x"
	>
		<div class="flex flex-1 gap-1 p-2 py-4">
			<button type="button" class="input-group-cell preset-tonal p-2">+</button>
			<button type="button" class="input-group-cell preset-tonal p-2"><MagicWand /></button>
		</div>
		<textarea
			value={currentMessage}
			oninput={(e) => (currentMessage = e.currentTarget.value)}
			class="border-0 bg-transparent ring-0"
			name="prompt"
			id="prompt"
			placeholder="Write a message..."
			rows="3"
			onkeydown={onPromptKeydown}
		></textarea>
		<button
			type="button"
			class="input-group-cell {currentMessage ? 'preset-filled-primary-500' : 'preset-tonal'} p-2.5"
			onclick={handleSubmit}
		>
			<IconSend />
		</button>
	</div>
</section>
