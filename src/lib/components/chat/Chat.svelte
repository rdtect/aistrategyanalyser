<script lang="ts">
	import ChatListIcon from 'lucide-svelte/icons/message-circle-code';
	import BotIcon from 'lucide-svelte/icons/bot-message-square';
	import { Avatar } from '@skeletonlabs/skeleton-svelte';
	import ChatInput from './ChatInput.svelte';
	import ChatSidebar from './ChatSidebar.svelte';
	import { chatManager, messages, isLoading } from './Chat.svelte.ts';
	import type { Message } from '$lib/data/sampleChats';
	import { marked } from 'marked';
	import { onMount } from 'svelte';

	const userName = 'RD';
	let elemChat: HTMLElement;
	
	// Use $effect for scrolling
	$effect(() => {
		if ($messages.length > 0 && elemChat) {
			scrollChatBottom();
		}
	});

	onMount(() => {
		if (elemChat) {
			scrollChatBottom();
		}
	});

	function scrollChatBottom(behavior: ScrollBehavior = 'auto') {
		if (elemChat) {
			elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
		}
	}

	// Handle message submission
	async function handleMessageSubmit(message: string) {
		await chatManager.handleMessageSubmit(message);
		// Scroll to bottom after message is submitted
		setTimeout(() => scrollChatBottom('smooth'), 100);
	}
</script>

<section class="card bg-surface-100-900 rounded-container flex h-full max-h-[calc(100vh-2rem)] flex-col">
	<div class="chat grid h-full w-full grid-cols-1 lg:grid-cols-[30%_1fr]">
		<ChatSidebar />
		<div class="flex h-full flex-col">
			<section 
				bind:this={elemChat} 
				class="flex-1 overflow-y-auto p-4 space-y-4"
				style="max-height: calc(100vh - 12rem); min-height: 200px;"
			>
				{#each $messages as message}
					{#if message.sender === 'user'}
						<div class="grid grid-cols-[auto_1fr] gap-2 py-2">
							<Avatar name={userName} size="size-12">
								<svg viewBox="0 0 100 100">
									<text
										x="50%"
										y="52%"
										dominant-baseline="middle"
										text-anchor="middle"
										font-size="40"
										fill="white">RD</text
									>
								</svg>
							</Avatar>
							<div class="card preset-tonal space-y-2 rounded-tl-none p-4">
								<header class="flex items-center justify-between">
									<p class="font-bold text-white">Rick</p>
									<small class="text-white opacity-70">
										{message.timestamp}
									</small>
								</header>
								<div
									class="prose prose-sm prose-headings:text-white prose-p:text-white prose-strong:text-white prose-a:text-blue-300 max-w-none text-white"
								>
									{@html marked(message.content)}
								</div>
							</div>
						</div>
					{:else}
						<div class="grid grid-cols-[1fr_auto] gap-2">
							<div class="card preset-tonal-primary space-y-2 rounded-tr-none p-4">
								<header class="flex items-center justify-between">
									<p class="font-bold text-white">AI Assistant</p>
									<small class="text-white opacity-70">
										{message.timestamp}
									</small>
								</header>
								<div
									class="prose prose-sm prose-headings:text-white prose-p:text-white prose-strong:text-white prose-a:text-blue-300 prose-li:text-white max-w-none text-white"
								>
									{@html marked(message.content)}
								</div>
							</div>
							<Avatar name="AI" size="size-12">
								<div class="flex h-full w-full items-center justify-center">
									<BotIcon class="h-6 w-6" />
								</div>
							</Avatar>
						</div>
					{/if}
				{/each}

				{#if $isLoading}
					<div class="flex justify-center p-4">
						<div class="flex animate-pulse space-x-4">
							<div class="bg-primary-500 h-3 w-3 rounded-full"></div>
							<div class="bg-primary-500 h-3 w-3 rounded-full"></div>
							<div class="bg-primary-500 h-3 w-3 rounded-full"></div>
						</div>
					</div>
				{/if}
			</section>
			<ChatInput onMessageSubmit={handleMessageSubmit} />
		</div>
	</div>
</section>