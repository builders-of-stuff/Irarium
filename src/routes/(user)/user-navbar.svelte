<script lang="ts">
  import { NavigationMenu } from 'bits-ui';

  let { title = 'Irarium', actions } = $props<{
    title?: string;
    actions?: () => unknown;
  }>();
</script>

<NavigationMenu.Root>
  <div class="border-b">
    <div
      class="container mx-auto flex max-w-5xl items-center justify-between px-6 py-4"
    >
      <h1 class="text-xl font-semibold">{title}</h1>

      <!-- Actions section -->
      <div class="flex items-center gap-2">
        {#if actions}
          {@render actions()}
        {/if}
      </div>
    </div>
  </div>
</NavigationMenu.Root>
