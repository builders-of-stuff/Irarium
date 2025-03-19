/**
 * This module contains Stripe-related utilities for server-side operations.
 * In a real implementation, you would initialize the Stripe SDK here.
 */

import { STRIPE_SECRET_API_KEY, STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { COLLECTION } from '$lib/shared/shared.type';
import type { Payment } from '$lib/shared/shared.type';
import PocketBase from 'pocketbase';
import Stripe from 'stripe';

// Initialize Stripe SDK
const stripe = new Stripe(STRIPE_SECRET_API_KEY);

/**
 * Process a successful payment event from Stripe
 * @param pb PocketBase instance
 * @param session Stripe checkout session data
 * @returns Payment record or null if processing failed
 */
export async function processSuccessfulPayment(
  pb: PocketBase,
  session: any
): Promise<any | null> {
  try {
    const customerId = session.customer;
    const paymentId = session.payment_intent;
    const userEmail = session.customer_email || session.customer_details?.email;

    if (!userEmail) {
      console.error('No user email found in the Stripe session');
      return null;
    }

    // Find the user by email
    const users = await pb.collection(COLLECTION.USERS).getList(1, 1, {
      filter: `email="${userEmail}"`
    });

    if (users.items.length === 0) {
      console.error('User not found for email:', userEmail);
      return null;
    }

    const user = users.items[0];

    // Create a payment record
    const payment = await pb.collection(COLLECTION.PAYMENTS).create({
      userId: user.id,
      amount: session.amount_total / 100, // Convert from cents to dollars
      currency: session.currency,
      status: 'succeeded',
      stripePaymentId: paymentId,
      stripeCustomerId: customerId,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      metadata: session.metadata || {}
    });

    // Update user to premium
    await pb.collection(COLLECTION.USERS).update(user.id, {
      isPremium: true,
      premiumSince: new Date().toISOString()
    });

    return payment;
  } catch (error) {
    console.error('Error processing payment:', error);
    return null;
  }
}

/**
 * Verify a Stripe webhook signature using the Stripe SDK
 * @param payload Raw request body
 * @param signature Stripe signature header
 * @returns The verified Stripe event or null if verification fails
 */
export function verifyWebhookSignature(payload: string, signature: string) {
  try {
    // Use the Stripe SDK to verify the signature and construct the event
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      STRIPE_WEBHOOK_SECRET
    );

    return event;
  } catch (err) {
    console.error('Error verifying webhook signature:', err);
    return null;
  }
}
