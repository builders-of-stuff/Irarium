<script lang="ts">
  import { toast } from 'svelte-sonner';
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import UserNavbar from '$lib/shared/user-navbar.svelte';
  import IrariumComposer from '$lib/irarium/irarium-composer.svelte';
  import { IrariumStore } from '$lib/irarium/irarium.store.svelte';
  import { irariumsStore } from '$lib/irarium/irariums.store.svelte';
  import { authStore } from '$lib/auth/auth.store.svelte';
  import { ROUTE } from '$lib/shared/shared.constant';

  let irarium = new IrariumStore({
    userId: authStore.userId
  });

  async function createIrarium() {
    if (!irarium) return;

    try {
      await irariumsStore.createIrarium(irarium);
      await irariumsStore.fetchUserIrariums(authStore.userId, true);
      await goto(ROUTE.COLLECTION);
      toast.success('Irarium saved successfully!');
    } catch (error) {
      console.error('Error saving irarium:', error);
      const message = error?.message || 'Failed to create irarium. Please try again.';
      toast.error(message);
    }
  }
</script>

{#snippet actions()}
  <div class="flex gap-2">
    <Button variant="secondary" onclick={createIrarium}>Save</Button>
  </div>
{/snippet}
<div class="relative min-h-screen overflow-hidden">
  <div class="relative z-10 flex h-screen flex-col">
    <UserNavbar title="Create" {actions} />

    <div class="flex-1 overflow-hidden">
      {#if irarium}
        <IrariumComposer bind:irarium enableUpdates />
      {/if}
    </div>
  </div>
</div>
```
