<script lang="ts">
  import {
    GalleryVerticalEnd,
    MessageSquare,
    Save,
    ChevronDown,
    Settings
  } from 'lucide-svelte';

  import IRARIUM_LOGO from '$lib/assets/irarium.png';

  import * as Sidebar from '$lib/components/ui/sidebar';
  import * as Collapsible from '$lib/components/ui/collapsible';

  import { appState } from '$lib/state/app.state.svelte';

  const menuItems = $derived([
    {
      title: 'Home',
      icon: MessageSquare,
      href: `/home`
    },
    { title: 'Collection', icon: Settings, href: '/collection' },
    {
      title: 'Settings',
      icon: Settings,
      href: `/settings`
    }
    // { title: 'Saved', icon: Save, href: '/saved' }
  ]);

  // Add default open state
  let isOpen = $state(true);
</script>

<Sidebar.Root>
  <Sidebar.Header class="flex items-center justify-center pt-4">
    <a href="/">
      <img src={IRARIUM_LOGO} class="h-32 w-32 rounded-full" alt="Irarium Logo" />
    </a>
  </Sidebar.Header>

  <Sidebar.Content class="py-2">
    {#each menuItems as item}
      <Sidebar.Group class="p-0">
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <a
                href={item.href}
                class="flex w-full items-center gap-2 px-3 py-1.5 hover:bg-accent hover:text-accent-foreground"
              >
                {#if item.icon}
                  <item.icon class="h-4 w-4" />
                {/if}
                <span>{item.title}</span>
              </a>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    {/each}
  </Sidebar.Content>
</Sidebar.Root>
