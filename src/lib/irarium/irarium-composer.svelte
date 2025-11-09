<script lang="ts">
  import { Editor } from '@tiptap/core';
  import { tick } from 'svelte';

  import { Button } from '$lib/components/ui/button';
  import TextEditor from '$lib/text-editor/text-editor.svelte';
  import * as Select from '$lib/components/ui/select/index.js';
  import { DEFAULT_IRARIUM_ID, KEYBOARD_KEYS } from '$lib/shared/shared.constant';

  import Idea from './idea.svelte';

  let { irarium = $bindable(), enableUpdates = false } = $props();

  let editor = $state<Editor>();

  const handleAddIdea = () => {
    if (!editor) return;

    if (!irarium.hasContent) {
      irarium.setContent(irarium.inputContent);
    } else {
      irarium.addIdea(irarium.inputContent, irarium.activeIdea);
    }

    irarium.inputContent = '';
    editor.commands.clearContent();
    irarium.setIsAdding(true);

    tick().then(() => {
      if (editor) {
        editor.commands.focus('end');
      }
    });
  };

  // Handle click outside Idea components
  const handleClickOutside = (event: MouseEvent) => {
    const irariumElements = document.querySelectorAll('.irarium');
    const target = event.target as HTMLElement;

    // Check if the click is inside any Idea component
    let isInsideIrarium = false;
    for (const irariumElement of irariumElements) {
      if (irariumElement.contains(target)) {
        isInsideIrarium = true;
        break;
      }
    }

    if (!isInsideIrarium && irarium.activeIdeaId) {
      irarium.clearActiveIdeaId();
    }
  };

  // Hotkey navigation
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === KEYBOARD_KEYS.ESCAPE && irarium.activeIdeaId) {
      irarium.clearActiveIdeaId();
      irarium.setIsEditing(false);
      irarium.setIsAdding(false);
      event.preventDefault();
      return;
    }

    // Skip arrow key navigation if we're in an input or editor
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      (event.target as HTMLElement).isContentEditable
    ) {
      return;
    }

    // Only apply key navigation when there is NO active idea
    if (!irarium.activeIdeaId) {
      // Handle activation keys(Enter, Space)
      if (
        irarium.lastActiveIdeaId &&
        (event.key === KEYBOARD_KEYS.ENTER || event.key === KEYBOARD_KEYS.SPACE)
      ) {
        irarium.setActiveIdeaId(irarium.lastActiveIdeaId);
        irarium.setIsEditing(true);
        irarium.setIsAdding(false);
        event.preventDefault();
        return;
      }

      // Handle arrow key navigation
      let newIdeaId: string | null = null;

      switch (event.key) {
        case KEYBOARD_KEYS.ARROW_UP: {
          // Navigate to parent
          if (irarium.lastActiveIdeaId) {
            const referenceIdea = irarium.findIdeaById(irarium.lastActiveIdeaId);

            if (
              referenceIdea?.parentId &&
              referenceIdea?.parentId !== irarium.id &&
              referenceIdea?.parentId !== DEFAULT_IRARIUM_ID
            ) {
              newIdeaId = referenceIdea?.parentId;
            } else if (
              (referenceIdea?.parentId === irarium.id ||
                referenceIdea?.parentId === DEFAULT_IRARIUM_ID) &&
              irarium.hasContent
            ) {
              newIdeaId = irarium.id;
            }
          }
          break;
        }
        case KEYBOARD_KEYS.ARROW_DOWN: {
          // Navigate to first child
          if (irarium.lastActiveIdeaId) {
            // Special case for root
            if (irarium.lastActiveIdeaId === irarium.id) {
              if (irarium.children && irarium.children.length > 0) {
                newIdeaId = irarium.children[0].id;
              }
            } else {
              // Regular case for other ideas
              const referenceIdea = irarium.findIdeaById(irarium.lastActiveIdeaId);
              if (
                referenceIdea &&
                referenceIdea.children &&
                referenceIdea.children.length > 0
              ) {
                newIdeaId = referenceIdea.children[0].id;
              }
            }
          } else {
            // No reference idea, try to select first child of root or root itself
            if (irarium.hasChildren) {
              newIdeaId = irarium.children[0].id;
            } else if (irarium.hasContent) {
              newIdeaId = irarium.id;
            }
          }
          break;
        }
        case KEYBOARD_KEYS.ARROW_LEFT: {
          // Navigate to left sibling
          if (irarium.lastActiveIdeaId) {
            const leftSibling = irarium.getSiblingLeft(irarium.lastActiveIdeaId);
            if (leftSibling) {
              newIdeaId = leftSibling.id;
            }
          }
          break;
        }
        case KEYBOARD_KEYS.ARROW_RIGHT: {
          // Navigate to right sibling
          if (irarium.lastActiveIdeaId) {
            const rightSibling = irarium.getSiblingRight(irarium.lastActiveIdeaId);
            if (rightSibling) {
              newIdeaId = rightSibling.id;
            }
          }
          break;
        }
      }

      // Update the lastActiveIdeaId if we found a new idea to navigate to
      if (newIdeaId) {
        irarium.setLastActiveIdeaId(newIdeaId);
        event.preventDefault();
      }
    }
  };

  // Set up event listeners with $effect to ensure they update when irarium changes
  $effect(() => {
    const clickHandler = handleClickOutside;

    document.addEventListener('click', clickHandler);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('click', clickHandler);
      document.removeEventListener('keydown', handleKeyDown);
    };
  });
</script>

<div class="mx-auto flex w-full max-w-4xl flex-col items-center">
  <!-- Parent chain (above) - only show unique items in the chain -->
  <div class="mb-8 flex w-full flex-col items-center space-y-8">
    <!-- Root idea -->
    {#if irarium.hasContent || irarium.hasChildren}
      <div class="irarium relative w-full">
        <Idea
          {irarium}
          bind:content={irarium.content}
          id={irarium.id}
          position="parent"
        />
      </div>
    {/if}

    <!-- Parent chain -->
    {#each irarium.getParentChain() as parentIdea}
      <div class="irarium relative w-full">
        <Idea
          {irarium}
          bind:content={parentIdea.content}
          id={parentIdea.id}
          position="parent"
        />
      </div>
    {/each}

    <!-- Active idea -->
    {#if irarium.referenceIdeaId && !irarium
        .getParentChain()
        .some((idea) => idea.id === irarium.referenceIdeaId) && irarium.referenceIdeaId !== irarium.id}
      {#each irarium.getAllIdeas() as idea}
        {#if idea.id === irarium.referenceIdeaId}
          <div class="irarium relative w-full">
            <Idea
              {irarium}
              bind:content={idea.content}
              id={idea.id}
              position="parent"
            />
          </div>
        {/if}
      {/each}
    {/if}
  </div>

  <!-- New idea -->
  {#if enableUpdates && (irarium.isAdding || irarium.isEmptyIrarium)}
    <div class="irarium relative w-full max-w-2xl">
      <!-- Editor -->
      <div class="border-primary bg-card w-full rounded-lg border-2 p-4 shadow-md">
        <TextEditor
          bind:editor
          bind:content={irarium.inputContent}
          editable={enableUpdates && (irarium.isAdding || irarium.isEmptyIrarium)}
        />

        <!-- Content/CTAs Divider -->
        <div class="border-muted-foreground/20 mt-4 flex justify-end border-t pt-3">
          <div class="relative flex w-full justify-end">
            <Button onclick={handleAddIdea}>Add</Button>
            <Select.Root type="single" bind:value={irarium.activeIdeaId}>
              <Select.Trigger
                class="border-l-input h-full w-10 rounded-l-none border-l px-2"
              ></Select.Trigger>
              <Select.Content>
                <div class="text-muted-foreground px-2 py-1.5 text-xs">Add to</div>
                {#each irarium.allIdeasAsOptions as option}
                  <Select.Item value={option.value}>{option.label}</Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- Child chain -->
  {#if irarium.getChildChain().length > 0}
    <div class="bg-muted-foreground/30 mt-0 h-8 w-0.5"></div>

    <div class="mt-0 w-full max-w-2xl space-y-8">
      {#each irarium.getChildChain() as idea (idea.id)}
        <div class="irarium relative w-full">
          <Idea content={idea.content} id={idea.id} position="child" {irarium} />
        </div>
      {/each}
    </div>
  {/if}
</div>
