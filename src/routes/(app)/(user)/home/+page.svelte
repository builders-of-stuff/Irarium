<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '$lib/auth/auth.store.svelte';
  import { irariumsStore } from '$lib/irarium/irariums.store.svelte';
  import { countThoughts } from '$lib/irarium/irarium.tools.svelte';
  import { Button } from '$lib/components/ui/button';
  import { MapPin } from '@lucide/svelte';
  import UserNavbar from '$lib/shared/user-navbar.svelte';

  onMount(() => {
    if (authStore.userId) {
      irariumsStore.fetchPublicIrariums();
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

<div class="relative min-h-screen overflow-hidden">
  <div class="relative z-10">
    <UserNavbar title="Home" />

    <div class="container mx-auto max-w-6xl px-4 py-8">
      {#if irariumsStore.isLoading}
        <div class="flex justify-center py-12">
          <div class="animate-pulse text-center">
            <p>Loading public irariums...</p>
          </div>
        </div>
      {:else if irariumsStore.error}
        <div class="rounded-lg bg-destructive/10 p-4 text-destructive">
          <p>{irariumsStore.error}</p>
          <Button
            variant="outline"
            class="mt-2"
            onclick={() => irariumsStore.fetchPublicIrariums()}>Try Again</Button
          >
        </div>
      {:else if irariumsStore.publicIrariums.length === 0}
        <div class="rounded-lg border border-dashed p-8 text-center">
          <h3 class="mb-3 text-xl font-medium">No irariums found</h3>

          <Button href="/create">Create irarium</Button>
        </div>
      {:else}
        <div class="space-y-4">
          {#each irariumsStore.publicIrariums as irarium}
            <a
              href={`/${irarium.id}`}
              class="block rounded-lg border border-muted p-4 transition-colors hover:bg-muted/30"
            >
              <div class="mb-2 line-clamp-3">
                {@html irarium.content || 'No content'}
              </div>
              <div class="flex justify-between text-xs text-muted-foreground">
                <div class="flex items-center gap-2">
                  {#if irarium.createdBy}
                    <a
                      href={`/user/${irarium.createdBy}`}
                      class="hover:underline"
                      onclick={(e) => e.stopPropagation()}
                    >
                      @{irarium.createdBy}
                    </a>
                  {/if}

                  {#if irarium.space}
                    <a
                      href={`/spaces/${irarium.space.slug}-${irarium.spaceId}`}
                      class="flex items-center gap-1 hover:text-foreground hover:underline"
                      onclick={(e) => e.stopPropagation()}
                    >
                      <MapPin size={12} />
                      {irarium.space.name}
                    </a>
                  {/if}

                  <span>{formatDate(irarium.updated)}</span>
                </div>
                <span>{countThoughts(irarium)} thoughts</span>
              </div>
            </a>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>
