<script lang="ts">
  import { onMount } from 'svelte';
  import { Check, CheckCircle, AlertCircle, XCircle, LogOut } from '@lucide/svelte';
  import { goto } from '$app/navigation';

  import { Button } from '$lib/components/ui/button';
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
  } from '$lib/components/ui/card';
  import * as Tabs from '$lib/components/ui/tabs';
  import { ROUTE } from '$lib/shared/shared.constant';
  import * as Alert from '$lib/components/ui/alert';
  import { authStore } from '$lib/auth/auth.store.svelte';
  import { irariumsStore } from '$lib/irarium/irariums.store.svelte';

  let showSuccess = false;
  let showCanceled = false;
  let showError = false;
  let errorMessage = 'Something went wrong. Please try again later.';

  onMount(() => {
    // Check URL parameters
    const url = new URL(window.location.href);
    showSuccess = url.searchParams.get('success') === 'true';
    showCanceled = url.searchParams.get('canceled') === 'true';

    // Clean URL if needed
    if (showSuccess || showCanceled) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  });

  // Handle logout function
  function handleLogout() {
    authStore.signOut();
    irariumsStore.clearStore();

    goto(ROUTE.LANDING);
  }

  // Function to handle checkout
  const handleCheckout = async () => {
    try {
      // Reset alert states
      showSuccess = false;
      showCanceled = false;
      showError = false;

      // Call checkout API
      const response = await fetch(ROUTE.CHECKOUT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: authStore.userId
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        errorMessage = errorData.message || 'Failed to create checkout session';
        throw new Error(errorMessage);
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Error starting checkout process:', error);
      // Show error alert
      showError = true;
    }
  };
</script>

<div class="relative container min-h-screen max-w-5xl py-8">
  <div class="mb-6 flex items-center justify-between">
    <h1 class="text-3xl font-bold">Settings</h1>
  </div>

  {#if showSuccess}
    <Alert.Root
      class="mb-6 border-green-600 bg-green-100 dark:border-green-500 dark:bg-green-900/50"
    >
      <CheckCircle class="h-5 w-5 text-green-600 dark:text-green-500" />
      <Alert.Title>Success!</Alert.Title>
      <Alert.Description class="text-green-700 dark:text-green-400">
        Your payment was successful and your account has been upgraded.
      </Alert.Description>
    </Alert.Root>
  {/if}

  {#if showCanceled}
    <Alert.Root
      class="mb-6 border-amber-600 bg-amber-100 dark:border-amber-500 dark:bg-amber-900/50"
    >
      <AlertCircle class="h-5 w-5 text-amber-600 dark:text-amber-500" />
      <Alert.Title>Payment Canceled</Alert.Title>
      <Alert.Description class="text-amber-700 dark:text-amber-400">
        Your payment process was canceled. No charges were made.
      </Alert.Description>
    </Alert.Root>
  {/if}

  {#if showError}
    <Alert.Root
      variant="destructive"
      class="mb-6 border-red-600 bg-red-100 dark:bg-red-900/50"
    >
      <XCircle class="h-5 w-5" />
      <Alert.Title>Checkout Failed</Alert.Title>
      <Alert.Description>
        {errorMessage}
      </Alert.Description>
    </Alert.Root>
  {/if}

  <Tabs.Root value="plans" class="w-full">
    <Tabs.List class="mb-8 grid w-full max-w-md grid-cols-2">
      <Tabs.Trigger value="plans">Billing & Plans</Tabs.Trigger>
      <Tabs.Trigger value="account" disabled>Account</Tabs.Trigger>
    </Tabs.List>

    <Tabs.Content value="plans" class="space-y-8">
      <div class="space-y-4">
        <h2 class="text-xl font-semibold">Available Plans</h2>
        <div class="grid gap-6 md:grid-cols-2 lg:max-w-4xl">
          <!-- Free Plan -->
          <Card class="flex flex-col">
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>Basic access to Irarium features</CardDescription>
              <div class="mt-2 text-3xl font-bold">
                $0<span class="text-sm font-normal text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent class="flex-grow">
              <ul class="space-y-2">
                <li class="flex items-center gap-2">
                  <Check class="h-4 w-4 text-primary" />
                  <span>Base access to features</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" class="w-full" disabled>Current Plan</Button>
            </CardFooter>
          </Card>

          <!-- Full Upgrade -->
          <Card class="flex flex-col border-primary/50 shadow-sm">
            <CardHeader>
              <CardTitle>Full Upgrade</CardTitle>
              <CardDescription>One-time payment for permanent upgrade</CardDescription>
              <div class="mt-2 text-3xl font-bold">$10</div>
            </CardHeader>
            <CardContent class="flex-grow">
              <ul class="space-y-2">
                <li class="flex items-center gap-2">
                  <Check class="h-4 w-4 text-primary" />
                  <span>
                    Unlock all current and future features that don't require a
                    subscription
                  </span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button class="w-full" onclick={handleCheckout}>Purchase</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Tabs.Content>

    <Tabs.Content value="account">
      <div
        class="flex flex-col items-center justify-center py-12 text-muted-foreground"
      >
        <p>Account settings coming soon</p>
      </div>
    </Tabs.Content>
  </Tabs.Root>

  <div class="fixed right-8 bottom-8">
    <Button
      variant="destructive"
      size="lg"
      class="gap-2 shadow-lg"
      onclick={handleLogout}
    >
      <LogOut class="h-4 w-4" />
      Log Out
    </Button>
  </div>
</div>
