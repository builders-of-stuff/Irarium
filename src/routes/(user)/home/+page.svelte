<script lang="ts">
  import { goto } from '$app/navigation';
  import { ROUTE_IDS } from '$lib/shared/shared.constant';
  import { appState } from '$lib/state/app.state.svelte';

  async function handleSignOut() {
    await appState.signOut();
    goto(ROUTE_IDS.LANDING);
  }
</script>

<div class="container flex min-h-screen items-start justify-center pt-[10vh]">
  <div class="w-full max-w-md space-y-10">
    <h1>Home</h1>
    <button onclick={handleSignOut}>Sign out</button>
  </div>
</div>
