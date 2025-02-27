<script lang="ts">
  import {
    GalleryVerticalEnd,
    MessageSquare,
    Save,
    ChevronDown,
    Settings,
    User,
    House
  } from 'lucide-svelte';

  import IRARIUM_LOGO from '$lib/assets/irarium.png';

  import * as Sidebar from '$lib/components/ui/sidebar';
  import * as Collapsible from '$lib/components/ui/collapsible';

  import { appState } from '$lib/state/app.state.svelte';
  import { ROUTE } from '$lib/shared/shared.constant';

  const menuItems = $derived([
    {
      title: 'Home',
      icon: House,
      href: `/home`
    },
    { title: 'Collection', icon: GalleryVerticalEnd, href: '/collection' }
    // { title: 'Saved', icon: Save, href: '/saved' }
  ]);

  // Add default open state
  let isOpen = $state(true);
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
      <Sidebar.Group class="p-0">
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <a
                href="/settings"
                class="mx-2 flex w-full items-center gap-3 rounded-md px-5 py-3 text-base hover:bg-accent hover:text-accent-foreground"
              >
                <div
                  class="flex h-5 w-5 items-center justify-center rounded-full bg-muted"
                >
                  <User class="h-4 w-4" />
                </div>
                <span>Settings</span>
              </a>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    </div>
  </Sidebar.Content>
</Sidebar.Root>
