<script lang="ts">
  import { T } from '@threlte/core';
  import { Float, HTML } from '@threlte/extras';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { X } from 'lucide-svelte';
  import type { Irarium } from '$lib/shared/shared.type';
  import { countThoughts } from '$lib/irarium/irarium.tools.svelte';

  let { irarium } = $props<{ irarium: Irarium }>();

  let hovered = $state(false);
  let showCard = $state(false);
  let mesh = $state<any>();
  let ignoreNextWindowClick = false;

  const position = irarium.position || [0, 0, 0];
  const color = $derived(hovered ? '#ff3e00' : '#ffffff');
  const scale = $derived(hovered ? 1.5 : 1);
  const thoughtCount = countThoughts(irarium);

  function handleClick(e: any) {
    console.log('handleClick');
    e.stopPropagation();
    showCard = !showCard;
    if (showCard) {
      ignoreNextWindowClick = true;
    }
  }

  function handleWindowClick() {
    if (ignoreNextWindowClick) {
      ignoreNextWindowClick = false;
      return;
    }
    if (showCard) {
      showCard = false;
    }
  }

  function handleCloseCard(e: MouseEvent) {
    console.log('Close button clicked');
    e.stopPropagation();
    showCard = false;
  }

  function handleCardClick(e: MouseEvent) {
    console.log('Card clicked');
    // Prevent clicks inside the card from closing it
    e.stopPropagation();
  }

  function handleCardKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      showCard = false;
    }
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
      <HTML
        position={[0, 3, 0]}
        center
        distanceFactor={150}
        portal={browser ? document.body : undefined}
      >
        <!-- Card content positioned above sphere -->
        <div
          onkeydown={handleCardKeydown}
          onclick={handleCardClick}
          onpointerdown={(e) => {
            console.log('Card pointerdown');
            e.stopPropagation();
          }}
          onpointerup={(e) => {
            console.log('Card pointerup');
            e.stopPropagation();
          }}
          class="info-card pointer-events-auto relative z-[1000] max-w-[350px] min-w-[250px] rounded-lg border border-white/20 bg-black/95 p-4 shadow-xl backdrop-blur-sm select-none"
          role="dialog"
          tabindex="-1"
        >
          <!-- Close button -->
          <button
            onclick={handleCloseCard}
            onpointerdown={(e) => e.stopPropagation()}
            class="absolute top-2 right-2 rounded-full p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close"
            type="button"
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
          <a
            href={`/${irarium.id}`}
            onclick={(e) => {
              console.log('View clicked');
              e.preventDefault();
              e.stopPropagation();
              goto(`/${irarium.id}`);
            }}
            onpointerdown={(e) => e.stopPropagation()}
            class="block w-full rounded-md bg-orange-600 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-orange-500"
          >
            View
          </a>
        </div>
      </HTML>
    {/if}
  </Float>
</T.Group>

<svelte:window onclick={handleWindowClick} />
