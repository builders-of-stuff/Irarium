<script lang="ts">
  import { goto } from '$app/navigation';
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import IrariumLogo from '$lib/assets/irarium.png';
  import { ROUTE } from '$lib/shared/shared.constant';
  import { authStore } from '$lib/auth/auth.store.svelte';

  let email = $state('');
  let password = $state('');
  let error = $state('');

  async function handleLogin() {
    try {
      const result = await authStore.login(email, password);

      if (result.success) {
        error = '';
        goto(ROUTE.HOME);
      } else {
        error = 'Invalid email or password';
        console.error('Login error:', result.error);
      }
    } catch (err) {
      error = 'Invalid email or password';
      console.error('Login error:', err);
    }
  }
</script>

<div class="container flex min-h-screen items-start justify-center pt-[10vh]">
  <div class="w-full max-w-md space-y-10">
    <div class="flex flex-col items-center gap-4">
      <a href={ROUTE.LANDING}>
        <img
          src={IrariumLogo}
          alt="Irarium Logo"
          class="h-20 w-20 rounded-xl shadow-sm"
        />
      </a>
      <h1 class="text-primary text-3xl font-bold">Irarium</h1>
    </div>

    <Card.Root class="w-full max-w-md">
      <Card.Header class="space-y-1">
        <Card.Title class="text-2xl">Sign in</Card.Title>
      </Card.Header>
      <form
        onsubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <Card.Content class="space-y-4">
          <div class="space-y-2">
            <label for="email" class="text-sm font-medium">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              required
              bind:value={email}
            />
          </div>
          <div class="space-y-2">
            <label for="password" class="text-sm font-medium">Password</label>
            <Input id="password" type="password" required bind:value={password} />
          </div>
          {#if error}
            <div class="text-destructive text-sm">{error}</div>
          {/if}
        </Card.Content>
        <Card.Footer class="pt-6">
          <Button type="submit" class="w-full">Sign in</Button>
        </Card.Footer>
      </form>
      <div class="px-6 pb-6 text-center text-sm">
        Don't have an account? <a href="/signup" class="text-primary hover:underline">
          Sign up
        </a>
      </div>
    </Card.Root>
  </div>
</div>
