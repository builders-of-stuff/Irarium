<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '$lib/auth/auth.store.svelte';
  import UserNavbar from '$lib/shared/user-navbar.svelte';
  import { Button } from '$lib/components/ui/button';

  import { irariumsStore } from '$lib/irarium/irariums.store.svelte';
  import { countIdeas } from '$lib/irarium/irarium.tools.svelte';

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

<UserNavbar title="My Collection" />

<div class="container mx-auto px-4 py-8">
  {#if irariumsStore.isLoading}
    <div class="flex justify-center py-12">
      <div class="animate-pulse text-center">
        <p>Loading your irariums...</p>
      </div>
    </div>
  {:else if irariumsStore.error}
    <div class="rounded-lg bg-destructive/10 p-4 text-destructive">
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
          class="block rounded-lg border border-muted p-4 transition-colors hover:bg-muted/30"
        >
          <div class="mb-2 line-clamp-3">
            {@html irarium.content || 'No content'}
          </div>
          <div class="flex justify-between text-xs text-muted-foreground">
            <span>{formatDate(irarium.updated)}</span>
            <span>{countIdeas(irarium)} ideas</span>
          </div>
        </a>
      {/each}
    </div>
  {/if}
</div>
