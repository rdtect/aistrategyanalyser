<script lang="ts">
  import { isDark, toggleTheme } from '$lib/stores/theme.svelte';
  import { Switch } from '@skeletonlabs/skeleton-svelte';
  import IconMoon from 'lucide-svelte/icons/moon';
  import IconSun from 'lucide-svelte/icons/sun';

  // Convert derived value to primitive boolean for Switch component
  $effect(() => {
    const isChecked = isDark;
    return isChecked;
  });
</script>

<div class="flex items-center gap-2">
  <IconSun class="h-4 w-4" />
  <Switch
    name="theme-toggle"
    checked={$isDark}
    onCheckedChange={() => toggleTheme()}
  />
  <IconMoon class="h-4 w-4" />
</div>


