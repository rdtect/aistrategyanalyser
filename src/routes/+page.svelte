<script lang="ts">
	import { appStore } from '$lib/state/appState.svelte.ts';
	import AnalysisModal from '$lib/components/AnalysisModal.svelte';
	import Chat from '$lib/components/chat/Chat.svelte';
	import NewAnalysisModal from '$lib/components/chat/NewAnalysisModal/index.svelte';

	let showNewChatModal = $state(false);

	function openNewChatModal() {
		showNewChatModal = true;
	}

	function handleCloseModal() {
		showNewChatModal = false;
	}
</script>

<!-- Main container with fixed height and auto margins -->
<div class="container mx-auto p-4">
	<Chat {openNewChatModal} />
	
	<NewAnalysisModal 
		open={showNewChatModal} 
		onClose={handleCloseModal}
	/>
</div>