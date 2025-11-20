<script lang="ts">
  import { Canvas } from '@threlte/core';
  import { OrbitControls } from '@threlte/extras';
  import { T } from '@threlte/core';
  import SpaceBox from './SpaceBox.svelte';
  import { irariumsStore } from '$lib/irarium/irariums.store.svelte';
  import { onMount } from 'svelte';

  // Group irariums by spaceId
  let groupedIrariums = $derived.by(() => {
    const groups: Record<string, typeof irariumsStore.publicIrariums> = {};
    for (const irarium of irariumsStore.publicIrariums) {
      const spaceId = irarium.spaceId || 'default-space';
      if (!groups[spaceId]) {
        groups[spaceId] = [];
      }
      groups[spaceId].push(irarium);
    }
    return groups;
  });

  onMount(() => {
    console.log('Space component mounted');
    irariumsStore.fetchPublicIrariums();
  });
</script>

<div class="h-full w-full bg-black">
  <Canvas>
    <T.PerspectiveCamera makeDefault position={[150, 150, 150]} fov={50}>
      <OrbitControls enableDamping autoRotate autoRotateSpeed={0.5} />
    </T.PerspectiveCamera>

    <T.AmbientLight intensity={0.5} />
    <T.DirectionalLight position={[10, 10, 10]} intensity={1} />
    <T.PointLight position={[-10, -10, -10]} intensity={0.5} color="blue" />

    <!-- Render Spaces -->
    {#each Object.entries(groupedIrariums) as [spaceId, irariums], i}
      <!-- Position spaces in a line for now -->
      <T.Group position={[i * 150, 0, 0]}>
        <SpaceBox id={spaceId} {irariums} />
      </T.Group>
    {/each}

    <!-- Starfield effect could be added here later -->
  </Canvas>
</div>
