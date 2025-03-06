<script lang="ts">
  import type { IrariumStore } from '$lib/irarium/irarium.store.svelte';

  let {
    content,
    id,
    position,
    irarium
  }: {
    content: string;
    id: string;
    position: 'parent' | 'child' | 'sibling';
    irarium: IrariumStore;
  } = $props();
</script>

<div class="relative w-full">
  <!-- Left sibling indicator -->
  {#if irarium.hasSiblingLeft(id)}
    <div class=" left-0 top-1/2 flex -translate-x-12 -translate-y-1/2 items-center">
      <div class="h-0.5 w-8 bg-muted-foreground/30"></div>
      <div
        class="flex h-8 w-8 items-center justify-center rounded-full border border-muted-foreground/30 text-muted-foreground"
      >
        <span>←</span>
      </div>
    </div>
  {/if}

  <!-- Current idea -->
  <div
    class="w-full rounded-lg border bg-card p-4 transition-all
              {irarium.activeIdeaId === id ? 'border-primary' : ''}"
  >
    <div class="prose prose-sm dark:prose-invert whitespace-pre-wrap">
      {content}
    </div>
  </div>

  <!-- Right sibling indicator -->
  {#if irarium.hasSiblingRight(id)}
    <div class=" right-0 top-1/2 flex -translate-y-1/2 translate-x-12 items-center">
      <div
        class="flex h-8 w-8 items-center justify-center rounded-full border border-muted-foreground/30 text-muted-foreground"
      >
        <span>→</span>
      </div>
      <div class="h-0.5 w-8 bg-muted-foreground/30"></div>
    </div>
  {/if}

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
