<script lang="ts">
  import * as Sidebar from '$lib/components/ui/sidebar/index';
  import UserSidebar from '../../lib/shared/user-sidebar.svelte';
  import SidebarShowButton from '$lib/components/ui/sidebar/sidebar-show-button.svelte';
  import Starfield from '$lib/components/starfield.svelte';
  let { children } = $props();
</script>

<Starfield />

<Sidebar.Provider>
  <UserSidebar />
  <SidebarShowButton />
  <main class="w-full">
    {@render children()}
  </main>
</Sidebar.Provider>
