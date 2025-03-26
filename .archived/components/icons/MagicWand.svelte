<script lang="ts">
	let {
		size = 24,
		strokeWidth = 2,
		class: className = ''
	} = $props<{
		size?: number;
		strokeWidth?: number;
		class?: string;
	}>();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width={strokeWidth}
	stroke-linecap="round"
	stroke-linejoin="round"
	class={className}
>
	<path d="m15 4-8 8" />
	<path d="m9 4 1 1" />
	<path d="m4 9 1 1" />
	<path d="m14 20 6-6" />
	<path d="m19 12 1-1" />
	<path d="m12 19 1 1" />
</svg>
