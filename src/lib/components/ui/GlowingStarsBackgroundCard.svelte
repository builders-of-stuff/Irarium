<script lang="ts">
  import { cn } from '$lib/utils';

  export let className = '';
  export let containerClassName = '';

  let stars = Array.from({ length: 20 }).map(() => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 2 + 1}px`,
    animationDuration: `${Math.random() * 3 + 2}s`,
    animationDelay: `${Math.random() * 2}s`
  }));
</script>

<div
  class={cn(
    'relative h-full w-full overflow-hidden bg-slate-950 [--glow:0px_0px_70px_-5px_var(--glow-color)]',
    containerClassName
  )}
>
  <div
    class={cn(
      'relative z-10 h-full w-full rounded-[inherit] bg-slate-950/90 p-8',
      className
    )}
  >
    <slot />
  </div>
  <div class="absolute inset-0 h-full w-full">
    <div class="stars-container absolute inset-0 h-full w-full">
      {#each stars as star, i (i)}
        <div
          class="absolute z-0 h-[1px] w-[1px] rounded-full bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.3)] shadow-white/50"
          style="top: {star.top}; left: {star.left}; width: {star.size}; height: {star.size}; animation: glow {star.animationDuration} ease-in-out {star.animationDelay} infinite alternate;"
        />
      {/each}
    </div>
  </div>
</div>

<style>
  @keyframes glow {
    0% {
      opacity: 0.5;
      transform: scale(1);
    }
    100% {
      opacity: 1;
      transform: scale(1.5);
    }
  }
</style>
