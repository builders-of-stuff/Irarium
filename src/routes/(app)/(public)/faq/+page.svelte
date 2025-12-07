<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import Faq from '$lib/components/faq.svelte';
  import { ArrowLeft } from '@lucide/svelte';
</script>

<div class="relative min-h-screen overflow-hidden">
  <div class="relative z-10">
    <div class="container mx-auto max-w-3xl px-4 py-8 pt-32 md:pt-20">
      <!-- Header -->
      <div class="mb-8 flex items-center justify-between">
        <h1 class="text-3xl font-bold">Frequently Asked Questions</h1>
        <Button variant="ghost" size="sm" href="/">
          <ArrowLeft class="mr-2 h-4 w-4" />
          Home
        </Button>
      </div>

      <!-- FAQ Content -->
      <Faq />
    </div>
  </div>
</div>
