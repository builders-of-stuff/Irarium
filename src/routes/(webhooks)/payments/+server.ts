import { json } from '@sveltejs/kit';
import Stripe from 'stripe';

import { STRIPE_SECRET_API_KEY, STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { handleSuccessfulPayment } from './payments.tools';

export async function POST(event) {
  const stripe = new Stripe(STRIPE_SECRET_API_KEY);
  const pb = event.locals.pb;

  // Extract and validate request data
  const payload = await event.request.text();
  const signature = event.request.headers.get('stripe-signature');

  if (!signature) {
    return json({ error: 'Missing Stripe signature' }, { status: 400 });
  }

  // Verify webhook signature
  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      payload,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Error verifying webhook signature:', err);
    return json({ error: 'Invalid Stripe signature' }, { status: 400 });
  }

  if (!stripeEvent) {
    return json({ error: 'Invalid Stripe signature' }, { status: 400 });
  }

  // Process the webhook event
  try {
    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        const result = await handleSuccessfulPayment(pb, stripeEvent);
        return result;
      }

      case 'checkout.session.expired':
        // Payment expired or was cancelled
        return json({ success: true });

      default:
        // Just acknowledge receipt of unexpected event types
        return json({ received: true });
    }
  } catch (err) {
    console.error('Error handling webhook:', err);
    return json({ error: 'Webhook processing failed' }, { status: 400 });
  }
}
