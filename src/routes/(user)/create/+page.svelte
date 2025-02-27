<script lang="ts">
  import { appState } from '$lib/state/app.state.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import Link from '@tiptap/extension-link';
  import { Button } from '$lib/components/ui/button';
  import { cn } from '$lib/utils';
  import TextEditor from '$lib/text-editor/text-editor.svelte';

  let editor: Editor;
  let content = $state('<p>Start writing here...</p>');
</script>

<div class="container flex min-h-screen items-start justify-center pt-[10vh]">
  <div class="w-full max-w-3xl space-y-6">
    <TextEditor bind:editor {content} />

    <div class="flex justify-end gap-2">
      <Button>Save</Button>
    </div>
  </div>
</div>
