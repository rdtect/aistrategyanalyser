<script lang="ts">
	import { Navigation } from '@skeletonlabs/skeleton-svelte';
	
	// Icons
	import IconMenu from 'lucide-svelte/icons/menu';
	import IconFolder from 'lucide-svelte/icons/folder';
	
	import IconSettings from 'lucide-svelte/icons/settings';
	import IconBarChart from 'lucide-svelte/icons/bar-chart';
	import IconUsers from 'lucide-svelte/icons/users';
	import IconTrendingUp from 'lucide-svelte/icons/trending-up';
	import IconBuilding from 'lucide-svelte/icons/building';

	let isExpansed = $state(false); // Collapsed by default

	function toggleExpanded() {
		isExpansed = !isExpansed;
	}

	// Track the active navigation item
	let activeItem = $state('category-competition');



	// Handle coming soon notification
	function handleComingSoon(id: string) {
		alert('This feature is coming soon!');
	}
</script>

<!-- Custom wrapper with text-left class to ensure left alignment -->
<div class="h-full w-full text-left">
	<!-- Component -->
	<Navigation.Rail expanded={isExpansed}>
		{#snippet header()}
			<Navigation.Tile labelExpanded="Menu" onclick={toggleExpanded} title="Toggle Menu Width"
				><IconMenu /></Navigation.Tile
			>
		{/snippet}
		{#snippet tiles()}
			<!-- Disabled items use href="#" and custom onclick handler -->
			<div class="w-full opacity-50">
				<Navigation.Tile
					labelExpanded="4C's Analysis"
					href="#"
					onclick={() => handleComingSoon('4cs')}
					title="Coming soon"
				>
					<IconFolder />
				</Navigation.Tile>
			</div>

			<div class="w-full opacity-50">
				<Navigation.Tile
					labelExpanded="Company Analysis"
					href="#"
					onclick={() => handleComingSoon('company')}
					title="Coming soon"
				>
					<IconBuilding />
				</Navigation.Tile>
			</div>

			<!-- Active item -->
			<Navigation.Tile
				labelExpanded="Category and Competition Analysis"
				href="#"
				onclick={() => {activeItem = 'category-competition'}}
				selected={activeItem === 'category-competition'}
				title="Category and Competition Analysis"
			>
				<IconBarChart />
			</Navigation.Tile>

			<div class="w-full opacity-50">
				<Navigation.Tile
					labelExpanded="Culture and Trends Analysis"
					href="#"
					onclick={() => handleComingSoon('culture-trends')}
					title="Coming soon"
				>
					<IconTrendingUp />
				</Navigation.Tile>
			</div>

			<div class="w-full opacity-50">
				<Navigation.Tile
					labelExpanded="Consumer Analysis"
					href="#"
					onclick={() => handleComingSoon('consumer')}
					title="Coming soon"
				>
					<IconUsers />
				</Navigation.Tile>
			</div>
		{/snippet}
		{#snippet footer()}
			<div class="w-full opacity-50">
				<Navigation.Tile
					labelExpanded="Settings"
					href="#"
					onclick={() => handleComingSoon('settings')}
					title="Coming soon"
				>
					<IconSettings />
				</Navigation.Tile>
			</div>
		{/snippet}
	</Navigation.Rail>
	<!-- Content -->
	<!-- <div class="flex items-center justify-center">
    <p class="opacity-20">(Content)</p>
  </div> -->
</div>

<style>
	/* Custom styles for left alignment */
	:global(.nav-rail-tile) {
		justify-content: flex-start !important;
	}
</style>
