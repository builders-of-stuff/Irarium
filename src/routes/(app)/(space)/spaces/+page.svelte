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

<div class="relative min-h-screen overflow-hidden">
  <div class="relative z-10 flex h-screen flex-col">
    <UserNavbar title="Spaces" />

    <div class="flex-1 overflow-auto p-8 pt-32 md:pt-20">
      <div class="container mx-auto max-w-4xl">
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
          <div class="grid gap-4 md:grid-cols-2">
            {#each spaceStore.filteredPublicSpaces as space}
              {@const count = spaceStore.irariumCounts[space.id] || 0}
              <div
                role="button"
                tabindex="0"
                onclick={() => goto(`/spaces/${space.slug}-${space.id}`)}
                onkeydown={(e) =>
                  e.key === 'Enter' && goto(`/spaces/${space.slug}-${space.id}`)}
                class="relative block cursor-pointer rounded-lg border border-muted p-6 transition-colors hover:bg-muted/30"
              >
                {#if space.isShared}
                  <div class="absolute top-4 right-4">
                    <span
                      class="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500"
                      title="Shared Space"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                      Shared
                    </span>
                  </div>
                {/if}

                <h3 class="mb-2 pr-20 text-xl font-semibold">{space.name}</h3>
                <p class="text-sm text-muted-foreground">
                  {space.description || 'No description'}
                </p>
                {#if space.tags}
                  <div class="mt-2 flex flex-wrap gap-1">
                    {#each space.tags.split(',') as tag}
                      <span
                        class="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                      >
                        {tag.trim()}
                      </span>
                    {/each}
                  </div>
                {/if}
                <div class="mt-4 flex flex-col gap-1 text-xs text-muted-foreground">
                  <div class="flex items-center">
                    <span class="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="mr-1"
                        ><path
                          d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                        ></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"
                        ></polyline><line x1="12" y1="22.08" x2="12" y2="12"
                        ></line></svg
                      >
                      {count > 50 ? '50+' : count} irariums
                    </span>
                    <span class="mx-2">•</span>
                    <span class="flex items-center" title="Space Size">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="mr-1"
                        ><path d="M3 21l18 0"></path><path d="M3 10l18 0"></path><path
                          d="M5 6l7 -3l7 3"
                        ></path><path d="M4 10l0 11"></path><path d="M20 10l0 11"
                        ></path><path d="M8 14l0 3"></path><path d="M12 14l0 3"
                        ></path><path d="M16 14l0 3"></path></svg
                      >
                      Size: {space.size || DEFAULT_SPACE_SIZE}
                    </span>
                    {#if space.username}
                      <span class="mx-2">•</span>
                      <a
                        href={`/user/${space.username}`}
                        class="text-foreground hover:underline"
                        onclick={(e) => e.stopPropagation()}
                      >
                        @{space.username}
                      </a>
                    {/if}
                  </div>
                  <div class="flex items-center">
                    <DateDisplay created={space.created} />
                  </div>
                </div>
              </div>
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
</div>
