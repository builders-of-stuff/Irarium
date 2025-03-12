<script lang="ts">
  import { Editor } from '@tiptap/core';

  import { Button } from '$lib/components/ui/button';
  import TextEditor from '$lib/text-editor/text-editor.svelte';
  import { IrariumStore } from '$lib/irarium/irarium.store.svelte';
  import * as Select from '$lib/components/ui/select/index.js';

  import UserNavbar from '../user-navbar.svelte';
  import Idea from './idea.svelte';

  let editor = $state<Editor>();

  const irarium = new IrariumStore();

  $effect(() => {
    // log stuff here
  });

  const handleAddIdea = () => {
    if (!editor) return;

    if (!irarium.hasContent) {
      irarium.setContent(irarium.inputContent);
    } else {
      irarium.addIdea(irarium.inputContent, irarium.activeIdea);
    }

    irarium.inputContent = '';
    editor.commands.clearContent();

    // Ensure the editor stays focused and editable
    setTimeout(() => {
      if (editor) {
        editor.commands.focus('end');
      }
    }, 10);
  };
</script>

{#snippet actions()}
  <div class="flex gap-2">
    <Button variant="secondary">Save</Button>
  </div>
{/snippet}

<UserNavbar title="Create" {actions} />

<div class="container flex min-h-screen flex-col items-center justify-center py-8">
  <div class="mx-auto flex w-full max-w-4xl flex-col items-center">
    <!-- Parent chain (above) - only show unique items in the chain -->
    <div class="mb-8 flex w-full flex-col items-center space-y-8">
      <!-- Root idea -->
      {#if irarium.hasContent}
        <Idea
          {irarium}
          bind:content={irarium.content}
          id={irarium.id}
          position="parent"
        />
      {/if}

      <!-- Parent chain -->
      {#each irarium.getParentChain() as parentIdea}
        <Idea
          {irarium}
          bind:content={parentIdea.content}
          id={parentIdea.id}
          position="parent"
        />
      {/each}

      <!-- Last idea -->
      {#if irarium.activeIdeaId && !irarium
          .getParentChain()
          .some((idea) => idea.id === irarium.activeIdeaId) && irarium.activeIdeaId !== irarium.id}
        {#each irarium.getAllIdeas() as idea}
          {#if idea.id === irarium.activeIdeaId}
            <Idea
              {irarium}
              bind:content={idea.content}
              id={idea.id}
              position="parent"
            />
          {/if}
        {/each}
      {/if}
    </div>

    <!-- Text editor (center/active node) -->
    <!-- {#if irarium.isAdding} -->
    <div class="relative w-full max-w-2xl">
      <!-- Editor -->
      <div class="w-full rounded-lg border-2 border-primary bg-card p-4 shadow-md">
        <TextEditor
          bind:editor
          bind:content={irarium.inputContent}
          editable={irarium.isAdding}
        />

        <div class="mt-4 flex items-center justify-end gap-2">
          <div class="relative ml-auto flex w-full max-w-[200px]">
            <Button onclick={handleAddIdea} variant="outline" class="flex-1 pr-10">
              Add
            </Button>
            <Select.Root type="single" bind:value={irarium.activeIdeaId}>
              <Select.Trigger
                class="absolute right-0 top-0 h-full w-10 rounded-l-none border-l border-l-input px-2"
              ></Select.Trigger>
              <Select.Content>
                <div class="px-2 py-1.5 text-xs text-muted-foreground">Add to</div>
                {#each irarium.allIdeasAsOptions as option}
                  <Select.Item value={option.value}>{option.label}</Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          </div>
        </div>
      </div>
    </div>
    <!-- {/if} -->

    <!-- Child chain -->
    {#if irarium.getChildChain().length > 0}
      <div class="mt-0 h-8 w-0.5 bg-muted-foreground/30"></div>

      <div class="mt-0 w-full max-w-2xl space-y-8">
        {#each irarium.getChildChain() as idea}
          <Idea content={idea.content} id={idea.id} position="child" {irarium} />
        {/each}
      </div>
    {/if}
  </div>
</div>
