<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';

  let { editor = $bindable(), content = $bindable() } = $props();

  onMount(() => {
    editor = new Editor({
      element: document.querySelector('.tiptap-editor') as any,
      extensions: [StarterKit],
      content,
      autofocus: true,
      onUpdate: ({ editor }) => {
        content = editor.getText();
      }
    });
  });

  onDestroy(() => {
    if (editor) {
      editor?.destroy?.();
    }
  });
</script>

<div class="tiptap-editor">
  <div class="prose prose-sm max-w-none focus-within:outline-none"></div>
</div>

<style>
  /* Minimal required styles */
  :global(.tiptap-editor .ProseMirror) {
    outline: none;
  }

  :global(.tiptap-editor .ProseMirror p) {
    margin-bottom: 0.5rem;
  }

  :global(.tiptap-editor .ProseMirror h2) {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  :global(.tiptap-editor .ProseMirror ul) {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin-bottom: 0.5rem;
  }
</style>
