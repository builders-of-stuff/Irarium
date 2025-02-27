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
    { title: 'Settings', icon: Settings, href: '/settings' },
    {
      title: 'Flashcards',
      icon: GalleryVerticalEnd,
      href: `/home`,
      children: [
        {
          title: 'Words',
          href: `/home/flashcards/words`,
          disabled: false
        },
        {
          title: 'Phrases',
          href: `/home/flashcards/phrases`
        }
      ]
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
            {#if item.children}
              <Collapsible.Root bind:open={isOpen}>
                <Sidebar.MenuItem>
                  <div class="flex w-full items-center justify-between">
                    <a
                      href={item.href}
                      class="flex w-full items-center gap-2 px-3 py-1.5 hover:bg-accent hover:text-accent-foreground"
                    >
                      {#if item.icon}
                        <item.icon class="h-4 w-4" />
                      {/if}
                      <span>{item.title}</span>
                    </a>
                    <Collapsible.Trigger
                      class="rounded-md px-3 py-1.5 hover:bg-accent hover:text-accent-foreground"
                    >
                      <ChevronDown
                        class="h-4 w-4 transition-transform duration-200 {isOpen
                          ? 'rotate-180'
                          : ''}"
                      />
                    </Collapsible.Trigger>
                  </div>
                  <Collapsible.Content>
                    <Sidebar.MenuSub>
                      {#each item.children as child}
                        <Sidebar.MenuSubItem>
                          <a
                            href={child.disabled ? null : child.href}
                            class="flex w-full items-center px-4 py-1.5 {child.disabled
                              ? 'cursor-not-allowed opacity-50'
                              : 'hover:bg-accent hover:text-accent-foreground'}"
                          >
                            <span>{child.title}</span>
                          </a>
                        </Sidebar.MenuSubItem>
                      {/each}
                    </Sidebar.MenuSub>
                  </Collapsible.Content>
                </Sidebar.MenuItem>
              </Collapsible.Root>
            {:else}
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
            {/if}
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    {/each}
  </Sidebar.Content>
</Sidebar.Root>
