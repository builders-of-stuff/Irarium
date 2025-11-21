<script lang="ts">
  import {
    GalleryVerticalEnd,
    Settings,
    User,
    Box,
    LogOut,
    MoreHorizontal
  } from '@lucide/svelte';
  import { goto } from '$app/navigation';

  import IrariumLogo from '$lib/components/irarium-logo.svelte';

  import * as Sidebar from '$lib/components/ui/sidebar';
  import * as Popover from '$lib/components/ui/popover';
  import { Button } from '$lib/components/ui/button';

  import { authStore } from '$lib/auth/auth.store.svelte';
  import { irariumsStore } from '$lib/irarium/irariums.store.svelte';
  import { ROUTE } from '$lib/shared/shared.constant';

  const menuItems = $derived([
    { title: 'Spaces', icon: Box, href: '/spaces' },
    { title: 'Collections', icon: GalleryVerticalEnd, href: '/collections' },
    { title: 'Profile', icon: User, href: `/user/${authStore?.username}` }
  ]);

  // Handle logout function
  function handleLogout() {
    authStore.signOut();
    irariumsStore.clearStore();

    goto(ROUTE.LANDING);
  }
</script>

<Sidebar.Root variant="floating" class="border-r bg-background/50 backdrop-blur-sm">
  <Sidebar.Header class="flex flex-row items-center justify-between px-6 pt-6 pb-2">
    <a
      href={ROUTE.HOME}
      class="flex items-center gap-3 transition-opacity hover:opacity-80"
    >
      <IrariumLogo class="h-10 w-10 text-primary" />
      <span class="text-xl font-bold tracking-tight">Irarium</span>
    </a>
    <Sidebar.Trigger class="hidden md:flex" />
  </Sidebar.Header>

  <Sidebar.Content class="px-4 py-4">
    <Sidebar.Group>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each menuItems as item}
            <Sidebar.MenuItem>
              <a
                href={item.href}
                class="flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <item.icon class="h-5 w-5" />
                <span>{item.title}</span>
              </a>
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>

    <div class="mt-auto flex flex-col gap-4 pb-6">
      <div class="px-2">
        <a href="/create" class="block">
          <Button
            variant="default"
            class="w-full rounded-full py-7 text-lg font-semibold shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Create
          </Button>
        </a>
      </div>

      <Sidebar.Group>
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Popover.Root>
                <Popover.Trigger class="w-full">
                  <button
                    class="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <div
                      class="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground"
                    >
                      <Settings class="h-5 w-5" />
                    </div>
                    <span class="flex-1 text-left">Settings</span>
                    <MoreHorizontal class="h-5 w-5 text-muted-foreground" />
                  </button>
                </Popover.Trigger>
                <Popover.Content class="w-56 p-1" align="start" side="right">
                  <button
                    class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                    onclick={handleLogout}
                  >
                    <LogOut class="h-4 w-4" />
                    <span>Log Out</span>
                  </button>
                </Popover.Content>
              </Popover.Root>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    </div>
  </Sidebar.Content>
</Sidebar.Root>
