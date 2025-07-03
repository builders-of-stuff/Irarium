<script lang="ts">
  import { IsMobile } from '$lib/hooks/is-mobile.svelte';
  import * as Sidebar from '$lib/components/ui/sidebar/index';
  import UserSidebar from '../../lib/shared/user-sidebar.svelte';
  import SidebarShowButton from '$lib/components/ui/sidebar/SidebarShowButton.svelte';
  let { children } = $props();
  const isMobile = new IsMobile();
</script>

<Sidebar.Provider>
  <UserSidebar />
  <SidebarShowButton />
  <main class="w-full">
    <div
      class={`flex flex-wrap items-center ${isMobile.current ? `justify-between px-3 pt-2` : 'justify-end'}`}
    >
      {#if isMobile.current}
        <Sidebar.Trigger />
      {/if}
    </div>
    {@render children()}
  </main>
</Sidebar.Provider>
