<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData } from "./$types";
  
  let { form } = $props<{ form: ActionData }>();
  
  // Initialize form state with values from server or empty strings
  let name = $state(form?.values?.name ?? "");
  let company = $state(form?.values?.company ?? "");
  let industry = $state(form?.values?.industry ?? "");
  let region = $state(form?.values?.region ?? "");
  
  // Form validation
  $effect(() => {
    if (form?.error) {
      // Update form state with server-returned values if there was an error
      name = form.values?.name ?? name;
      company = form.values?.company ?? company;
      industry = form.values?.industry ?? industry;
      region = form.values?.region ?? region;
    }
  });
  
  // Keyboard handling for accessibility
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      form.requestSubmit();
    }
  }
</script>

<div class="max-w-2xl mx-auto p-4">
  <h1 class="text-2xl font-bold mb-6">Create New Analysis</h1>
  
  <form method="POST" action="?/createChat" use:enhance class="space-y-4">
    {#if form?.error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
        {form.error}
      </div>
    {/if}
    
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700">Analysis Name *</label>
      <input
        type="text"
        id="name"
        name="name"
        value={name}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        required
      />
    </div>
    
    <div>
      <label for="company" class="block text-sm font-medium text-gray-700">Company</label>
      <input
        type="text"
        id="company"
        name="company"
        value={company}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>
    
    <div>
      <label for="industry" class="block text-sm font-medium text-gray-700">Industry</label>
      <input
        type="text"
        id="industry"
        name="industry"
        value={industry}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>
    
    <div>
      <label for="region" class="block text-sm font-medium text-gray-700">Region</label>
      <input
        type="text"
        id="region"
        name="region"
        value={region}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>
    
    <div class="flex justify-between pt-4">
      <a
        href="/"
        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        Cancel
      </a>
      <button
        type="submit"
        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        disabled={!name.trim()}
      >
        Create Analysis
      </button>
    </div>
  </form>
</div> 