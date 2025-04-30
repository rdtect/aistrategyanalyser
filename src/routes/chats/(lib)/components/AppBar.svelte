<script lang="ts">
  import { AppBar } from "@skeletonlabs/skeleton-svelte";
  import { goto } from "$app/navigation";
  import ArrowLeft from "@lucide/svelte/icons/arrow-left";
  import Paperclip from "@lucide/svelte/icons/paperclip";
  import Sun from "@lucide/svelte/icons/sun";
  import Moon from "@lucide/svelte/icons/moon";
  import Download from "@lucide/svelte/icons/download";
  import CircleUser from "@lucide/svelte/icons/circle-user";
  import { browser } from "$app/environment";

  // Props
  let { title = "AI Strategy Analysis" } = $props<{
    title?: string | (() => string);
  }>();

  // Handle derived title if it's a function
  const displayTitle = $derived(typeof title === "function" ? title() : title);

  // Dark mode state
  let isDark = $state(false);

  // Initialize dark mode from localStorage or system preference
  $effect(() => {
    if (browser) {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      const savedTheme = localStorage.getItem("theme");

      isDark = savedTheme === "dark" || (savedTheme === null && prefersDark);
    }
  });

  // Toggle theme
  function toggleTheme() {
    isDark = !isDark;

    if (browser) {
      if (isDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  }

  // Navigation functions
  function goBack() {
    window.history.back();
  }

  function goHome() {
    goto("/");
  }

  function goToExport() {
    const pathParts = window.location.pathname.split("/");
    if (pathParts.length >= 3 && pathParts[1] === "chats") {
      const chatId = pathParts[2];
      goto(`/chats/${chatId}/export`);
    }
  }

  function showAttachments() {
    // This would open an attachment panel or dialog
    alert("Attachments feature coming soon!");
  }

  function openSettings() {
    goto("/settings");
  }
</script>

<!--
  Fix for Skeleton AppBar: Only use known props and children, not 'actions' prop.
  Use snippets for custom actions and lead, and ensure the AppBar is rendered as a wrapper only.
-->
<AppBar>
  <div class="flex w-full items-center justify-between px-4 py-2">
    <div class="flex items-center gap-2">
      <button onclick={goBack} aria-label="Go back">
        <ArrowLeft size={22} />
      </button>
      <span class="font-semibold text-lg">{displayTitle}</span>
    </div>
    <div class="flex items-center gap-2">
      <button onclick={showAttachments} aria-label="Attachments">
        <Paperclip size={20} />
      </button>
      <button onclick={goToExport} aria-label="Export chat">
        <Download size={20} />
      </button>
      <button onclick={toggleTheme} aria-label="Toggle dark mode">
        {#if isDark}
          <Sun size={20} />
        {:else}
          <Moon size={20} />
        {/if}
      </button>
      <button onclick={openSettings} aria-label="Open settings">
        <CircleUser size={22} />
      </button>
    </div>
  </div>
</AppBar>
