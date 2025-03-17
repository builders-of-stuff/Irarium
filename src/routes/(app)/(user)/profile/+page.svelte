<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '$lib/auth/auth.store.svelte';
  import { irariumsStore } from '$lib/irarium/irariums.store.svelte';
  import { Button } from '$lib/components/ui/button';
  import UserNavbar from '$lib/shared/user-navbar.svelte';
  import { pb } from '$lib/db/client';
  import { COLLECTION } from '$lib/shared/shared.type';

  // Dialog components
  import * as Dialog from '$lib/components/ui/dialog';

  let bio = $state('');
  let name = $state('');
  let isUpdating = $state(false);
  let updateError = $state('');
  let showDialog = $state(false);

  // Form inputs
  let bioInput = $state('');
  let nameInput = $state('');

  onMount(async () => {
    if (authStore.userId) {
      name = authStore.user.name || '';

      // Check if the user has a bio field, if not it will default to empty string
      try {
        const userRecord = await pb
          .collection(COLLECTION.USERS)
          .getOne(authStore.userId);
        bio = userRecord.bio || '';
      } catch (error) {
        console.error('Error fetching user bio:', error);
      }

      // Fetch the user's irariums
      irariumsStore.fetchUserIrariums(authStore.userId);
      irariumsStore.fetchPublicIrariums();
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
    nameInput = name;
    bioInput = bio;
    showDialog = true;
  }

  async function handleSaveProfile() {
    if (!authStore.userId) return;

    isUpdating = true;
    updateError = '';

    try {
      await pb.collection(COLLECTION.USERS).update(authStore.userId, {
        name: nameInput,
        bio: bioInput
      });

      // Update local state
      name = nameInput;
      bio = bioInput;
      showDialog = false;

      // Refresh auth store user data
      authStore.refreshUser();
    } catch (error) {
      console.error('Error updating profile:', error);
      updateError = 'Failed to update profile. Please try again.';
    } finally {
      isUpdating = false;
    }
  }
</script>

<UserNavbar title="Profile" />

<div class="container mx-auto max-w-3xl px-4 py-6">
  <!-- Profile header -->
  <div class="mb-8 rounded-xl bg-muted/30 p-6">
    <div class="flex flex-col md:flex-row md:items-start md:gap-6">
      <!-- Avatar placeholder -->
      <div class="mb-4 h-24 w-24 rounded-full bg-muted md:mb-0"></div>

      <div class="flex-1">
        <div class="mb-4 flex items-start justify-between">
          <div>
            <h1 class="text-2xl font-bold">{name || 'Anonymous User'}</h1>
            <p class="text-sm text-muted-foreground">
              @{authStore.userId?.substring(0, 8) || 'user'}
            </p>
          </div>

          <Button variant="outline" size="sm" onclick={handleEditProfile}>
            Edit profile
          </Button>
        </div>

        {#if bio}
          <p class="mb-4 whitespace-pre-wrap text-base">{bio}</p>
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

  <!-- Public Irariums section -->
  <div>
    <h2 class="mb-4 text-xl font-semibold">Public Irariums</h2>

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
          You haven't made any irariums public yet.
        </p>
        <Button href="/collection">View All My Irariums</Button>
      </div>
    {:else}
      <div class="space-y-4">
        {#each userPublicIrariums as irarium}
          <a
            href={`/${irarium.id}`}
            class="block rounded-lg border p-4 transition-all hover:bg-muted/30"
          >
            <h3 class="mb-1 font-medium">{irarium.title || 'Untitled Irarium'}</h3>
            <div class="mb-2 line-clamp-2 text-sm text-muted-foreground">
              {irarium.description || 'No description'}
            </div>
            <div class="flex justify-between text-xs text-muted-foreground">
              <span>Updated {formatDate(irarium.updated)}</span>
              {#if irarium.tags}
                <span>{irarium.tags}</span>
              {/if}
            </div>
          </a>
        {/each}
      </div>
    {/if}
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
          class="w-full rounded-md border border-input px-3 py-2 text-sm"
          placeholder="Your name"
          maxlength="50"
        />
      </div>

      <div class="space-y-2">
        <label for="bio" class="text-sm font-medium">Bio</label>
        <textarea
          id="bio"
          bind:value={bioInput}
          class="w-full rounded-md border border-input px-3 py-2 text-sm"
          placeholder="Tell us about yourself"
          rows="4"
          maxlength="160"
        ></textarea>
      </div>

      {#if updateError}
        <p class="text-sm text-destructive">{updateError}</p>
      {/if}
    </div>

    <Dialog.Footer>
      <Button variant="outline" onclick={() => (showDialog = false)}>Cancel</Button>
      <Button onclick={handleSaveProfile} disabled={isUpdating}>
        {isUpdating ? 'Saving...' : 'Save changes'}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
