<script lang="ts">
  import { goto } from '$app/navigation';
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import IrariumLogo from '$lib/assets/irarium.png';
  import { ROUTE_IDS } from '$lib/shared/shared.constant';

  import { appState } from '../../lib/state/app.state.svelte';

  let email = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let error = $state('');

  async function handleSignup() {
    if (password !== confirmPassword) {
      error = 'Passwords do not match';
      return;
    }

    try {
      const result = await appState.signUp(email, password, confirmPassword);

      if (result.success) {
        error = '';
        goto(ROUTE_IDS.HOME);
      } else {
        error = 'Error creating account. Please try again.';
        console.error('Signup error:', result.error);
      }
    } catch (err) {
      error = 'Error creating account. Please try again.';
      console.error('Signup error:', err);
    }
  }
</script>

<div class="container flex min-h-screen items-start justify-center pt-[10vh]">
  <div class="w-full max-w-md space-y-10">
    <div class="flex flex-col items-center gap-4">
      <img
        src={IrariumLogo}
        alt="Irarium Logo"
        class="h-20 w-20 rounded-xl shadow-sm"
      />
      <h1 class="text-3xl font-bold text-primary">Irarium</h1>
    </div>

    <Card.Root>
      <Card.Header class="space-y-1">
        <Card.Title class="text-2xl">Create account</Card.Title>
      </Card.Header>
      <form
        onsubmit={(e) => {
          e.preventDefault();
          handleSignup();
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
          <div class="space-y-2">
            <label for="confirm-password" class="text-sm font-medium"
              >Confirm Password</label
            >
            <Input
              id="confirm-password"
              type="password"
              required
              bind:value={confirmPassword}
            />
          </div>
          {#if error}
            <div class="text-sm text-destructive">{error}</div>
          {/if}
        </Card.Content>
        <Card.Footer>
          <Button type="submit" class="w-full">Create account</Button>
        </Card.Footer>
      </form>
      <div class="px-6 pb-6 text-center text-sm">
        Already have an account? <a href="/login" class="text-primary hover:underline">
          Sign in
        </a>
      </div>
    </Card.Root>
  </div>
</div>
