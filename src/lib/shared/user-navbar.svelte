<script lang="ts">
  import { NavigationMenu } from 'bits-ui';
  import { tick } from 'svelte';
  import { MapPin } from '@lucide/svelte';

  import { useSidebar } from '$lib/components/ui/sidebar/context.svelte';

  let {
    title = 'Irarium',
    actions,
    isTitleEditable = false,
    handleTitleChange = (newTitle: string) => {},
    spaceName,
    spaceSlug,
    spaceId,
    username
  } = $props<{
    title?: string;
    actions?: () => unknown;
    isTitleEditable?: boolean;
    handleTitleChange?: (newTitle: string) => void;
    spaceName?: string;
    spaceSlug?: string;
    spaceId?: string;
    username?: string;
  }>();

  const sidebar = useSidebar();

  let isEditing = $state(false);
  let editableTitle = $state(title);
  let titleInput = $state<HTMLInputElement>();

  const hasSpace = $derived(spaceName && spaceSlug && spaceId);

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
  <div class="border-b border-white/10 bg-black/30 backdrop-blur-xl">
    <div
      class="flex items-center justify-between py-3 pr-8 transition-all duration-300 {!sidebar.isMobile &&
      sidebar.state === 'collapsed'
        ? 'pl-14'
        : 'pl-8'}"
    >
      <div class="flex items-center gap-4">
        {#if isEditing}
          <input
            bind:this={titleInput}
            bind:value={editableTitle}
            onkeydown={handleKeyDown}
            onblur={finishEditing}
            class="border-b border-orange-500/50 bg-transparent px-2 py-1 text-2xl font-bold text-white transition-colors focus:border-orange-500 focus:outline-none"
            type="text"
          />
        {:else}
          <button onclick={handleTitleClick} class="group">
            <h1
              class="text-2xl font-bold text-white transition-colors {isTitleEditable
                ? 'cursor-pointer group-hover:text-orange-400'
                : ''}"
            >
              {title}
            </h1>
          </button>
        {/if}

        {#if hasSpace}
          <a
            href={`/spaces/${spaceSlug}-${spaceId}`}
            class="flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-gradient-to-r from-orange-500/20 to-pink-500/20 px-3 py-1.5 text-sm font-medium text-orange-300 transition-all duration-200 hover:scale-105 hover:border-orange-500/50 hover:from-orange-500/30 hover:to-pink-500/30"
          >
            <MapPin size={14} />
            <span>{spaceName}</span>
          </a>
        {/if}

        {#if username}
          <a
            href={`/user/${username}`}
            class="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-white/10 hover:text-white"
          >
            <span>@{username}</span>
          </a>
        {/if}
      </div>

      <!-- Actions section -->
      <div class="flex items-center gap-2">
        {#if actions}
          {@render actions()}
        {/if}
      </div>
    </div>
  </div>
</NavigationMenu.Root>
