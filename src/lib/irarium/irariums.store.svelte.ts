import { pb } from '$lib/db/client';
import { COLLECTION, type Irarium } from '$lib/shared/shared.type';
import { spaceStore } from '$lib/space/space.store.svelte';
import { authStore } from '$lib/auth/auth.store.svelte';
import { DEFAULT_SPACE_SIZE } from '$lib/shared/space.constants';
import { refreshState } from '$lib/utils/state.utils';

export class IrariumsStore {
  userIrariums = $state<Irarium[]>([]);
  publicIrariums = $state<Irarium[]>([]);

  lastFetchedUserIrariums = $state('');
  lastFetchedPublicIrariums = $state('');
  isLoading = $state(true);
  error = $state<string | null>(null);

  // Pagination State
  userPage = $state(1);
  publicPage = $state(1);
  perPage = 50;
  hasMoreUserIrariums = $state(true);
  hasMorePublicIrariums = $state(true);
  isLoadingMore = $state(false);

  // user + public - duplicates
  allIrariums = $derived([
    ...new Map(
      [...this.userIrariums, ...this.publicIrariums].map((irarium) => [
        irarium.id,
        irarium
      ])
    ).values()
  ]);
  hasFetchedUserIrariums = $derived(!!this.lastFetchedUserIrariums);
  hasFetchedPublicIrariums = $derived(!!this.lastFetchedPublicIrariums);

  // Group public irariums by spaceId
  publicIrariumsBySpace = $derived.by(() => {
    const groups: Record<string, Irarium[]> = {};
    for (const irarium of this.publicIrariums) {
      const spaceId = irarium.spaceId || 'default-space';
      if (!groups[spaceId]) {
        groups[spaceId] = [];
      }
      groups[spaceId].push(irarium);
    }
    return groups;
  });

  constructor() {}

  async deleteIrarium(id: string) {
    this.isLoading = true;
    this.error = null;

    try {
      await pb.collection(COLLECTION.IRARIUMS).delete(id);

      await refreshState();
    } catch (err) {
      console.error('Error deleting irarium:', err);
      this.error = 'Failed to delete irarium. Please try again later.';
    } finally {
      this.isLoading = false;
    }
  }

  async fetchUserIrariums(userId: string, force = false) {
    if (this.hasFetchedUserIrariums && !force) return;

    this.isLoading = true;
    this.error = null;
    this.userPage = 1;
    this.hasMoreUserIrariums = true;

    try {
      const records = await pb.collection(COLLECTION.IRARIUMS).getList(1, this.perPage, {
        filter: `userId = "${userId}"`,
        sort: '-created',
        expand: 'spaceId',
        requestKey: null
      });

      this.userIrariums = records.items.map((item) => this.mapRecordToIrarium(item));
      this.lastFetchedUserIrariums = new Date().toISOString();
      this.hasMoreUserIrariums = records.items.length === this.perPage;
      this.error = null;
    } catch (err) {
      console.error('Error fetching irariums:', err);
      this.error = 'Failed to load irariums. Please try again later.';
    } finally {
      this.isLoading = false;
    }
  }

  async loadMoreUserIrariums(userId: string) {
    if (!this.hasMoreUserIrariums || this.isLoadingMore) return;

    this.isLoadingMore = true;
    const nextPage = this.userPage + 1;

    try {
      const records = await pb.collection(COLLECTION.IRARIUMS).getList(nextPage, this.perPage, {
        filter: `userId = "${userId}"`,
        sort: '-created',
        expand: 'spaceId',
        requestKey: null
      });

      const newIrariums = records.items.map((item) => this.mapRecordToIrarium(item));
      this.userIrariums = [...this.userIrariums, ...newIrariums];
      this.userPage = nextPage;
      this.hasMoreUserIrariums = records.items.length === this.perPage;
    } catch (err) {
      console.error('Error loading more user irariums:', err);
      // Don't set global error to avoid disrupting the UI too much
    } finally {
      this.isLoadingMore = false;
    }
  }

  async fetchPublicIrariums(targetSpaceId?: string, force = false) {
    if (this.hasFetchedPublicIrariums && !force && !targetSpaceId) return;

    this.isLoading = true;
    this.error = null;
    this.publicPage = 1;
    this.hasMorePublicIrariums = true;

    try {
      const filter = this.buildPublicFilter(targetSpaceId);

      const records = await pb.collection(COLLECTION.IRARIUMS).getList(1, this.perPage, {
        filter: filter,
        sort: '-created',
        expand: 'userId,spaceId'
      });

      this.publicIrariums = records.items.map((item) => this.mapRecordToIrarium(item));
      this.lastFetchedPublicIrariums = new Date().toISOString();
      this.hasMorePublicIrariums = records.items.length === this.perPage;
      this.error = null;
    } catch (err) {
      console.error('Error fetching irariums:', err);
      this.error = 'Failed to load irariums. Please try again later.';
    } finally {
      this.isLoading = false;
    }
  }

  async loadMorePublicIrariums(targetSpaceId?: string) {
    if (!this.hasMorePublicIrariums || this.isLoadingMore) return;

    this.isLoadingMore = true;
    const nextPage = this.publicPage + 1;

    try {
      const filter = this.buildPublicFilter(targetSpaceId);

      const records = await pb.collection(COLLECTION.IRARIUMS).getList(nextPage, this.perPage, {
        filter: filter,
        sort: '-created',
        expand: 'userId,spaceId'
      });

      const newIrariums = records.items.map((item) => this.mapRecordToIrarium(item));
      this.publicIrariums = [...this.publicIrariums, ...newIrariums];
      this.publicPage = nextPage;
      this.hasMorePublicIrariums = records.items.length === this.perPage;
    } catch (err) {
      console.error('Error loading more public irariums:', err);
    } finally {
      this.isLoadingMore = false;
    }
  }

  private buildPublicFilter(targetSpaceId?: string): string {
    // Build filter for spaces
    let filter = 'isPublic = true';
    
    // If user is logged in, restrict to owned and subscribed spaces
    if (authStore.userId) {
      // Get owned spaces
      const ownedSpaceIds = spaceStore.userSpaces.map(s => s.id);
      
      // Get subscribed spaces
      const subscribedSpaceIds = authStore.userSettings?.subscribedSpaces || [];
      
      // Combine unique IDs
      const allowedSpaceIds = new Set([...ownedSpaceIds, ...subscribedSpaceIds]);
      
      // If a target space is provided (e.g. visiting a space directly), allow it
      if (targetSpaceId) {
        allowedSpaceIds.add(targetSpaceId);
      }
      
      if (allowedSpaceIds.size > 0) {
        // Construct OR filter for space IDs
        const spaceFilter = Array.from(allowedSpaceIds).map(id => `spaceId = "${id}"`).join(' || ');
        filter = `(${filter}) && (${spaceFilter})`;
      } else {
        // If no spaces owned or subscribed, show nothing (or maybe just public ones from system? 
        // Requirement says "Only fetch published irariums from spaces you own")
        // So if no spaces, we should probably return empty or handle gracefully.
        // However, to prevent showing ALL public irariums when having no spaces, we can force a non-match
        filter = `(${filter}) && (spaceId = "non_existent_id")`; 
      }
    }
    return filter;
  }

  async fetchAllIrariumsForSpace(spaceId: string) {
    this.isLoading = true;
    this.error = null;
    
    try {
      // Initial fetch to get total pages
      const firstPage = await pb.collection(COLLECTION.IRARIUMS).getList(1, this.perPage, {
        filter: `spaceId = "${spaceId}" && isPublic = true`,
        sort: '-created',
        expand: 'userId,spaceId'
      });

      let allItems = firstPage.items;
      
      // If there are more pages, fetch them all
      if (firstPage.totalPages > 1) {
        const promises: Promise<any>[] = [];
        for (let p = 2; p <= firstPage.totalPages; p++) {
          promises.push(
            pb.collection(COLLECTION.IRARIUMS).getList(p, this.perPage, {
              filter: `spaceId = "${spaceId}" && isPublic = true`,
              sort: '-created',
              expand: 'userId,spaceId'
            })
          );
        }
        
        const results = await Promise.all(promises);
        results.forEach(res => {
          allItems = [...allItems, ...res.items];
        });
      }

      const mappedIrariums = allItems.map(item => this.mapRecordToIrarium(item));
      
      // Merge with existing public irariums to avoid duplicates but ensure we have all for this space
      // We'll filter out existing ones for this space first, then add the new full set
      const otherIrariums = this.publicIrariums.filter(i => i.spaceId !== spaceId);
      this.publicIrariums = [...otherIrariums, ...mappedIrariums];
      
      this.lastFetchedPublicIrariums = new Date().toISOString();
      this.error = null;
    } catch (err) {
      console.error('Error fetching all irariums for space:', err);
      this.error = 'Failed to load space irariums.';
    } finally {
      this.isLoading = false;
    }
  }

  async fetchIrarium(id: string) {
    const irarium = this.findIrariumById(id);
    if (irarium) return irarium;

    const record = await pb.collection(COLLECTION.IRARIUMS).getOne(id, {
      expand: 'userId,spaceId'
    });

    if (record) {
      const fetchedIrarium = this.mapRecordToIrarium(record);
      this.allIrariums.push(fetchedIrarium);

      return fetchedIrarium;
    }

    return null;
  }

  async createIrarium(irarium: Irarium) {
    this.isLoading = true;
    this.error = null;

    try {
      // Use provided spaceId or default to empty (will be set when publishing)
      const spaceId = irarium.spaceId || '';
      const record = await pb
        .collection(COLLECTION.IRARIUMS)
        .create(this.mapIrariumToCreate(irarium, spaceId));

      await refreshState();
    } catch (err: any) {
      console.error('Error creating irarium:', err);
      if (err.data) console.error('Validation errors:', err.data);
      this.error = err.message || 'Failed to create irarium. Please try again later.';
      throw err;
    } finally {
      this.isLoading = false;
    }
  }

  async updateIrarium(updatedIrarium: Irarium) {
    try {
      await pb
        .collection(COLLECTION.IRARIUMS)
        .update(updatedIrarium.id, this.mapIrariumToUpdate(updatedIrarium));

      await refreshState();
    } catch (err) {
      console.error('Error updating irarium:', err);
    }
  }

  async togglePublicState(
    irarium: Irarium, 
    spaceId?: string, 
    position?: [number, number, number]
  ) {
    try {
      // Use provided values or existing ones
      const targetSpaceId = spaceId || irarium.spaceId || '';
      const targetPosition = position || irarium.position;

      // If publishing and no position provided, generate one
      let finalPosition = targetPosition;
      if (!irarium.isPublic && !finalPosition) {
        finalPosition = await this.generateUniquePosition(targetSpaceId);
      }

      const updatedIrarium = { 
        ...irarium, 
        isPublic: !irarium.isPublic,
        spaceId: targetSpaceId,
        position: finalPosition
      };

      // Format position as text (comma-separated) for the database
      const positionText = finalPosition 
        ? `${finalPosition[0]},${finalPosition[1]},${finalPosition[2]}` 
        : null;

      await pb
        .collection(COLLECTION.IRARIUMS)
        .update(irarium.id, { 
          isPublic: !irarium.isPublic,
          spaceId: targetSpaceId || null,
          position: positionText
        });

      await refreshState();

      // Refresh the space's irarium count to update the UI
      if (targetSpaceId) {
        await spaceStore.fetchIrariumCount(targetSpaceId);
      }

      return updatedIrarium;
    } catch (err) {
      console.error('Error toggling public state:', err);
      throw err;
    }
  }





  findIrariumById(id: string) {
    return this.allIrariums.find((irarium) => irarium.id === id);
  }

  clearStore() {
    this.userIrariums = [];
    this.publicIrariums = [];
    this.lastFetchedUserIrariums = '';
    this.lastFetchedPublicIrariums = '';
    this.isLoading = false;
    this.error = null;
    this.userPage = 1;
    this.publicPage = 1;
    this.hasMoreUserIrariums = true;
    this.hasMorePublicIrariums = true;
  }


  private mapIrariumToCreate(irarium: Irarium, spaceId: string) {
    // Deep clone children to remove Svelte proxies
    const children = irarium.children ? JSON.parse(JSON.stringify(irarium.children)) : [];
    
    return {
      userId: irarium.userId || pb.authStore.model?.id,
      title: irarium.title,
      description: irarium.description,
      tags: irarium.tags,
      content: irarium.content,
      children: children,
      spaceId: spaceId || null, // Ensure empty string becomes null for relation field
      position: null,
      createdBy: authStore.username || authStore.user?.name || authStore.userId || '' // Capture username at creation time
    };
  }

  private mapIrariumToUpdate(irarium: Irarium) {
    return {
      title: irarium.title,
      description: irarium.description,
      tags: irarium.tags,
      content: irarium.content,
      children: irarium.children
    };
  }

  private mapRecordToIrarium(recordItem: any): Irarium {
    // Parse position from text (comma-separated) or JSON
    let position: [number, number, number] | undefined;
    if (recordItem.position) {
      if (typeof recordItem.position === 'string') {
        // Try parsing as comma-separated values first
        const coords = recordItem.position.split(',').map((s: string) => parseFloat(s.trim()));
        if (coords.length === 3 && !coords.some(isNaN)) {
          position = coords as [number, number, number];
        } else {
          // Fallback to JSON parsing for backward compatibility
          try {
            position = JSON.parse(recordItem.position);
          } catch (e) {
            console.error('Failed to parse position:', e);
            position = this.getMockPosition(recordItem.id);
          }
        }
      } else if (Array.isArray(recordItem.position)) {
        position = recordItem.position as [number, number, number];
      } else {
        position = this.getMockPosition(recordItem.id);
      }
    } else {
      position = this.getMockPosition(recordItem.id);
    }
    
    return {
      id: recordItem.id,
      userId: recordItem.userId,
      title: recordItem.title || '',
      description: recordItem.description || '',
      tags: recordItem.tags || '',
      content: recordItem.content || '',
      children: recordItem.children || [],
      isPublic: recordItem.isPublic || false,
      created: recordItem.created,
      updated: recordItem.updated,
      spaceId: recordItem.spaceId || '', // Use actual spaceId from DB
      position: position,
      username: recordItem.expand?.userId?.username || recordItem.expand?.userId?.name || recordItem.userId || '',
      createdBy: recordItem.createdBy || '', // Username at time of creation
      space: recordItem.expand?.spaceId ? {
        name: recordItem.expand.spaceId.name,
        slug: recordItem.expand.spaceId.slug
      } : undefined
    };
  }

  private getMockSpaceId(id: string): string {
    // Deterministically assign to one of 3 mock spaces
    const spaces = ['tech', 'art', 'random'];
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash << 5) - hash + id.charCodeAt(i);
      hash |= 0;
    }
    return spaces[Math.abs(hash) % spaces.length];
  }

  private getMockPosition(id: string): [number, number, number] {
    // Simple deterministic random based on ID
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash << 5) - hash + id.charCodeAt(i);
      hash |= 0;
    }
    
    // Map to -50 to 50 range, keeping it somewhat spherical if possible, 
    // but for mock deterministic positions, a simple box mapping is often enough 
    // or we can do a simple rejection sampling or just clamp.
    // Let's just map to box -30 to 30 to be safe inside sphere 50
    const x = (Math.abs(hash % 60)) - 30;
    const y = (Math.abs((hash >> 8) % 60)) - 30;
    const z = (Math.abs((hash >> 16) % 60)) - 30;
    
    return [x, y, z];
  }

  private generateRandomPosition(radius = DEFAULT_SPACE_SIZE): [number, number, number] {
    // Generate random position within sphere of radius
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = radius * Math.cbrt(Math.random());
    
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    return [x, y, z];
  }

  private async generateUniquePosition(spaceId: string): Promise<[number, number, number]> {
    const maxAttempts = 100;
    const minDistance = 5; // Minimum distance between nodes

    // Get all irariums in this space
    const spaceIrariums = this.publicIrariums.filter(
      (irarium) => irarium.spaceId === spaceId && irarium.position
    );

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const newPosition = this.generateRandomPosition();
      
      // Check if position is too close to any existing position
      const isTooClose = spaceIrariums.some((irarium) => {
        if (!irarium.position) return false;
        const [x1, y1, z1] = irarium.position;
        const [x2, y2, z2] = newPosition;
        const distance = Math.sqrt(
          Math.pow(x2 - x1, 2) + 
          Math.pow(y2 - y1, 2) + 
          Math.pow(z2 - z1, 2)
        );
        return distance < minDistance;
      });

      if (!isTooClose) {
        return newPosition;
      }
    }

    // If we couldn't find a unique position, just return a random one
    return this.generateRandomPosition();
  }
}

export const irariumsStore = new IrariumsStore();
