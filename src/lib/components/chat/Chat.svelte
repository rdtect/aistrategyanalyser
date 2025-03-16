<script lang="ts">
	// Imports
	import { AI_MODELS, type AIModel } from '$lib/config/aiModels';
	import BotIcon from 'lucide-svelte/icons/bot-message-square';
	import RefreshCw from 'lucide-svelte/icons/refresh-cw';
	import { Avatar } from '@skeletonlabs/skeleton-svelte';
	import ArrowDown from 'lucide-svelte/icons/arrow-down';
	import { marked } from 'marked';
	import { fade, fly, scale } from 'svelte/transition';
	import { backOut } from 'svelte/easing';

	// Component imports
	import ChatInput from './ChatInput.svelte';
	import ChatSidebar from './ChatSidebar.svelte';
	import ModelSelector from './header/ModelSelector.svelte';
	import ConnectionStatus from './header/ConnectionStatus.svelte';
	import RefreshButton from './header/RefreshButton.svelte';
	import Header from './header/Header.svelte';

	// Import the chat store
	import { chatStore } from './Chat.svelte.ts';
	import type { Message } from '$lib/data/sampleChats';

	// Constants
	const userName = 'RD';

	// Type-safe model entries
	const modelEntries: [string, { name: string }][] = Object.entries(AI_MODELS);

	// DOM references and state
	let elemChat: HTMLElement;
	let showScrollButton = $state(false);

	// Lifecycle hooks and effects
	$effect(() => {
		if (chatStore.messages.length > 0 && elemChat) {
			scrollChatBottom();
		}
	});

	// Utility functions
	function scrollChatBottom(behavior: ScrollBehavior = 'auto') {
		if (elemChat) {
			elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
		}
	}

	function handleScroll() {
		const isScrolledUp = elemChat.scrollHeight - elemChat.scrollTop > elemChat.clientHeight + 200;
		showScrollButton = isScrolledUp;
	}

	// Event handlers
	async function handleMessageSubmit(message: string) {
		await chatStore.handleMessageSubmit(message);
		setTimeout(() => scrollChatBottom('smooth'), 100);
	}

	let {openNewChatModal} = $props();
</script>

<!-- #snippets section for reusable UI elements -->
{#snippet userMessage(message: Message, index: number)}
	<div class="flex w-full flex-row-reverse gap-2 py-2" in:fly={{ y: 20, duration: 300, delay: index * 100 }}>
		<Avatar name={userName} />
		<div class="card bg-surface-700/100 w-3/4 rounded-3xl rounded-tr-none p-4">
			<header class="mb-1 flex justify-between">
				<p class="font-bold text-white">Rick</p>
				<small class="text-white opacity-70">
					{message.timestamp}
				</small>
			</header>
			<div class="prose prose-sm prose-invert max-w-none text-white">
				{@html marked(message.content)}
			</div>
		</div>
	</div>
{/snippet}

{#snippet botMessage(message: Message, index: number)}
	<div
		class="flex w-full gap-2 py-2"
		in:fly={{ y: 20, duration: 300, delay: index * 100 }}
	>
		<Avatar name="AI">
			<div class="flex bg-primary-500 h-full w-full items-center justify-center rounded-full">
				<BotIcon class="h-6 w-6" />
			</div>
		</Avatar>
		<div class="card bg-surface-800/50 w-3/4 shadow-xl shadow-blue-500/5 rounded-3xl rounded-tl-none p-4">
			<header class="mb-1 flex justify-between">
				<p class="font-bold text-white">AI Assistant</p>
				<small class="text-white opacity-70">
					{message.timestamp}
				</small>
			</header>
			<div class="prose prose-sm prose-invert max-w-none text-white p-4">
				{@html marked(message.content)}
			</div>
		</div>
	</div>
{/snippet}

{#snippet loadingIndicator()}
	<div class="flex w-full flex-row-reverse gap-2 py-2" in:fade={{ duration: 200 }}>
		<Avatar name="AI">
			<div class="flex h-full w-full items-center justify-center rounded-full">
				<BotIcon class="h-6 w-6" />
			</div>
		</Avatar>
		<div class="card bg-primary-800/50 w-1/3 rounded-tr-none p-4">
			<div class="flex space-x-2">
				<div class="bg-primary-300 h-3 w-3 animate-pulse rounded-full"></div>
				<div
					class="bg-primary-300 h-3 w-3 animate-pulse rounded-full"
					style="animation-delay: 0.2s"
				></div>
				<div
					class="bg-primary-300 h-3 w-3 animate-pulse rounded-full"
					style="animation-delay: 0.4s"
				></div>
			</div>
		</div>
	</div>
{/snippet}

{#snippet scrollButton()}
	<button
		class="bg-primary-500 absolute bottom-20 z-10 mx-auto rounded-full p-2 text-white shadow-lg"
		onclick={() => scrollChatBottom('smooth')}
		aria-label="Scroll to bottom"
	>
		<ArrowDown />
		
	</button>
{/snippet}

<div
	class="border-surface-500 bg-surface-900 flex h-[calc(100vh-13rem)] flex-col rounded-2xl border"
>
	<!-- Header bar with info and status -->
	<Header />

	<!-- Main container with sidebar and chat area -->
	<div class="flex flex-1 overflow-hidden">
		<!-- Sidebar (hidden on mobile) -->
		<div class="border-surface-500 hidden border-r md:block w-80">
			<ChatSidebar {openNewChatModal} />
		</div>

		<!-- Chat area -->
		<div class="relative flex h-full flex-1 flex-col">
			<!-- Messages container with scroll handler -->
			<div
				bind:this={elemChat}
				class="flex-1 space-y-4 overflow-y-auto p-4"
				onscroll={handleScroll}
			>
				{#each chatStore.messages as message, index}
					{#if message.sender === 'user'}
						{@render userMessage(message, index)}
					{:else}
						{@render botMessage(message, index)}
					{/if}
				{/each}

				<!-- Loading indicator -->
				{#if chatStore.isLoading}
					{@render loadingIndicator()}
				{/if}

				<!-- Scroll to bottom button -->
				{#if showScrollButton}
					{@render scrollButton()}
				{/if}
			</div>

			<!-- Input area - fixed at bottom -->
			<div class="border-surface-500 border-t p-2" in:fade={{ duration: 300 }}>
				<ChatInput onMessageSubmit={handleMessageSubmit} />
			</div>
		</div>
	</div>
</div>