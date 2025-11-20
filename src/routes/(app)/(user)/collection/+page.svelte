<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { authStore } from '$lib/auth/auth.store.svelte';
  import UserNavbar from '$lib/shared/user-navbar.svelte';
  import { Button } from '$lib/components/ui/button';

  import { irariumsStore } from '$lib/irarium/irariums.store.svelte';
  import { countThoughts } from '$lib/irarium/irarium.tools.svelte';

  import * as Tabs from '$lib/components/ui/tabs';
  import { spaceStore } from '$lib/space/space.store.svelte';
  import CreateSpaceDialog from '$lib/components/space/create-space-dialog.svelte';

  let isCreateSpaceOpen = $state(false);
  let activeTab = $state('irariums');

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

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
</script>

{#snippet actions()}
  {#if activeTab === 'spaces'}
    {#if spaceStore.userSpaces.length < 1 || authStore.userSettings?.isFullyUpgraded}
      <Button onclick={() => (isCreateSpaceOpen = true)}>Create Space</Button>
    {/if}
  {/if}
{/snippet}

<div class="relative min-h-screen overflow-hidden">
  <div class="relative z-10">
    <UserNavbar title="My Collection" {actions} />

    <div class="container mx-auto max-w-6xl px-4 py-8">
      <Tabs.Root bind:value={activeTab} class="w-full">
        <Tabs.List class="grid w-full grid-cols-2">
          <Tabs.Trigger value="irariums">Irariums</Tabs.Trigger>
          <Tabs.Trigger value="spaces">Spaces</Tabs.Trigger>
        </Tabs.List>

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
          {:else if irariumsStore.userIrariums.length === 0}
            <div class="rounded-lg border border-dashed p-8 text-center">
              <h3 class="mb-3 text-xl font-medium">No irariums found</h3>
              <Button href="/create">Create irarium</Button>
            </div>
          {:else}
            <div class="mt-4 space-y-4">
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
                    <span>{countThoughts(irarium)} thoughts</span>
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
            {:else if spaceStore.userSpaces.length === 0}
              <div class="rounded-lg border border-dashed p-8 text-center">
                <h3 class="mb-3 text-xl font-medium">No spaces found</h3>
                <p class="mb-4 text-muted-foreground">
                  You haven't created any spaces yet.
                </p>
                <Button onclick={() => (isCreateSpaceOpen = true)}>Create Space</Button>
              </div>
            {:else}
              <div class="grid gap-4 md:grid-cols-2">
                {#each spaceStore.userSpaces as space}
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
