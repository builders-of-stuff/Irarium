<script lang="ts">
  import { onMount, onDestroy, getContext } from 'svelte';
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import Image from '@tiptap/extension-image';

  // export let editor;
  // export let isEditable = true;
  // export let post = {} as any;

  let { editor = $bindable(), content } = $props();

  $effect(() => {
    console.log(content);
  });

  /**
   * Initialization
   */
  // onMount(() => {
  //   editor = new Editor({
  //     element: document.querySelector('.tiptap-editor') as any,
  //     extensions: [
  //       StarterKit.configure({
  //         heading: {
  //           levels: [1, 2, 3]
  //         }
  //       }),
  //       Image.configure({
  //         inline: false,
  //         allowBase64: true,
  //         HTMLAttributes: {
  //           class: 'max-w-full h-auto'
  //         }
  //       })
  //     ],
  //     editable: isEditable,
  //     content: content || '',
  //     editorProps: {
  //       attributes: {
  //         class: 'prose h-full w-full outline-0 container px-4 pb-4 max-w-full'
  //       }
  //     }
  //   });
  // });

  onMount(() => {
    editor = new Editor({
      element: document.querySelector('.tiptap-editor') as any,
      extensions: [
        StarterKit
        // Link.configure({
        //   openOnClick: false
        // })
      ],
      content,
      autofocus: true,
      onUpdate: ({ editor }) => {
        content = editor.getHTML();
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
  <div class="prose prose-sm min-h-[300px] max-w-none focus-within:outline-none"></div>
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
