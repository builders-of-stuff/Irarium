<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';

  let {
    editor = $bindable(),
    content = $bindable(),
    editable = $bindable()
  } = $props();
  let editorElement: HTMLElement = $state() as any;
  let previousContent = $state(content);
  let isEditorMounted = $state(false);

  function initializeEditor() {
    if (editor) {
      editor.destroy();
    }

    editor = new Editor({
      element: editorElement,
      extensions: [StarterKit],
      parseOptions: {
        preserveWhitespace: 'full'
      },
      content,
      editable,
      autofocus: 'end',
      onUpdate: ({ editor }) => {
        content = editor.getHTML();
      }
    });
    isEditorMounted = true;

    if (editable) {
      tick().then(() => {
        editor.commands.focus('end');
      });
    }
  }

  onMount(() => {
    initializeEditor();
  });

  // Handle external content changes, catches what onUpdate misses
  $effect(() => {
    if (editor && content !== previousContent) {
      editor.commands.setContent(content, false, { preserveWhitespace: 'full' });
      previousContent = content;
    }
  });

  // Handle editable state changes
  $effect(() => {
    if (editor && isEditorMounted) {
      editor.setEditable(editable);
      if (editable) {
        tick().then(() => {
          editor.commands.focus('end');
        });
      }
    } else if (isEditorMounted && !editor && editable) {
      initializeEditor();
    }
  });

  onDestroy(() => {
    if (editor) {
      editor.destroy();
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

  :global(.ProseMirror *) {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
</style>
