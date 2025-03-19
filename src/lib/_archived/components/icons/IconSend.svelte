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
	<path d="m5 12 14-7-7 14v-7H5z" />
</svg>
