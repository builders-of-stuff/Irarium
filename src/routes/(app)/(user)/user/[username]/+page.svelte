<script lang="ts">
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';

  import { authStore } from '$lib/auth/auth.store.svelte';
  import { irariumsStore } from '$lib/irarium/irariums.store.svelte';
  import { spaceStore } from '$lib/space/space.store.svelte';
  import { countThoughts } from '$lib/irarium/irarium.tools.svelte';
  import { Button } from '$lib/components/ui/button';
  import UserNavbar from '$lib/shared/user-navbar.svelte';
  import * as Collapsible from '$lib/components/ui/collapsible';
  import { MapPin, ChevronDown } from '@lucide/svelte';
  import DateDisplay from '$lib/components/shared/date-display.svelte';
  import SpaceCard from '$lib/components/shared/space-card.svelte';

  // Dialog components
  import * as Dialog from '$lib/components/ui/dialog';

  let showDialog = $state(false);
  let spacesOpen = $state(true);
  let irariumsOpen = $state(true);

  // Form inputs
  let bioInput = $state('');
  let nameInput = $state('');
  let usernameInput = $state('');

  onMount(async () => {
    if (authStore.userId) {
      // Initialize form inputs with current user data
      bioInput = authStore.user.bio || '';
      nameInput = authStore.user.name || '';
      usernameInput = authStore.username || '';

      // Fetch the user's irariums and spaces
      try {
        await irariumsStore.fetchUserIrariums(authStore.userId);
        await irariumsStore.fetchPublicIrariums();
        await spaceStore.fetchUserSpaces(authStore.userId);
      } catch (error) {
        toast.error('Failed to load profile data. Please refresh the page.');
      }
    } else {
      toast.error('You must be logged in to view your profile.');
    }
  });

  // Get the user's public irariums
  const userPublicIrariums = $derived(
    irariumsStore.userIrariums.filter(
      (irarium) => irarium.userId === authStore.userId && irarium.isPublic
    )
  );

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function handleEditProfile() {
    nameInput = authStore.user.name || '';
    bioInput = authStore.user.bio || '';
    usernameInput = authStore.username || '';
    showDialog = true;
  }

  async function handleSaveProfile() {
    try {
      const result = await authStore.updateProfile(nameInput, bioInput, usernameInput);
      if (result.success) {
        showDialog = false;
        toast.success('Profile updated successfully');
      } else {
        toast.error(authStore.updateError || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  }

  // Function to handle logging out with toast
  async function handleLogout() {
    try {
      const result = await authStore.signOut();
      if (result.success) {
        toast.success('Logged out successfully');
        // Redirect if needed
      } else {
        toast.error('Failed to log out');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  }
</script>

<div class="relative min-h-screen overflow-hidden">
  <div class="relative z-10">
    <UserNavbar title="Profile" />

    <div class="container mx-auto max-w-3xl px-4 py-6 pt-32 md:pt-20">
      <!-- Profile header -->
      <div class="mb-8 rounded-xl bg-muted/30 p-6">
        <div class="flex flex-col md:flex-row md:items-start md:gap-6">
          <!-- Avatar placeholder -->
          <!-- <div class="mb-4 h-24 w-24 rounded-full bg-muted md:mb-0"></div> -->

          <div class="flex-1">
            <div class="mb-4 flex items-start justify-between">
              <div>
                <h1 class="text-2xl font-bold">
                  {authStore.user.name || 'Anonymous User'}
                </h1>
                <p class="text-sm text-muted-foreground">
                  @{authStore.username || authStore.userId?.substring(0, 8) || 'user'}
                </p>
              </div>

              <Button variant="outline" size="sm" onclick={handleEditProfile}>
                Edit profile
              </Button>
            </div>

            {#if authStore.user.bio}
              <p class="mb-4 text-base whitespace-pre-wrap">{authStore.user.bio}</p>
            {:else}
              <p class="mb-4 text-muted-foreground">No bio yet</p>
            {/if}

            <div class="flex items-center text-sm text-muted-foreground">
              <span class="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="mr-1 h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Joined {formatDate(authStore.user.created || '')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Public Content section -->
      <div class="space-y-8">
        <!-- Spaces Section -->
        <div>
          <Collapsible.Root bind:open={spacesOpen}>
            <Collapsible.Trigger
              class="mb-4 flex w-full items-center justify-between text-left font-semibold transition-opacity hover:opacity-70"
            >
              <h2 class="text-lg">Spaces</h2>
              <ChevronDown
                size={18}
                class="text-muted-foreground transition-transform duration-200 {spacesOpen
                  ? 'rotate-180'
                  : ''}"
              />
            </Collapsible.Trigger>

            <Collapsible.Content>
              {#if spaceStore.isLoading}
                <div class="flex justify-center py-8">
                  <div class="animate-pulse text-center">
                    <p>Loading spaces...</p>
                  </div>
                </div>
              {:else if spaceStore.userSpaces.filter((s) => s.isPublic).length === 0}
                <div class="py-8 text-center text-muted-foreground">
                  <p>No public spaces yet.</p>
                </div>
              {:else}
                <div class="space-y-4">
                  {#each spaceStore.userSpaces.filter((s) => s.isPublic) as space}
                    <SpaceCard
                      {space}
                      irariumCount={spaceStore.irariumCounts[space.id] || 0}
                    />
                  {/each}
                </div>
              {/if}
            </Collapsible.Content>
          </Collapsible.Root>
        </div>

        <!-- Irariums Section -->
        <div>
          <Collapsible.Root bind:open={irariumsOpen}>
            <Collapsible.Trigger
              class="mb-4 flex w-full items-center justify-between text-left font-semibold transition-opacity hover:opacity-70"
            >
              <h2 class="text-lg">Irariums</h2>
              <ChevronDown
                size={18}
                class="text-muted-foreground transition-transform duration-200 {irariumsOpen
                  ? 'rotate-180'
                  : ''}"
              />
            </Collapsible.Trigger>

            <Collapsible.Content>
              {#if irariumsStore.isLoading}
                <div class="flex justify-center py-8">
                  <div class="animate-pulse text-center">
                    <p>Loading irariums...</p>
                  </div>
                </div>
              {:else if userPublicIrariums.length === 0}
                <div class="py-8 text-center text-muted-foreground">
                  <p>No public irariums yet.</p>
                </div>
              {:else}
                <div class="space-y-4">
                  {#each userPublicIrariums as irarium}
                    <a
                      href={`/${irarium.id}`}
                      class="block rounded-lg border border-muted p-4 transition-colors hover:bg-muted/30"
                    >
                      {#if irarium.title && irarium.title !== irarium.id}
                        <h3 class="mb-2 line-clamp-3 font-semibold">
                          {irarium.title}
                        </h3>
                      {:else}
                        <div class="mb-2 line-clamp-3">
                          {@html irarium.content || 'No content'}
                        </div>
                      {/if}
                      <div class="flex justify-between text-xs text-muted-foreground">
                        <div class="flex items-center gap-3">
                          <DateDisplay
                            created={irarium.created}
                            updated={irarium.updated}
                          />
                          {#if irarium.space}
                            <button
                              type="button"
                              class="flex items-center gap-1 hover:text-foreground hover:underline"
                              onclick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                window.location.href = `/spaces/${irarium.space?.slug}-${irarium.spaceId}`;
                              }}
                            >
                              <MapPin size={12} />
                              {irarium.space.name}
                            </button>
                          {/if}
                        </div>
                        <span>{countThoughts(irarium)} thoughts</span>
                      </div>
                    </a>
                  {/each}
                </div>

                {#if irariumsStore.hasMoreUserIrariums && userPublicIrariums.length > 0}
                  <div class="mt-8 flex justify-center">
                    <Button
                      variant="outline"
                      disabled={irariumsStore.isLoadingMore}
                      onclick={() =>
                        irariumsStore.loadMoreUserIrariums(authStore.userId)}
                    >
                      {irariumsStore.isLoadingMore ? 'Loading...' : 'Load More'}
                    </Button>
                  </div>
                {/if}
              {/if}
            </Collapsible.Content>
          </Collapsible.Root>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Edit Profile Dialog -->
<Dialog.Root bind:open={showDialog}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Edit Profile</Dialog.Title>
      <Dialog.Description>Update your profile information</Dialog.Description>
    </Dialog.Header>

    <div class="space-y-4 py-2">
      <div class="space-y-2">
        <label for="name" class="text-sm font-medium">Name</label>
        <input
          id="name"
          type="text"
          bind:value={nameInput}
          class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
          placeholder="Your name"
          maxlength="50"
        />
      </div>

      <div class="space-y-2">
        <label for="username" class="text-sm font-medium">Username</label>
        <div class="flex items-center">
          <span class="mr-1 text-sm text-muted-foreground">@</span>
          <input
            id="username"
            type="text"
            bind:value={usernameInput}
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
            placeholder="username"
            maxlength="30"
          />
        </div>
        <p class="text-xs text-muted-foreground">
          Your username appears in your profile URL and irariums
        </p>
      </div>

      <div class="space-y-2">
        <label for="bio" class="text-sm font-medium">Bio</label>
        <textarea
          id="bio"
          bind:value={bioInput}
          class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
          placeholder="Tell us about yourself"
          rows="4"
          maxlength="160"
        ></textarea>
      </div>

      {#if authStore.updateError}
        <p class="text-sm text-destructive">{authStore.updateError}</p>
      {/if}
    </div>

    <Dialog.Footer>
      <Button variant="outline" onclick={() => (showDialog = false)}>Cancel</Button>
      <Button onclick={handleSaveProfile} disabled={authStore.isUpdating}>
        {authStore.isUpdating ? 'Saving...' : 'Save changes'}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
