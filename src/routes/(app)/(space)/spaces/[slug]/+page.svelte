<script lang="ts">
  import { page } from '$app/state';
  import SpaceView from '../space-view.svelte';

  const slug = $derived(page.params.slug || 'general');
</script>

<div class="h-[calc(100vh-4rem)] w-full overflow-hidden">
  <SpaceView {slug} />
</div>
