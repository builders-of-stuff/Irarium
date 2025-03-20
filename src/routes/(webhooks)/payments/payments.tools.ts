import { json } from '@sveltejs/kit';
import { COLLECTION } from '$lib/shared/shared.type';

/**
 * Process a successful payment from Stripe checkout
 */
export async function handleSuccessfulPayment(pb, event) {
  const session = event.data.object;
  const userId = session.client_reference_id;

  if (!userId) {
    console.error('Missing userId in session metadata');
    return json({ error: 'Missing user ID in payment metadata' }, { status: 400 });
  }

  // Create payment record
  try {
    await pb.collection(COLLECTION.PAYMENTS).create({
      userId: userId,
      stripeEventId: event.id,
      paymentIntent: session.payment_intent,
      amountTotal: session.amount_total,
      currency: session.currency,
      status: session.status
    });
  } catch (err) {
    console.error('Error creating payment record:', err);
    return json({ error: 'Failed to create payment record' }, { status: 500 });
  }

  // Update user to premium
  try {
    // Fetch and update the user settings in one step
    const userSettings = await pb
      .collection(COLLECTION.USER_SETTINGS)
      .getFirstListItem(`userId="${userId}"`);

    await pb.collection(COLLECTION.USER_SETTINGS).update(userSettings.id, {
      isFullyUpgraded: true
    });
  } catch (err) {
    console.error('Error updating userSettings:', err);
    return json({ error: 'Failed to update userSettings' }, { status: 500 });
  }

  return json({ success: true });
}
