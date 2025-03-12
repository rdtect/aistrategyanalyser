<script lang="ts">
	type SizeOption = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

	let {
		size = 'md' as SizeOption,
		initials = 'U',
		bgColor = '#4f46e5',
		textColor = 'white',
		class: className = ''
	} = $props<{
		size?: SizeOption;
		initials?: string;
		bgColor?: string;
		textColor?: string;
		class?: string;
	}>();

	// Size mapping
	const sizeMap: Record<SizeOption, string> = {
		xs: 'h-6 w-6 text-xs',
		sm: 'h-8 w-8 text-sm',
		md: 'h-10 w-10 text-base',
		lg: 'h-12 w-12 text-lg',
		xl: 'h-16 w-16 text-xl'
	};

	// Get the appropriate size class
	const sizeClass = sizeMap[size];
</script>

<div
	class="{sizeClass} flex items-center justify-center rounded-full {className}"
	style="background-color: {bgColor}; color: {textColor};"
>
	{initials.substring(0, 2).toUpperCase()}
</div>
