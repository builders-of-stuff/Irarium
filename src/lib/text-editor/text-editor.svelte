<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';

  let {
    editor = $bindable(),
    content = $bindable(),
    editable = $bindable(),
    minHeight = $bindable()
  } = $props();
  let editorElement: HTMLElement = $state() as any;
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
    class="prose max-w-none text-card-foreground focus-within:outline-none"
    style="min-height: {minHeight};"
  ></div>
</div>

<style>
  /* Minimal required styles */
  :global(.tiptap-editor .ProseMirror) {
    outline: none;
    min-height: inherit;
    font-size: 1rem;
    line-height: 1.75;
  }

  /* Remove top margin from first element */
  :global(.tiptap-editor .ProseMirror > *:first-child) {
    margin-top: 0;
  }

  :global(.tiptap-editor .ProseMirror p) {
    margin-bottom: 1rem;
    font-size: 1rem;
    line-height: 1.75;
  }

  :global(.tiptap-editor .ProseMirror h2) {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.75rem;
    line-height: 1.5;
  }

  :global(.tiptap-editor .ProseMirror ul) {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin-bottom: 1rem;
  }

  :global(.ProseMirror *) {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
</style>
