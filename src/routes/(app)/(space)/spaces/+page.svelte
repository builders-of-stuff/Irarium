<script lang="ts">
  import { onMount } from 'svelte';
  import { pb } from '$lib/db/client';
  import { COLLECTION, type Space } from '$lib/shared/shared.type';
  import { Button } from '$lib/components/ui/button';
  import UserNavbar from '$lib/shared/user-navbar.svelte';

  let spaces = $state<Space[]>([]);
  let isLoading = $state(true);
  let error = $state<string | null>(null);

  onMount(async () => {
    try {
      const records = await pb.collection(COLLECTION.SPACES).getList(1, 50, {
        sort: 'name',
        filter: 'isPublic = true'
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
        isPublic: item.isPublic
      }));
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
              </a>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
