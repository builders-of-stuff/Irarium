<script lang="ts">
  import { NavigationMenu } from 'bits-ui';
  import { tick } from 'svelte';

  let {
    title = 'Irarium',
    actions,
    isTitleEditable = false,
    handleTitleChange = (newTitle: string) => {}
  } = $props<{
    title?: string;
    actions?: () => unknown;
    isTitleEditable?: boolean;
    handleTitleChange?: (newTitle: string) => void;
  }>();

  let isEditing = $state(false);
  let editableTitle = $state(title);
  let titleInput = $state<HTMLInputElement>();

  /**
   * Edit title
   */
  function handleTitleClick() {
    if (isTitleEditable && !isEditing) {
      isEditing = true;
      editableTitle = title;
      tick().then(() => {
        titleInput?.focus();
      });
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      finishEditing();
    } else if (event.key === 'Escape') {
      isEditing = false;
    }
  }

  function finishEditing() {
    if (editableTitle.trim() !== '' && editableTitle !== title) {
      handleTitleChange(editableTitle);
    } else {
      editableTitle = title;
    }
    isEditing = false;
  }

  // Update editableTitle when title prop changes
  $effect(() => {
    if (!isEditing) {
      editableTitle = title;
    }
  });
</script>

<NavigationMenu.Root>
  <div class="border-b">
    <div
      class="container mx-auto flex max-w-5xl items-center justify-between px-6 py-4"
    >
      {#if isEditing}
        <input
          bind:this={titleInput}
          bind:value={editableTitle}
          onkeydown={handleKeyDown}
          onblur={finishEditing}
          class="w-full max-w-md border-b border-primary bg-transparent px-1 py-0.5 text-xl font-semibold focus:ring-0 focus:outline-none"
          type="text"
        />
      {:else}
        <button onclick={handleTitleClick}>
          <h1
            class="text-xl font-semibold {isTitleEditable
              ? 'cursor-pointer hover:text-primary'
              : ''}"
          >
            {title}
          </h1>
        </button>
      {/if}

      <!-- Actions section -->
      <div class="flex items-center gap-2">
        {#if actions}
          {@render actions()}
        {/if}
      </div>
    </div>
  </div>
</NavigationMenu.Root>
