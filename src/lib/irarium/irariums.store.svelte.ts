import { pb } from '$lib/db/client';
import { COLLECTION, type Irarium } from '$lib/shared/shared.type';

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

  async fetchUserIrariums(userId: string) {
    if (this.hasFetchedUserIrariums) return;

    this.isLoading = true;
    this.error = null;

    try {
      const records = await pb.collection(COLLECTION.IRARIUMS).getList(1, 50, {
        filter: `userId = "${userId}"`,
        sort: '-created'
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
        sort: '-created'
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
    try {
      const spaceId = await this.getGeneralSpaceId();
      const record = await pb
        .collection(COLLECTION.IRARIUMS)
        .create(this.mapIrariumToCreate(irarium, spaceId));

      this.userIrariums.push(this.mapRecordToIrarium(record));
    } catch (err) {
      console.error('Error creating irarium:', err);
      this.error = 'Failed to create irarium. Please try again later.';
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

  async togglePublicState(irarium: Irarium) {
    try {
      // Generate position if making public and no position exists
      let position = irarium.position;
      if (!irarium.isPublic && !position) {
        position = await this.generateUniquePosition(irarium.spaceId || '');
      }

      const updatedIrarium = { 
        ...irarium, 
        isPublic: !irarium.isPublic,
        position 
      };

      await pb
        .collection(COLLECTION.IRARIUMS)
        .update(irarium.id, { 
          isPublic: !irarium.isPublic,
          position: position ? JSON.stringify(position) : null
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
  }

  private async getGeneralSpaceId(): Promise<string> {
    try {
      const spaces = await pb.collection(COLLECTION.SPACES).getList(1, 1, {
        filter: 'slug = "general"'
      });
      
      if (spaces.items.length > 0) {
        return spaces.items[0].id;
      }
      
      // Fallback: if no general space found, return empty string
      console.warn('General space not found');
      return '';
    } catch (err) {
      console.error('Error fetching general space:', err);
      return '';
    }
  }

  private mapIrariumToCreate(irarium: Irarium, spaceId: string) {
    return {
      userId: irarium.userId,
      title: irarium.title,
      description: irarium.description,
      tags: irarium.tags,
      content: irarium.content,
      children: irarium.children,
      spaceId: spaceId
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
    // Parse position from JSON if it's a string
    let position: [number, number, number] | undefined;
    if (recordItem.position) {
      if (typeof recordItem.position === 'string') {
        try {
          position = JSON.parse(recordItem.position);
        } catch (e) {
          console.error('Failed to parse position:', e);
          position = this.getMockPosition(recordItem.id);
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
      position: position
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
    
    // Map to -50 to 50 range (100x100x100 container centered at 0)
    const x = (Math.abs(hash % 100) - 50);
    const y = (Math.abs((hash >> 8) % 100) - 50);
    const z = (Math.abs((hash >> 16) % 100) - 50);
    
    return [x, y, z];
  }

  private generateRandomPosition(): [number, number, number] {
    // Generate random position within -50 to 50 range
    const x = Math.random() * 100 - 50;
    const y = Math.random() * 100 - 50;
    const z = Math.random() * 100 - 50;
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
