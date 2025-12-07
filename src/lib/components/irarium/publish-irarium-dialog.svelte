<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { type Irarium } from '$lib/shared/shared.type';
  import { spaceStore } from '$lib/space/space.store.svelte';
  import { publishIrariumStore } from '$lib/irarium/publish-irarium.store.svelte';
  import { authStore } from '$lib/auth/auth.store.svelte';
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

  // Fetch public spaces when dialog opens
  $effect(() => {
    if (open) {
      spaceStore.fetchPublicSpaces();
      if (authStore.userId) {
        spaceStore.fetchUserSpaces(authStore.userId);
      }
      publishIrariumStore.reset(irarium);
    }
  });

  // Filter spaces where user has permission to publish
  let availableSpaces = $derived.by(() => {
    const owned = spaceStore.userSpaces;
    const shared = spaceStore.publicSpaces.filter((s) => s.isShared);

    // Combine and deduplicate
    const map = new Map();
    owned.forEach((s) => map.set(s.id, s));
    shared.forEach((s) => map.set(s.id, s));

    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  });

  async function handlePublish() {
    try {
      const updatedIrarium = await publishIrariumStore.publish(irarium);

      toast.success('Irarium published successfully!');

      // Call the callback to update parent state
      if (onPublishSuccess && updatedIrarium) {
        onPublishSuccess(updatedIrarium);
      }

      open = false;
    } catch (err: any) {
      console.error('Error publishing irarium:', err);
      toast.error(err.message || 'Failed to publish irarium');
    }
  }
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
          bind:value={publishIrariumStore.selectedSpaceId}
          onchange={() => (publishIrariumStore.positionError = '')}
          class="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Select a space</option>
          {#each availableSpaces as space (space.id)}
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
              bind:value={publishIrariumStore.x}
              placeholder="0"
              step="0.1"
              min={-publishIrariumStore.spaceSize}
              max={publishIrariumStore.spaceSize}
              oninput={() => (publishIrariumStore.positionError = '')}
            />
          </div>
          <div>
            <Label for="y" class="text-xs text-muted-foreground">Y</Label>
            <Input
              id="y"
              type="number"
              bind:value={publishIrariumStore.y}
              placeholder="0"
              step="0.1"
              min={-publishIrariumStore.spaceSize}
              max={publishIrariumStore.spaceSize}
              oninput={() => (publishIrariumStore.positionError = '')}
            />
          </div>
          <div>
            <Label for="z" class="text-xs text-muted-foreground">Z</Label>
            <Input
              id="z"
              type="number"
              bind:value={publishIrariumStore.z}
              placeholder="0"
              step="0.1"
              min={-publishIrariumStore.spaceSize}
              max={publishIrariumStore.spaceSize}
              oninput={() => (publishIrariumStore.positionError = '')}
            />
          </div>
        </div>
        {#if publishIrariumStore.positionError}
          <p class="text-sm text-destructive">{publishIrariumStore.positionError}</p>
        {/if}
      </div>

      <!-- Preview -->
      <div class="rounded-md bg-muted p-3 text-sm">
        <p class="font-medium">Preview:</p>
        <p class="text-muted-foreground">
          Space: {publishIrariumStore.selectedSpace?.name || 'Not selected'}
        </p>
        <p class="text-muted-foreground">
          Position: ({publishIrariumStore.x}, {publishIrariumStore.y}, {publishIrariumStore.z})
        </p>
        <p
          class={publishIrariumStore.isPositionValid
            ? 'text-muted-foreground'
            : 'font-medium text-destructive'}
        >
          Distance from center: {publishIrariumStore.distance.toFixed(1)} / {publishIrariumStore.spaceSize}
        </p>
      </div>
    </div>

    <Dialog.Footer>
      <Button
        variant="outline"
        onclick={() => (open = false)}
        disabled={publishIrariumStore.isLoading}
      >
        Cancel
      </Button>
      <Button
        onclick={handlePublish}
        disabled={publishIrariumStore.isLoading ||
          publishIrariumStore.isCheckingPosition ||
          !publishIrariumStore.selectedSpaceId ||
          !publishIrariumStore.isPositionValid}
      >
        {publishIrariumStore.isLoading
          ? 'Publishing...'
          : publishIrariumStore.isCheckingPosition
            ? 'Checking...'
            : 'Publish'}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
