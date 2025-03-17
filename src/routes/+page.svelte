<script lang="ts">
	import Chat from '$lib/components/chat/Chat.svelte';
	import { sampleChats } from '$lib/data/sampleChats';

	// Convert sampleChats to a Promise to match the component's expectations
	// const chats = Promise.resolve(sampleChats);
</script>

{#await sampleChats}
	Loading....
{:then sampleChats} 
<div class="container mx-auto p-4">
	<Chat chats={sampleChats} />
</div>	
{/await}
