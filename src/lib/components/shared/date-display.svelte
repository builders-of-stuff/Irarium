<script lang="ts">
  import { Calendar, Clock } from '@lucide/svelte';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { cn } from '$lib/utils';

  let {
    created,
    updated,
    class: className
  } = $props<{
    created: string;
    updated?: string;
    class?: string;
  }>();

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function formatDateTime(dateString: string) {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  }

  const isUpdated = $derived(updated && created !== updated);
</script>

<div class={cn('flex items-center gap-3 text-xs text-muted-foreground', className)}>
  {#if isUpdated}
    <Tooltip.Root>
      <Tooltip.Trigger
        class="flex cursor-help items-center gap-1 transition-colors hover:text-foreground"
      >
        <Clock size={12} />
        <span>{formatDate(updated)}</span>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <p>Updated: {formatDateTime(updated)}</p>
      </Tooltip.Content>
    </Tooltip.Root>
  {/if}

  <Tooltip.Root>
    <Tooltip.Trigger
      class="flex cursor-help items-center gap-1 transition-colors hover:text-foreground"
    >
      <Calendar size={12} />
      <span>{formatDate(created)}</span>
    </Tooltip.Trigger>
    <Tooltip.Content>
      <p>Created: {formatDateTime(created)}</p>
    </Tooltip.Content>
  </Tooltip.Root>
</div>
