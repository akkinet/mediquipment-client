import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const signature = req.headers.get('stripe-signature');
    const event = stripe.webhooks.constructEvent(
      await req.text(), // Get the request body as text
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
        method: "POST",
        body: JSON.stringify({
          sessionID: session.id
        })
      })

      // Retrieve and process payment information from the session object
      console.log(session.payment_intent); // Contains payment details
      console.log(session.id); // Contains payment details
      console.log(session.customer_details); // Contains customer information
      console.log(session.amount_total); // Total amount paid
      console.log(session.currency); // Currency used
      console.log(session.shipping); // Shipping information (if collected)
    }

    if(event.type === 'checkout.session.expired'){
      const session = event.data.object;
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/cancel/${session.id}`)
    }

    return new NextResponse('Webhook received', { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }
}

exports.config = {
  api: {
    bodyParser: false, // Stripe requires the raw request body
  },
};