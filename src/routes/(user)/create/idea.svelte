<script lang="ts">
  import { Editor } from '@tiptap/core';
  import { tick } from 'svelte';
  import Plus from 'lucide-svelte/icons/plus';

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
    irarium.activeIdeaId === id || (irarium.activeIdeaId === '' && id === '')
  );
  let isEditable = $derived(isActive && irarium.isEditing);

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

  const handleIdeaClick = () => {
    irarium.setActiveIdeaId(id);
    irarium.setIsEditing(true);

    tick().then(() => {
      if (editor) {
        editor.commands.focus('end');
      }
    });
  };

  const handleAddPost = (event) => {
    event.stopPropagation();
    irarium.setIsEditing(false);
  };
</script>

<div class="relative w-full">
  <!-- Left sibling indicator -->
  {#if irarium.hasSiblingLeft(id)}
    <div
      class="absolute left-0 top-1/2 flex -translate-x-full -translate-y-1/2 items-center"
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

  <!-- Current idea -->
  <Button
    variant="ghost"
    class="h-auto w-full justify-start rounded-lg border bg-card p-4 transition-all
          {isActive ? 'border-primary' : ''}"
    onclick={handleIdeaClick}
    aria-current={isActive ? 'true' : 'false'}
  >
    <div class="prose prose-sm dark:prose-invert w-full whitespace-pre-wrap">
      <TextEditor bind:editor bind:content editable={isEditable} />

      <!-- Dividing line for actions -->
      <div class="mt-4 flex justify-end border-t border-muted-foreground/20 pt-2">
        <Button
          variant="ghost"
          size="icon"
          class="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
          aria-label="Add new post"
          onclick={(event) => handleAddPost(event)}
        >
          <Plus class="h-5 w-5" />
        </Button>
      </div>
    </div>
  </Button>

  <!-- Right sibling indicator -->
  {#if irarium.hasSiblingRight(id)}
    <div
      class="absolute right-0 top-1/2 flex -translate-y-1/2 translate-x-full items-center"
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
      class="absolute left-1/2 top-0 h-6 w-0.5 -translate-x-1/2 -translate-y-full bg-muted-foreground/30"
      aria-hidden="true"
    ></div>
  {/if}
  <!-- No connector for siblings as they're handled in the parent component -->
</div>
