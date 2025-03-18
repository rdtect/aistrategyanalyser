<script lang="ts">
  import { theme, toggleTheme } from '$lib/stores/theme.svelte';
  import { Switch } from '@skeletonlabs/skeleton-svelte';
  import IconMoon from 'lucide-svelte/icons/moon';
  import IconSun from 'lucide-svelte/icons/sun';

</script>



<div class="flex items-center gap-2">
  <IconSun class="h-4 w-4" />
  <Switch
    name="theme-toggle"
    checked={theme() === 'dark'}
    onCheckedChange={toggleTheme}
  />
  <IconMoon class="h-4 w-4" />
</div>


