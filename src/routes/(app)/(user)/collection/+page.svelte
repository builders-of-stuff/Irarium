<script lang="ts">
  import { onMount } from 'svelte';
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

  import { irariumsStore } from '$lib/irarium/irariums.store.svelte';

  onMount(() => {
    if (authStore.userId) {
      irariumsStore.fetchUserIrariums();
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
      <Button variant="outline" class="mt-2" onclick={irariumsStore.fetchUserIrariums}
        >Try Again</Button
      >
    </div>
  {:else if irariumsStore.userIrariums.length === 0}
    <div class="rounded-lg border border-dashed p-8 text-center">
      <h3 class="mb-2 text-xl font-medium">No irariums found</h3>
      <p class="mb-4 text-muted-foreground">You haven't created any irariums yet.</p>
      <Button href="/create">Create Your First Irarium</Button>
    </div>
  {:else}
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {#each irariumsStore.userIrariums as irarium}
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
            <Button variant="outline" href={`/${irarium.id}`}>View</Button>
          </CardFooter>
        </Card>
      {/each}
    </div>
  {/if}
</div>
