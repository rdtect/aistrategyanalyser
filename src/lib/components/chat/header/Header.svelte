<script lang="ts">
	import BotIcon from 'lucide-svelte/icons/bot-message-square';
	// import ModelSelector from './ModelSelector.svelte';
	import ConnectionStatus from './ConnectionStatus.svelte';
	import RefreshButton from './RefreshButton.svelte';
</script>

<div class="border-surface-500 flex h-12 items-center justify-between border-b px-3 py-2">
	<div class="flex items-center gap-2 font-semibold text-white">
		<BotIcon class="h-4 w-4" />
		<span class="text-sm">AI Strategy Analysis Chat</span>
	</div>
	<div class="flex items-center justify-evenly gap-1.5">
        <ConnectionStatus />
		<!-- <ModelSelector /> -->
		<RefreshButton />
	</div>
</div>
