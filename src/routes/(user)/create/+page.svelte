<script lang="ts">
  import { Editor } from '@tiptap/core';

  import { appState } from '$lib/state/app.state.svelte';
  import { Button } from '$lib/components/ui/button';
  import TextEditor from '$lib/text-editor/text-editor.svelte';
  import { IrariumState } from '$lib/state/irarium.state.svelte';
  import * as Select from '$lib/components/ui/select/index.js';

  import UserNavbar from '../user-navbar.svelte';
  import Idea from './idea.svelte';

  let editor = $state<Editor>();

  const irarium = new IrariumState();

  $effect(() => {
    console.log('irarium.children', $state.snapshot(irarium.children));
  });

  const handleAddToIrarium = () => {
    if (!editor) return;

    if (!irarium.hasContent) {
      irarium.setContent(irarium.inputContent);
    } else {
      irarium.addToIrarium(irarium.inputContent, irarium.activeParentIdea);
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

<div class="container flex min-h-screen flex-col items-start justify-start py-8">
  <div class="mx-auto w-full max-w-2xl space-y-6">
    <!-- Text editor -->
    <div class="rounded-lg border p-4">
      <TextEditor bind:editor bind:content={irarium.inputContent} />

      <div class="mt-4 flex items-center justify-end gap-2">
        <div class="relative flex w-full max-w-[200px]">
          <Button onclick={handleAddToIrarium} variant="outline" class="flex-1 pr-10">
            Add
          </Button>
          <Select.Root type="single" bind:value={irarium.activeParentIdeaId}>
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

    <!-- Idea Chain Preview -->
    <!-- {#if ideaChain.length > 0}
      <div class="mt-8">
        <div class="tweet-chain">
          {#each ideaChain as idea (idea.id)}
            <Idea
              content={idea.content}
              timestamp={idea.timestamp}
              onDelete={() => removeIdea(idea.id)}
            />
          {/each}
        </div>
      </div>
    {/if} -->
  </div>
</div>
