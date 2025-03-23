# Irarium

A space for ideas.

## Map

...

## Testing Stripe webhook

ngrok doesn't work, not sure why, just use stripe cli

`stripe listen --forward-to http://localhost:5173/payments`
`stripe trigger checkout.session.completed`

#### Test cards

4242424242424242 - Successful payment
4000000000009995 - Failed payment
4000002500003155 - Requires authentication
