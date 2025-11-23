<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { authStore } from '$lib/auth/auth.store.svelte';
  import UserNavbar from '$lib/shared/user-navbar.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';

  import { irariumsStore } from '$lib/irarium/irariums.store.svelte';
  import { countThoughts } from '$lib/irarium/irarium.tools.svelte';

  import * as Tabs from '$lib/components/ui/tabs';
  import { spaceStore } from '$lib/space/space.store.svelte';
  import CreateSpaceDialog from '$lib/components/space/create-space-dialog.svelte';
  import { MapPin } from '@lucide/svelte';
  import DateDisplay from '$lib/components/shared/date-display.svelte';

  let isCreateSpaceOpen = $state(false);
  let activeTab = $state('irariums');

  // Filter states
  let searchQuery = $state('');
  let visibilityFilter = $state<'all' | 'public' | 'private'>('all');

  $effect(() => {
    if (authStore.userId) {
      untrack(() => {
        // Only fetch if not already loaded or if forced
        (async () => {
          if (!irariumsStore.hasFetchedUserIrariums) {
            await irariumsStore.fetchUserIrariums(authStore.userId);
          }
          spaceStore.fetchUserSpaces(authStore.userId);
        })();
      });
    }
  });

  // Filtered irariums based on search and visibility
  let filteredIrariums = $derived.by(() => {
    let items = irariumsStore.userIrariums;

    // Apply visibility filter
    if (visibilityFilter === 'public') {
      items = items.filter((i) => i.isPublic);
    } else if (visibilityFilter === 'private') {
      items = items.filter((i) => !i.isPublic);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter((i) => {
        const content = i.content?.toLowerCase() || '';
        return content.includes(query);
      });
    }

    return items;
  });

  // Filtered spaces based on search and visibility
  let filteredSpaces = $derived.by(() => {
    let items = spaceStore.userSpaces;

    // Apply visibility filter
    if (visibilityFilter === 'public') {
      items = items.filter((s) => s.isPublic);
    } else if (visibilityFilter === 'private') {
      items = items.filter((s) => !s.isPublic);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter((s) => {
        const name = s.name?.toLowerCase() || '';
        const description = s.description?.toLowerCase() || '';
        return name.includes(query) || description.includes(query);
      });
    }

    return items;
  });

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
</script>

{#snippet actions()}
  {#if activeTab === 'irariums'}
    <Button href="/create">Create Irarium</Button>
  {:else if activeTab === 'spaces'}
    {#if spaceStore.userSpaces.length < (authStore.userSettings?.spaceLimit || 1) || authStore.userSettings?.isFullyUpgraded}
      <Button onclick={() => (isCreateSpaceOpen = true)}>Create Space</Button>
    {/if}
  {/if}
{/snippet}

<div class="relative min-h-screen overflow-hidden">
  <div class="relative z-10">
    <UserNavbar title="My Collections" {actions} />

    <div class="container mx-auto max-w-6xl px-4 py-8 pt-32 md:pt-20">
      <Tabs.Root bind:value={activeTab} class="w-full">
        <div
          class="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <Tabs.List class="w-fit">
            <Tabs.Trigger value="irariums">Irariums</Tabs.Trigger>
            <Tabs.Trigger value="spaces">Spaces</Tabs.Trigger>
          </Tabs.List>

          <div class="flex flex-1 gap-2 sm:max-w-md">
            <Input
              type="text"
              placeholder={activeTab === 'irariums'
                ? 'Search irariums...'
                : 'Search spaces...'}
              bind:value={searchQuery}
              class="flex-1"
            />
            <select
              bind:value={visibilityFilter}
              class="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-xs ring-offset-background transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30"
            >
              <option value="all">All</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>

        <Tabs.Content value="irariums">
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
          {:else if filteredIrariums.length === 0}
            <div class="rounded-lg border border-dashed p-8 text-center">
              <h3 class="mb-3 text-xl font-medium">
                {irariumsStore.userIrariums.length === 0
                  ? 'No irariums found'
                  : 'No matching irariums'}
              </h3>
              {#if irariumsStore.userIrariums.length === 0}
                <Button href="/create">Create irarium</Button>
              {:else}
                <p class="text-sm text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              {/if}
            </div>
          {:else}
            <div class="mt-4 space-y-4">
              {#each filteredIrariums as irarium}
                <a
                  href={`/${irarium.id}`}
                  class="block rounded-lg border border-muted p-4 transition-colors hover:bg-muted/30"
                >
                  {#if irarium.title && irarium.title !== irarium.id}
                    <h3 class="mb-2 line-clamp-3 font-semibold">{irarium.title}</h3>
                  {:else}
                    <div class="mb-2 line-clamp-3">
                      {@html irarium.content || 'No content'}
                    </div>
                  {/if}
                  <div class="flex justify-between text-xs text-muted-foreground">
                    <div class="flex items-center gap-2">
                      {#if irarium.space}
                        <button
                          type="button"
                          class="mr-1 flex items-center gap-1 hover:text-foreground hover:underline"
                          onclick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.location.href = `/spaces/${irarium.space?.slug}-${irarium.spaceId}`;
                          }}
                        >
                          <MapPin size={12} />
                          {irarium.space.name}
                        </button>
                      {/if}
                      <DateDisplay
                        created={irarium.created}
                        updated={irarium.updated}
                      />
                    </div>
                    <div class="flex items-center gap-2">
                      {#if irarium.isPublic}
                        <span
                          class="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] text-green-500"
                          >Public</span
                        >
                      {:else}
                        <span
                          class="rounded-full bg-yellow-500/10 px-2 py-0.5 text-[10px] text-yellow-500"
                          >Private</span
                        >
                      {/if}
                      <span>{countThoughts(irarium)} thoughts</span>
                    </div>
                  </div>
                </a>
              {/each}
            </div>
          {/if}
        </Tabs.Content>

        <Tabs.Content value="spaces">
          <div class="mt-4">
            {#if spaceStore.isLoading}
              <div class="flex justify-center py-12">
                <div class="animate-pulse text-center">
                  <p>Loading your spaces...</p>
                </div>
              </div>
            {:else if spaceStore.error}
              <div class="rounded-lg bg-destructive/10 p-4 text-destructive">
                <p>{spaceStore.error}</p>
                <Button
                  variant="outline"
                  class="mt-2"
                  onclick={() => spaceStore.fetchUserSpaces(authStore.userId)}
                  >Try Again</Button
                >
              </div>
            {:else if filteredSpaces.length === 0}
              <div class="rounded-lg border border-dashed p-8 text-center">
                <h3 class="mb-3 text-xl font-medium">
                  {spaceStore.userSpaces.length === 0
                    ? 'No spaces found'
                    : 'No matching spaces'}
                </h3>
                {#if spaceStore.userSpaces.length === 0}
                  <p class="mb-4 text-muted-foreground">
                    You haven't created any spaces yet.
                  </p>
                  <Button onclick={() => (isCreateSpaceOpen = true)}
                    >Create Space</Button
                  >
                {:else}
                  <p class="text-sm text-muted-foreground">
                    Try adjusting your search or filters
                  </p>
                {/if}
              </div>
            {:else}
              <div class="grid gap-4 md:grid-cols-2">
                {#each filteredSpaces as space}
                  <a
                    href={`/spaces/${space.slug}-${space.id}`}
                    class="block rounded-lg border border-muted p-6 transition-colors hover:bg-muted/30"
                  >
                    <div class="mb-2 flex items-center justify-between">
                      <h3 class="text-xl font-semibold">{space.name}</h3>
                      {#if space.isPublic}
                        <span
                          class="rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-500"
                          >Public</span
                        >
                      {:else}
                        <span
                          class="rounded-full bg-yellow-500/10 px-2 py-1 text-xs text-yellow-500"
                          >Private</span
                        >
                      {/if}
                    </div>
                    <p class="text-sm text-muted-foreground">
                      {space.description || 'No description'}
                    </p>
                    <div class="mt-4 flex items-center text-xs text-muted-foreground">
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
                        {spaceStore.irariumCounts[space.id] || 0} irariums
                      </span>
                    </div>
                  </a>
                {/each}
              </div>
            {/if}
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  </div>
</div>

<CreateSpaceDialog bind:open={isCreateSpaceOpen} />
