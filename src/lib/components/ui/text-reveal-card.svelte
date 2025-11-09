<script lang="ts">
  import { cn } from '$lib/utils';

  export let text: string;
  export let revealText: string;
  export let className: string = '';

  let isHovered = false;
  let container: HTMLElement;

  function handleMouseEnter() {
    isHovered = true;
  }

  function handleMouseLeave() {
    isHovered = false;
  }
</script>

<div
  bind:this={container}
  class={cn(
    'group/card relative overflow-hidden rounded-lg border border-white/10 bg-slate-950 p-8',
    className
  )}
  role="button"
  tabindex="0"
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
>
  <div
    class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.1),transparent_60%)]"
    style="opacity: {isHovered ? 1 : 0}; transition: opacity 0.3s ease-in-out;"
  ></div>

  <div class="relative z-10 flex flex-col items-center justify-center space-y-4">
    <h3 class="text-center text-xl font-bold text-white">
      {revealText}
    </h3>
    <p class="text-center text-sm text-white/60">
      {text}
    </p>
  </div>
</div>
