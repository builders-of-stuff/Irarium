<script lang="ts">
  import { cn } from '$lib/utils';
  import { onMount } from 'svelte';

  export let duration: number = 2000;
  export let rx: string = '0px';
  export let ry: string = '0px';
  export let className: string = '';
  export let containerClassName: string = '';
  export let pathClassName: string = '';

  let pathLength = 0;
  let isHovered = false;
  let path: SVGPathElement;

  onMount(() => {
    if (path) {
      pathLength = path.getTotalLength();
    }
  });

  function handleMouseEnter() {
    isHovered = true;
  }

  function handleMouseLeave() {
    isHovered = false;
  }
</script>

<div
  class={cn('relative', containerClassName)}
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
>
  <svg
    class={cn('absolute h-full w-full', className)}
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      bind:this={path}
      d="M 0,0 L 100,0 L 100,100 L 0,100 Z"
      {rx}
      {ry}
      stroke="url(#gradient)"
      stroke-width="2"
      class={cn('transition-all duration-300', pathClassName)}
      style="stroke-dasharray: {pathLength}; stroke-dashoffset: {isHovered
        ? 0
        : pathLength}; animation: move-border {duration}ms linear infinite;"
    />
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FF4D4D" />
        <stop offset="100%" stop-color="#F9CB28" />
      </linearGradient>
    </defs>
  </svg>
  <slot />
</div>

<style>
  @keyframes move-border {
    0% {
      stroke-dashoffset: 0;
    }
    100% {
      stroke-dashoffset: 300;
    }
  }
</style>
