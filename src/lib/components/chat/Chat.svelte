<script lang="ts">
	import ChatListIcon from 'lucide-svelte/icons/message-circle-code';
	import BotIcon from 'lucide-svelte/icons/bot-message-square';
	import { Avatar } from '@skeletonlabs/skeleton-svelte';
	import { onMount } from 'svelte';
	import { marked } from 'marked';

	import PromptInput from '$lib/components/chat/PromptInput.svelte';
	import { generateAIResponse } from '$lib/services/aiService';

	// Types
	interface Message {
		id: number;
		sender: 'user' | 'ai';
		timestamp: string;
		content: string;
	}

	interface Chat {
		id: number;
		name: string; // Format: Brand,Category,Region
		messages: Message[];
		createdAt: string;
	}

	// Helper function to safely process markdown
	function processMarkdown(content: string): string {
		try {
			return marked.parse(content) as string;
		} catch (error) {
			console.error('Error parsing markdown:', error);
			return content;
		}
	}

	// Sample data
	const initialChats: Chat[] = [
		{
			id: 0,
			name: 'Adidas,Footwear,Global',
			createdAt: 'Yesterday @ 2:00pm',
			messages: [
				{
					id: 0,
					sender: 'ai',
					timestamp: 'Yesterday @ 2:30pm',
					content: '**AI Bot:** Hello! How can I assist you today regarding Adidas,Footwear,Global?'
				},
				{
					id: 1,
					sender: 'user',
					timestamp: 'Yesterday @ 2:45pm',
					content: `I'd like to know about their recent market performance.`
				},
				{
					id: 2,
					sender: 'ai',
					timestamp: 'Yesterday @ 2:50pm',
					content: `**AI Bot:**  Okay, here's a summary of Adidas' recent performance in the global footwear market:\n\n*   **Key Trends:** Increased competition from emerging brands.\n*   **Revenue:**  Moderate growth reported in Q2 2023.\n*   **Challenges:** Supply chain issues.\n\nWhat else would you like to know?`
				},
				{
					id: 3,
					sender: 'user',
					timestamp: 'Yesterday @ 2:52pm',
					content: `Thanks!  What about their innovation strategies?`
				}
			]
		},
		{
			id: 1,
			name: 'Nike,AthleticFootwear,India',
			createdAt: '2 days ago @ 9:00am',
			messages: [
				{
					id: 4,
					sender: 'ai',
					timestamp: '2 days ago @ 10:00am',
					content: `**AI Bot:**  Greetings! I'm ready to delve into the world of Nike, Athletic Footwear, India. How may I help?`
				},
				{
					id: 5,
					sender: 'user',
					timestamp: '2 days ago @ 10:15am',
					content: `What is the market share?`
				}
			]
		},
		{
			id: 2,
			name: 'Puma,Sportswear,USA',
			createdAt: '3 days ago @ 12:00pm',
			messages: [
				{
					id: 6,
					sender: 'ai',
					timestamp: '3 days ago @ 1:00pm',
					content: `**AI Bot:**  Hello! Ready to assist you with Puma, Sportswear, USA related questions`
				},
				{
					id: 7,
					sender: 'user',
					timestamp: '3 days ago @ 1:15pm',
					content: `How is their E-commerce doing?`
				}
			]
		}
	];

	// Pre-process markdown content for consistent rendering
	for (const chat of initialChats) {
		for (const message of chat.messages) {
			message.content = processMarkdown(message.content);
		}
	}

	// Initialize props with Svelte 5 runes
	let { initialChatId = 0 } = $props<{
		initialChatId?: number;
	}>();

	// Component state using $state
	let chats = $state(initialChats);
	let currentChatId = $state(initialChatId);
	let isLoading = $state(false);
	let elemChat: HTMLElement;
	let userName = $state('RD');

	// Derived values using $derived
	const currentChat = $derived(chats.find((chat) => chat.id === currentChatId) || chats[0]);
	const messages = $derived(currentChat?.messages || []);

	// Effect to scroll to bottom when messages change
	$effect(() => {
		if (messages.length > 0 && elemChat) {
			setTimeout(() => scrollChatBottom('auto'), 0);
		}
	});

	function scrollChatBottom(behavior?: 'auto' | 'instant' | 'smooth') {
		if (elemChat) {
			elemChat.scrollTo({ top: elemChat.scrollHeight, behavior: behavior || 'auto' });
		}
	}

	function getCurrentTimestamp(): string {
		return new Date().toLocaleString('en-US', {
			hour: 'numeric',
			minute: 'numeric',
			hour12: true
		});
	}

	function generateMessageId(chat: Chat): number {
		return chat.messages.length > 0 ? Math.max(...chat.messages.map((m) => m.id)) + 1 : 0;
	}

	async function handleMessageSubmit(message: string) {
		if (!currentChat) return;

		// Process markdown for the user message
		const processedContent = processMarkdown(message);

		// Add user message
		const userMessage: Message = {
			id: generateMessageId(currentChat),
			sender: 'user',
			timestamp: getCurrentTimestamp(),
			content: processedContent
		};

		// Update the chat with the new message
		chats = chats.map((chat) =>
			chat.id === currentChatId ? { ...chat, messages: [...chat.messages, userMessage] } : chat
		);

		// Smooth scroll to bottom
		setTimeout(() => scrollChatBottom('smooth'), 0);

		// Set loading state
		isLoading = true;

		try {
			// Wait 1 second
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Generate AI response
			const responseContent = await generateAIResponse(currentChat, message);

			// Process markdown for the AI response
			const processedResponse = processMarkdown(responseContent);

			// Add AI response
			const aiMessage: Message = {
				id: generateMessageId(currentChat),
				sender: 'ai',
				timestamp: getCurrentTimestamp(),
				content: processedResponse
			};

			// Update the chat with the AI response
			chats = chats.map((chat) =>
				chat.id === currentChatId ? { ...chat, messages: [...chat.messages, aiMessage] } : chat
			);

			// Smooth scroll to bottom
			setTimeout(() => scrollChatBottom('smooth'), 0);
		} catch (error) {
			console.error('Error generating AI response:', error);
		} finally {
			isLoading = false;
		}
	}

	// When DOM is mounted, scroll to bottom
	onMount(() => {
		scrollChatBottom('auto');
	});
</script>

<section class="card bg-surface-100-900 rounded-container flex h-full flex-col overflow-hidden">
	<div class="chat grid h-full w-full flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[30%_1fr]">
		<!-- Navigation -->
		<div
			class="border-surface-200-800 hidden grid-rows-[auto_1fr_auto] overflow-hidden border-r-[1px] lg:grid"
		>
			<!-- Header -->
			<header class="border-surface-200-800 border-b-[1px] p-4">
				<input class="input" type="search" placeholder="Search..." />
			</header>
			<!-- List -->
			<div class="space-y-4 overflow-y-auto p-4">
				<small class="opacity-50">Previous Analysis</small>
				<div class="flex flex-col space-y-1">
					{#each chats as chat}
						<button
							type="button"
							class="card flex w-full items-center space-x-4 p-2 {chat.id === currentChatId
								? 'preset-filled-primary-500'
								: 'bg-surface-hover-token'}"
							onclick={() => (currentChatId = chat.id)}
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
			<footer class="border-surface-200-800 border-t-[1px] p-4">(footer)</footer>
		</div>
		<!-- Chat section -->
		<div class="grid h-full grid-rows-[1fr_auto] overflow-hidden">
			<!-- Conversation area -->
			<section bind:this={elemChat} class="space-y-4 overflow-y-auto p-4">
				{#each messages as message}
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
									{@html message.content}
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
									{@html message.content}
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

				{#if isLoading}
					<div class="flex justify-center p-4">
						<div class="flex animate-pulse space-x-4">
							<div class="bg-primary-500 h-3 w-3 rounded-full"></div>
							<div class="bg-primary-500 h-3 w-3 rounded-full"></div>
							<div class="bg-primary-500 h-3 w-3 rounded-full"></div>
						</div>
					</div>
				{/if}
			</section>
			<PromptInput onMessageSubmit={handleMessageSubmit} />
		</div>
	</div>
</section>
