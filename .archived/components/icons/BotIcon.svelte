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
	<path d="M12 8V4H8" />
	<rect width="16" height="12" x="4" y="8" rx="2" />
	<path d="M2 14h2" />
	<path d="M20 14h2" />
	<path d="M15 13v2" />
	<path d="M9 13v2" />
</svg>
