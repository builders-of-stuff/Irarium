<script lang="ts">
  import { T } from '@threlte/core';
  import { Text, interactivity } from '@threlte/extras';
  import type { Irarium } from '$lib/shared/shared.type';
  import IrariumNode from './irarium-node.svelte';

  // Enable interactivity for this scene
  interactivity();

  let { id, irariums } = $props<{ id: string; irariums: Irarium[] }>();

  // Space size
  const size = 100;
</script>

<T.Group>
  <!-- Space Wireframe -->
  <T.Mesh>
    <T.BoxGeometry args={[size, size, size]} />
    <T.MeshBasicMaterial color="#444" wireframe />
  </T.Mesh>

  <!-- Space Label -->
  <Text
    text={id.toUpperCase()}
    position={[0, size / 2 + 5, 0]}
    fontSize={4}
    color="#888"
    anchorX="center"
    anchorY="bottom"
  />

  <!-- Irarium Nodes inside the container -->
  {#each irariums as irarium (irarium.id)}
    <IrariumNode {irarium} />
  {/each}
</T.Group>
