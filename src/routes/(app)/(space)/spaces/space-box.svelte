<script lang="ts">
  import { T } from '@threlte/core';
  import { Text, interactivity } from '@threlte/extras';
  import * as THREE from 'three';
  import { DEFAULT_SPACE_SIZE } from '$lib/shared/space.constants';
  import type { Irarium, Space } from '$lib/shared/shared.type';
  import IrariumNode from './irarium-node.svelte';

  // Enable interactivity for this scene
  interactivity();

  let { id, irariums, space, filteredIds } = $props<{
    id: string;
    irariums: Irarium[];
    space?: Space;
    filteredIds?: Set<string>;
  }>();

  // Space size (radius)
  const radius = space?.size || DEFAULT_SPACE_SIZE;
</script>

<T.Group>
  <!-- Space Wireframe -->
  <!-- Space Wireframe (Edges Only) -->
  <T.LineSegments>
    <T.EdgesGeometry args={[new THREE.SphereGeometry(radius, 64, 64)]} />
    <T.LineBasicMaterial color="#444" />
  </T.LineSegments>

  <!-- Space Label -->
  <Text
    text={id.toUpperCase()}
    position={[0, radius + 5, 0]}
    fontSize={4}
    color="#888"
    anchorX="center"
    anchorY="bottom"
  />

  <!-- Irarium Nodes inside the container -->
  {#each irariums as irarium (irarium.id)}
    <IrariumNode
      {irarium}
      isDimmed={filteredIds ? !filteredIds.has(irarium.id) : false}
    />
  {/each}
</T.Group>
