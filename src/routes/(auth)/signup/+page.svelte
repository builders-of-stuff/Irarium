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
  let confirmPassword = $state('');
  let error = $state('');

  async function handleSignup() {
    if (password !== confirmPassword) {
      error = 'Passwords do not match';
      return;
    }

    try {
      const result = await authStore.signUp(email, password, confirmPassword);

      if (result.success) {
        error = '';
        goto(ROUTE.HOME);
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

<div
  class="container mx-auto flex min-h-screen max-w-md items-start justify-center pt-[10vh]"
>
  <div class="w-full max-w-md space-y-10">
    <div class="flex flex-col items-center gap-4">
      <a href={ROUTE.LANDING}>
        <img
          src={IrariumLogo}
          alt="Irarium Logo"
          class="h-20 w-20 rounded-xl shadow-sm"
        />
      </a>
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
        <Card.Footer class="pt-6">
          <Button type="submit" class="w-full">Create account</Button>
        </Card.Footer>
      </form>

      <div class="relative px-6">
        <div class="absolute inset-0 flex items-center px-6">
          <span class="w-full border-t" />
        </div>
        <div class="relative flex justify-center text-xs uppercase">
          <span class="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div class="px-6 pt-2">
        <Button
          variant="outline"
          class="w-full"
          onclick={async () => {
            try {
              const result = await authStore.loginWithGoogle();
              if (result.success) {
                error = '';
                goto(ROUTE.HOME);
              } else {
                error = 'Error signing in with Google';
                console.error('Google login error:', result.error);
              }
            } catch (err) {
              error = 'Error signing in with Google';
              console.error('Google login error:', err);
            }
          }}
        >
          <svg class="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </Button>
      </div>
      <div class="px-6 pb-6 text-center text-sm">
        Already have an account? <a href="/login" class="text-primary hover:underline">
          Sign in
        </a>
      </div>
    </Card.Root>
  </div>
</div>
