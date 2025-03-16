<script lang="ts">
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';

  import { page } from '$app/state';
  import { goto } from '$app/navigation';

  import { irariumsStore } from '$lib/irarium/irariums.store.svelte';
  import { IrariumStore } from '$lib/irarium/irarium.store.svelte';
  import IrariumComposer from '$lib/irarium/irarium-composer.svelte';
  import UserNavbar from '$lib/shared/user-navbar.svelte';
  import { Button } from '$lib/components/ui/button';

  let irarium = $state<IrariumStore | null>(null);
  let isLoading = $state(true);
  let error = $state<string | null>(null);

  const irariumId = $derived(page.params.irariumId);

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
      await irariumsStore.deleteIrarium(irariumId);

      toast.success('Irarium deleted successfully!');
      goto('/collection');
    } catch (error) {
      console.error('Error deleting irarium:', error);
      toast.error('Failed to delete irarium');
    }
  }
</script>

{#snippet actions()}
  <div class="flex gap-2">
    {#if irarium?.isOwner}
      <Button variant="destructive" onclick={deleteIrarium}>Delete</Button>
    {/if}
    <Button variant="secondary" onclick={saveIrarium}>Save</Button>
  </div>
{/snippet}

<UserNavbar title={irarium?.title || irarium?.id} {actions} />

<div class="container flex min-h-screen flex-col items-center justify-center py-8">
  {#if isLoading}
    <div class="flex items-center justify-center">
      <div
        class="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"
      ></div>
    </div>
  {:else if error}
    <div class="flex flex-col items-center justify-center gap-4">
      <p class="text-destructive">{error}</p>
      <Button href="/home">Back to Dashboard</Button>
    </div>
  {:else if irarium}
    <IrariumComposer {irarium} />
  {:else}
    <div class="flex flex-col items-center justify-center gap-4">
      <p>No irarium found</p>
      <Button href="/home">Back to Dashboard</Button>
    </div>
  {/if}
</div>
