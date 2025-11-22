<script lang="ts">
  import { GalleryVerticalEnd, Settings, User, Box } from '@lucide/svelte';
  import { goto } from '$app/navigation';

  import IrariumLogo from '$lib/components/irarium-logo.svelte';

  import * as Sidebar from '$lib/components/ui/sidebar';
  import { Button } from '$lib/components/ui/button';

  import { authStore } from '$lib/auth/auth.store.svelte';
  import { irariumsStore } from '$lib/irarium/irariums.store.svelte';
  import { ROUTE } from '$lib/shared/shared.constant';

  const menuItems = $derived([
    { title: 'Spaces', icon: Box, href: '/spaces' },
    { title: 'Collections', icon: GalleryVerticalEnd, href: '/collections' },
    { title: 'Profile', icon: User, href: `/user/${authStore?.username}` },
    { title: 'Settings', icon: Settings, href: '/settings' }
  ]);
</script>

<Sidebar.Root variant="sidebar" class="border-r bg-background/50 backdrop-blur-sm">
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

    <div class="mt-auto px-2 pb-6">
      <a href="/create" class="block">
        <Button
          variant="default"
          class="w-full rounded-full py-7 text-lg font-semibold shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Create
        </Button>
      </a>
    </div>
  </Sidebar.Content>
</Sidebar.Root>
