<script lang="ts">
  import { onMount } from 'svelte';
  import { Button } from '$lib/components/ui/button';
  import { Trash2 } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';

  import { page } from '$app/state';
  import { goto } from '$app/navigation';

  import { irariumsStore } from '$lib/irarium/irariums.store.svelte';
  import { IrariumStore } from '$lib/irarium/irarium.store.svelte';
  import UserNavbar from '$lib/shared/user-navbar.svelte';

  import IrariumComposer from '$lib/irarium/irarium-composer.svelte';
  import { authStore } from '$lib/auth/auth.store.svelte';
  import { ROUTE } from '$lib/shared/shared.constant';

  let irarium = $state<IrariumStore | null>(null);
  let isLoading = $state(true);
  let error = $state<string | null>(null);

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

      toast.success('Irarium deleted successfully!');
      goto('/collection');
    } catch (error) {
      console.error('Error deleting irarium:', error);
      toast.error('Failed to delete irarium');
    }
  }

  async function togglePublicState() {
    if (!irarium) return;

    try {
      const updatedIrarium = await irariumsStore.togglePublicState(irarium);
      irarium.isPublic = updatedIrarium.isPublic;

      const message = irarium.isPublic
        ? 'Published successfully'
        : 'Unpublished successfully';

      toast.success(message);
    } catch (error) {
      console.error('Error toggling public state:', error);
      toast.error('Failed to update public state');
    }
  }

  function exportIrarium() {
    if (!irarium) return;

    try {
      irarium.exportAsJson();
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
      <Button variant="destructive" onclick={deleteIrarium}>Delete</Button>
      <Button variant="outline" onclick={togglePublicState}>
        {irarium?.isPublic ? 'Unpublish' : 'Publish'}
      </Button>
      <Button variant="outline" onclick={exportIrarium}>Export</Button>
      <Button variant="secondary" onclick={saveIrarium}>Save</Button>
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
