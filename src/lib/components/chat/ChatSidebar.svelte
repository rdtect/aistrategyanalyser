<script lang="ts">
	import { Plus, Trash2 } from 'lucide-svelte';
	import { chatStore } from './Chat.svelte.ts';

	export let openNewChatModal = () => {};
</script>

<div class="flex h-full flex-col">
	<!-- New Chat Button -->
	<div class="p-1.5">
		<button 
			class="btn variant-filled-primary w-full text-sm"
			onclick={openNewChatModal}
		>
			<Plus class="h-3.5 w-3.5" />
			<span>New Analysis</span>
		</button>
	</div>

	<!-- Chat List with proper scrolling -->
	<div class="flex-1 overflow-y-auto p-1.5 space-y-1.5">
		{#each chatStore.chats as chat}
			<div class="flex items-center gap-2">
				<button 
					class="flex-1 text-left p-2 rounded-lg transition-colors duration-200 text-sm
						   {chat.id === chatStore.currentChatId ? 'bg-primary-500' : 'hover:bg-surface-700'}"
					onclick={() => chatStore.switchChat(chat.id)}
				>
					<div class="font-medium text-sm">{chat.name}</div>
					<div class="text-xs opacity-70">
						{new Date(chat.createdAt).toLocaleDateString()}
					</div>
				</button>
				<button 
					class="btn-icon btn-icon-sm variant-soft-error"
					onclick={() => chatStore.deleteChat(chat.id)}
					aria-label="Delete chat"
				>
					<Trash2 class="h-4 w-4" />
				</button>
			</div>
		{/each}
	</div>
</div>
