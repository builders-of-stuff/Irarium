<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { pb } from '$lib/db/client';
  import { COLLECTION, type Space } from '$lib/shared/shared.type';
  import { DEFAULT_SPACE_SIZE } from '$lib/shared/space.constants';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import UserNavbar from '$lib/shared/user-navbar.svelte';
  import { authStore } from '$lib/auth/auth.store.svelte';
  import { goto } from '$app/navigation';

  import { spaceStore } from '$lib/space/space.store.svelte';
  import DateDisplay from '$lib/components/shared/date-display.svelte';
  import SpaceCard from '$lib/components/shared/space-card.svelte';

  onMount(async () => {
    spaceStore.fetchPublicSpaces();
  });

  $effect(() => {
    if (authStore.userId) {
      untrack(() => {
        spaceStore.fetchUserSpaces(authStore.userId);
      });
    }
  });
</script>

<div class="relative min-h-screen">
  <div class="relative z-10">
    <UserNavbar title="Spaces" />

    <div class="container mx-auto max-w-4xl px-8 py-8">
      <div class="mb-6 flex gap-2">
        <Input
          type="text"
          placeholder="Search spaces by title, description, or tags..."
          bind:value={spaceStore.searchQuery}
          class="flex-1 sm:max-w-md"
        />
        <select
          bind:value={spaceStore.sortBy}
          class="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-xs ring-offset-background transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30"
        >
          <option value="most-irariums">Most Irariums</option>
          <option value="fewest-irariums">Fewest Irariums</option>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {#if spaceStore.isLoading}
        <div class="flex justify-center py-12">
          <div class="animate-pulse text-center">
            <p>Loading spaces...</p>
          </div>
        </div>
      {:else if spaceStore.error}
        <div class="rounded-lg bg-destructive/10 p-4 text-destructive">
          <p>{spaceStore.error}</p>
        </div>
      {:else if spaceStore.filteredPublicSpaces.length === 0}
        <div class="rounded-lg border border-dashed p-8 text-center">
          <h3 class="mb-3 text-xl font-medium">
            {spaceStore.publicSpaces.length === 0
              ? 'No spaces found'
              : 'No matching spaces'}
          </h3>
          <p class="text-muted-foreground">
            {spaceStore.publicSpaces.length === 0
              ? 'There are no spaces available yet.'
              : 'Try adjusting your search query.'}
          </p>
        </div>
      {:else}
        <div class="space-y-4">
          {#each spaceStore.filteredPublicSpaces as space}
            {@const count = spaceStore.irariumCounts[space.id] || 0}
            <SpaceCard {space} irariumCount={count} />
          {/each}
        </div>

        {#if spaceStore.hasMorePublicSpaces && spaceStore.filteredPublicSpaces.length > 0}
          <div class="mt-8 flex justify-center">
            <Button
              variant="outline"
              disabled={spaceStore.isLoadingMore}
              onclick={() => spaceStore.loadMorePublicSpaces()}
            >
              {spaceStore.isLoadingMore ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        {/if}
      {/if}
    </div>
  </div>
</div>
