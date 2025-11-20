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

  // Offset position to center in space box (coordinates are 0-100, box is -50 to +50)
  const rawPosition = irarium.position || [50, 50, 50];
  const position: [number, number, number] = [
    rawPosition[0] - 50,
    rawPosition[1] - 50,
    rawPosition[2] - 50
  ];
  const color = $derived(hovered || isActive ? '#ff3e00' : '#ffffff');
  const scale = $derived(hovered || isActive ? 1.5 : 1);
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

    <!-- Anchor for position tracking (logic only, no visual) -->
    {#if isActive}{/if}
  </Float>
</T.Group>

<svelte:window onclick={handleWindowClick} />
