<script lang="ts">
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
  import { Check } from 'lucide-svelte';
</script>

<div class="container max-w-5xl py-8">
  <h1 class="mb-6 text-3xl font-bold">Billing & Subscription</h1>

  <Tabs.Root value="one-time" class="w-full">
    <Tabs.List class="grid w-full grid-cols-2">
      <Tabs.Trigger value="one-time">Upgrades</Tabs.Trigger>
      <Tabs.Trigger value="plans">Subscriptions</Tabs.Trigger>
    </Tabs.List>

    <Tabs.Content value="plans" class="space-y-4">
      <div class="flex justify-center">
        <Card class="flex w-full max-w-md flex-col">
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <CardDescription>Basic access to Irarium features</CardDescription>
            <div class="text-3xl font-bold">
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
      </div>
    </Tabs.Content>

    <Tabs.Content value="one-time" class="space-y-4">
      <div class="flex justify-center">
        <Card class="flex w-full max-w-md flex-col">
          <CardHeader>
            <CardTitle>Full Upgrade</CardTitle>
            <CardDescription>One-time payment for permanent upgrade</CardDescription>
            <div class="text-3xl font-bold">$10</div>
          </CardHeader>
          <CardContent class="flex-grow">
            <ul class="space-y-2">
              <li class="flex items-center gap-2">
                <Check class="h-4 w-4 text-primary" />
                <span>Unlock all future features that don't require a subscription</span
                >
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button class="w-full">Purchase</Button>
          </CardFooter>
        </Card>
      </div>
    </Tabs.Content>
  </Tabs.Root>
</div>
