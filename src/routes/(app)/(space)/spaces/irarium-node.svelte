<script lang="ts">
  import { T } from '@threlte/core';
  import { Float, HTML } from '@threlte/extras';

  import { browser } from '$app/environment';
  import { DEFAULT_POSITION } from '$lib/shared/space.constants';
  import type { Irarium } from '$lib/shared/shared.type';
  import { countThoughts } from '$lib/irarium/irarium.tools.svelte';
  import { spaceStore } from '$lib/space/space.store.svelte';

  let { irarium, isDimmed = false } = $props<{
    irarium: Irarium;
    isDimmed?: boolean;
  }>();

  let hovered = $state(false);
  let isActive = $derived(spaceStore.activeIrariumId === irarium.id);
  let mesh = $state<any>();
  let ignoreNextWindowClick = false;

  // Position is now centered at 0,0,0 with range -50 to 50
  const position = irarium.position || DEFAULT_POSITION;

  // Color logic:
  // - Active/Hovered: Orange
  // - Dimmed: Dark Gray
  // - Normal: White
  const color = $derived(
    hovered || isActive ? '#ff3e00' : isDimmed ? '#333333' : '#ffffff'
  );

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
        emissiveIntensity={hovered || isActive ? 2 : isDimmed ? 0.1 : 0.5}
        toneMapped={false}
        transparent
        opacity={isDimmed ? 0.3 : 1}
      />
    </T.Mesh>

    <!-- Anchor for position tracking (logic only, no visual) -->
    {#if isActive}{/if}
  </Float>
</T.Group>

<svelte:window onclick={handleWindowClick} />
