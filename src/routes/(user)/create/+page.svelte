<script lang="ts">
  import { Editor } from '@tiptap/core';

  import { appState } from '$lib/state/app.state.svelte';
  import { Button } from '$lib/components/ui/button';
  import TextEditor from '$lib/text-editor/text-editor.svelte';

  import UserNavbar from '../user-navbar.svelte';
  import Idea from './idea.svelte';

  let editor = $state<Editor>();
  let content = $state('');
  let ideaChain = $state<Idea[]>([]);
  let isSaving = $state(false);

  $effect(() => {
    console.log('ideaChain', ideaChain);
    console.log('content', content);
  });

  function addToIrarium() {
    if (!editor) {
      return;
    }

    // Add the current content to the tweet chain
    ideaChain = [
      ...ideaChain,
      {
        id: crypto.randomUUID(),
        content,
        timestamp: new Date()
      }
    ];

    // Reset the content
    content = '';
    editor.commands.clearContent();
    editor.commands.focus();
  }

  function removeIdea(id: string) {
    ideaChain = ideaChain.filter((idea) => idea.id !== id);
  }
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
      <TextEditor bind:editor bind:content />

      <div class="mt-4 flex justify-end">
        <Button onclick={addToIrarium} variant="outline" class="mr-2">Add</Button>
      </div>
    </div>

    <!-- Idea Chain Preview -->
    {#if ideaChain.length > 0}
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
    {/if}
  </div>
</div>
