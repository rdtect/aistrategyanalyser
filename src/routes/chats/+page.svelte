<script>
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  // Redirect to home page on mount
  onMount(() => {
    goto("/");
  });
</script>

<div class="container mx-auto p-4">
  <p>Redirecting...</p>
</div>