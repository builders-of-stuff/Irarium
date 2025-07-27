# Irarium

A space for ideas.

## Init

##### sveltekit

`npm run dev`

##### pocketbase

Download the pocketbase executable from docs and drag and drop it into `pocketbase` folder.

`cd pocketbase`
`./pocketbase serve`

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
