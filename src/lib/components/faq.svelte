<script lang="ts">
  import * as Collapsible from '$lib/components/ui/collapsible';
  import { ChevronDown } from '@lucide/svelte';

  let howItWorksOpen = $state(true);
  let pricingOpen = $state(false);
  let selfHostingOpen = $state(false);
</script>

<div class="space-y-4">
  <!-- How it works -->
  <Collapsible.Root bind:open={howItWorksOpen}>
    <Collapsible.Trigger
      class="flex w-full items-center justify-between rounded-lg border bg-card p-4 text-left font-semibold transition-colors hover:bg-muted/30"
    >
      <h3 class="text-lg">How it works</h3>
      <ChevronDown
        size={20}
        class="text-muted-foreground transition-transform duration-200 {howItWorksOpen
          ? 'rotate-180'
          : ''}"
      />
    </Collapsible.Trigger>

    <Collapsible.Content>
      <div class="mt-2 space-y-3 rounded-lg border border-t-0 bg-card p-4 pt-2">
        <p class="text-sm leading-relaxed">Any user can create their own space.</p>
        <p class="text-sm leading-relaxed">
          Within a space, which can be public or private, shared or unshared, users can
          publish irariums within.
        </p>
        <p class="text-sm leading-relaxed">
          Irariums are like terrariums but for ideas, or just a space for thoughts.
        </p>
        <p class="text-sm leading-relaxed">
          An irarium can be structured, it can be messy, an ongoing dump of thoughts, or
          whatever you'd like it to be.
        </p>
      </div>
    </Collapsible.Content>
  </Collapsible.Root>

  <!-- Pricing -->
  <Collapsible.Root bind:open={pricingOpen}>
    <Collapsible.Trigger
      class="flex w-full items-center justify-between rounded-lg border bg-card p-4 text-left font-semibold transition-colors hover:bg-muted/30"
    >
      <h3 class="text-lg">Pricing</h3>
      <ChevronDown
        size={20}
        class="text-muted-foreground transition-transform duration-200 {pricingOpen
          ? 'rotate-180'
          : ''}"
      />
    </Collapsible.Trigger>

    <Collapsible.Content>
      <div class="mt-2 space-y-3 rounded-lg border border-t-0 bg-card p-4 pt-2">
        <p class="text-sm leading-relaxed">
          Every user gets 1 free space and can write and publish as many irariums
          within.
        </p>
        <p class="text-sm leading-relaxed">
          Buy additional spaces for about three fifty each.
        </p>
        <p class="text-sm leading-relaxed">
          Or expand spaces with space expanders, for a dollar each.
        </p>
        <p class="text-sm leading-relaxed">
          Ansibles are simply ways to "subscribe" to a space's feed. By default you see
          only irariums published within your own spaces, so unless you actively explore
          other public spaces others' irariums will not be visible to you.
        </p>
        <p class="text-sm leading-relaxed">
          Or you can just fork it and set it up for free yourself.
        </p>
      </div>
    </Collapsible.Content>
  </Collapsible.Root>

  <!-- Self-hosting -->
  <Collapsible.Root bind:open={selfHostingOpen}>
    <Collapsible.Trigger
      class="flex w-full items-center justify-between rounded-lg border bg-card p-4 text-left font-semibold transition-colors hover:bg-muted/30"
    >
      <h3 class="text-lg">Self-hosting</h3>
      <ChevronDown
        size={20}
        class="text-muted-foreground transition-transform duration-200 {selfHostingOpen
          ? 'rotate-180'
          : ''}"
      />
    </Collapsible.Trigger>

    <Collapsible.Content>
      <div class="mt-2 space-y-3 rounded-lg border border-t-0 bg-card p-4 pt-2">
        <p class="text-sm leading-relaxed">
          Irarium is open source and can be self-hosted for free.
        </p>
        <p class="text-sm leading-relaxed">
          For instructions on how to run the project locally, see the
          <a
            href="https://github.com/kyletruong/irarium/blob/main/docs/SELF_HOSTING.md"
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary underline hover:text-primary/80"
          >
            self-hosting documentation
          </a>.
        </p>
      </div>
    </Collapsible.Content>
  </Collapsible.Root>
</div>
