<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { toast } from 'svelte-sonner';

  import UserNavbar from '$lib/shared/user-navbar.svelte';
  import IrariumComposer from '$lib/irarium/irarium-composer.svelte';
  import { IrariumStore } from '$lib/irarium/irarium.store.svelte';
  import { irariumsStore } from '$lib/irarium/irariums.store.svelte';

  let irarium = new IrariumStore();

  async function saveIrarium() {
    if (!irarium) return;

    try {
      await irariumsStore.createIrarium(irarium);
      toast.success('Irarium saved successfully!');
    } catch (error) {
      console.error('Error saving irarium:', error);
    }
  }
</script>

{#snippet actions()}
  <div class="flex gap-2">
    <Button variant="secondary" onclick={saveIrarium}>Save</Button>
  </div>
{/snippet}

<UserNavbar title="Create" {actions} />

<div class="container flex min-h-screen flex-col items-center justify-center py-8">
  <IrariumComposer {irarium} />
</div>
