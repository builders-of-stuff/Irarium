<script lang="ts">
  import { cn } from '$lib/utils';
  import { onMount } from 'svelte';

  export let className = '';

  let mouseX = 0;
  let mouseY = 0;

  onMount(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  });
</script>

<div
  class={cn(
    'absolute inset-0 overflow-hidden [--glow-color:rgba(255,100,50,0.5)]',
    className
  )}
>
  <div
    class="pointer-events-none absolute -inset-[100%] opacity-50"
    style="background: radial-gradient(
      600px circle at {mouseX}px {mouseY}px,
      var(--glow-color) 20%,
      transparent 80%
    );"
  />
  <div
    class="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"
  ></div>
</div>
