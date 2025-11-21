import { pb } from '$lib/db/client';
import { COLLECTION, type Space } from '$lib/shared/shared.type';

export class SpaceStore {
  activeIrariumId = $state<string | null>(null);
  userSpaces = $state<Space[]>([]);
  isLoading = $state(false);
  error = $state<string | null>(null);
  
  irariumCounts = $state<Record<string, number>>({});

  lastFetchedUserSpaces = $state('');
  
  hasFetchedUserSpaces = $derived(!!this.lastFetchedUserSpaces);

  // Auto-rotate is enabled when no irarium is active
  isAutoRotateEnabled = $derived(this.activeIrariumId === null);

  setActiveIrarium(id: string | null) {
    this.activeIrariumId = id;
  }

  async fetchUserSpaces(userId: string, force = false) {
    if (this.hasFetchedUserSpaces && !force) return;

    this.isLoading = true;
    this.error = null;
    try {
      const records = await pb.collection(COLLECTION.SPACES).getList(1, 50, {
        filter: `createdBy = "${userId}"`,
        sort: '-created',
        requestKey: null // Allow multiple requests without auto-cancel if needed, but we handle abort below
      });

      this.userSpaces = records.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        slug: item.slug,
        tags: item.tags,
        type: item.type,
        createdBy: item.createdBy,
        mods: item.mods,
        isPublic: item.isPublic
      }));
      
      this.lastFetchedUserSpaces = new Date().toISOString();
      
      // Fetch counts for these spaces
      this.userSpaces.forEach(space => this.fetchIrariumCount(space.id));
    } catch (err: any) {
      // Ignore auto-cancellation errors
      if (err.isAbort) return;
      
      console.error('Error fetching user spaces:', err);
      this.error = 'Failed to load spaces';
    } finally {
      this.isLoading = false;
    }
  }

  async fetchIrariumCount(spaceId: string) {
    try {
      const result = await pb.collection(COLLECTION.IRARIUMS).getList(1, 1, {
        filter: `spaceId = "${spaceId}"`,
        fields: 'id', // Minimal fetch
        requestKey: `irarium-count-${spaceId}` // Unique key per space to prevent auto-cancel
      });

      // Create a new object to trigger reactivity
      this.irariumCounts = { ...this.irariumCounts, [spaceId]: result.totalItems };
    } catch (err: any) {
      console.error(`Error fetching count for space ${spaceId}:`, err);

      // Only set to 0 if not an abort error
      if (!err.isAbort) {
        this.irariumCounts = { ...this.irariumCounts, [spaceId]: 0 };
      }
    }
  }
}

export const spaceStore = new SpaceStore();
