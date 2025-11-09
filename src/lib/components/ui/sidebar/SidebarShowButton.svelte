<script lang="ts">
  import { useSidebar } from './context.svelte';
  import { Trigger } from './index';
  const sidebar = useSidebar();
</script>

{#if !sidebar.isMobile && sidebar.state === 'collapsed'}
  <div class="fixed top-4 left-0 z-50 hidden md:block">
    <Trigger
      class="border-sidebar-border bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent flex h-10 w-8 items-center justify-center rounded-r-lg border shadow transition-all"
    />
  </div>
{/if}
