<script lang="ts">
  import * as Sidebar from '$lib/components/ui/sidebar/index';
  import UserSidebar from '../../lib/shared/user-sidebar.svelte';
  import SidebarShowButton from '$lib/components/ui/sidebar/sidebar-show-button.svelte';
  import Starfield from '$lib/components/starfield.svelte';
  import { authStore } from '$lib/auth/auth.store.svelte';
  import { spaceStore } from '$lib/space/space.store.svelte';

  import { untrack } from 'svelte';

  let { children } = $props();

  $effect(() => {
    if (authStore.userId && !spaceStore.hasFetchedUserSpaces) {
      untrack(() => spaceStore.fetchUserSpaces(authStore.userId));
    }
  });
</script>

<Starfield />

<Sidebar.Provider>
  <UserSidebar />
  <SidebarShowButton />
  <main class="w-full">
    {@render children()}
  </main>
</Sidebar.Provider>
