<script lang="ts">
  import { T } from '@threlte/core';
  import { Float, HTML } from '@threlte/extras';
  import { goto } from '$app/navigation';
  import { X } from 'lucide-svelte';
  import type { Irarium } from '$lib/shared/shared.type';
  import { countThoughts } from '$lib/irarium/irarium.tools.svelte';

  let { irarium } = $props<{ irarium: Irarium }>();

  let hovered = $state(false);
  let showCard = $state(false);
  let mesh = $state<any>();

  const position = irarium.position || [0, 0, 0];
  const color = $derived(hovered ? '#ff3e00' : '#ffffff');
  const scale = $derived(hovered ? 1.5 : 1);
  const thoughtCount = countThoughts(irarium);

  function handleClick(e: any) {
    e.stopPropagation();
    showCard = !showCard;
  }

  function handleViewClick(e: any) {
    e.stopPropagation();
    goto(`/${irarium.id}`);
  }

  function handleCloseCard(e: any) {
    e.stopPropagation();
    showCard = false;
  }

  function handleCardClick(e: any) {
    // Prevent clicks inside the card from closing it
    e.stopPropagation();
  }

  function handleOverlayClick(e: any) {
    e.stopPropagation();
    showCard = false;
  }

  function handlePointerEnter(e: any) {
    e.stopPropagation();
    hovered = true;
    document.body.style.cursor = 'pointer';
  }

  function handlePointerLeave(e: any) {
    e.stopPropagation();
    hovered = false;
    document.body.style.cursor = 'default';
  }
</script>

<T.Group {position}>
  <Float speed={2} rotationIntensity={1} floatIntensity={2}>
    <!-- The Node Sphere -->
    <T.Mesh
      bind:ref={mesh}
      {scale}
      onpointerenter={handlePointerEnter}
      onpointerleave={handlePointerLeave}
      onclick={handleClick}
    >
      <T.SphereGeometry args={[1, 32, 32]} />
      <T.MeshStandardMaterial
        {color}
        emissive={color}
        emissiveIntensity={hovered ? 2 : 0.5}
        toneMapped={false}
      />
    </T.Mesh>

    <!-- Info Card (shown on click) -->
    {#if showCard}
      <HTML position={[0, 3, 0]} center>
        <!-- Clickable overlay to close card -->
        <div
          class="pointer-events-auto select-none"
          onclick={handleOverlayClick}
          role="button"
          tabindex="-1"
        >
          <!-- Info Card -->
          <div
            onclick={handleCardClick}
            class="relative max-w-[350px] min-w-[250px] rounded-lg border border-white/20 bg-black/95 p-4 shadow-xl backdrop-blur-sm"
            role="dialog"
          >
            <!-- Close button -->
            <button
              onclick={handleCloseCard}
              class="absolute top-2 right-2 rounded-full p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <h3 class="mb-2 pr-6 text-lg font-semibold text-white">
              {irarium.title || 'Untitled'}
            </h3>
            {#if irarium.description}
              <p class="mb-3 line-clamp-3 text-sm text-gray-300">
                {irarium.description}
              </p>
            {/if}
            <div class="mb-3 flex items-center gap-2 text-xs text-gray-400">
              <span>{thoughtCount} thought{thoughtCount !== 1 ? 's' : ''}</span>
            </div>
            <button
              onclick={handleViewClick}
              class="w-full rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-500"
            >
              View Irarium
            </button>
          </div>
        </div>
      </HTML>
    {/if}
  </Float>
</T.Group>
