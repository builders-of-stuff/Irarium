import { error, json } from '@sveltejs/kit';
import { STRIPE_SECRET_API_KEY } from '$env/static/private';
import Stripe from 'stripe';

// Initialize Stripe SDK
const stripe = new Stripe(STRIPE_SECRET_API_KEY);

export async function POST({ request, locals }) {
  // Ensure user is authenticated
  if (!locals.pb.authStore.isValid) {
    throw error(401, 'Unauthorized');
  }
  // Extract product details from request
  const { userId, productType, quantity = 1 } = await request.json();

  if (!userId || !productType || !quantity) {
    throw error(400, 'Invalid user data');
  }

  try {
    // Validate quantity
    const parsedQuantity = parseInt(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity < 1 || parsedQuantity > 10) {
      throw error(400, 'Invalid quantity. Must be between 1 and 10.');
    }

    // Set up appropriate line items based on product type
    let lineItems;
    if (productType === 'full_upgrade') {
      lineItems = [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Full Upgrade',
              description: 'One-time payment for permanent upgrade'
            },
            unit_amount: 1000 // $10.00 in cents
          },
          quantity: parsedQuantity
        }
      ];
    } else {
      throw error(400, 'Invalid product type');
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      client_reference_id: userId,
      success_url: `${request.headers.get('origin')}/billing?success=true`,
      cancel_url: `${request.headers.get('origin')}/billing?canceled=true`,
      metadata: {
        quantity: parsedQuantity.toString()
      }
      // customer_email: user.email
    });

    return json({ url: session.url });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    throw error(500, 'Failed to create checkout session');
  }
}
