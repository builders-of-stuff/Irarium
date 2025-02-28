<script lang="ts">
  import { appState } from '$lib/state/app.state.svelte';
  import { Button } from '$lib/components/ui/button';
  import TextEditor from '$lib/text-editor/text-editor.svelte';

  import UserNavbar from '../user-navbar.svelte';
  import Tweet from './tweet.svelte';
  import { Trash2 } from 'lucide-svelte';

  type TweetItem = {
    id: string;
    content: string;
    timestamp: Date;
  };

  let editor;
  let content = $state('');
  let tweetChain = $state<TweetItem[]>([]);
  let isSaving = $state(false);

  $effect(() => {
    console.log('tweetChain', tweetChain);
    console.log('content', content);
  });

  function addToChain() {
    if (content === '' || content === '<p></p>') {
      return;
    }

    // Add the current content to the tweet chain
    tweetChain = [
      ...tweetChain,
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

  function removeTweet(id: string) {
    tweetChain = tweetChain.filter((tweet) => tweet.id !== id);
  }

  async function saveChain() {
    if (tweetChain.length === 0) {
      return;
    }

    isSaving = true;

    try {
      // Here you would implement the actual saving logic
      // For example:
      // await fetch('/api/tweets', {
      //   method: 'POST',
      //   body: JSON.stringify({ tweets: tweetChain }),
      //   headers: { 'Content-Type': 'application/json' }
      // });

      // For now, let's just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Clear the chain after saving
      tweetChain = [];
      alert('Tweet chain saved successfully!');
    } catch (error) {
      console.error('Failed to save tweet chain:', error);
      alert('Failed to save tweet chain. Please try again.');
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
    <!-- Tweet Editor -->
    <div class="rounded-lg border p-4">
      <TextEditor bind:editor bind:content />

      <div class="mt-4 flex justify-end">
        <Button onclick={addToChain} variant="outline" class="mr-2">
          Add to Chain
        </Button>
      </div>
    </div>

    <!-- Tweet Chain Preview -->
    {#if tweetChain.length > 0}
      <div class="mt-8">
        <h2 class="mb-4 text-xl font-semibold">Your Chain</h2>

        <div class="tweet-chain">
          {#each tweetChain as tweet (tweet.id)}
            <Tweet
              content={tweet.content}
              timestamp={tweet.timestamp}
              onDelete={() => removeTweet(tweet.id)}
            />
          {/each}
        </div>

        <div class="mt-4 flex justify-end">
          <Button onclick={saveChain} disabled={isSaving} variant="default">
            {isSaving ? 'Saving...' : 'Save Chain'}
          </Button>
        </div>
      </div>
    {/if}
  </div>
</div>
