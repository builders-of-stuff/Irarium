export class SpaceStore {
  activeIrariumId = $state<string | null>(null);
  
  // Auto-rotate is enabled when no irarium is active
  isAutoRotateEnabled = $derived(this.activeIrariumId === null);

  setActiveIrarium(id: string | null) {
    this.activeIrariumId = id;
  }
}

export const spaceStore = new SpaceStore();
