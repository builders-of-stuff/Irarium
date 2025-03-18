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
  import { authStore } from '$lib/auth/auth.store.svelte';
</script>

<div class="container max-w-5xl py-8">
  <h1 class="mb-6 text-3xl font-bold">Billing & Subscription</h1>

  <Tabs.Root value="plans" class="w-full">
    <Tabs.List class="grid w-full grid-cols-2">
      <Tabs.Trigger value="plans">Subscription Plans</Tabs.Trigger>
      <Tabs.Trigger value="billing-history">Billing History</Tabs.Trigger>
    </Tabs.List>

    <Tabs.Content value="plans" class="space-y-4">
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card class="flex flex-col">
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
                <span>Basic collection management</span>
              </li>
              <li class="flex items-center gap-2">
                <Check class="h-4 w-4 text-primary" />
                <span>Limited storage</span>
              </li>
              <li class="flex items-center gap-2">
                <Check class="h-4 w-4 text-primary" />
                <span>Standard support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" class="w-full" disabled>Current Plan</Button>
          </CardFooter>
        </Card>

        <Card class="flex flex-col border-primary">
          <CardHeader>
            <CardTitle>Pro</CardTitle>
            <CardDescription>Enhanced capabilities for collectors</CardDescription>
            <div class="text-3xl font-bold">
              $9.99<span class="text-sm font-normal text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent class="flex-grow">
            <ul class="space-y-2">
              <li class="flex items-center gap-2">
                <Check class="h-4 w-4 text-primary" />
                <span>Everything in Free</span>
              </li>
              <li class="flex items-center gap-2">
                <Check class="h-4 w-4 text-primary" />
                <span>Advanced collection tools</span>
              </li>
              <li class="flex items-center gap-2">
                <Check class="h-4 w-4 text-primary" />
                <span>Increased storage</span>
              </li>
              <li class="flex items-center gap-2">
                <Check class="h-4 w-4 text-primary" />
                <span>Priority support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button class="w-full">Upgrade to Pro</Button>
          </CardFooter>
        </Card>

        <Card class="flex flex-col">
          <CardHeader>
            <CardTitle>Enterprise</CardTitle>
            <CardDescription>For organizations and serious collectors</CardDescription>
            <div class="text-3xl font-bold">
              $29.99<span class="text-sm font-normal text-muted-foreground">/month</span
              >
            </div>
          </CardHeader>
          <CardContent class="flex-grow">
            <ul class="space-y-2">
              <li class="flex items-center gap-2">
                <Check class="h-4 w-4 text-primary" />
                <span>Everything in Pro</span>
              </li>
              <li class="flex items-center gap-2">
                <Check class="h-4 w-4 text-primary" />
                <span>Team collaboration features</span>
              </li>
              <li class="flex items-center gap-2">
                <Check class="h-4 w-4 text-primary" />
                <span>Unlimited storage</span>
              </li>
              <li class="flex items-center gap-2">
                <Check class="h-4 w-4 text-primary" />
                <span>24/7 dedicated support</span>
              </li>
              <li class="flex items-center gap-2">
                <Check class="h-4 w-4 text-primary" />
                <span>Custom integrations</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" class="w-full">Contact Sales</Button>
          </CardFooter>
        </Card>
      </div>
    </Tabs.Content>

    <Tabs.Content value="billing-history">
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View your past payments and invoices</CardDescription>
        </CardHeader>
        <CardContent>
          {#if authStore?.user}
            <div class="rounded-md border">
              <table class="w-full caption-bottom text-sm">
                <thead>
                  <tr
                    class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <th class="h-12 px-4 text-left align-middle font-medium">Date</th>
                    <th class="h-12 px-4 text-left align-middle font-medium">Amount</th>
                    <th class="h-12 px-4 text-left align-middle font-medium">Status</th>
                    <th class="h-12 px-4 text-left align-middle font-medium">Invoice</th
                    >
                  </tr>
                </thead>
                <tbody>
                  <!-- Sample data - this would come from your backend -->
                  <tr
                    class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <td colspan="4" class="p-4 text-center text-muted-foreground">
                      No billing history available
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          {:else}
            <div class="flex h-40 items-center justify-center">
              <p class="text-muted-foreground">
                Please sign in to view your billing history
              </p>
            </div>
          {/if}
        </CardContent>
      </Card>
    </Tabs.Content>
  </Tabs.Root>
</div>
