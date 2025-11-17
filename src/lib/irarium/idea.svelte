<script lang="ts">
  import { Editor } from '@tiptap/core';
  import Plus from 'lucide-svelte/icons/plus';
  import Trash2 from 'lucide-svelte/icons/trash-2';

  import { IrariumStore } from '$lib/irarium/irarium.store.svelte';
  import { Button } from '$lib/components/ui/button';
  import TextEditor from '$lib/text-editor/text-editor.svelte';

  let {
    content = $bindable(),
    id,
    position,
    irarium
  }: {
    content: string;
    id: string;
    position: 'parent' | 'child' | 'sibling';
    irarium: IrariumStore;
  } = $props();

  let editor = $state<Editor>();
  let isActive = $derived(
    irarium.activeIdeaId === id ||
      (irarium.lastActiveIdeaId === id && !irarium.activeIdeaId)
  );
  let isEditing = $derived(isActive && irarium.isEditing);

  $effect(() => {});

  const handleSiblingLeftClick = () => {
    const leftSibling = irarium.getSiblingLeft(id);
    if (leftSibling) {
      irarium.setActiveIdeaId(leftSibling.id);
    }
  };

  const handleSiblingRightClick = () => {
    const rightSibling = irarium.getSiblingRight(id);
    if (rightSibling) {
      irarium.setActiveIdeaId(rightSibling.id);
    }
  };

  const handleIdeaClick = (event: MouseEvent) => {
    event.stopPropagation();
    irarium.setActiveIdeaId(id);
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
    irarium.deleteIdea(id);
  };
</script>

<div class="relative w-full">
  <!-- Left sibling indicator -->
  {#if irarium.hasSiblingLeft(id)}
    <div
      class="absolute top-1/2 left-0 flex -translate-x-full -translate-y-1/2 items-center"
    >
      <div class="bg-muted-foreground/30 h-0.5 w-4"></div>
      <Button
        variant="outline"
        size="icon"
        class="border-muted-foreground/30 text-muted-foreground h-6 w-6 rounded-full border p-0"
        aria-label="Navigate to left sibling"
        onclick={handleSiblingLeftClick}
      >
        <span>←</span>
      </Button>
    </div>
  {/if}

  <!-- Current idea -->
  <Button
    variant="ghost"
    class="!bg-card/60 hover:!bg-card/60 focus:!bg-card/60 active:!bg-card/60 backdrop-blur-sm h-auto w-full justify-start rounded-lg border border-white/40 px-4 py-2 transition-all
          {isActive ? 'border-primary/60' : ''}"
    onclick={(event) => handleIdeaClick(event)}
    aria-current={isActive ? 'true' : 'false'}
  >
    <div class="prose prose-lg dark:prose-invert max-w-none w-full text-left">
      <TextEditor bind:editor bind:content editable={isEditing} />

      {#if isActive && isEditing}
        <!-- Dividing line for actions -->
        <div class="border-muted-foreground/20 mt-2 flex justify-between border-t pt-2">
          <Button
            variant="ghost"
            size="icon"
            class="text-muted-foreground/50 hover:bg-destructive/5 hover:text-destructive/50 h-8 w-8 rounded-full"
            aria-label="Delete idea"
            onclick={(event) => handleDelete(event)}
          >
            <Trash2 class="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            class="hover:bg-primary/10 hover:text-primary h-8 w-8 rounded-full"
            aria-label="Add new post"
            onclick={(event) => handleAddPost(event)}
          >
            <Plus class="h-5 w-5" />
          </Button>
        </div>
      {/if}
    </div>
  </Button>

  <!-- Right sibling indicator -->
  {#if irarium.hasSiblingRight(id)}
    <div
      class="absolute top-1/2 right-0 flex translate-x-full -translate-y-1/2 items-center"
    >
      <Button
        variant="outline"
        size="icon"
        class="border-muted-foreground/30 text-muted-foreground h-6 w-6 rounded-full border p-0"
        aria-label="Navigate to right sibling"
        onclick={handleSiblingRightClick}
      >
        <span>→</span>
      </Button>
      <div class="bg-muted-foreground/30 h-0.5 w-4"></div>
    </div>
  {/if}

  <!-- Connector line (based on position) -->
  {#if position === 'parent'}
    <div
      class="bg-muted-foreground/30 absolute bottom-0 left-1/2 h-6 w-0.5 -translate-x-1/2 translate-y-full"
      aria-hidden="true"
    ></div>
  {:else if position === 'child'}
    <div
      class="bg-muted-foreground/30 absolute top-0 left-1/2 h-6 w-0.5 -translate-x-1/2 -translate-y-full"
      aria-hidden="true"
    ></div>
  {/if}
  <!-- No connector for siblings as they're handled in the parent component -->
</div>
