<script lang="ts">
  import { Editor } from '@tiptap/core';
  import { tick } from 'svelte';

  import { Button } from '$lib/components/ui/button';
  import TextEditor from '$lib/text-editor/text-editor.svelte';
  import * as Select from '$lib/components/ui/select/index.js';
  import { DEFAULT_IRARIUM_ID, KEYBOARD_KEYS } from '$lib/shared/shared.constant';

  import Thought from './thought.svelte';

  let { irarium = $bindable(), enableUpdates = false } = $props();

  let editor = $state<Editor>();

  const handleAddThought = () => {
    if (!editor) return;

    if (!irarium.hasContent) {
      irarium.setContent(irarium.inputContent);
    } else {
      irarium.addThought(irarium.inputContent, irarium.activeThought);
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

  // Handle click outside Thought components
  const handleClickOutside = (event: MouseEvent) => {
    const irariumElements = document.querySelectorAll('.irarium');
    const target = event.target as HTMLElement;

    // Check if the click is inside any Thought component
    let isInsideIrarium = false;
    for (const irariumElement of irariumElements) {
      if (irariumElement.contains(target)) {
        isInsideIrarium = true;
        break;
      }
    }

    if (!isInsideIrarium && irarium.activeThoughtId) {
      irarium.clearActiveThoughtId();
    }
  };

  // Hotkey navigation
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === KEYBOARD_KEYS.ESCAPE && irarium.activeThoughtId) {
      irarium.clearActiveThoughtId();
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

    // Only apply key navigation when there is NO active thought
    if (!irarium.activeThoughtId) {
      // Handle activation keys(Enter, Space)
      if (
        irarium.lastActiveThoughtId &&
        (event.key === KEYBOARD_KEYS.ENTER || event.key === KEYBOARD_KEYS.SPACE)
      ) {
        irarium.setActiveThoughtId(irarium.lastActiveThoughtId);
        irarium.setIsEditing(true);
        irarium.setIsAdding(false);
        event.preventDefault();
        return;
      }

      // Handle arrow key navigation
      let newThoughtId: string | null = null;

      switch (event.key) {
        case KEYBOARD_KEYS.ARROW_UP: {
          // Navigate to parent
          if (irarium.lastActiveThoughtId) {
            const referenceThought = irarium.findThoughtById(
              irarium.lastActiveThoughtId
            );

            if (
              referenceThought?.parentId &&
              referenceThought?.parentId !== irarium.id &&
              referenceThought?.parentId !== DEFAULT_IRARIUM_ID
            ) {
              newThoughtId = referenceThought?.parentId;
            } else if (
              (referenceThought?.parentId === irarium.id ||
                referenceThought?.parentId === DEFAULT_IRARIUM_ID) &&
              irarium.hasContent
            ) {
              newThoughtId = irarium.id;
            }
          }
          break;
        }
        case KEYBOARD_KEYS.ARROW_DOWN: {
          // Navigate to first child
          if (irarium.lastActiveThoughtId) {
            // Special case for root
            if (irarium.lastActiveThoughtId === irarium.id) {
              if (irarium.children && irarium.children.length > 0) {
                newThoughtId = irarium.children[0].id;
              }
            } else {
              // Regular case for other thoughts
              const referenceThought = irarium.findThoughtById(
                irarium.lastActiveThoughtId
              );
              if (
                referenceThought &&
                referenceThought.children &&
                referenceThought.children.length > 0
              ) {
                newThoughtId = referenceThought.children[0].id;
              }
            }
          } else {
            // No reference thought, try to select first child of root or root itself
            if (irarium.hasChildren) {
              newThoughtId = irarium.children[0].id;
            } else if (irarium.hasContent) {
              newThoughtId = irarium.id;
            }
          }
          break;
        }
        case KEYBOARD_KEYS.ARROW_LEFT: {
          // Navigate to left sibling
          if (irarium.lastActiveThoughtId) {
            const leftSibling = irarium.getSiblingLeft(irarium.lastActiveThoughtId);
            if (leftSibling) {
              newThoughtId = leftSibling.id;
            }
          }
          break;
        }
        case KEYBOARD_KEYS.ARROW_RIGHT: {
          // Navigate to right sibling
          if (irarium.lastActiveThoughtId) {
            const rightSibling = irarium.getSiblingRight(irarium.lastActiveThoughtId);
            if (rightSibling) {
              newThoughtId = rightSibling.id;
            }
          }
          break;
        }
      }

      // Update the lastActiveThoughtId if we found a new thought to navigate to
      if (newThoughtId) {
        irarium.setLastActiveThoughtId(newThoughtId);
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
    <!-- Root thought -->
    {#if irarium.hasContent || irarium.hasChildren}
      <div class="irarium relative w-full">
        <Thought
          {irarium}
          bind:content={irarium.content}
          id={irarium.id}
          position="parent"
        />
      </div>
    {/if}

    <!-- Parent chain -->
    {#each irarium.getParentChain() as parentThought}
      <div class="irarium relative w-full">
        <Thought
          {irarium}
          bind:content={parentThought.content}
          id={parentThought.id}
          position="parent"
        />
      </div>
    {/each}

    <!-- Active thought -->
    {#if irarium.referenceThoughtId && !irarium
        .getParentChain()
        .some((thought) => thought.id === irarium.referenceThoughtId) && irarium.referenceThoughtId !== irarium.id}
      {#each irarium.getAllThoughts() as thought}
        {#if thought.id === irarium.referenceThoughtId}
          <div class="irarium relative w-full">
            <Thought
              {irarium}
              bind:content={thought.content}
              id={thought.id}
              position="parent"
            />
          </div>
        {/if}
      {/each}
    {/if}
  </div>

  <!-- New thought -->
  {#if enableUpdates && (irarium.isAdding || irarium.isEmptyIrarium)}
    <div class="irarium relative w-full max-w-2xl">
      <!-- Editor -->
      <div class="w-full rounded-lg border-2 border-primary bg-card p-4 shadow-md">
        <TextEditor
          bind:editor
          bind:content={irarium.inputContent}
          editable={enableUpdates && (irarium.isAdding || irarium.isEmptyIrarium)}
        />

        <!-- Content/CTAs Divider -->
        <div class="mt-4 flex justify-end border-t border-muted-foreground/20 pt-3">
          <div class="relative flex w-full justify-end">
            <Button onclick={handleAddThought}>Add</Button>
            <Select.Root type="single" bind:value={irarium.activeThoughtId}>
              <Select.Trigger
                class="h-full w-10 rounded-l-none border-l border-l-input px-2"
              ></Select.Trigger>
              <Select.Content>
                <div class="px-2 py-1.5 text-xs text-muted-foreground">Add to</div>
                {#each irarium.allThoughtsAsOptions as option}
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
    <div class="mt-0 h-8 w-0.5 bg-muted-foreground/30"></div>

    <div class="mt-0 w-full max-w-2xl space-y-8">
      {#each irarium.getChildChain() as thought (thought.id)}
        <div class="irarium relative w-full">
          <Thought
            content={thought.content}
            id={thought.id}
            position="child"
            {irarium}
          />
        </div>
      {/each}
    </div>
  {/if}
</div>
