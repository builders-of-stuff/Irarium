import { pb } from '$lib/db/client';
import { COLLECTION, type Irarium, type Space } from '$lib/shared/shared.type';
import { DEFAULT_SPACE_SIZE } from '$lib/shared/space.constants';
import { irariumsStore } from '$lib/irarium/irariums.store.svelte';
import { spaceStore } from '$lib/space/space.store.svelte';

export class PublishIrariumStore {
  selectedSpaceId = $state<string>('');
  x = $state<string>('0');
  y = $state<string>('0');
  z = $state<string>('0');
  isLoading = $state(false);
  isCheckingPosition = $state(false);
  positionError = $state<string>('');

  // Derived state
  selectedSpace = $derived(spaceStore.publicSpaces.find((s) => s.id === this.selectedSpaceId));
  spaceSize = $derived(this.selectedSpace?.size || DEFAULT_SPACE_SIZE);

  distance = $derived(
    Math.sqrt(
      Math.pow(parseFloat(this.x) || 0, 2) +
        Math.pow(parseFloat(this.y) || 0, 2) +
        Math.pow(parseFloat(this.z) || 0, 2)
    )
  );

  isPositionValid = $derived(this.distance <= this.spaceSize);

  constructor() {}

  reset(irarium: Irarium) {
    this.selectedSpaceId = irarium.spaceId || '';
    if (irarium.position) {
      const coords = irarium.position;
      this.x = coords[0].toString();
      this.y = coords[1].toString();
      this.z = coords[2].toString();
    } else {
      this.generateRandomPosition();
    }
    this.positionError = '';
    this.isLoading = false;
    this.isCheckingPosition = false;
  }

  generateRandomPosition() {
    // Generate random coordinates within sphere of radius spaceSize
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = this.spaceSize * Math.cbrt(Math.random());

    const xVal = r * Math.sin(phi) * Math.cos(theta);
    const yVal = r * Math.sin(phi) * Math.sin(theta);
    const zVal = r * Math.cos(phi);

    this.x = xVal.toFixed(1);
    this.y = yVal.toFixed(1);
    this.z = zVal.toFixed(1);
  }

  async validatePosition() {
    if (!this.selectedSpaceId) {
      this.positionError = 'Please select a space';
      return false;
    }

    const xNum = parseFloat(this.x);
    const yNum = parseFloat(this.y);
    const zNum = parseFloat(this.z);

    if (isNaN(xNum) || isNaN(yNum) || isNaN(zNum)) {
      this.positionError = 'Coordinates must be valid numbers';
      return false;
    }

    // Check if position is within bounds (-size to size)
    if (
      xNum < -this.spaceSize ||
      xNum > this.spaceSize ||
      yNum < -this.spaceSize ||
      yNum > this.spaceSize ||
      zNum < -this.spaceSize ||
      zNum > this.spaceSize
    ) {
      this.positionError = `Coordinates must be between -${this.spaceSize} and ${this.spaceSize}`;
      return false;
    }

    // Check if position is within sphere radius
    if (this.distance > this.spaceSize) {
      this.positionError = `Position is outside the sphere (Distance: ${this.distance.toFixed(1)} > ${this.spaceSize})`;
      return false;
    }

    this.positionError = '';
    return true;
  }

  async publish(irarium: Irarium) {
    if (!(await this.validatePosition())) {
      throw new Error(this.positionError);
    }

    this.isLoading = true;
    try {
      const xNum = parseFloat(this.x);
      const yNum = parseFloat(this.y);
      const zNum = parseFloat(this.z);
      const position: [number, number, number] = [xNum, yNum, zNum];

      const updatedIrarium = await irariumsStore.togglePublicState(
        irarium,
        this.selectedSpaceId,
        position
      );

      return updatedIrarium;
    } catch (err) {
      console.error('Error publishing irarium:', err);
      throw err;
    } finally {
      this.isLoading = false;
    }
  }
}

export const publishIrariumStore = new PublishIrariumStore();
