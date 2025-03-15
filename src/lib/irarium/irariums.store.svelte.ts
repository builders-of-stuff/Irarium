import { pb } from '$lib/db/client';
import { COLLECTION, type Irarium } from '$lib/shared/shared.type';
import { authStore } from '$lib/auth/auth.store.svelte';

export class IrariumsStore {
  userId = $derived(authStore.userId);

  userIrariums = $state<Irarium[]>([]);
  publicIrariums = $state<Irarium[]>([]);

  lastFetchedUserIrariums = $state('');
  lastFetchedPublicIrariums = $state('');
  isLoading = $state(true);
  error = $state<string | null>(null);

  hasFetchedUserIrariums = $derived(!!this.lastFetchedUserIrariums);
  hasFetchedPublicIrariums = $derived(!!this.lastFetchedPublicIrariums);

  constructor() {}

  async fetchUserIrariums() {
    if (this.hasFetchedUserIrariums) return;

    this.isLoading = true;
    this.error = null;

    try {
      const records = await pb.collection(COLLECTION.IRARIUMS).getList(1, 50, {
        filter: `userId = "${this.userId}"`,
        sort: '-updated'
      });

      this.userIrariums = records.items.map((item) => item as unknown as Irarium);
      this.lastFetchedUserIrariums = new Date().toISOString();
      this.error = null;
    } catch (err) {
      console.error('Error fetching irariums:', err);
      this.error = 'Failed to load irariums. Please try again later.';
    } finally {
      this.isLoading = false;
    }
  }

  async fetchAllIrariums() {
    this.isLoading = true;
    this.error = null;

    try {
      const records = await pb.collection(COLLECTION.IRARIUMS).getList(1, 50, {
        filter: 'isPublic = true',
        sort: '-updated'
      });

      this.publicIrariums = records.items.map((item) => item as unknown as Irarium);
      this.lastFetchedPublicIrariums = new Date().toISOString();
      this.error = null;
    } catch (err) {
      console.error('Error fetching irariums:', err);
      this.error = 'Failed to load irariums. Please try again later.';
    } finally {
      this.isLoading = false;
    }
  }

  async createIrarium(irarium: Irarium) {
    try {
      const record = await pb
        .collection(COLLECTION.IRARIUMS)
        .create(this.mapIrariumToCreate(irarium));

      console.log('record', record);
      this.userIrariums.push(record as unknown as Irarium);
    } catch (err) {
      console.error('Error creating irarium:', err);
      this.error = 'Failed to create irarium. Please try again later.';
    } finally {
      this.isLoading = false;
    }
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
}

export const irariumsStore = new IrariumsStore();
