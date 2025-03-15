<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { irariumsStore } from '$lib/irarium/irariums.store.svelte';
  import { IrariumStore } from '$lib/irarium/irarium.store.svelte';
  import IrariumComposer from '$lib/irarium/irarium-composer.svelte';
  import UserNavbar from '$lib/shared/user-navbar.svelte';
  import { Button } from '$lib/components/ui/button';
  import { toast } from 'svelte-sonner';

  let irarium = $state<IrariumStore | null>(null);
  let isLoading = $state(true);
  let error = $state<string | null>(null);

  const irariumId = $derived(page.params.irariumId);

  onMount(async () => {
    if (!irariumId) return;

    try {
      isLoading = true;
      const fetchedIrarium = await irariumsStore.fetchIrariumBy(irariumId);

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
      // TODO: Implement update functionality
      toast.success('Irarium saved successfully!');
    } catch (error) {
      console.error('Error saving irarium:', error);
      toast.error('Failed to save irarium');
    }
  }
</script>

{#snippet actions()}
  <div class="flex gap-2">
    <Button variant="secondary" onclick={saveIrarium}>Save</Button>
  </div>
{/snippet}

<UserNavbar title={irarium?.title || 'Irarium'} {actions} />

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
