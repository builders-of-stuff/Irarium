<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';

  let {
    editor = $bindable(),
    content = $bindable(),
    editable = $bindable()
  } = $props();
  let editorElement: HTMLElement = $state() as any;
  let previousContent = $state(content);

  onMount(() => {
    editor = new Editor({
      element: editorElement,
      extensions: [StarterKit],
      content,
      editable,
      autofocus: true,
      onUpdate: ({ editor }) => {
        content = editor.getText();
      }
    });
  });

  // Handle external content changes, catches what onUpdate misses
  $effect(() => {
    if (editor && content !== previousContent) {
      editor.commands.setContent(content);
      previousContent = content;
    }
  });

  onDestroy(() => {
    if (editor) {
      editor?.destroy?.();
    }
  });
</script>

<div class="tiptap-editor">
  <div
    bind:this={editorElement}
    class="prose prose-sm max-w-none focus-within:outline-none"
  ></div>
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
