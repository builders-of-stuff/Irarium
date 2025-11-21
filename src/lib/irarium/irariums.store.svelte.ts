import { pb } from '$lib/db/client';
import { COLLECTION, type Irarium } from '$lib/shared/shared.type';
import { spaceStore } from '$lib/space/space.store.svelte';
import { authStore } from '$lib/auth/auth.store.svelte';

export class IrariumsStore {
  userIrariums = $state<Irarium[]>([]);
  publicIrariums = $state<Irarium[]>([]);

  lastFetchedUserIrariums = $state('');
  lastFetchedPublicIrariums = $state('');
  isLoading = $state(true);
  error = $state<string | null>(null);

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

  constructor() {}

  async deleteIrarium(id: string) {
    this.isLoading = true;
    this.error = null;

    try {
      await pb.collection(COLLECTION.IRARIUMS).delete(id);

      this.userIrariums = this.userIrariums.filter((irarium) => irarium.id !== id);
      this.publicIrariums = this.publicIrariums.filter((irarium) => irarium.id !== id);
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

    try {
      const records = await pb.collection(COLLECTION.IRARIUMS).getList(1, 50, {
        filter: `userId = "${userId}"`,
        sort: '-created',
        requestKey: null
      });

      this.userIrariums = records.items.map((item) => this.mapRecordToIrarium(item));
      this.lastFetchedUserIrariums = new Date().toISOString();
      this.error = null;
    } catch (err) {
      console.error('Error fetching irariums:', err);
      this.error = 'Failed to load irariums. Please try again later.';
    } finally {
      this.isLoading = false;
    }
  }

  async fetchPublicIrariums() {
    this.isLoading = true;
    this.error = null;

    try {
      const records = await pb.collection(COLLECTION.IRARIUMS).getList(1, 50, {
        filter: 'isPublic = true',
        sort: '-created',
        expand: 'userId'
      });

      this.publicIrariums = records.items.map((item) => this.mapRecordToIrarium(item));
      this.lastFetchedPublicIrariums = new Date().toISOString();
      this.error = null;
    } catch (err) {
      console.error('Error fetching irariums:', err);
      this.error = 'Failed to load irariums. Please try again later.';
    } finally {
      this.isLoading = false;
    }
  }

  async fetchIrarium(id: string) {
    const irarium = this.findIrariumById(id);
    if (irarium) return irarium;

    const record = await pb.collection(COLLECTION.IRARIUMS).getOne(id);

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

      this.userIrariums = [...this.userIrariums, this.mapRecordToIrarium(record)];
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

      this.userIrariums = this.userIrariums.map((irarium) =>
        updatedIrarium.id === irarium.id ? updatedIrarium : irarium
      );
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

      // Update in both user and public collections
      this.userIrariums = this.userIrariums.map((item) =>
        item.id === irarium.id ? updatedIrarium : item
      );

      if (updatedIrarium.isPublic) {
        this.publicIrariums = [...this.publicIrariums, updatedIrarium];
      } else {
        this.publicIrariums = this.publicIrariums.filter(
          (item) => item.id !== irarium.id
        );
      }

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

  async refreshAllData(userId: string) {
    this.isLoading = true;
    try {
      await Promise.all([
        authStore.refreshUser(),
        this.fetchUserIrariums(userId, true),
        spaceStore.fetchUserSpaces(userId, true)
      ]);
    } catch (error) {
      console.error('Error refreshing all data:', error);
    } finally {
      this.isLoading = false;
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
      createdBy: authStore.username || '' // Capture username at creation time
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
      username: recordItem.expand?.userId?.username || '',
      createdBy: recordItem.createdBy || '' // Username at time of creation
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

  private generateRandomPosition(): [number, number, number] {
    // Generate random position within sphere of radius 50
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = 50 * Math.cbrt(Math.random());
    
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
