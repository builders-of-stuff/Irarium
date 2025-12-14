<script lang="ts">
  import { onMount } from 'svelte';
  import { Button } from '$lib/components/ui/button';
  import { Trash2, MoreVertical } from '@lucide/svelte';
  import { toast } from 'svelte-sonner';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

  import { page } from '$app/state';
  import { goto } from '$app/navigation';

  import { irariumsStore } from '$lib/irarium/irariums.store.svelte';
  import { IrariumStore } from '$lib/irarium/irarium.store.svelte';
  import UserNavbar from '$lib/shared/user-navbar.svelte';
  import PublishIrariumDialog from '$lib/components/irarium/publish-irarium-dialog.svelte';

  import IrariumComposer from '$lib/irarium/irarium-composer.svelte';
  import { authStore } from '$lib/auth/auth.store.svelte';
  import { ROUTE } from '$lib/shared/shared.constant';
  import { pb } from '$lib/db/client';
  import { COLLECTION, type Space } from '$lib/shared/shared.type';

  let irarium = $state<IrariumStore | null>(null);
  let isLoading = $state(true);
  let error = $state<string | null>(null);
  let space = $state<Space | null>(null);
  let showPublishDialog = $state(false);

  const irariumId = $derived(page.params.irariumId);
  const isOwner = $derived(irarium?.userId === authStore.userId);
  const displayTitle = $derived(irarium?.title || irarium?.id || 'Irarium');

  function updateTitle(newTitle: string) {
    if (irarium && newTitle !== irarium.title) {
      irarium.title = newTitle;
    }
  }

  onMount(async () => {
    if (!irariumId) return;

    try {
      isLoading = true;
      const fetchedIrarium = await irariumsStore.fetchIrarium(irariumId);

      if (fetchedIrarium) {
        irarium = new IrariumStore(fetchedIrarium);

        // Fetch space if irarium has a spaceId
        if (fetchedIrarium.spaceId) {
          try {
            const spaceRecord = await pb
              .collection(COLLECTION.SPACES)
              .getOne(fetchedIrarium.spaceId);
            space = {
              id: spaceRecord.id,
              name: spaceRecord.name,
              description: spaceRecord.description,
              slug: spaceRecord.slug,
              tags: spaceRecord.tags,
              type: spaceRecord.type,
              createdBy: spaceRecord.createdBy,
              mods: spaceRecord.mods,
              isPublic: spaceRecord.isPublic,
              created: spaceRecord.created
            };
          } catch (err) {
            console.error('Error fetching space:', err);
          }
        }
      } else {
        error = 'Irarium not found';
      }
    } catch (err) {
      console.error('Error loading irarium:', err);
      error = 'Failed to load irarium. Please try again later.';
    } finally {
      isLoading = false;
    }
  });

  async function saveIrarium() {
    if (!irarium) return;

    try {
      await irariumsStore.updateIrarium(irarium);
      toast.success('Irarium saved successfully!');
    } catch (error) {
      console.error('Error saving irarium:', error);
    }
  }

  async function deleteIrarium() {
    if (!irarium) return;

    if (
      !confirm(
        'Are you sure you want to delete this irarium? This action cannot be undone.'
      )
    ) {
      return;
    }

    try {
      if (!irariumId) return;
      await irariumsStore.deleteIrarium(irariumId);
      await irariumsStore.refreshAllData(authStore.userId);

      toast.success('Irarium deleted successfully!');
      goto('/collections');
    } catch (error) {
      console.error('Error deleting irarium:', error);
      toast.error('Failed to delete irarium');
    }
  }

  async function togglePublicState() {
    if (!irarium) return;

    // If currently private, show modal to publish
    if (!irarium.isPublic) {
      showPublishDialog = true;
      return;
    }

    // If currently public, unpublish directly
    try {
      const updatedIrarium = await irariumsStore.togglePublicState(irarium);
      irarium.isPublic = updatedIrarium.isPublic;

      toast.success('Unpublished successfully');
    } catch (error) {
      console.error('Error unpublishing:', error);
      toast.error('Failed to unpublish');
    }
  }

  function exportIrarium() {
    if (!irarium) return;

    try {
      irarium.exportAsMarkdown();
      toast.success('Irarium exported successfully!');
    } catch (error) {
      console.error('Error exporting irarium:', error);
      toast.error('Failed to export irarium');
    }
  }
</script>

{#snippet actions()}
  <div class="flex gap-2">
    {#if isOwner}
      <Button
        variant="secondary"
        onclick={saveIrarium}
        class="border-0 bg-orange-600 text-white hover:bg-orange-500"
      >
        Save
      </Button>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          class="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/20 bg-white/5 text-sm font-medium transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
        >
          <MoreVertical size={16} />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content class="w-48">
          <DropdownMenu.Item onclick={togglePublicState}>
            {irarium?.isPublic ? 'Unpublish' : 'Publish'}
          </DropdownMenu.Item>
          <DropdownMenu.Item onclick={exportIrarium}>Export</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item onclick={deleteIrarium} class="text-destructive">
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    {/if}
  </div>
{/snippet}

<div class="relative min-h-screen overflow-hidden">
  <div class="relative z-10 flex h-screen flex-col">
    <UserNavbar
      title={displayTitle}
      {actions}
      isTitleEditable={isOwner}
      handleTitleChange={updateTitle}
      spaceName={space?.name}
      spaceSlug={space?.slug}
      spaceId={space?.id}
      username={irarium?.createdBy || irarium?.username}
    />

    <div class="flex-1 overflow-hidden">
      {#if irarium}
        <IrariumComposer bind:irarium enableUpdates={isOwner} />
      {:else}
        <div class="flex h-full flex-col items-center justify-center gap-4">
          <p>No irarium found</p>
          <Button href="/home">Back to Dashboard</Button>
        </div>
      {/if}
    </div>
  </div>
</div>

{#if irarium}
  <PublishIrariumDialog
    bind:open={showPublishDialog}
    {irarium}
    onPublishSuccess={(updatedIrarium) => {
      if (irarium) {
        irarium.isPublic = updatedIrarium.isPublic;
        irarium.spaceId = updatedIrarium.spaceId || '';
        irarium.position = updatedIrarium.position;

        // Refetch space if it changed
        if (updatedIrarium.spaceId && updatedIrarium.spaceId !== space?.id) {
          pb.collection(COLLECTION.SPACES)
            .getOne(updatedIrarium.spaceId)
            .then((spaceRecord) => {
              space = {
                id: spaceRecord.id,
                name: spaceRecord.name,
                description: spaceRecord.description,
                slug: spaceRecord.slug,
                tags: spaceRecord.tags,
                type: spaceRecord.type,
                createdBy: spaceRecord.createdBy,
                mods: spaceRecord.mods,
                isPublic: spaceRecord.isPublic,
                created: spaceRecord.created
              };
            })
            .catch((err) => {
              console.error('Error fetching space:', err);
            });
        }

        irariumsStore.refreshAllData(authStore.userId);
      }
    }}
  />
{/if}
