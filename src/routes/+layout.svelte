<script lang="ts">
	import Navigation from './Navigation.svelte';
	import { getContext } from 'svelte';

	import '../app.css';

	// Define the type for our analysis data
	interface AnalysisData {
		title: string;
		description: string;
		features: string[];
		instructions: string[];
		/**
		 * OpenAI connection status information
		 * - connected: Whether the OpenAI API is successfully connected
		 * - error: Optional error message when connection fails
		 */
		openai?: {
			connected: boolean;
			error?: string;
		};
	}

	let { children } = $props();

	// Try to get analysis data from context (will be undefined on routes without it)
	let analysisData: AnalysisData | undefined = $state(undefined);
	$effect(() => {
		try {
			analysisData = getContext<AnalysisData>('analysisData');
			// This effect runs once on component initialization
			// as the context is not expected to change after mount
		} catch (e) {
			// No context available, that's fine
		}
	});
</script>

<div class="grid h-screen grid-rows-[auto_1fr_auto] overflow-hidden">
	<!-- Header -->
	<header
		class="bg-surface-900/90 sticky top-0 z-10 flex items-center justify-between p-4 backdrop-blur-2xl"
	>
		<div class="flex items-center gap-2">
			<span class="text-lg font-bold">aiStrategyBot</span>
			<span class="badge variant-filled-primary">Beta</span>
			{#if analysisData?.openai?.connected}
				<span class="badge variant-filled-success">AI Connected</span>
			{:else if analysisData?.openai?.error}
				<span class="badge variant-filled-error" title={analysisData.openai.error}
					>AI Disconnected</span
				>
			{/if}
		</div>
		<div class="flex items-center gap-4">
			<span class="text-sm opacity-70">{analysisData?.title || 'AI Strategy Analysis'}</span>
		</div>
	</header>
	<!-- Grid Columns - Three column layout on large screens -->
	<div
		class="grid grid-cols-1 overflow-hidden md:grid-cols-[auto_1fr] xl:grid-cols-[auto_1fr_auto]"
	>
		<!-- Navigation Sidebar - Hidden on mobile, visible on md+ -->
		<aside class="bg-surface-900/20 hidden overflow-y-auto md:block">
			<Navigation />
		</aside>
		<!-- Main Content -->
		<main class="m-2 h-full overflow-hidden p-4">
			<!-- Route-specific content -->
			{@render children()}
		</main>
	</div>
	<!-- Footer -->
	<footer class="bg-surface-900/90 z-10 flex items-center justify-between p-4">
		<span>&copy; 2024 aiStrategyBot x rdtect</span>
		<span class="text-sm opacity-70">Powered by AI</span>
	</footer>
</div>
