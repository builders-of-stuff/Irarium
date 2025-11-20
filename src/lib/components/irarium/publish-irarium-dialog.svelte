<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { pb } from '$lib/db/client';
  import { COLLECTION, type Irarium, type Space } from '$lib/shared/shared.type';
  import { irariumsStore } from '$lib/irarium/irariums.store.svelte';
  import { toast } from 'svelte-sonner';

  let {
    open = $bindable(false),
    irarium,
    onPublishSuccess
  } = $props<{
    open: boolean;
    irarium: Irarium;
    onPublishSuccess?: (updatedIrarium: Irarium) => void;
  }>();

  let spaces = $state<Space[]>([]);
  let selectedSpaceId = $state<string>('');
  let x = $state<string>('0');
  let y = $state<string>('0');
  let z = $state<string>('0');
  let isLoading = $state(false);
  let isCheckingPosition = $state(false);
  let positionError = $state<string>('');

  // Fetch public spaces when dialog opens
  // Fetch public spaces when dialog opens
  $effect(() => {
    if (open) {
      fetchSpaces();
      // Reset form
      selectedSpaceId = irarium.spaceId || '';
      if (irarium.position) {
        const coords = irarium.position;
        x = coords[0].toString();
        y = coords[1].toString();
        z = coords[2].toString();
      } else {
        // Generate random coordinates between 0 and 100
        x = (Math.random() * 100).toFixed(1);
        y = (Math.random() * 100).toFixed(1);
        z = (Math.random() * 100).toFixed(1);
      }
      positionError = '';
    }
  });

  async function fetchSpaces() {
    try {
      const records = await pb.collection(COLLECTION.SPACES).getList(1, 50, {
        filter: 'isPublic = true',
        sort: 'name'
      });

      spaces = records.items.map((item: any) => ({
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
      console.error('Error fetching spaces:', err);
      toast.error('Failed to load spaces');
    }
  }

  async function validatePosition() {
    if (!selectedSpaceId) {
      positionError = 'Please select a space';
      return false;
    }

    const xNum = parseFloat(x);
    const yNum = parseFloat(y);
    const zNum = parseFloat(z);

    if (isNaN(xNum) || isNaN(yNum) || isNaN(zNum)) {
      positionError = 'Coordinates must be valid numbers';
      return false;
    }

    // Check if position is within bounds (0 to 100)
    if (xNum < 0 || xNum > 100 || yNum < 0 || yNum > 100 || zNum < 0 || zNum > 100) {
      positionError = 'Coordinates must be between 0 and 100';
      return false;
    }

    positionError = '';
    return true;
  }

  async function handlePublish() {
    if (!(await validatePosition())) {
      return;
    }

    isLoading = true;
    try {
      const xNum = parseFloat(x);
      const yNum = parseFloat(y);
      const zNum = parseFloat(z);
      const position: [number, number, number] = [xNum, yNum, zNum];

      const updatedIrarium = await irariumsStore.togglePublicState(
        irarium,
        selectedSpaceId,
        position
      );

      toast.success('Irarium published successfully!');

      // Call the callback to update parent state
      if (onPublishSuccess) {
        onPublishSuccess(updatedIrarium);
      }

      open = false;
    } catch (err) {
      console.error('Error publishing irarium:', err);
      toast.error('Failed to publish irarium');
    } finally {
      isLoading = false;
    }
  }

  // Get selected space name for display
  const selectedSpace = $derived(spaces.find((s) => s.id === selectedSpaceId));
</script>

<Dialog.Root bind:open>
  <Dialog.Content class="sm:max-w-[500px]">
    <Dialog.Header>
      <Dialog.Title>Publish Irarium</Dialog.Title>
      <Dialog.Description>
        Choose a space and coordinates to publish your irarium.
      </Dialog.Description>
    </Dialog.Header>

    <div class="grid gap-4 py-4">
      <!-- Space Selection -->
      <div class="grid gap-2">
        <Label for="space">Space</Label>
        <select
          id="space"
          bind:value={selectedSpaceId}
          onchange={() => (positionError = '')}
          class="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Select a space</option>
          {#each spaces as space (space.id)}
            <option value={space.id}>{space.name}</option>
          {/each}
        </select>
      </div>

      <!-- Coordinates -->
      <div class="grid gap-2">
        <Label>Coordinates</Label>
        <div class="grid grid-cols-3 gap-2">
          <div>
            <Label for="x" class="text-xs text-muted-foreground">X</Label>
            <Input
              id="x"
              type="number"
              bind:value={x}
              placeholder="0"
              step="0.1"
              min="0"
              max="100"
              onchange={() => (positionError = '')}
            />
          </div>
          <div>
            <Label for="y" class="text-xs text-muted-foreground">Y</Label>
            <Input
              id="y"
              type="number"
              bind:value={y}
              placeholder="0"
              step="0.1"
              min="-50"
              max="50"
              onchange={() => (positionError = '')}
            />
          </div>
          <div>
            <Label for="z" class="text-xs text-muted-foreground">Z</Label>
            <Input
              id="z"
              type="number"
              bind:value={z}
              placeholder="0"
              step="0.1"
              min="-50"
              max="50"
              onchange={() => (positionError = '')}
            />
          </div>
        </div>
        {#if positionError}
          <p class="text-sm text-destructive">{positionError}</p>
        {/if}
      </div>

      <!-- Preview -->
      <div class="rounded-md bg-muted p-3 text-sm">
        <p class="font-medium">Preview:</p>
        <p class="text-muted-foreground">
          Space: {selectedSpace?.name || 'Not selected'}
        </p>
        <p class="text-muted-foreground">
          Position: ({x}, {y}, {z})
        </p>
      </div>
    </div>

    <Dialog.Footer>
      <Button variant="outline" onclick={() => (open = false)} disabled={isLoading}>
        Cancel
      </Button>
      <Button
        onclick={handlePublish}
        disabled={isLoading || isCheckingPosition || !selectedSpaceId}
      >
        {isLoading ? 'Publishing...' : isCheckingPosition ? 'Checking...' : 'Publish'}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
