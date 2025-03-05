<script lang="ts">
  import { Editor } from '@tiptap/core';

  import { Button } from '$lib/components/ui/button';
  import TextEditor from '$lib/text-editor/text-editor.svelte';
  import { IrariumState } from '$lib/state/irarium.state.svelte';
  import * as Select from '$lib/components/ui/select/index.js';

  import UserNavbar from '../user-navbar.svelte';
  import Idea from './idea.svelte';

  let editor = $state<Editor>();

  const irarium = new IrariumState();

  $effect(() => {
    // console.log('irarium.children', $state.snapshot(irarium.children));
  });

  const handleAddToIrarium = () => {
    if (!editor) return;

    if (!irarium.hasContent) {
      irarium.setContent(irarium.inputContent);
    } else {
      irarium.addToIrarium(irarium.inputContent, irarium.lastIdea);
    }

    irarium.inputContent = '';
    editor.commands.clearContent();
    editor.commands.focus();
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
          content={irarium.content}
          id={irarium.id}
          lastIdeaId={irarium.lastIdeaId}
          position="parent"
        />
      {/if}

      <!-- Parent chain -->
      {#each irarium.getParentChain() as parentIdea}
        <Idea
          content={parentIdea.content}
          id={parentIdea.id}
          lastIdeaId={irarium.lastIdeaId}
          position="parent"
        />
      {/each}

      <!-- Left sibling indicator -->
      {#if irarium.hasSiblingLeft()}
        <div class=" left-0 top-1/2 flex -translate-x-12 -translate-y-1/2 items-center">
          <div class="h-0.5 w-8 bg-muted-foreground/30"></div>
          <div
            class="flex h-8 w-8 items-center justify-center rounded-full border border-muted-foreground/30 text-muted-foreground"
          >
            <span>←</span>
          </div>
        </div>
      {/if}

      <!-- Last idea -->
      {#if irarium.lastIdeaId && !irarium
          .getParentChain()
          .some((idea) => idea.id === irarium.lastIdeaId) && irarium.lastIdeaId !== irarium.id}
        {#each irarium.getAllIdeas() as idea}
          {#if idea.id === irarium.lastIdeaId}
            <Idea
              content={idea.content}
              id={idea.id}
              lastIdeaId={irarium.lastIdeaId}
              position="parent"
            />
          {/if}
        {/each}
      {/if}

      <!-- Right sibling indicator -->
      {#if irarium.hasSiblingRight()}
        <div class=" right-0 top-1/2 flex -translate-y-1/2 translate-x-12 items-center">
          <div
            class="flex h-8 w-8 items-center justify-center rounded-full border border-muted-foreground/30 text-muted-foreground"
          >
            <span>→</span>
          </div>
          <div class="h-0.5 w-8 bg-muted-foreground/30"></div>
        </div>
      {/if}

      <!-- Connector line from last parent to editor -->
      <div class="h-8 w-0.5 bg-muted-foreground/30"></div>
    </div>

    <!-- Text editor (center/active node) -->
    <div class="relative w-full max-w-2xl">
      <!-- Editor -->
      <div class="w-full rounded-lg border-2 border-primary bg-card p-4 shadow-md">
        <TextEditor bind:editor bind:content={irarium.inputContent} />

        <div class="mt-4 flex items-center justify-end gap-2">
          <div class="relative ml-auto flex w-full max-w-[200px]">
            <Button onclick={handleAddToIrarium} variant="outline" class="flex-1 pr-10">
              Add
            </Button>
            <Select.Root type="single" bind:value={irarium.lastIdeaId}>
              <Select.Trigger
                class="absolute right-0 top-0 h-full w-10 rounded-l-none border-l border-l-input px-2"
              ></Select.Trigger>
              <Select.Content>
                {#each irarium.optionsParentIdeaIds as option}
                  <Select.Item value={option.value}>{option.label}</Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          </div>
        </div>
      </div>
    </div>

    <!-- Child chain -->
    {#if irarium.getChildChain().length > 0}
      <div class="mt-0 h-8 w-0.5 bg-muted-foreground/30"></div>

      <div class="mt-0 w-full max-w-2xl space-y-8">
        {#each irarium.getChildChain() as idea}
          <Idea
            content={idea.content}
            id={idea.id}
            lastIdeaId={irarium.lastIdeaId}
            position="child"
          />
        {/each}
      </div>
    {/if}
  </div>
</div>
