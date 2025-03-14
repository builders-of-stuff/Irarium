<script lang="ts">
  import { Button } from '$lib/components/ui/button';

  import UserNavbar from '../user-navbar.svelte';
  import IrariumComposer from '$lib/irarium/irarium-composer.svelte';

  $effect(() => {});
</script>

{#snippet actions()}
  <div class="flex gap-2">
    <Button variant="secondary">Save</Button>
  </div>
{/snippet}

<UserNavbar title="Create" {actions} />

<div class="container flex min-h-screen flex-col items-center justify-center py-8">
  <IrariumComposer />
</div>
