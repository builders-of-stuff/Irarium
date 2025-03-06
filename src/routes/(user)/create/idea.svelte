<script lang="ts">
  let {
    content,
    id,
    activeIdeaId,
    position
  }: {
    content: string;
    id: string;
    activeIdeaId: string | null;
    position: 'parent' | 'child' | 'sibling';
  } = $props();
</script>

<div class="relative w-full">
  <!-- Current idea -->
  <div
    class="w-full rounded-lg border bg-card p-4 transition-all
              {activeIdeaId === id ? 'border-primary' : ''}"
  >
    <div class="prose prose-sm dark:prose-invert whitespace-pre-wrap">
      {content}
    </div>
  </div>

  <!-- Connector line (based on position) -->
  {#if position === 'parent'}
    <div
      class="absolute bottom-0 left-1/2 h-8 w-0.5 -translate-x-1/2 bg-muted-foreground/30"
    ></div>
  {:else if position === 'child'}
    <div
      class="absolute left-1/2 top-0 h-8 w-0.5 -translate-x-1/2 bg-muted-foreground/30"
    ></div>
  {/if}
  <!-- No connector for siblings as they're handled in the parent component -->
</div>
