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

  let quantity = 1;

  onMount(() => {
    // Check URL parameters
    const url = new URL(window.location.href);
    showSuccess = url.searchParams.get('success') === 'true';
    showCanceled = url.searchParams.get('canceled') === 'true';

    // Clean URL if needed
    if (showSuccess || showCanceled) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (showSuccess) {
      authStore.refreshUser();
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
          userId: authStore.userId,
          quantity
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

<div class="relative container mx-auto min-h-screen max-w-5xl px-4 py-8">
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
    <Tabs.List class="mb-8 w-auto max-w-md grid-cols-2">
      <Tabs.Trigger value="plans">Upgrades</Tabs.Trigger>
      <Tabs.Trigger value="account" disabled>Account</Tabs.Trigger>
    </Tabs.List>

    <Tabs.Content value="plans" class="space-y-8">
      <!-- Current Status Section -->
      <div class="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h2 class="mb-4 text-lg font-semibold">Your Status</h2>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="flex items-center gap-3">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
            >
              <Check class="h-5 w-5 text-primary" />
            </div>
            <div>
              <p class="text-sm font-medium text-muted-foreground">Space Limit</p>
              <p class="text-xl font-bold">{authStore.userSettings?.spaceLimit || 1}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
            >
              <Check class="h-5 w-5 text-primary" />
            </div>
            <div>
              <p class="text-sm font-medium text-muted-foreground">Features</p>
              <p class="text-base font-semibold">Base access included</p>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <h2 class="text-xl font-semibold">Available Upgrades</h2>
        <div class="grid gap-6 lg:max-w-4xl">
          <!-- Additional Spaces -->
          <Card class="flex flex-col border-primary/50 shadow-sm">
            <CardHeader>
              <CardTitle>Additional Spaces</CardTitle>
              <CardDescription>
                One-time payment to increase your space limit.
              </CardDescription>
              <div class="mt-2 text-3xl font-bold">
                $3.50<span class="text-sm font-normal text-muted-foreground">/unit</span
                >
              </div>
            </CardHeader>
            <CardContent class="flex-grow">
              <div class="mb-4 space-y-2">
                <div class="flex items-center gap-2">
                  <label for="quantity" class="text-sm font-medium">Quantity:</label>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    max="100"
                    bind:value={quantity}
                    class="flex h-9 w-20 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
              <ul class="space-y-2">
                <li class="flex items-center gap-2">
                  <Check class="h-4 w-4 text-primary" />
                  <span>Permanently increase your space limit</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button class="w-full md:w-auto" onclick={handleCheckout}>Purchase</Button
              >
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
