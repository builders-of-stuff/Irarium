<script lang="ts">
  import { Trash2, ChevronDown, CornerDownRight } from '@lucide/svelte';
  import { Editor } from '@tiptap/core';
  import type { Thought } from '$lib/shared/shared.type';
  import { IrariumStore } from '$lib/irarium/irarium.store.svelte';
  import TextEditor from '$lib/text-editor/text-editor.svelte';

  let {
    node,
    irarium,
    depth,
    isRoot = false
  }: {
    node: Thought;
    irarium: IrariumStore;
    depth: number;
    isRoot?: boolean;
  } = $props();

  let editor: Editor | undefined = $state();
  let cardRef: HTMLDivElement | undefined = $state();
  let isHovered = $state(false);

  let isFocused = $derived(irarium.activeThoughtId === node.id);
  let isSelected = $derived(irarium.selectedThoughtId === node.id);
  let hasChildren = $derived(node.children && node.children.length > 0);
  let isExpanded = $derived(node.isExpanded ?? true);

  // Auto-focus and Auto-Center logic
  $effect(() => {
    if (isFocused) {
      if (editor && !editor.isFocused) {
        // Use setTimeout to ensure the key event that activated this node doesn't trigger the editor's key handler
        setTimeout(() => {
          editor?.commands.focus('end');
        }, 0);
      }
      // Clear selection when focused
      if (irarium.selectedThoughtId) {
        irarium.clearSelectedThoughtId();
      }
    } else {
      if (editor && editor.isFocused) {
        editor.commands.blur();
      }
    }

    if (isFocused || isSelected) {
      // Smooth scroll to center this node in viewport
      if (cardRef) {
        cardRef.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }
    }
  });

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isFocused) return false;

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      irarium.addThought('', node);
      return true;
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // If root, Tab adds a child (since it has no siblings in this view usually, or we treat it special)
      if (depth === 0) {
        irarium.addThought('', node);
      } else {
        irarium.addSibling('', node, 'right');
      }
      return true;
    } else if (
      e.key === 'Backspace' &&
      editor?.getText() === '' &&
      (!node.children || node.children.length === 0) &&
      depth > 0
    ) {
      e.preventDefault();
      irarium.deleteThought(node.id);
      return true;
    }
    return false;
  };

  const toggleExpand = (e: MouseEvent) => {
    e.stopPropagation();
    irarium.toggleExpand(node.id);
  };

  const handleAddChild = () => irarium.addThought('', node);
  const handleDelete = () => irarium.deleteThought(node.id);
  const handleFocus = () => {
    irarium.setActiveThoughtId(node.id);
    irarium.clearSelectedThoughtId();
  };
</script>

<div class="flex flex-col items-center">
  <!-- 1. The Node Card -->
  <div
    bind:this={cardRef}
    class="group relative z-10 flex shrink-0 flex-col transition-all duration-300 {hasChildren &&
    isExpanded
      ? 'mb-0'
      : 'mb-4'}"
    onmouseenter={() => (isHovered = true)}
    onmouseleave={() => (isHovered = false)}
    role="group"
  >
    <div
      class="relative flex shrink-0 flex-col rounded-xl
        border backdrop-blur-md transition-all duration-300 ease-in-out
        {isFocused
        ? 'bg-space-900 border-nebula-accent ring-nebula-accent/50 z-30 w-[90vw] scale-[1.02] shadow-[0_0_30px_rgba(99,102,241,0.2)] ring-1 md:w-[800px]'
        : isSelected
          ? 'bg-space-950/90 border-nebula-accent/70 ring-nebula-accent/30 z-20 w-[240px] scale-[1.01] shadow-[0_0_15px_rgba(99,102,241,0.1)] ring-1 md:w-[280px]'
          : 'bg-space-950/80 hover:bg-space-900/90 w-[240px] border-white/10 hover:border-white/20 hover:shadow-lg md:w-[280px]'}
      "
    >
      <div class="flex items-start gap-2 p-3">
        <!-- Content Input -->
        <div class="min-w-0 flex-1">
          <TextEditor
            bind:editor
            bind:content={node.content}
            editable={true}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            minHeight="20px"
            className={!isFocused ? 'line-clamp-3 overflow-hidden text-ellipsis' : ''}
          />

          <!-- Action Bar - Only visible on hover/focus -->
          <div
            class="mt-2 flex items-center justify-center gap-1 overflow-hidden border-t border-white/5
            pt-2 transition-all duration-200
            {isHovered || isFocused ? 'max-h-8 opacity-100' : 'max-h-0 opacity-0'}
          "
          >
            <button
              onclick={handleAddChild}
              class="rounded-md p-1 text-slate-400 transition-colors hover:bg-emerald-500/20 hover:text-emerald-400"
              title="Add Child"
            >
              <CornerDownRight size={12} />
            </button>

            {#if !isRoot}
              <button
                onclick={handleDelete}
                class="rounded-md p-1 text-slate-400 transition-colors hover:bg-rose-500/20 hover:text-rose-400"
                title="Delete"
              >
                <Trash2 size={12} />
              </button>
            {/if}

            {#if hasChildren}
              <button
                onclick={toggleExpand}
                class="rounded-md p-1 transition-colors {isExpanded
                  ? 'text-nebula-accent'
                  : 'text-slate-500'}"
              >
                <ChevronDown
                  size={12}
                  class="transform transition-transform {isExpanded
                    ? 'rotate-0'
                    : '-rotate-90'}"
                />
              </button>
            {/if}
          </div>
        </div>
      </div>
    </div>

    <!-- Connector Dot (Bottom of card) -->
    {#if hasChildren && isExpanded}
      <div
        class="ring-space-950 absolute -bottom-[5px] left-1/2 z-20 h-2 w-2 -translate-x-1/2 rounded-full bg-indigo-500/50 ring-2"
      ></div>
    {/if}
  </div>

  <!-- 2. Children Container (Horizontal Row) -->
  {#if hasChildren && isExpanded}
    <div class="animate-slide-up flex flex-col items-center">
      <!-- The Vertical Stem from Parent to Bus -->
      <div class="h-6 w-[2px] bg-white/10"></div>

      <!-- The Bus (Horizontal Line wrapper) -->
      <div class="relative flex flex-row gap-4 pt-0">
        <!-- The actual connector lines for children -->
        {#each node.children as child, index (child.id)}
          {@const isFirst = index === 0}
          {@const isLast = index === node.children.length - 1}
          {@const isOnly = node.children.length === 1}

          <div class="relative flex flex-col items-center">
            <!-- Top Connector Logic -->
            <!-- If it's not the only child, we need horizontal bars -->
            {#if !isOnly}
              <!-- Left Line (connects to center if right-side child) -->
              <div
                class="absolute top-0 left-0 h-[2px] bg-white/10 {isFirst
                  ? 'left-1/2 w-1/2'
                  : 'w-1/2'}"
              ></div>
              <!-- Right Line (connects to center if left-side child) -->
              <div
                class="absolute top-0 right-0 h-px bg-white/10 {isLast
                  ? 'right-1/2 w-1/2'
                  : 'w-1/2'}"
              ></div>
            {/if}

            <!-- Node Junction Point (Top of stem) -->
            <div
              class="absolute top-0 left-1/2 -mt-[3px] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white/20"
            ></div>

            <!-- Vertical Line Down to Child Card -->
            <div class="mb-2 h-4 w-[2px] bg-white/10"></div>

            <!-- Recursive render -->
            <svelte:self node={child} {irarium} depth={depth + 1} />
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
