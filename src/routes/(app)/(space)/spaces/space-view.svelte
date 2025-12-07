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
  import { DEFAULT_SPACE_SIZE } from '$lib/shared/space.constants';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { countThoughts } from '$lib/irarium/irarium.tools.svelte';
  import { authStore } from '$lib/auth/auth.store.svelte';
  import DateDisplay from '$lib/components/shared/date-display.svelte';
  import { toast } from 'svelte-sonner';

  import UserNavbar from '$lib/shared/user-navbar.svelte';
  import { Button } from '$lib/components/ui/button';
  import SpaceSettingsModal from '$lib/components/space/space-settings-modal.svelte';

  let { slug } = $props<{ slug: string }>();

  let space = $state<Space | null>(null);
  let isLoading = $state(true);
  let error = $state<string | null>(null);
  let isSettingsOpen = $state(false);

  let searchQuery = $state('');

  // Filter irariums by this space's ID
  let spaceIrariums = $derived.by(() => {
    const spaceId = space?.id;
    if (!spaceId) return [];
    const filtered = irariumsStore.publicIrariums.filter(
      (irarium) => irarium.spaceId === spaceId
    );
    return filtered;
  });

  // Filter by search query
  let filteredIrariums = $derived.by(() => {
    if (!searchQuery.trim()) return spaceIrariums;

    const query = searchQuery.toLowerCase();
    return spaceIrariums.filter((irarium) => {
      const title = (irarium.title || '').toLowerCase();
      const description = (irarium.description || '').toLowerCase();
      const username = (irarium.username || '').toLowerCase();
      const content = (irarium.content || '').toLowerCase();

      return (
        title.includes(query) ||
        description.includes(query) ||
        username.includes(query) ||
        content.includes(query)
      );
    });
  });

  let filteredIds = $derived(new Set(filteredIrariums.map((i) => i.id)));

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
          isShared: record.isShared,
          created: record.created,
          size: record.size
        };
      } else {
        error = 'Space not found';
      }

      // Fetch public irariums
      // Fetch all public irariums for this space
      await irariumsStore.fetchAllIrariumsForSpace(record.id);
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
      <Button
        variant="outline"
        size="icon"
        onclick={() => (isSettingsOpen = true)}
        title="Settings"
      >
        <Settings size={16} />
      </Button>
    {/if}

    {#if authStore.userSettings?.hasAnsible && space?.createdBy !== authStore.userId}
      {@const isSubscribed = authStore.userSettings?.subscribedSpaces?.includes(
        space?.id || ''
      )}
      <Button
        variant={isSubscribed ? 'secondary' : 'outline'}
        size="sm"
        onclick={async () => {
          const result = await authStore.toggleSpaceSubscription(space.id);
          if (result?.success) {
            if (result.isSubscribed) {
              toast.success('Subscribed to space');
            } else {
              toast.success('Unsubscribed from space');
            }
          } else {
            toast.error('Failed to update subscription');
          }
        }}
        title={isSubscribed ? 'Unsubscribe from Space' : 'Subscribe to Space'}
      >
        {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
      </Button>
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

{#snippet search()}
  <div class="relative w-full max-w-md">
    <div class="relative">
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search irariums..."
        class="w-full rounded-full border border-white/10 bg-white/5 px-4 py-1.5 pl-9 text-sm text-white transition-all placeholder:text-muted-foreground focus:border-orange-500/50 focus:bg-white/10 focus:ring-1 focus:ring-orange-500/50 focus:outline-none"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    </div>
    {#if searchQuery}
      <div
        class="absolute top-full left-0 mt-1 w-full text-center text-xs text-muted-foreground"
      >
        {filteredIrariums.length} irariums found
      </div>
    {/if}
  </div>
{/snippet}

{#snippet customBadge()}
  <div class="flex items-center gap-2">
    <div
      class="flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 px-3 py-1.5 text-sm font-medium text-blue-300 transition-all duration-200 hover:border-blue-500/50 hover:from-blue-500/30 hover:to-cyan-500/30"
      title="Space Size"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M3 21l18 0"></path><path d="M3 10l18 0"></path><path d="M5 6l7 -3l7 3"
        ></path><path d="M4 10l0 11"></path><path d="M20 10l0 11"></path><path
          d="M8 14l0 3"
        ></path><path d="M12 14l0 3"></path><path d="M16 14l0 3"></path>
      </svg>
      <span>Size: {space?.size || DEFAULT_SPACE_SIZE}</span>
    </div>

    <div
      class="flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-3 py-1.5 text-sm font-medium text-purple-300 transition-all duration-200 hover:border-purple-500/50 hover:from-purple-500/30 hover:to-pink-500/30"
      title="Irarium Count"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
      <span>{spaceIrariums.length}</span>
    </div>

    {#if space?.isShared}
      <div
        class="flex items-center gap-1.5 rounded-full border border-green-500/30 bg-gradient-to-r from-green-500/20 to-emerald-500/20 px-3 py-1.5 text-sm font-medium text-green-300 transition-all duration-200 hover:border-green-500/50 hover:from-green-500/30 hover:to-emerald-500/30"
        title="Shared Space - Anyone can publish here"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        <span>Shared</span>
      </div>
    {/if}
  </div>
{/snippet}

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
    <UserNavbar title={space.name} {actions} {customBadge} {search} />

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
      <SpaceBox id={space.slug} irariums={spaceIrariums} {space} {filteredIds} />
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

    <SpaceSettingsModal bind:open={isSettingsOpen} bind:space />
  </div>
{/if}
