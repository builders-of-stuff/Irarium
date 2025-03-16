import { pb } from '$lib/db/client';
import { COLLECTION, type Irarium } from '$lib/shared/shared.type';
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
  userId = $derived(authStore.userId);

  constructor() {
    this.fetchAllIrariums();
  }

  async fetchUserIrariums() {
    if (this.hasFetchedUserIrariums) return;

    this.isLoading = true;
    this.error = null;

    try {
      const records = await pb.collection(COLLECTION.IRARIUMS).getList(1, 50, {
        filter: `userId = "${this.userId}"`,
        sort: '-updated'
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
        sort: '-updated'
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
      this.allIrariums.push(record as unknown as Irarium);
    }

    return record as unknown as Irarium;
  }

  async fetchAllIrariums() {
    await Promise.all([this.fetchUserIrariums(), this.fetchPublicIrariums()]);
  }

  async createIrarium(irarium: Irarium) {
    try {
      const record = await pb
        .collection(COLLECTION.IRARIUMS)
        .create(this.mapIrariumToCreate(irarium));

      this.userIrariums.push(record as unknown as Irarium);
    } catch (err) {
      console.error('Error creating irarium:', err);
      this.error = 'Failed to create irarium. Please try again later.';
    } finally {
      this.isLoading = false;
    }
  }

  findIrariumById(id: string) {
    return this.allIrariums.find((irarium) => irarium.id === id);
  }

  private mapIrariumToCreate(irarium: Irarium) {
    return {
      userId: irarium.userId,
      title: irarium.title,
      description: irarium.description,
      tags: irarium.tags,
      content: irarium.content,
      children: irarium.children
    };
  }

  private mapRecordToIrarium(recordItem: any): Irarium {
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
      updated: recordItem.updated
    };
  }
}

export const irariumsStore = new IrariumsStore();
