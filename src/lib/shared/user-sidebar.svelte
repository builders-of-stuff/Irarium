<script lang="ts">
  import {
    GalleryVerticalEnd,
    Settings,
    User,
    House,
    MoreHorizontal,
    LogOut,
    HelpCircle,
    Shield,
    Box
  } from 'lucide-svelte';
  import { goto } from '$app/navigation';

  import IRARIUM_LOGO from '$lib/assets/irarium.png';

  import * as Sidebar from '$lib/components/ui/sidebar';
  import * as Popover from '$lib/components/ui/popover';
  import { Button } from '$lib/components/ui/button';

  import { authStore } from '$lib/auth/auth.store.svelte';
  import { irariumsStore } from '$lib/irarium/irariums.store.svelte';
  import { ROUTE } from '$lib/shared/shared.constant';

  const menuItems = $derived([
    { title: 'Spaces', icon: Box, href: '/spaces' },
    { title: 'Collection', icon: GalleryVerticalEnd, href: '/collection' },
    { title: 'Profile', icon: User, href: `/user/${authStore?.username}` }
    // { title: 'Saved', icon: Save, href: '/saved' }
  ]);

  // Handle logout function
  function handleLogout() {
    authStore.signOut();
    irariumsStore.clearStore();

    goto(ROUTE.LANDING);
  }
</script>

<Sidebar.Root variant="floating">
  <Sidebar.Header class="relative mx-2 flex justify-between px-4 pt-4">
    <a href={ROUTE.HOME}>
      <img src={IRARIUM_LOGO} class="h-10 w-10" alt="Irarium Logo" />
    </a>
    <Sidebar.Trigger class="absolute top-4 right-4 ml-2 hidden md:flex" />
  </Sidebar.Header>

  <Sidebar.Content class="py-4">
    {#each menuItems as item}
      <Sidebar.Group class="p-0">
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <a
                href={item.href}
                class="mx-2 flex w-full items-center gap-3 rounded-md px-5 py-3 text-base hover:bg-accent hover:text-accent-foreground"
              >
                {#if item.icon}
                  <item.icon class="h-5 w-5" />
                {/if}
                <span>{item.title}</span>
              </a>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    {/each}

    <div class="mt-auto">
      <div class="mx-2 mb-8">
        <a href="/create">
          <Button
            variant="default"
            class="w-full rounded-full py-6 text-lg font-medium"
          >
            Create
          </Button>
        </a>
      </div>

      <Sidebar.Group class="p-0">
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            <Sidebar.MenuItem class="w-full">
              <Popover.Root>
                <Popover.Trigger class="w-full">
                  <button
                    class="mx-2 flex w-full items-center gap-3 rounded-md px-5 py-3 text-base hover:bg-accent hover:text-accent-foreground"
                  >
                    <div
                      class="flex h-5 w-5 items-center justify-center rounded-full bg-muted"
                    >
                      <Settings class="h-5 w-5" />
                    </div>
                    <span>Settings</span>
                    <MoreHorizontal class="ml-auto h-5 w-5" />
                  </button>
                </Popover.Trigger>
                <Popover.Content class="w-56 p-0">
                  <div class="flex flex-col">
                    <button
                      class="flex items-center gap-2 px-4 py-2 text-left text-destructive hover:bg-accent"
                      onclick={handleLogout}
                    >
                      <LogOut class="h-4 w-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </Popover.Content>
              </Popover.Root>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    </div>
  </Sidebar.Content>
</Sidebar.Root>
