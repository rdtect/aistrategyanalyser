<script lang="ts">
	import { chatStore } from './Chat.svelte.ts';
	import ChatListIcon from 'lucide-svelte/icons/message-circle-code';
	import type { Chat } from '$lib/data/sampleChats';
</script>

<div class="border-surface-200-800 hidden h-full grid-rows-[auto_1fr_auto] border-r-[1px] lg:grid">
	<!-- Header -->
	<header class="border-surface-200-800 border-b-[1px] p-4">
		<input class="input w-full" type="search" placeholder="Search..." />
	</header>
	
	<!-- List -->
	<div class="flex-1 overflow-y-auto p-4 space-y-4">
		<small class="opacity-50">Previous Analysis</small>
		<div class="flex flex-col space-y-1">
			{#each chatStore.chats as chat}
				<button
					type="button"
					class="card flex w-full items-center space-x-4 p-2 {chat.id === chatStore.currentChatId
						? 'preset-filled-primary-500'
						: 'bg-surface-hover-token'}"
					onclick={() => chatStore.switchChat(chat.id)}
				>
					<div class="flex h-8 w-8 flex-shrink-0 items-center justify-center">
						<ChatListIcon class="h-5 w-5" />
					</div>
					<span class="flex-1 truncate text-start">
						{chat.name}
					</span>
				</button>
			{/each}
		</div>
	</div>
	
	<!-- Footer -->
	<footer class="border-surface-200-800 border-t-[1px] p-4">
		<button
			type="button"
			class="btn btn-sm variant-filled-primary w-full"
			onclick={() => chatStore.createNewChat("New Chat")}
		>
			New Chat
		</button>
	</footer>
</div>