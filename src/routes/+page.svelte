<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent } from '$lib/components/ui/card';
  import IrariumLogo from '$lib/assets/irarium.png';
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import SparklesCore from '$lib/components/ui/sparkles.svelte';
  import {
    DISCORD_INVITE_LINK,
    X_LINK,
    GITHUB_LINK
  } from '$lib/shared/shared.constant';
  import DiscordIcon from '$lib/components/icons/discord-icon.svelte';
  import XIcon from '$lib/components/icons/x.svelte';
  let mounted = false;

  onMount(() => {
    mounted = true;
  });
</script>

<div class="relative min-h-screen overflow-hidden bg-black">
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
        <div in:fade={{ duration: 300, delay: 50 }} class="space-y-4">
          <!-- Logo with moving border -->
          <div class="relative mx-auto h-32 w-32">
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
            <div in:fly={{ y: -20, duration: 300, delay: 100 }}>
              <h1
                class="bg-gradient-to-r from-primary via-amber-400 to-rose-500 bg-clip-text text-4xl font-bold tracking-tight text-transparent"
              >
                IRARIUM
              </h1>
            </div>

            <div
              in:fly={{ x: 100, duration: 300, delay: 200 }}
              class="mx-auto h-px w-16 bg-gradient-to-r from-primary to-transparent"
            ></div>

            <p
              in:fly={{ y: 10, duration: 300, delay: 200 }}
              class="text-sm font-light tracking-wider text-zinc-400"
            >
              A TERRARIUM FOR IDEAS; A SPACE FOR BURNING IDEAS
            </p>
          </div>

          <!-- Action Buttons with moving border effect -->
          <div
            in:fade={{ duration: 300, delay: 300 }}
            class="mt-6 flex flex-col space-y-3 pt-4"
          >
            <a href="/signup">
              <div class="relative">
                <Button
                  variant="default"
                  class="relative z-10 w-full border-none bg-gradient-to-r from-primary to-amber-500 transition-all duration-300 hover:from-primary/90 hover:to-amber-500/90"
                >
                  Get Started
                </Button>
              </div>
            </a>

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

  <!-- Social links in bottom right corner -->
  <div class="absolute bottom-6 right-6 z-20 flex space-x-4">
    <a
      href={X_LINK}
      target="_blank"
      rel="noopener noreferrer"
      class="text-zinc-400 transition-colors hover:text-white"
    >
      <XIcon class="h-5 w-5" />
      <span class="sr-only">X / Twitter</span>
    </a>
    <a
      href={DISCORD_INVITE_LINK}
      target="_blank"
      rel="noopener noreferrer"
      class="text-zinc-400 transition-colors hover:text-white"
    >
      <DiscordIcon />
      <span class="sr-only">Discord</span>
    </a>
    <a
      href={GITHUB_LINK}
      target="_blank"
      rel="noopener noreferrer"
      class="text-zinc-400 transition-colors hover:text-white"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-5 w-5"
      >
        <path
          d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
        ></path>
        <path d="M9 18c-4.51 2-5-2-7-2"></path>
      </svg>
      <span class="sr-only">GitHub</span>
    </a>
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
