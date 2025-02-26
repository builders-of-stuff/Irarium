<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent } from '$lib/components/ui/card';
  import IrariumLogo from '$lib/assets/irarium.png';
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import BackgroundBeams from '$lib/components/ui/background-beams.svelte';
  import SparklesCore from '$lib/components/ui/sparkles.svelte';

  let mounted = false;

  onMount(() => {
    mounted = true;
  });
</script>

<div class="relative min-h-screen overflow-hidden bg-black">
  <!-- Background effects -->
  <BackgroundBeams className="opacity-20" />

  <!-- Subtle sparkles in the background -->
  <div class="absolute inset-0 h-full w-full">
    <SparklesCore
      id="tsparticles"
      background="transparent"
      minSize={0.4}
      maxSize={1.0}
      particleDensity={40}
      className="h-full w-full"
      particleColor="#FFFFFF"
    />
  </div>

  <div class="relative z-10 flex min-h-screen items-start justify-center p-4 pt-[20vh]">
    <div class="w-full max-w-md">
      {#if mounted}
        <div in:fade={{ duration: 800, delay: 200 }} class="space-y-4">
          <!-- Logo with moving border -->
          <div class="relative mx-auto mb-2 h-32 w-32">
            <div
              class="absolute inset-[6px] flex items-center justify-center rounded-full"
            >
              <img
                src={IrariumLogo}
                alt="Irarium Logo"
                class="animate-float h-20 w-20 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              />
            </div>
          </div>

          <!-- Name and slogan with animations -->
          <div class="space-y-2 text-center">
            <div in:fly={{ y: -20, duration: 800, delay: 400 }}>
              <h1
                class="bg-gradient-to-r from-primary via-amber-400 to-rose-500 bg-clip-text text-4xl font-bold tracking-tight text-transparent"
              >
                IRARIUM
              </h1>
            </div>

            <div
              in:fly={{ x: 100, duration: 800, delay: 600 }}
              class="from-primar mx-auto h-px w-16 bg-gradient-to-r to-transparent"
            ></div>

            <p
              in:fly={{ y: 10, duration: 800, delay: 800 }}
              class="text-sm font-light tracking-wider text-zinc-400"
            >
              A SPACE FOR BURNING IDEAS
            </p>
          </div>

          <!-- Action Buttons with moving border effect -->
          <div
            in:fade={{ duration: 800, delay: 1000 }}
            class="mt-6 flex flex-col space-y-3 pt-4"
          >
            <div class="relative">
              <a href="/signup">
                <Button
                  variant="default"
                  class="relative z-10 w-full border-none bg-gradient-to-r from-primary to-amber-500 transition-all duration-300 hover:from-primary/90 hover:to-amber-500/90"
                >
                  Get Started
                </Button>
              </a>
            </div>

            <Button
              variant="ghost"
              class="text-zinc-400 transition-colors duration-300 hover:bg-white/5 hover:text-white"
            >
              <a href="/login">Already have an account? Log in</a>
            </Button>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  @keyframes float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
    }
  }

  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
</style>
