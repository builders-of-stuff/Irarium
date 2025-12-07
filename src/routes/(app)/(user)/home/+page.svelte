<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '$lib/auth/auth.store.svelte';
  import { irariumsStore } from '$lib/irarium/irariums.store.svelte';
  import { spaceStore } from '$lib/space/space.store.svelte';
  import { countThoughts } from '$lib/irarium/irarium.tools.svelte';
  import { Button } from '$lib/components/ui/button';
  import { MapPin } from '@lucide/svelte';
  import UserNavbar from '$lib/shared/user-navbar.svelte';
  import DateDisplay from '$lib/components/shared/date-display.svelte';

  import { untrack } from 'svelte';

  $effect(() => {
    // If logged in, wait for spaces to be loaded so we can filter correctly
    if (authStore.userId && !spaceStore.hasFetchedUserSpaces) return;

    untrack(() => irariumsStore.fetchPublicIrariums());
  });
</script>

<div class="relative min-h-screen overflow-hidden">
  <div class="relative z-10">
    <UserNavbar title="Home">
      {#snippet customBadge()}
        {#if authStore.userId}
          {@const ownSpacesCount = spaceStore.userSpaces.length}
          {@const subscribedSpacesCount =
            authStore.userSettings.subscribedSpaces?.length || 0}
          {@const totalSpaces = ownSpacesCount + subscribedSpacesCount}
          {#if totalSpaces > 0}
            <div
              class="flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-3 py-1.5 text-sm font-medium text-blue-300"
            >
              <span>{totalSpaces} {totalSpaces === 1 ? 'space' : 'spaces'}</span>
            </div>
          {/if}
        {/if}
      {/snippet}
    </UserNavbar>

    <div class="container mx-auto max-w-6xl px-4 py-8 pt-32 md:pt-20">
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

          <Button href="/spaces">View spaces</Button>
        </div>
      {:else}
        <div class="space-y-4">
          {#each irariumsStore.publicIrariums as irarium}
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
                  {#if irarium.createdBy}
                    <button
                      type="button"
                      class="hover:underline"
                      onclick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.location.href = `/user/${irarium.createdBy}`;
                      }}
                    >
                      @{irarium.createdBy}
                    </button>
                  {/if}

                  {#if irarium.space}
                    <button
                      type="button"
                      class="flex items-center gap-1 hover:text-foreground hover:underline"
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

                  <DateDisplay created={irarium.created} updated={irarium.updated} />
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
