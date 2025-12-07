import { irariumsStore } from '$lib/irarium/irariums.store.svelte';
import { spaceStore } from '$lib/space/space.store.svelte';

export class CollectionsStore {
  activeTab = $state('irariums');
  searchQuery = $state('');
  visibilityFilter = $state<'all' | 'public' | 'private'>('all');

  // Filtered irariums based on search and visibility
  filteredIrariums = $derived.by(() => {
    let items = irariumsStore.userIrariums;

    // Apply visibility filter
    if (this.visibilityFilter === 'public') {
      items = items.filter((i) => i.isPublic);
    } else if (this.visibilityFilter === 'private') {
      items = items.filter((i) => !i.isPublic);
    }

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      items = items.filter((i) => {
        const content = i.content?.toLowerCase() || '';
        const title = i.title?.toLowerCase() || '';
        return content.includes(query) || title.includes(query);
      });
    }

    return items;
  });

  // Filtered spaces based on search and visibility
  filteredSpaces = $derived.by(() => {
    let items = spaceStore.userSpaces;

    // Apply visibility filter
    if (this.visibilityFilter === 'public') {
      items = items.filter((s) => s.isPublic);
    } else if (this.visibilityFilter === 'private') {
      items = items.filter((s) => !s.isPublic);
    }

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      items = items.filter((s) => {
        const name = s.name?.toLowerCase() || '';
        const description = s.description?.toLowerCase() || '';
        return name.includes(query) || description.includes(query);
      });
    }

    return items;
  });

  constructor() {}
}

export const collectionsStore = new CollectionsStore();
