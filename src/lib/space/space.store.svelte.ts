import { pb } from '$lib/db/client';
import { COLLECTION, type Space } from '$lib/shared/shared.type';

export class SpaceStore {
  activeIrariumId = $state<string | null>(null);
  userSpaces = $state<Space[]>([]);
  publicSpaces = $state<Space[]>([]);
  isLoading = $state(false);
  error = $state<string | null>(null);
  
  // UI State for Spaces Page
  searchQuery = $state('');
  sortBy = $state<'most-irariums' | 'fewest-irariums' | 'newest' | 'oldest'>('most-irariums');
  
  irariumCounts = $state<Record<string, number>>({});

  lastFetchedUserSpaces = $state('');
  lastFetchedPublicSpaces = $state('');
  
  // Pagination State
  publicPage = $state(1);
  perPage = 50;
  hasMorePublicSpaces = $state(true);
  isLoadingMore = $state(false);
  
  hasFetchedUserSpaces = $derived(!!this.lastFetchedUserSpaces);
  hasFetchedPublicSpaces = $derived(!!this.lastFetchedPublicSpaces);

  // Auto-rotate is enabled when no irarium is active
  isAutoRotateEnabled = $derived(this.activeIrariumId === null);

  filteredPublicSpaces = $derived.by(() => {
    // First filter by search query
    let result = this.publicSpaces;
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = this.publicSpaces.filter((s) => {
        const name = s.name?.toLowerCase() || '';
        const description = s.description?.toLowerCase() || '';
        const tags = s.tags?.toLowerCase() || '';
        return (
          name.includes(query) || description.includes(query) || tags.includes(query)
        );
      });
    }

    // Then sort
    return [...result].sort((a, b) => {
      switch (this.sortBy) {
        case 'most-irariums':
          return (
            (this.irariumCounts[b.id] || 0) -
            (this.irariumCounts[a.id] || 0)
          );
        case 'fewest-irariums':
          return (
            (this.irariumCounts[a.id] || 0) -
            (this.irariumCounts[b.id] || 0)
          );
        case 'newest':
          return new Date(b.created).getTime() - new Date(a.created).getTime();
        case 'oldest':
          return new Date(a.created).getTime() - new Date(b.created).getTime();
        default:
          return 0;
      }
    });
  });

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

      this.userSpaces = records.items.map((item: any) => this.mapRecordToSpace(item));
      
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

  async fetchPublicSpaces(force = false) {
    if (this.hasFetchedPublicSpaces && !force) return;

    this.isLoading = true;
    this.error = null;
    this.publicPage = 1;
    this.hasMorePublicSpaces = true;

    try {
      const records = await pb.collection(COLLECTION.SPACES).getList(1, this.perPage, {
        sort: 'name',
        filter: 'isPublic = true',
        expand: 'createdBy'
      });

      this.publicSpaces = records.items.map((item: any) => this.mapRecordToSpace(item));
      
      this.lastFetchedPublicSpaces = new Date().toISOString();
      this.hasMorePublicSpaces = records.items.length === this.perPage;
      
      // Fetch counts for these spaces
      this.publicSpaces.forEach(space => this.fetchIrariumCount(space.id));
    } catch (err: any) {
      console.error('Error fetching public spaces:', err);
      this.error = 'Failed to load spaces';
    } finally {
      this.isLoading = false;
    }
  }

  async loadMorePublicSpaces() {
    if (!this.hasMorePublicSpaces || this.isLoadingMore) return;

    this.isLoadingMore = true;
    const nextPage = this.publicPage + 1;

    try {
      const records = await pb.collection(COLLECTION.SPACES).getList(nextPage, this.perPage, {
        sort: 'name',
        filter: 'isPublic = true',
        expand: 'createdBy'
      });

      const newSpaces = records.items.map((item: any) => this.mapRecordToSpace(item));
      this.publicSpaces = [...this.publicSpaces, ...newSpaces];
      
      this.publicPage = nextPage;
      this.hasMorePublicSpaces = records.items.length === this.perPage;
      
      // Fetch counts for these new spaces
      newSpaces.forEach(space => this.fetchIrariumCount(space.id));
    } catch (err: any) {
      console.error('Error loading more public spaces:', err);
    } finally {
      this.isLoadingMore = false;
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

  async fetchSpacesByIds(spaceIds: string[]): Promise<Space[]> {
    if (!spaceIds || spaceIds.length === 0) return [];

    try {
      // Build filter for multiple IDs: id = "id1" || id = "id2" || ...
      const filter = spaceIds.map(id => `id = "${id}"`).join(' || ');
      
      const records = await pb.collection(COLLECTION.SPACES).getList(1, 50, {
        filter,
        expand: 'createdBy'
      });

      const spaces = records.items.map((item: any) => this.mapRecordToSpace(item));
      
      // Fetch counts for these spaces
      spaces.forEach(space => this.fetchIrariumCount(space.id));
      
      return spaces;
    } catch (err: any) {
      console.error('Error fetching spaces by IDs:', err);
      return [];
    }
  }

  private mapRecordToSpace(item: any): Space {
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      slug: item.slug,
      tags: item.tags,
      type: item.type,
      createdBy: item.createdBy,
      mods: item.mods,
      isPublic: item.isPublic,
      isShared: item.isShared || false,
      created: item.created,
      updated: item.updated,
      username: item.expand?.createdBy?.username,
      size: item.size
    };
  }

  removeSpace(spaceId: string) {
    this.userSpaces = this.userSpaces.filter((s) => s.id !== spaceId);
    this.publicSpaces = this.publicSpaces.filter((s) => s.id !== spaceId);
  }
}

export const spaceStore = new SpaceStore();
