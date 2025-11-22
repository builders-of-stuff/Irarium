<script lang="ts">
  import { onMount } from 'svelte';
  import { pb } from '$lib/db/client';
  import { COLLECTION, type Space } from '$lib/shared/shared.type';
  import { Button } from '$lib/components/ui/button';
  import UserNavbar from '$lib/shared/user-navbar.svelte';

  import { spaceStore } from '$lib/space/space.store.svelte';

  let spaces = $state<Space[]>([]);
  let isLoading = $state(true);
  let error = $state<string | null>(null);

  onMount(async () => {
    try {
      const records = await pb.collection(COLLECTION.SPACES).getList(1, 50, {
        sort: 'name',
        filter: 'isPublic = true',
        expand: 'createdBy'
      });

      spaces = records.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        slug: item.slug,
        tags: item.tags,
        type: item.type,
        createdBy: item.createdBy,
        mods: item.mods,
        isPublic: item.isPublic,
        created: item.created,
        username: item.expand?.createdBy?.username
      }));

      // Fetch counts
      spaces.forEach((space) => spaceStore.fetchIrariumCount(space.id));
    } catch (err) {
      console.error('Error fetching spaces:', err);
      error = 'Failed to load spaces';
    } finally {
      isLoading = false;
    }
  });
</script>

<div class="relative min-h-screen overflow-hidden">
  <div class="relative z-10 flex h-screen flex-col">
    <UserNavbar title="Spaces" />

    <div class="flex-1 overflow-auto p-8">
      <div class="container mx-auto max-w-4xl">
        {#if isLoading}
          <div class="flex justify-center py-12">
            <div class="animate-pulse text-center">
              <p>Loading spaces...</p>
            </div>
          </div>
        {:else if error}
          <div class="rounded-lg bg-destructive/10 p-4 text-destructive">
            <p>{error}</p>
          </div>
        {:else if spaces.length === 0}
          <div class="rounded-lg border border-dashed p-8 text-center">
            <h3 class="mb-3 text-xl font-medium">No spaces found</h3>
            <p class="text-muted-foreground">There are no spaces available yet.</p>
          </div>
        {:else}
          <div class="grid gap-4 md:grid-cols-2">
            {#each spaces as space}
              <a
                href={`/spaces/${space.slug}-${space.id}`}
                class="block rounded-lg border border-muted p-6 transition-colors hover:bg-muted/30"
              >
                <h3 class="mb-2 text-xl font-semibold">{space.name}</h3>
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
                      ></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg
                    >
                    {spaceStore.irariumCounts[space.id] || 0} irariums
                  </span>
                  <span class="mx-2">•</span>
                  <span>
                    {new Date(space.created).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
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
              </a>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
