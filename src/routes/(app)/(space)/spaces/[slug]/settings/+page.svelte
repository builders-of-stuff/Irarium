<script lang="ts">
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import { pb } from '$lib/db/client';
  import { COLLECTION, type Space } from '$lib/shared/shared.type';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Switch } from '$lib/components/ui/switch';
  import { authStore } from '$lib/auth/auth.store.svelte';
  import { toast } from 'svelte-sonner';
  import { goto } from '$app/navigation';
  import UserNavbar from '$lib/shared/user-navbar.svelte';

  let slug = $derived(page.params.slug ?? '');
  let spaceId = $derived(slug.split('-').pop());

  let space = $state<Space | null>(null);
  let isLoading = $state(true);
  let isSaving = $state(false);
  let error = $state<string | null>(null);

  let name = $state('');
  let description = $state('');
  let tags = $state('');
  let isPublic = $state(false);

  onMount(async () => {
    if (!spaceId) {
      error = 'Invalid space ID';
      isLoading = false;
      return;
    }

    try {
      const record = await pb.collection(COLLECTION.SPACES).getOne(spaceId);

      // Check permissions
      if (record.createdBy !== authStore.userId) {
        error = 'You do not have permission to edit this space';
        return;
      }

      space = {
        id: record.id,
        name: record.name,
        description: record.description,
        slug: record.slug,
        tags: record.tags,
        type: record.type,
        createdBy: record.createdBy,
        mods: record.mods,
        isPublic: record.isPublic,
        created: record.created
      };

      name = space.name;
      description = space.description;
      tags = space.tags;
      isPublic = space.isPublic;
    } catch (err) {
      console.error('Error fetching space:', err);
      error = 'Failed to load space';
    } finally {
      isLoading = false;
    }
  });

  async function handleSave() {
    if (!spaceId || !space) return;

    isSaving = true;
    try {
      const data = {
        name,
        description,
        tags,
        isPublic
      };

      await pb.collection(COLLECTION.SPACES).update(spaceId, data);
      toast.success('Space updated successfully');

      // Redirect back to space view
      goto(`/spaces/${space.slug}-${space.id}`);
    } catch (err: any) {
      console.error('Error updating space:', err);
      toast.error(err.message || 'Failed to update space');
    } finally {
      isSaving = false;
    }
  }
</script>

<div class="relative min-h-screen overflow-hidden">
  <div class="relative z-10">
    <UserNavbar title="Space Settings" />

    <div class="container mx-auto max-w-2xl px-4 py-8">
      {#if isLoading}
        <div class="flex justify-center py-12">
          <div class="animate-pulse text-center">
            <p>Loading settings...</p>
          </div>
        </div>
      {:else if error}
        <div class="rounded-lg bg-destructive/10 p-4 text-destructive">
          <p>{error}</p>
          <Button variant="outline" class="mt-4" href="/spaces">Go Back</Button>
        </div>
      {:else if space}
        <div class="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
          <div class="space-y-2">
            <h3 class="text-lg font-medium">General Settings</h3>
            <p class="text-sm text-muted-foreground">
              Update your space details and visibility.
            </p>
          </div>

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
          </div>

          <div class="flex justify-end gap-4 pt-4">
            <Button variant="outline" href={`/spaces/${space.slug}-${space.id}`}
              >Cancel</Button
            >
            <Button onclick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
