<script>
	import '../app.css';
	let { children } = $props();
</script>

<div class="grid h-screen grid-rows-[auto_1fr_auto] overflow-hidden">
	<!-- Header -->
	<header class="bg-surface-900/90 sticky top-0 z-10 p-4 backdrop-blur-2xl">
		OGS x aiStrategyBot
	</header>
	<!-- Grid Columns -->
	<div class="grid grid-cols-1 overflow-hidden md:grid-cols-[auto_1fr]">
		<!-- Sidebar -->
		<aside class="bg-surface-900/20 overflow-y-auto p-4">(sidebar)</aside>
		<!-- Main Content -->
		<main class="overflow-y-auto p-4">
			{@render children()}
		</main>
	</div>
	<!-- Footer -->
	<footer class="bg-surface-900/90 z-10 p-4">© 2024 aiStrategyBot</footer>
</div>
