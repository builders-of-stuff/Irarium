<script lang="ts">
  import { i18n } from '$lib/i18n';
  import { ParaglideJS } from '@inlang/paraglide-sveltekit';

  import { appState } from '$lib/state/app.state.svelte';

  import '../app.css';

  let { children } = $props();
</script>

{#if appState.hasUser}
  {@render children()}
{:else}
  {@render children()}
{/if}
