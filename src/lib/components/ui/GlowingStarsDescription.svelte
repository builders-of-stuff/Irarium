<script lang="ts">
  import { cn } from '$lib/utils';

  export let className = '';
</script>

<p
  class={cn(
    'text-sm text-slate-400 [text-shadow:_0_0_30px_var(--glow-color)]',
    className
  )}
>
  <slot />
</p>
