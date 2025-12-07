<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Switch } from '$lib/components/ui/switch';
  import { pb } from '$lib/db/client';
  import { COLLECTION } from '$lib/shared/shared.type';
  import { authStore } from '$lib/auth/auth.store.svelte';
  import { spaceStore } from '$lib/space/space.store.svelte';
  import { toast } from 'svelte-sonner';
  import { DEFAULT_SPACE_SIZE } from '$lib/shared/space.constants';
  import { refreshState } from '$lib/utils/state.utils';

  let { open = $bindable(false) } = $props();

  let name = $state('');
  let slug = $state('');
  let description = $state('');
  let tags = $state('');
  let isPublic = $state(false);
  let isLoading = $state(false);

  async function handleSubmit() {
    if (!authStore.userId) return;

    isLoading = true;
    try {
      // Check if user already has a space
      const spaceLimit = authStore.userSettings?.spaceLimit || 1;
      if (spaceStore.userSpaces.length >= spaceLimit) {
        toast.error(
          `You have reached your limit of ${spaceLimit} space${spaceLimit > 1 ? 's' : ''}. Upgrade to create more.`
        );
        return;
      }

      const data = {
        name,
        slug,
        description,
        tags,
        isPublic,
        createdBy: authStore.userId,
        type: 'personal', // Default type
        mods: [authStore.userId],
        size: DEFAULT_SPACE_SIZE
      };

      await pb.collection(COLLECTION.SPACES).create(data);
      toast.success('Space created successfully!');
      open = false;

      // Refresh user spaces
      await refreshState();

      // Reset form
      name = '';
      slug = '';
      description = '';
      tags = '';
      isPublic = false;
    } catch (err: any) {
      console.error('Error creating space:', err);
      toast.error(err.message || 'Failed to create space');
    } finally {
      isLoading = false;
    }
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Create Space</Dialog.Title>
      <Dialog.Description>
        Create your own personal space. You can create up to {authStore.userSettings
          ?.spaceLimit || 1} spaces.
      </Dialog.Description>
    </Dialog.Header>
    <div class="grid gap-4 py-4">
      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="name" class="text-right">Name</Label>
        <Input id="name" bind:value={name} class="col-span-3" />
      </div>
      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="slug" class="text-right">Slug</Label>
        <Input
          id="slug"
          bind:value={slug}
          class="col-span-3"
          placeholder="unique-url-slug"
        />
      </div>
      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="description" class="text-right">Description</Label>
        <Textarea id="description" bind:value={description} class="col-span-3" />
      </div>
      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="tags" class="text-right">Tags</Label>
        <Input
          id="tags"
          bind:value={tags}
          class="col-span-3"
          placeholder="comma, separated, tags"
        />
      </div>
      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="public" class="text-right">Public</Label>
        <Switch id="public" bind:checked={isPublic} />
      </div>
    </div>
    <Dialog.Footer>
      <Button type="submit" onclick={handleSubmit} disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Space'}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
