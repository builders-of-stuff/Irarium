<script lang="ts">
  import NodeItem from './node-item.svelte';
  import { IrariumStore } from './irarium.store.svelte';
  import type { Thought } from '$lib/shared/shared.type';

  let {
    irarium = $bindable(),
    enableUpdates = false
  }: {
    irarium: IrariumStore;
    enableUpdates?: boolean;
  } = $props();

  // Cast irarium to Thought-like structure for the root node
  let rootNode = $derived({
    id: irarium.id,
    content: irarium.content,
    children: irarium.children,
    depth: 0,
    isExpanded: true, // Root is always expanded
    created: irarium.created,
    updated: irarium.updated,
    parentId: undefined
  } as Thought);

  // Sync changes from rootNode back to irarium (specifically content)
  // Since NodeItem binds to node.content, and rootNode is derived, we need to handle updates.
  // Actually, NodeItem binds to `node.content`. If `rootNode` is a derived object, binding might not propagate back to `irarium.content`.
  // We should probably pass `irarium` directly if possible or handle root specially.
  // Let's try to pass a proxy or just handle the root update manually if needed.
  // But wait, `irarium` is a class instance (store).
  // If I pass `irarium` as `node`, it might work if I cast it.

  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear everything?')) {
      irarium.clearStore();
      irarium.content = 'Core Concept'; // Set default content
      irarium.children = [];
    }
  };

  const handleGlobalKeyDown = (e: KeyboardEvent) => {
    // If we are editing (activeThoughtId is set), let the editor handle keys
    // UNLESS we want to trap Escape to exit edit mode
    if (irarium.activeThoughtId) {
      if (e.key === 'Escape') {
        // Allow Escape to close focused node even without edit permissions
        irarium.clearActiveThoughtId();
        // Optionally select the thought we just exited
        if (irarium.lastActiveThoughtId) {
          irarium.setSelectedThoughtId(irarium.lastActiveThoughtId);
        }
      }
      return;
    }

    // Navigation keys when not editing
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        irarium.navigate('up');
        break;
      case 'ArrowDown':
        e.preventDefault();
        irarium.navigate('down');
        break;
      case 'ArrowLeft':
        e.preventDefault();
        irarium.navigate('left');
        break;
      case 'ArrowRight':
        e.preventDefault();
        irarium.navigate('right');
        break;
      case 'Enter':
        if (irarium.selectedThoughtId) {
          e.preventDefault();
          irarium.setActiveThoughtId(irarium.selectedThoughtId);
          irarium.clearSelectedThoughtId();
        }
        break;
    }
  };
</script>

<svelte:window onkeydown={handleGlobalKeyDown} />

<div
  class="selection:bg-nebula-accent/30 relative flex h-full w-full flex-col overflow-hidden font-sans text-slate-200 selection:text-white"
>
  <!-- Main Canvas Area - Infinite Horizontal & Vertical Scroll -->
  <main class="relative flex-1 overflow-auto scroll-smooth" role="presentation">
    <div class="flex min-h-full min-w-max flex-col items-center p-8">
      <!-- Root Render -->
      <div class="animate-slide-up pb-40">
        <!-- 
            We pass the irarium object itself as the root node. 
            We need to ensure it satisfies the Thought interface or at least the parts NodeItem uses.
            NodeItem uses: id, content, children, isExpanded.
            Irarium has: id, content, children.
            We need to make sure `isExpanded` exists or is handled.
            Irarium doesn't have `isExpanded`.
            We can add a getter/setter for `isExpanded` to IrariumStore or just treat root as always expanded in NodeItem.
            NodeItem has `isRoot` prop.
         -->
        <NodeItem
          node={irarium as unknown as Thought}
          {irarium}
          depth={0}
          isRoot={true}
          {enableUpdates}
        />
      </div>
    </div>
  </main>

  <!-- Floating Shortcuts Hint -->
  <div
    class="bg-space-950/50 pointer-events-none fixed bottom-6 left-6 z-40 rounded-lg border border-white/5 px-3 py-2 font-mono text-xs text-slate-600 backdrop-blur select-none"
  >
    TAB: sibling • ENTER: child • DEL: remove
  </div>

  <!-- AI Processing Indicator (Global) -->
  <!-- We can add this if we have a global isGenerating state in store -->
</div>
