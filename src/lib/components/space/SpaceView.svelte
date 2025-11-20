<script lang="ts">
  import { Canvas } from '@threlte/core';
  import { OrbitControls } from '@threlte/extras';
  import { T } from '@threlte/core';
  import { Pause, Play } from 'lucide-svelte';
  import SpaceBox from '$lib/components/space/SpaceBox.svelte';
  import Starfield from '$lib/components/starfield.svelte';
  import { irariumsStore } from '$lib/irarium/irariums.store.svelte';
  import { pb } from '$lib/db/client';
  import { COLLECTION, type Space } from '$lib/shared/shared.type';
  import { onMount } from 'svelte';

  let { slug } = $props<{ slug: string }>();

  let space = $state<Space | null>(null);
  let isLoading = $state(true);
  let error = $state<string | null>(null);
  let autoRotate = $state(true);

  // Filter irariums by this space's ID
  let spaceIrariums = $derived.by(() => {
    if (!space?.id) return [];
    return irariumsStore.publicIrariums.filter(
      (irarium) => irarium.spaceId === space.id
    );
  });

  onMount(async () => {
    try {
      // Fetch the space by slug
      const spaces = await pb.collection(COLLECTION.SPACES).getList(1, 1, {
        filter: `slug = "${slug}"`
      });

      if (spaces.items.length > 0) {
        space = {
          id: spaces.items[0].id,
          name: spaces.items[0].name,
          description: spaces.items[0].description,
          slug: spaces.items[0].slug
        };
      } else {
        error = 'Space not found';
      }

      // Fetch public irariums
      await irariumsStore.fetchPublicIrariums();
    } catch (err) {
      console.error('Error fetching space:', err);
      error = 'Failed to load space';
    } finally {
      isLoading = false;
    }
  });
</script>

<Starfield />

{#if isLoading}
  <div class="flex h-full w-full items-center justify-center">
    <div class="animate-pulse text-center text-white">
      <p>Loading space...</p>
    </div>
  </div>
{:else if error}
  <div class="flex h-full w-full items-center justify-center">
    <div class="rounded-lg bg-destructive/10 p-4 text-destructive">
      <p>{error}</p>
    </div>
  </div>
{:else if space}
  <div class="relative h-full w-full">
    <!-- Play/Pause Button -->
    <button
      onclick={() => (autoRotate = !autoRotate)}
      class="absolute top-4 right-4 z-10 rounded-full bg-black/50 p-3 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
    >
      {#if autoRotate}
        <Pause size={20} />
      {:else}
        <Play size={20} />
      {/if}
    </button>

    <Canvas>
      <T.PerspectiveCamera makeDefault position={[150, 150, 150]} fov={50}>
        <OrbitControls enableDamping {autoRotate} autoRotateSpeed={0.5} />
      </T.PerspectiveCamera>

      <T.AmbientLight intensity={0.5} />
      <T.DirectionalLight position={[10, 10, 10]} intensity={1} />
      <T.PointLight position={[-10, -10, -10]} intensity={0.5} color="blue" />

      <!-- Render single space -->
      <SpaceBox id={space.slug} irariums={spaceIrariums} />
    </Canvas>
  </div>
{/if}
