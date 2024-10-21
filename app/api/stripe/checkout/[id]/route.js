import { NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export const GET = async (req, { params }) => {
  try {
    const id = params.id;
    const session = await stripe.checkout.sessions.retrieve(id, {
      expand: ['line_items'],
    });
    return NextResponse.json(session, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
