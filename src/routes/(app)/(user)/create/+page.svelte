<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { pb } from '$lib/db/client';
  import { COLLECTION } from '$lib/shared/shared.type';
  import { toast } from 'svelte-sonner';

  import UserNavbar from '$lib/shared/user-navbar.svelte';
  import IrariumComposer from '$lib/irarium/irarium-composer.svelte';
  import { IrariumStore } from '$lib/irarium/irarium.store.svelte';
  import { mapIrariumToCreate } from '$lib/irarium/irarium.tools.svelte';

  let irarium = new IrariumStore();

  async function saveIrarium() {
    if (!irarium) return;

    try {
      const record = await pb
        .collection(COLLECTION.IRARIUMS)
        .create(mapIrariumToCreate(irarium));

      toast.success('Irarium saved successfully!');
      return { success: true, data: record };
    } catch (error) {
      console.error('Error saving irarium:', error);
      return { success: false, error };
    }
  }

  $effect(() => {});
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
