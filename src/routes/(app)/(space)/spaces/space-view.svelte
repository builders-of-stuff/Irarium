<script lang="ts">
  import { Canvas } from '@threlte/core';
  import { OrbitControls } from '@threlte/extras';
  import { T } from '@threlte/core';
  import { Pause, Play, Settings, X } from '@lucide/svelte';
  import SpaceBox from './space-box.svelte';
  import Starfield from '$lib/components/starfield.svelte';
  import { irariumsStore } from '$lib/irarium/irariums.store.svelte';
  import { spaceStore } from '$lib/space/space.store.svelte';
  import { pb } from '$lib/db/client';
  import { COLLECTION, type Space } from '$lib/shared/shared.type';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { countThoughts } from '$lib/irarium/irarium.tools.svelte';
  import { authStore } from '$lib/auth/auth.store.svelte';
  import DateDisplay from '$lib/components/shared/date-display.svelte';

  import UserNavbar from '$lib/shared/user-navbar.svelte';
  import { Button } from '$lib/components/ui/button';

  let { slug } = $props<{ slug: string }>();

  let space = $state<Space | null>(null);
  let isLoading = $state(true);
  let error = $state<string | null>(null);

  // Filter irariums by this space's ID
  let spaceIrariums = $derived.by(() => {
    const spaceId = space?.id;
    if (!spaceId) return [];
    const filtered = irariumsStore.publicIrariums.filter(
      (irarium) => irarium.spaceId === spaceId
    );
    return filtered;
  });

  let activeIrariums = $derived.by(() => {
    if (!spaceStore.activeIrariumId) return [];
    const primary = spaceIrariums.find((i) => i.id === spaceStore.activeIrariumId);
    if (!primary) return [];

    // Find all irariums with the same position
    return spaceIrariums.filter((i) => {
      const posA = primary.position || [0, 0, 0];
      const posB = i.position || [0, 0, 0];
      return posA.toString() === posB.toString();
    });
  });

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
      // Extract ID from slug (format: slug-id)
      const parts = slug.split('-');
      const id = parts[parts.length - 1];

      // Fetch the space by ID
      const record = await pb.collection(COLLECTION.SPACES).getOne(id);

      if (record) {
        space = {
          id: record.id,
          name: record.name,
          description: record.description,
          slug: record.slug,
          tags: record.tags,
          type: record.type,
          createdBy: record.createdBy,
          mods: record.mods,
          isPublic: record.isPublic,
          created: record.created
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

{#snippet actions()}
  {#if space}
    {#if space.createdBy === authStore.userId}
      <a
        href={`/spaces/${space.slug}-${space.id}/settings`}
        class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
        title="Settings"
      >
        <Settings size={16} />
      </a>
    {/if}

    <Button
      variant="outline"
      size="icon"
      onclick={() =>
        spaceStore.setActiveIrarium(spaceStore.isAutoRotateEnabled ? 'paused' : null)}
      title={spaceStore.isAutoRotateEnabled ? 'Pause Rotation' : 'Play Rotation'}
    >
      {#if spaceStore.isAutoRotateEnabled}
        <Pause size={16} />
      {:else}
        <Play size={16} />
      {/if}
    </Button>
  {/if}
{/snippet}

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
    <UserNavbar title={space.name} {actions} />

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

    <!-- Info Cards (Fixed Position) -->
    {#if activeIrariums.length > 0}
      <div
        class="pointer-events-auto fixed top-24 right-8 z-[1000] flex flex-col gap-4 select-none"
      >
        {#each activeIrariums as irarium (irarium.id)}
          {@const thoughtCount = countThoughts(irarium)}
          <div
            onkeydown={handleCardKeydown}
            onclick={(e) => e.stopPropagation()}
            class="info-card relative w-[350px] rounded-lg border border-white/20 bg-black/95 p-4 shadow-xl backdrop-blur-sm"
            role="dialog"
            tabindex="-1"
          >
            <!-- Close button (only on first card to close all) -->
            {#if irarium === activeIrariums[0]}
              <button
                onclick={handleCloseCard}
                class="absolute top-2 right-2 rounded-full p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close"
                type="button"
              >
                <X size={16} />
              </button>
            {/if}

            <h3 class="mb-2 pr-6 text-lg font-semibold text-white">
              {irarium.title || 'Untitled'}
            </h3>
            {#if irarium.description}
              <p class="mb-3 line-clamp-3 text-sm text-gray-300">
                {irarium.description}
              </p>
            {/if}
            <div class="mb-3 flex flex-col gap-1 text-xs text-gray-400">
              <span>{thoughtCount} thought{thoughtCount !== 1 ? 's' : ''}</span>
              <DateDisplay
                created={irarium.created}
                updated={irarium.updated}
                class="flex-col items-start gap-1 text-gray-400"
              />
              {#if irarium.username}
                <a
                  href={`/user/${irarium.username}`}
                  class="hover:text-white hover:underline"
                  onclick={(e) => e.stopPropagation()}
                >
                  @{irarium.username}
                </a>
              {/if}
            </div>
            <a
              href={`/${irarium.id}`}
              onclick={(e) => {
                e.preventDefault();
                goto(`/${irarium.id}`);
              }}
              class="block w-full rounded-md bg-orange-600 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-orange-500"
            >
              View
            </a>
          </div>
        {/each}
      </div>
    {/if}
  </div>
{/if}
