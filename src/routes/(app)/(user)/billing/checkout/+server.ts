import Stripe from 'stripe';
import { error, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function POST({ request, locals }) {
  const stripe = new Stripe(env.STRIPE_SECRET_API_KEY);

  if (!locals.pb.authStore.isValid) {
    throw error(401, 'Unauthorized');
  }
  const { userId } = await request.json();

  if (!userId) {
    throw error(400, 'Invalid user data');
  }

  try {
    const lineItems = [
      {
        price: env.FULL_UPGRADE_PRICE_ID,
        quantity: 1
      }
    ];

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      client_reference_id: userId,
      success_url: `${request.headers.get('origin')}/billing?success=true`,
      cancel_url: `${request.headers.get('origin')}/billing?canceled=true`,
      metadata: {}
      // customer_email: user.email
    });

    return json({ url: session.url });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    throw error(500, 'Failed to create checkout session');
  }
}
