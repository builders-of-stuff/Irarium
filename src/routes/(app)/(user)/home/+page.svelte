<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '$lib/auth/auth.store.svelte';
  import { irariumsStore } from '$lib/irarium/irariums.store.svelte';

  onMount(() => {
    if (authStore.userId) {
      irariumsStore.fetchPublicIrariums();
    }
  });
</script>

<div class="container flex min-h-screen items-start justify-center pt-[10vh]">
  <div class="w-full max-w-md space-y-10">
    <h1 class="text-2xl font-bold">Home</h1>
    <p>Welcome to your home page.</p>
  </div>
</div>
