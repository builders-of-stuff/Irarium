<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Switch } from '$lib/components/ui/switch';
  import { pb } from '$lib/db/client';
  import { COLLECTION, type Space } from '$lib/shared/shared.type';
  import { authStore } from '$lib/auth/auth.store.svelte';
  import { spaceStore } from '$lib/space/space.store.svelte';
  import { toast } from 'svelte-sonner';
  import {
    DEFAULT_SPACE_SIZE,
    SPACE_EXPANSION_UNIT
  } from '$lib/shared/space.constants';
  import { goto, invalidateAll } from '$app/navigation';
  import { refreshState } from '$lib/utils/state.utils';

  let { open = $bindable(false), space = $bindable() } = $props<{
    open: boolean;
    space: Space;
  }>();

  let isLoading = $state(false);
  let isSaving = $state(false);
  let isExpanding = $state(false);

  let name = $state(space.name);
  let description = $state(space.description);
  let tags = $state(space.tags);
  let isPublic = $state(space.isPublic);
  let isShared = $state(space.isShared || false);

  // Update local state when space prop changes (e.g. if updated externally)
  $effect(() => {
    if (space) {
      name = space.name;
      description = space.description;
      tags = space.tags;
      isPublic = space.isPublic;
      isShared = space.isShared || false;
    }
  });

  async function handleSave() {
    if (!space?.id) return;

    isSaving = true;
    try {
      const data = {
        name,
        description,
        tags,
        isPublic,
        isShared
      };

      const updatedSpace = await pb
        .collection(COLLECTION.SPACES)
        .update(space.id, data);

      // Update local space object
      space = { ...space, ...updatedSpace };

      toast.success('Space updated successfully');
      open = false;

      // Refresh data to ensure everything is in sync
      await refreshState();
      await invalidateAll();
    } catch (err: any) {
      console.error('Error updating space:', err);
      toast.error(err.message || 'Failed to update space');
    } finally {
      isSaving = false;
    }
  }

  async function handleExpand() {
    if (!space?.id) return;

    if (
      !confirm(
        `Are you sure you want to expand this space? This will use 1 space expander.`
      )
    ) {
      return;
    }

    isExpanding = true;
    try {
      // We can still use the existing endpoint or move logic here.
      // Using the endpoint ensures server-side validation and admin actions (decrementing expanders).
      const response = await fetch(`/spaces/${space.slug}-${space.id}/settings`, {
        method: 'POST'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to expand space');
      }

      const { newSize } = await response.json();

      // Update local state
      space.size = newSize;

      // Refresh user settings to update expander count
      await refreshState();

      toast.success(`Space expanded to size ${newSize}`);
      await invalidateAll();
    } catch (err: any) {
      console.error('Error expanding space:', err);
      toast.error(err.message || 'Failed to expand space');
    } finally {
      isExpanding = false;
    }
  }

  async function handleDelete() {
    if (!space?.id) return;

    if (
      !confirm(
        'Are you sure you want to delete this space? This action cannot be undone.'
      )
    ) {
      return;
    }

    isSaving = true;
    try {
      await pb.collection(COLLECTION.SPACES).delete(space.id);
      spaceStore.removeSpace(space.id);
      await refreshState();
      toast.success('Space deleted successfully');
      goto('/spaces');
    } catch (err: any) {
      console.error('Error deleting space:', err);
      toast.error(err.message || 'Failed to delete space');
      isSaving = false;
    }
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Content class="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
    <Dialog.Header>
      <Dialog.Title>Space Settings</Dialog.Title>
      <Dialog.Description>Update your space details and visibility.</Dialog.Description>
    </Dialog.Header>

    <div class="grid gap-6 py-4">
      <!-- General Settings -->
      <div class="space-y-4">
        <div class="grid gap-2">
          <Label for="name">Name</Label>
          <Input id="name" bind:value={name} />
        </div>

        <div class="grid gap-2">
          <Label for="description">Description</Label>
          <Textarea id="description" bind:value={description} />
        </div>

        <div class="grid gap-2">
          <Label for="tags">Tags</Label>
          <Input id="tags" bind:value={tags} placeholder="comma, separated, tags" />
        </div>

        <div class="flex items-center space-x-2">
          <Switch id="public" bind:checked={isPublic} />
          <Label for="public">Make Public</Label>
        </div>

        <div class="flex items-center space-x-2">
          <Switch id="shared" bind:checked={isShared} />
          <Label for="shared">Allow others to publish</Label>
        </div>
      </div>

      <!-- Space Size -->
      <div class="space-y-4 border-t pt-4">
        <div class="space-y-2">
          <h3 class="text-lg font-medium">Space Size</h3>
          <p class="text-sm text-muted-foreground">
            Current Size: <span class="font-bold"
              >{space.size || DEFAULT_SPACE_SIZE}</span
            >
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-4">
          <Button
            variant="secondary"
            onclick={handleExpand}
            disabled={isExpanding || (authStore.userSettings?.spaceExpanders || 0) < 1}
          >
            {isExpanding ? 'Expanding...' : `Expand Space (+${SPACE_EXPANSION_UNIT})`}
          </Button>
          {#if (authStore.userSettings?.spaceExpanders || 0) < 1}
            <p class="text-xs text-muted-foreground">
              No expanders available. <a
                href="/settings"
                class="underline hover:text-primary">Purchase more</a
              >
            </p>
          {:else}
            <p class="text-xs text-muted-foreground">
              {authStore.userSettings?.spaceExpanders} expander(s) available
            </p>
          {/if}
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="space-y-4 border-t pt-4">
        <div class="space-y-2">
          <h3 class="text-lg font-medium text-destructive">Danger Zone</h3>
        </div>
        <Button
          variant="destructive"
          onclick={handleDelete}
          disabled={isSaving}
          size="sm"
        >
          Delete Space
        </Button>
      </div>
    </div>

    <Dialog.Footer>
      <Button variant="outline" onclick={() => (open = false)}>Cancel</Button>
      <Button onclick={handleSave} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save Changes'}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
