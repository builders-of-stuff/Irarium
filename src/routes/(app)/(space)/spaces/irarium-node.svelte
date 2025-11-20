<script lang="ts">
  import { T } from '@threlte/core';
  import { Float, HTML } from '@threlte/extras';

  import { browser } from '$app/environment';
  import type { Irarium } from '$lib/shared/shared.type';
  import { countThoughts } from '$lib/irarium/irarium.tools.svelte';
  import { spaceStore } from '$lib/space/space.store.svelte';

  let { irarium } = $props<{ irarium: Irarium }>();

  let hovered = $state(false);
  let isActive = $derived(spaceStore.activeIrariumId === irarium.id);
  let mesh = $state<any>();
  let ignoreNextWindowClick = false;

  const position = irarium.position || [0, 0, 0];
  const color = $derived(hovered ? '#ff3e00' : '#ffffff');
  const scale = $derived(hovered ? 1.5 : 1);
  const thoughtCount = countThoughts(irarium);

  function handleClick(e: any) {
    console.log('handleClick');
    e.stopPropagation();

    if (isActive) {
      spaceStore.setActiveIrarium(null);
    } else {
      spaceStore.setActiveIrarium(irarium.id);
      ignoreNextWindowClick = true;
    }
  }

  function handleWindowClick() {
    if (ignoreNextWindowClick) {
      ignoreNextWindowClick = false;
      return;
    }
    if (isActive) {
      spaceStore.setActiveIrarium(null);
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

  function lineConnector(node: HTMLElement) {
    if (!browser) return;

    let frameId: number;
    const updateLine = () => {
      const rect = node.getBoundingClientRect();

      const svg = node.querySelector('svg');
      if (svg) {
        const line = svg.querySelector('line');
        if (line) {
          const x1 = rect.left;
          const y1 = rect.top;
          const x2 = window.innerWidth - 382;
          const y2 = 120;

          line.setAttribute('x1', x1.toString());
          line.setAttribute('y1', y1.toString());
          line.setAttribute('x2', x2.toString());
          line.setAttribute('y2', y2.toString());
        }
      }

      frameId = requestAnimationFrame(updateLine);
    };

    updateLine();

    return {
      destroy() {
        cancelAnimationFrame(frameId);
      }
    };
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
    {#if isActive}
      <HTML
        position={[0, 0, 0]}
        center
        distanceFactor={150}
        portal={browser ? document.body : undefined}
      >
        <!-- Anchor point at the node's position -->
        <div class="absolute top-0 left-0 h-0 w-0" use:lineConnector>
          <svg class="pointer-events-none fixed top-0 left-0 z-[999] h-full w-full">
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="0"
              stroke="white"
              stroke-width="1"
              stroke-opacity="0.2"
            />
            <circle cx="0" cy="0" r="2" fill="white" fill-opacity="0.5">
              <!-- Update circle position too if we want a dot at the node -->
            </circle>
          </svg>
        </div>
      </HTML>
    {/if}
  </Float>
</T.Group>

<svelte:window onclick={handleWindowClick} />
