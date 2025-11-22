<script lang="ts">
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';

  import { authStore } from '$lib/auth/auth.store.svelte';
  import { irariumsStore } from '$lib/irarium/irariums.store.svelte';
  import { spaceStore } from '$lib/space/space.store.svelte';
  import { countThoughts } from '$lib/irarium/irarium.tools.svelte';
  import { Button } from '$lib/components/ui/button';
  import UserNavbar from '$lib/shared/user-navbar.svelte';
  import * as Tabs from '$lib/components/ui/tabs';
  import { MapPin } from '@lucide/svelte';

  // Dialog components
  import * as Dialog from '$lib/components/ui/dialog';

  let showDialog = $state(false);

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

    <div class="container mx-auto max-w-3xl px-4 py-6">
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
      <div>
        <Tabs.Root value="irariums" class="w-full">
          <Tabs.List class="grid w-full grid-cols-2">
            <Tabs.Trigger value="irariums">Irariums</Tabs.Trigger>
            <Tabs.Trigger value="spaces">Spaces</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="irariums" class="mt-4">
            {#if irariumsStore.isLoading}
              <div class="flex justify-center py-8">
                <div class="animate-pulse text-center">
                  <p>Loading irariums...</p>
                </div>
              </div>
            {:else if userPublicIrariums.length === 0}
              <div class="rounded-lg border border-dashed p-8 text-center">
                <h3 class="mb-2 text-xl font-medium">No public irariums</h3>
                <p class="mb-4 text-muted-foreground">
                  This user hasn't made any irariums public yet.
                </p>
              </div>
            {:else}
              <div class="space-y-4">
                {#each userPublicIrariums as irarium}
                  <a
                    href={`/${irarium.id}`}
                    class="block rounded-lg border border-muted p-4 transition-colors hover:bg-muted/30"
                  >
                    {#if irarium.title && irarium.title !== irarium.id}
                      <h3 class="mb-2 line-clamp-3 font-semibold">{irarium.title}</h3>
                    {:else}
                      <div class="mb-2 line-clamp-3">
                        {@html irarium.content || 'No content'}
                      </div>
                    {/if}
                    <div class="flex justify-between text-xs text-muted-foreground">
                      <div class="flex items-center gap-3">
                        <span>{formatDate(irarium.updated)}</span>
                        {#if irarium.space}
                          <a
                            href={`/spaces/${irarium.space.slug}-${irarium.spaceId}`}
                            class="flex items-center gap-1 hover:text-foreground hover:underline"
                            onclick={(e) => e.stopPropagation()}
                          >
                            <MapPin size={12} />
                            {irarium.space.name}
                          </a>
                        {/if}
                      </div>
                      <span>{countThoughts(irarium)} thoughts</span>
                    </div>
                  </a>
                {/each}
              </div>
            {/if}
          </Tabs.Content>

          <Tabs.Content value="spaces" class="mt-4">
            {#if spaceStore.isLoading}
              <div class="flex justify-center py-8">
                <div class="animate-pulse text-center">
                  <p>Loading spaces...</p>
                </div>
              </div>
            {:else if spaceStore.userSpaces.filter((s) => s.isPublic).length === 0}
              <div class="rounded-lg border border-dashed p-8 text-center">
                <h3 class="mb-2 text-xl font-medium">No public spaces</h3>
                <p class="mb-4 text-muted-foreground">
                  This user hasn't made any spaces public yet.
                </p>
              </div>
            {:else}
              <div class="grid gap-4 md:grid-cols-2">
                {#each spaceStore.userSpaces.filter((s) => s.isPublic) as space}
                  <a
                    href={`/spaces/${space.slug}-${space.id}`}
                    class="block rounded-lg border border-muted p-6 transition-colors hover:bg-muted/30"
                  >
                    <h3 class="mb-2 text-xl font-semibold">{space.name}</h3>
                    <p class="text-sm text-muted-foreground">
                      {space.description || 'No description'}
                    </p>
                    <div class="mt-4 flex items-center text-xs text-muted-foreground">
                      <span class="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="mr-1"
                          ><path
                            d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                          ></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"
                          ></polyline><line x1="12" y1="22.08" x2="12" y2="12"
                          ></line></svg
                        >
                        {spaceStore.irariumCounts[space.id] || 0} irariums
                      </span>
                    </div>
                  </a>
                {/each}
              </div>
            {/if}
          </Tabs.Content>
        </Tabs.Root>
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
