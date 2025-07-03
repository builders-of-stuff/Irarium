<script lang="ts">
  import { useSidebar } from './context.svelte';
  import { Trigger } from './index';
  const sidebar = useSidebar();
</script>

{#if !sidebar.isMobile && sidebar.state === 'collapsed'}
  <div class="fixed left-0 top-4 z-50 hidden md:block">
    <Trigger
      class="flex h-10 w-8 items-center justify-center rounded-r-lg border border-sidebar-border bg-sidebar text-sidebar-foreground shadow transition-all hover:bg-sidebar-accent"
    />
  </div>
{/if}
