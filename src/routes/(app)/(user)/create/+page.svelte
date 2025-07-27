<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { toast } from 'svelte-sonner';

  import { goto } from '$app/navigation';
  import UserNavbar from '$lib/shared/user-navbar.svelte';
  import IrariumComposer from '$lib/irarium/irarium-composer.svelte';
  import { IrariumStore } from '$lib/irarium/irarium.store.svelte';
  import { irariumsStore } from '$lib/irarium/irariums.store.svelte';
  import { authStore } from '$lib/auth/auth.store.svelte';
  import { ROUTE } from '$lib/shared/shared.constant';
  import SparklesCore from '$lib/components/ui/sparkles.svelte';

  let irarium = new IrariumStore({
    userId: authStore.userId
  });

  async function createIrarium() {
    if (!irarium) return;

    try {
      await irariumsStore.createIrarium(irarium);
      await goto(ROUTE.COLLECTION);
      toast.success('Irarium saved successfully!');
    } catch (error) {
      console.error('Error saving irarium:', error);
    }
  }
</script>

{#snippet actions()}
  <div class="flex gap-2">
    <Button variant="secondary" onclick={createIrarium}>Save</Button>
  </div>
{/snippet}

<UserNavbar title="Create" {actions} />

<div class="relative">
  <!-- Sparkles background -->
  <div class="fixed inset-0 h-full w-full pointer-events-none">
    <SparklesCore
      id="create-sparkles"
      background="transparent"
      minSize={0.4}
      maxSize={1.0}
      particleDensity={40}
      className="h-full w-full"
      particleColor="#FFFFFF"
    />
  </div>

  <div class="relative z-10 container flex min-h-screen flex-col items-center py-8">
    <IrariumComposer {irarium} enableUpdates />
  </div>
</div>
