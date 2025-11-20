<script lang="ts">
  import { Canvas } from '@threlte/core';
  import { OrbitControls } from '@threlte/extras';
  import { T } from '@threlte/core';
  import { Pause, Play } from 'lucide-svelte';
  import SpaceBox from './space-box.svelte';
  import Starfield from '$lib/components/starfield.svelte';
  import { irariumsStore } from '$lib/irarium/irariums.store.svelte';
  import { spaceStore } from '$lib/space/space.store.svelte';
  import { pb } from '$lib/db/client';
  import { COLLECTION, type Space } from '$lib/shared/shared.type';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { X } from 'lucide-svelte';
  import { countThoughts } from '$lib/irarium/irarium.tools.svelte';

  let { slug } = $props<{ slug: string }>();

  let space = $state<Space | null>(null);
  let isLoading = $state(true);
  let error = $state<string | null>(null);

  // Filter irariums by this space's ID
  let spaceIrariums = $derived.by(() => {
    const spaceId = space?.id;
    if (!spaceId) return [];
    return irariumsStore.publicIrariums.filter(
      (irarium) => irarium.spaceId === spaceId
    );
  });

  let activeIrarium = $derived.by(() => {
    if (!spaceStore.activeIrariumId) return null;
    return spaceIrariums.find((i) => i.id === spaceStore.activeIrariumId);
  });

  let activeThoughtCount = $derived(activeIrarium ? countThoughts(activeIrarium) : 0);

  function handleCloseCard(e: MouseEvent) {
    e.stopPropagation();
    spaceStore.setActiveIrarium(null);
  }

  function handleCardKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      spaceStore.setActiveIrarium(null);
    }
  }

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
          slug: spaces.items[0].slug,
          tags: spaces.items[0].tags,
          type: spaces.items[0].type,
          createdBy: spaces.items[0].createdBy,
          mods: spaces.items[0].mods
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
      onclick={() =>
        spaceStore.setActiveIrarium(spaceStore.isAutoRotateEnabled ? 'paused' : null)}
      class="absolute top-4 right-4 z-10 rounded-full bg-black/50 p-3 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
    >
      {#if spaceStore.isAutoRotateEnabled}
        <Pause size={20} />
      {:else}
        <Play size={20} />
      {/if}
    </button>

    <Canvas>
      <T.PerspectiveCamera makeDefault position={[150, 150, 150]} fov={50}>
        <OrbitControls
          enableDamping
          autoRotate={spaceStore.isAutoRotateEnabled}
          autoRotateSpeed={0.5}
        />
      </T.PerspectiveCamera>

      <T.AmbientLight intensity={0.5} />
      <T.DirectionalLight position={[10, 10, 10]} intensity={1} />
      <T.PointLight position={[-10, -10, -10]} intensity={0.5} color="blue" />

      <!-- Render single space -->
      <SpaceBox id={space.slug} irariums={spaceIrariums} />
    </Canvas>

    <!-- Info Card (Fixed Position) -->
    {#if activeIrarium}
      <div
        onkeydown={handleCardKeydown}
        class="info-card pointer-events-auto fixed top-24 right-8 z-[1000] w-[350px] rounded-lg border border-white/20 bg-black/95 p-4 shadow-xl backdrop-blur-sm select-none"
        role="dialog"
        tabindex="-1"
      >
        <!-- Close button -->
        <button
          onclick={handleCloseCard}
          class="absolute top-2 right-2 rounded-full p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Close"
          type="button"
        >
          <X size={16} />
        </button>

        <h3 class="mb-2 pr-6 text-lg font-semibold text-white">
          {activeIrarium.title || 'Untitled'}
        </h3>
        {#if activeIrarium.description}
          <p class="mb-3 line-clamp-3 text-sm text-gray-300">
            {activeIrarium.description}
          </p>
        {/if}
        <div class="mb-3 flex items-center gap-2 text-xs text-gray-400">
          <span>{activeThoughtCount} thought{activeThoughtCount !== 1 ? 's' : ''}</span>
        </div>
        <a
          href={`/${activeIrarium.id}`}
          onclick={(e) => {
            e.preventDefault();
            goto(`/${activeIrarium.id}`);
          }}
          class="block w-full rounded-md bg-orange-600 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-orange-500"
        >
          View
        </a>
      </div>
    {/if}
  </div>
{/if}
