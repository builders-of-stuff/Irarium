<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import { authStore } from '$lib/auth/auth.store.svelte';
  import { spaceStore } from '$lib/space/space.store.svelte';
  import type { Space } from '$lib/shared/shared.type';
  import { MapPin } from 'lucide-svelte';

  let { open = $bindable(false) } = $props<{
    open: boolean;
  }>();

  let subscribedSpaces = $state<Space[]>([]);
  let isLoadingSubscribed = $state(false);

  // Fetch subscribed spaces when dialog opens
  $effect(() => {
    if (open && authStore.userSettings?.subscribedSpaces?.length > 0) {
      loadSubscribedSpaces();
    }
  });

  async function loadSubscribedSpaces() {
    isLoadingSubscribed = true;
    try {
      subscribedSpaces = await spaceStore.fetchSpacesByIds(
        authStore.userSettings.subscribedSpaces || []
      );
    } finally {
      isLoadingSubscribed = false;
    }
  }

  function navigateToSpace(space: Space) {
    window.location.href = `/spaces/${space.slug}-${space.id}`;
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Content class="max-h-[80vh] overflow-y-auto sm:max-w-[600px]">
    <Dialog.Header>
      <Dialog.Title>Your Spaces</Dialog.Title>
      <Dialog.Description>
        View and navigate to your owned and subscribed spaces.
      </Dialog.Description>
    </Dialog.Header>

    <div class="space-y-6 py-4">
      <!-- Owned Spaces -->
      <div class="space-y-3">
        <h3 class="text-sm font-semibold text-muted-foreground">Your Spaces</h3>
        {#if spaceStore.userSpaces.length > 0}
          <div class="space-y-2">
            {#each spaceStore.userSpaces as space}
              <button
                type="button"
                onclick={() => navigateToSpace(space)}
                class="w-full rounded-lg border border-muted p-3 text-left transition-colors hover:bg-muted/30"
              >
                <div class="flex items-start justify-between gap-2">
                  <div class="flex-1 space-y-1">
                    <div class="flex items-center gap-2">
                      <MapPin size={14} class="text-muted-foreground" />
                      <h4 class="font-medium">{space.name}</h4>
                    </div>
                    {#if space.description}
                      <p class="line-clamp-2 text-sm text-muted-foreground">
                        {space.description}
                      </p>
                    {/if}
                  </div>
                  <div class="flex flex-col items-end gap-1">
                    <span class="text-xs text-muted-foreground">
                      {spaceStore.irariumCounts[space.id] || 0} irariums
                    </span>
                    {#if space.isPublic}
                      <span
                        class="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs text-blue-300"
                      >
                        Public
                      </span>
                    {/if}
                  </div>
                </div>
              </button>
            {/each}
          </div>
        {:else}
          <p class="text-sm text-muted-foreground">You don't own any spaces yet.</p>
        {/if}
      </div>

      <!-- Subscribed Spaces -->
      {#if authStore.userSettings?.hasAnsible}
        <div class="space-y-3 border-t pt-4">
          <h3 class="text-sm font-semibold text-muted-foreground">Subscribed Spaces</h3>
          {#if isLoadingSubscribed}
            <div class="flex justify-center py-4">
              <p class="text-sm text-muted-foreground">Loading...</p>
            </div>
          {:else if subscribedSpaces.length > 0}
            <div class="space-y-2">
              {#each subscribedSpaces as space}
                <button
                  type="button"
                  onclick={() => navigateToSpace(space)}
                  class="w-full rounded-lg border border-muted p-3 text-left transition-colors hover:bg-muted/30"
                >
                  <div class="flex items-start justify-between gap-2">
                    <div class="flex-1 space-y-1">
                      <div class="flex items-center gap-2">
                        <MapPin size={14} class="text-muted-foreground" />
                        <h4 class="font-medium">{space.name}</h4>
                      </div>
                      {#if space.description}
                        <p class="line-clamp-2 text-sm text-muted-foreground">
                          {space.description}
                        </p>
                      {/if}
                      {#if space.username}
                        <p class="text-xs text-muted-foreground">by @{space.username}</p>
                      {/if}
                    </div>
                    <div class="flex flex-col items-end gap-1">
                      <span class="text-xs text-muted-foreground">
                        {spaceStore.irariumCounts[space.id] || 0} irariums
                      </span>
                    </div>
                  </div>
                </button>
              {/each}
            </div>
          {:else}
            <p class="text-sm text-muted-foreground">
              You haven't subscribed to any spaces yet.
            </p>
          {/if}
        </div>
      {/if}
    </div>

    <Dialog.Footer>
      <Button variant="outline" onclick={() => (open = false)}>Close</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
