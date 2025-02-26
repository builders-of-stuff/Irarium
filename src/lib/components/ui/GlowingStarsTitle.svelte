<script lang="ts">
  import { cn } from '$lib/utils';

  export let className = '';
</script>

<h1
  class={cn(
    'text-2xl font-bold text-white [text-shadow:_0_0_30px_var(--glow-color)]',
    className
  )}
>
  <slot />
</h1>
