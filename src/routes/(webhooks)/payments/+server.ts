import { json } from '@sveltejs/kit';
import { processSuccessfulPayment, verifyWebhookSignature } from './payment.tools';

export async function POST(event) {
  const pb = event.locals.pb;

  const payload = await event.request.text();
  const signature = event.request.headers.get('stripe-signature');

  if (!signature) {
    return json({ error: 'Missing Stripe signature' }, { status: 400 });
  }

  try {
    // Verify webhook signature and get the event
    const stripeEvent = verifyWebhookSignature(payload, signature);

    if (!stripeEvent) {
      return json({ error: 'Invalid Stripe signature' }, { status: 400 });
    }

    // Handle the event
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        // Payment was successful
        const session = stripeEvent.data.object;
        const result = await processSuccessfulPayment(pb, session);

        if (!result) {
          return json({ error: 'Failed to process payment' }, { status: 500 });
        }

        return json({ success: true });

      case 'checkout.session.expired':
        // Payment expired or was cancelled
        return json({ success: true });

      default:
        // Unexpected event type
        return json({ received: true });
    }
  } catch (err) {
    console.error('Error handling webhook:', err);
    return json({ error: 'Webhook processing failed' }, { status: 400 });
  }
}
