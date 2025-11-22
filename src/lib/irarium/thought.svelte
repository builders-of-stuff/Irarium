<script lang="ts">
  import { Editor } from '@tiptap/core';
  import { Plus, Trash2 } from '@lucide/svelte';

  import { IrariumStore } from '$lib/irarium/irarium.store.svelte';
  import { Button } from '$lib/components/ui/button';
  import TextEditor from '$lib/text-editor/text-editor.svelte';

  let {
    content = $bindable(),
    id,
    position,
    irarium,
    enableUpdates = false
  }: {
    content: string;
    id: string;
    position: 'parent' | 'child' | 'sibling';
    irarium: IrariumStore;
    enableUpdates?: boolean;
  } = $props();

  let editor = $state<Editor>();
  let isActive = $derived(
    irarium.activeThoughtId === id ||
      (irarium.lastActiveThoughtId === id && !irarium.activeThoughtId)
  );
  let isEditing = $derived(isActive && irarium.isEditing);

  $effect(() => {});

  const handleSiblingLeftClick = () => {
    const leftSibling = irarium.getSiblingLeft(id);
    if (leftSibling) {
      irarium.setActiveThoughtId(leftSibling.id);
    }
  };

  const handleSiblingRightClick = () => {
    const rightSibling = irarium.getSiblingRight(id);
    if (rightSibling) {
      irarium.setActiveThoughtId(rightSibling.id);
    }
  };

  const handleThoughtClick = (event: MouseEvent) => {
    event.stopPropagation();
    irarium.setActiveThoughtId(id);
    irarium.setIsEditing(true);
    irarium.setIsAdding(false);
  };

  const handleAddPost = (event) => {
    event.stopPropagation();
    irarium.setIsAdding(true);
    irarium.setIsEditing(false);
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    irarium.deleteThought(id);
  };
</script>

<div class="relative w-full">
  <!-- Left sibling indicator -->
  {#if irarium.hasSiblingLeft(id)}
    <div
      class="absolute top-1/2 left-0 flex -translate-x-full -translate-y-1/2 items-center"
    >
      <div class="h-0.5 w-4 bg-muted-foreground/30"></div>
      <Button
        variant="outline"
        size="icon"
        class="h-6 w-6 rounded-full border border-muted-foreground/30 p-0 text-muted-foreground"
        aria-label="Navigate to left sibling"
        onclick={handleSiblingLeftClick}
      >
        <span>←</span>
      </Button>
    </div>
  {/if}

  <!-- Current thought -->
  <Button
    variant="ghost"
    class="h-auto w-full justify-start rounded-lg border border-white/40 !bg-card/60 px-4 py-2 backdrop-blur-sm transition-all hover:!bg-card/60 focus:!bg-card/60 active:!bg-card/60
          {isActive ? 'border-primary/60' : ''}"
    onclick={(event) => handleThoughtClick(event)}
    aria-current={isActive ? 'true' : 'false'}
  >
    <div class="prose w-full max-w-none text-left dark:prose-invert">
      <TextEditor bind:editor bind:content editable={isEditing} />

      {#if isActive && isEditing}
        <!-- Dividing line for actions -->
        <div class="mt-2 flex justify-between border-t border-muted-foreground/20 pt-2">
          <Button
            variant="ghost"
            size="icon"
            class="h-8 w-8 rounded-full text-muted-foreground/50 hover:bg-destructive/5 hover:text-destructive/50"
            aria-label="Delete thought"
            onclick={(event) => handleDelete(event)}
          >
            <Trash2 class="h-4 w-4" />
          </Button>

          <!-- Add Child Button (Bottom) -->
          {#if enableUpdates}
            <Button
              variant="ghost"
              size="icon"
              class="absolute -bottom-5 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full border border-muted-foreground/30 bg-background shadow-sm hover:bg-primary hover:text-primary-foreground"
              aria-label="Add child thought"
              onclick={(event) => {
                event.stopPropagation();
                irarium.addThought('', irarium.activeThought);
              }}
            >
              <Plus class="h-4 w-4" />
            </Button>
          {/if}
        </div>
      {/if}
    </div>

    {#if isActive && enableUpdates}
      {#if id !== irarium.id}
        <!-- Add Sibling Left Button -->
        <Button
          variant="ghost"
          size="icon"
          class="absolute -top-3 -left-3 h-6 w-6 rounded-full border border-muted-foreground/30 bg-background shadow-sm hover:bg-primary hover:text-primary-foreground"
          aria-label="Add sibling left"
          onclick={(event) => {
            event.stopPropagation();
            if (irarium.activeThought) {
              irarium.addSibling('', irarium.activeThought, 'left');
            }
          }}
        >
          <Plus class="h-4 w-4" />
        </Button>

        <!-- Add Sibling Right Button -->
        <Button
          variant="ghost"
          size="icon"
          class="absolute -top-3 -right-3 h-6 w-6 rounded-full border border-muted-foreground/30 bg-background shadow-sm hover:bg-primary hover:text-primary-foreground"
          aria-label="Add sibling right"
          onclick={(event) => {
            event.stopPropagation();
            if (irarium.activeThought) {
              irarium.addSibling('', irarium.activeThought, 'right');
            }
          }}
        >
          <Plus class="h-4 w-4" />
        </Button>
      {/if}
    {/if}
  </Button>

  <!-- Right sibling indicator -->
  {#if irarium.hasSiblingRight(id)}
    <div
      class="absolute top-1/2 right-0 flex translate-x-full -translate-y-1/2 items-center"
    >
      <Button
        variant="outline"
        size="icon"
        class="h-6 w-6 rounded-full border border-muted-foreground/30 p-0 text-muted-foreground"
        aria-label="Navigate to right sibling"
        onclick={handleSiblingRightClick}
      >
        <span>→</span>
      </Button>
      <div class="h-0.5 w-4 bg-muted-foreground/30"></div>
    </div>
  {/if}

  <!-- Connector line (based on position) -->
  {#if position === 'parent'}
    <div
      class="absolute bottom-0 left-1/2 h-6 w-0.5 -translate-x-1/2 translate-y-full bg-muted-foreground/30"
      aria-hidden="true"
    ></div>
  {:else if position === 'child'}
    <div
      class="absolute top-0 left-1/2 h-6 w-0.5 -translate-x-1/2 -translate-y-full bg-muted-foreground/30"
      aria-hidden="true"
    ></div>
  {/if}
  <!-- No connector for siblings as they're handled in the parent component -->
</div>
