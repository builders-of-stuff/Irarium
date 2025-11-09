<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '$lib/auth/auth.store.svelte';
  import UserNavbar from '$lib/shared/user-navbar.svelte';
  import { Button } from '$lib/components/ui/button';

  import { irariumsStore } from '$lib/irarium/irariums.store.svelte';
  import { countIdeas } from '$lib/irarium/irarium.tools.svelte';
  import StarryNight from '$lib/components/starry-night.svelte';

  onMount(() => {
    if (authStore.userId) {
      irariumsStore.fetchUserIrariums(authStore.userId);
    }
  });

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
</script>

<div class="relative min-h-screen overflow-hidden bg-black">
  <StarryNight />

  <div class="relative z-10">
    <UserNavbar title="My Collection" />

    <div class="container mx-auto px-4 py-8">
      {#if irariumsStore.isLoading}
        <div class="flex justify-center py-12">
          <div class="animate-pulse text-center">
            <p>Loading your irariums...</p>
          </div>
        </div>
      {:else if irariumsStore.error}
        <div class="bg-destructive/10 text-destructive rounded-lg p-4">
          <p>{irariumsStore.error}</p>
          <Button
            variant="outline"
            class="mt-2"
            onclick={() => irariumsStore.fetchUserIrariums(authStore.userId)}
            >Try Again</Button
          >
        </div>
      {:else if irariumsStore.userIrariums.length === 0}
        <div class="rounded-lg border border-dashed p-8 text-center">
          <h3 class="mb-3 text-xl font-medium">No irariums found</h3>
          <Button href="/create">Create irarium</Button>
        </div>
      {:else}
        <div class="space-y-4">
          {#each irariumsStore.userIrariums as irarium}
            <a
              href={`/${irarium.id}`}
              class="border-muted hover:bg-muted/30 block rounded-lg border p-4 transition-colors"
            >
              <div class="mb-2 line-clamp-3">
                {@html irarium.content || 'No content'}
              </div>
              <div class="text-muted-foreground flex justify-between text-xs">
                <span>{formatDate(irarium.updated)}</span>
                <span>{countIdeas(irarium)} thoughts</span>
              </div>
            </a>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>
