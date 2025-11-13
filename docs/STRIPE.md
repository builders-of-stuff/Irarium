# Stripe Integration

For testing payment functionality locally.

## Setup

**1. Install Stripe CLI:**

See: https://stripe.com/docs/stripe-cli

**2. Listen for webhooks:**

```bash
stripe listen --forward-to http://localhost:5173/payments
```

**3. Trigger test events:**

```bash
stripe trigger checkout.session.completed
```

## Test Cards

- `4242 4242 4242 4242` — Successful payment
- `4000 0000 0000 9995` — Failed payment
- `4000 0025 0000 3155` — Requires authentication

## Notes

- ngrok doesn't work for some reason, use the Stripe CLI instead
- The webhook endpoint is at `/payments`
- Payment records are stored in the `payments` collection
- User upgrade status is tracked in `userSettings.isFullyUpgraded`
