import { authStore } from '$lib/auth/auth.store.svelte';
import { irariumsStore } from '$lib/irarium/irariums.store.svelte';
import { spaceStore } from '$lib/space/space.store.svelte';

/**
 * Refreshes the entire application state (user, spaces, irariums).
 * Call this after any mutation that might affect global state.
 */
export async function refreshState() {
  const userId = authStore.userId;
  if (!userId) return;

  const promises = [
    authStore.refreshUser(),
    spaceStore.fetchUserSpaces(userId, true),
    irariumsStore.fetchUserIrariums(userId, true)
  ];

  await Promise.all(promises);
}
