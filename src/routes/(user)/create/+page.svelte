<script lang="ts">
  import { appState } from '$lib/state/app.state.svelte';
  import { Button } from '$lib/components/ui/button';
  import TextEditor from '$lib/text-editor/text-editor.svelte';

  import UserNavbar from '../user-navbar.svelte';
  import Idea from './idea.svelte';
  import { Trash2 } from 'lucide-svelte';

  type IdeaItem = {
    id: string;
    content: string;
    timestamp: Date;
  };

  let editor;
  let content = $state('');
  let ideaChain = $state<IdeaItem[]>([]);
  let isSaving = $state(false);

  $effect(() => {
    console.log('ideaChain', ideaChain);
    console.log('content', content);
  });

  function addToChain() {
    if (content === '' || content === '<p></p>') {
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

    // If editor has clearEditor method, use it
    if (editor && typeof editor.clearEditor === 'function') {
      editor.clearEditor();
    } else if (
      editor &&
      editor.commands &&
      typeof editor.commands.clearContent === 'function'
    ) {
      // Try to use the TipTap commands API directly
      editor.commands.clearContent();
    }
  }

  function removeIdea(id: string) {
    ideaChain = ideaChain.filter((idea) => idea.id !== id);
  }

  async function saveChain() {
    if (ideaChain.length === 0) {
      return;
    }

    isSaving = true;

    try {
      // For now, let's just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Clear the chain after saving
      ideaChain = [];
      alert('Idea chain saved successfully!');
    } catch (error) {
      console.error('Failed to save idea chain:', error);
      alert('Failed to save idea chain. Please try again.');
    } finally {
      isSaving = false;
    }
  }
</script>

{#snippet actions()}
  <div class="flex gap-2">
    <Button variant="outline">Publish</Button>
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
        <Button onclick={addToChain} variant="outline" class="mr-2">Add</Button>
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
