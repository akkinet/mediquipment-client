import { NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const paymentIntent = await stripe.paymentIntents.retrieve(id);
    return NextResponse.json(paymentIntent, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
