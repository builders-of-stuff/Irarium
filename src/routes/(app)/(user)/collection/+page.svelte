<script lang="ts">
  import { onMount } from 'svelte';
  import { pb } from '$lib/db/client';
  import { COLLECTION } from '$lib/shared/shared.type';
  import { authStore } from '$lib/auth/auth.store.svelte';
  import UserNavbar from '$lib/shared/user-navbar.svelte';
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
  } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import type { Irarium } from '$lib/shared/shared.type';

  let irariums = $state<Irarium[]>([]);
  let isLoading = $state(true);
  let error = $state<string | null>(null);

  async function fetchIrariums() {
    isLoading = true;
    error = null;

    try {
      const records = await pb.collection(COLLECTION.IRARIUMS).getList(1, 50, {
        filter: `userId = "${authStore.userId}"`,
        sort: '-updated'
      });

      irariums = records.items.map((item) => item as unknown as Irarium);
      error = null;
    } catch (err) {
      console.error('Error fetching irariums:', err);
      error = 'Failed to load your irariums. Please try again later.';
    } finally {
      isLoading = false;
    }
  }

  // Fetch irariums when the component mounts
  onMount(() => {
    if (authStore.userId) {
      fetchIrariums();
    }
  });

  // Watch for changes in auth state
  $effect(() => {
    if (authStore.userId) {
      fetchIrariums();
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
  {#if isLoading}
    <div class="flex justify-center py-12">
      <div class="animate-pulse text-center">
        <p>Loading your irariums...</p>
      </div>
    </div>
  {:else if error}
    <div class="rounded-lg bg-destructive/10 p-4 text-destructive">
      <p>{error}</p>
      <Button variant="outline" class="mt-2" onclick={fetchIrariums}>Try Again</Button>
    </div>
  {:else if irariums.length === 0}
    <div class="rounded-lg border border-dashed p-8 text-center">
      <h3 class="mb-2 text-xl font-medium">No irariums found</h3>
      <p class="mb-4 text-muted-foreground">You haven't created any irariums yet.</p>
      <Button href="/create">Create Your First Irarium</Button>
    </div>
  {:else}
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {#each irariums as irarium}
        <Card class="flex h-full flex-col">
          <CardHeader>
            <CardTitle>{irarium.title || 'Untitled Irarium'}</CardTitle>
            <CardDescription>
              {irarium.description || 'No description'}
            </CardDescription>
          </CardHeader>
          <CardContent class="flex-grow">
            <div class="line-clamp-3 text-sm text-muted-foreground">
              {@html irarium.content || 'No content'}
            </div>
            {#if irarium.tags}
              <div class="mt-4 flex flex-wrap gap-2">
                {#each irarium.tags.split(',') as tag}
                  {#if tag.trim()}
                    <span class="rounded-full bg-secondary px-2 py-1 text-xs">
                      {tag.trim()}
                    </span>
                  {/if}
                {/each}
              </div>
            {/if}
          </CardContent>
          <CardFooter class="flex justify-between">
            <span class="text-xs text-muted-foreground">
              Updated {formatDate(irarium.updated)}
            </span>
            <Button variant="outline" href={`/irarium/${irarium.id}`}>View</Button>
          </CardFooter>
        </Card>
      {/each}
    </div>
  {/if}
</div>
