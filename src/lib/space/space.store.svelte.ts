import { pb } from '$lib/db/client';
import { COLLECTION, type Space } from '$lib/shared/shared.type';

export class SpaceStore {
  activeIrariumId = $state<string | null>(null);
  userSpaces = $state<Space[]>([]);
  isLoading = $state(false);
  error = $state<string | null>(null);
  
  // Auto-rotate is enabled when no irarium is active
  isAutoRotateEnabled = $derived(this.activeIrariumId === null);

  setActiveIrarium(id: string | null) {
    this.activeIrariumId = id;
  }

  async fetchUserSpaces(userId: string) {
    this.isLoading = true;
    this.error = null;
    try {
      const records = await pb.collection(COLLECTION.SPACES).getList(1, 50, {
        filter: `createdBy = "${userId}"`,
        sort: '-created'
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
    } catch (err) {
      console.error('Error fetching user spaces:', err);
      this.error = 'Failed to load spaces';
    } finally {
      this.isLoading = false;
    }
  }
}

export const spaceStore = new SpaceStore();
