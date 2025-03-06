<script lang="ts">
  import {
    GalleryVerticalEnd,
    Settings,
    User,
    House,
    MoreHorizontal,
    LogOut,
    HelpCircle,
    Shield
  } from 'lucide-svelte';
  import { goto } from '$app/navigation';

  import IRARIUM_LOGO from '$lib/assets/irarium.png';

  import * as Sidebar from '$lib/components/ui/sidebar';
  import * as Popover from '$lib/components/ui/popover';
  import { Button } from '$lib/components/ui/button';

  import { appStore } from '$lib/stores/app.store.svelte';
  import { ROUTE } from '$lib/shared/shared.constant';

  const menuItems = $derived([
    {
      title: 'Home',
      icon: House,
      href: `/home`
    },
    { title: 'Collection', icon: GalleryVerticalEnd, href: '/collection' },
    { title: 'Profile', icon: User, href: '/profile' }
    // { title: 'Saved', icon: Save, href: '/saved' }
  ]);

  // Handle logout function
  function handleLogout() {
    appStore.signOut();
    goto(ROUTE.LANDING);
  }
</script>

<Sidebar.Root>
  <Sidebar.Header class="mx-2 flex  justify-start px-4 pt-4">
    <a href={ROUTE.HOME}>
      <img src={IRARIUM_LOGO} class="h-10 w-10" alt="Irarium Logo" />
    </a>
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
                    <a
                      href="/settings/account"
                      class="flex items-center gap-2 px-4 py-2 hover:bg-accent"
                    >
                      <User class="h-4 w-4" />
                      <span>Account Settings</span>
                    </a>
                    <a
                      href="/settings/privacy"
                      class="flex items-center gap-2 px-4 py-2 hover:bg-accent"
                    >
                      <Shield class="h-4 w-4" />
                      <span>Privacy & Safety</span>
                    </a>
                    <a
                      href="/help"
                      class="flex items-center gap-2 px-4 py-2 hover:bg-accent"
                    >
                      <HelpCircle class="h-4 w-4" />
                      <span>Help Center</span>
                    </a>
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
