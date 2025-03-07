import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const POST = async (req) => {
  try {
    const { line_items, email, metadata } = await req.json();
    // const baseURL = new URL(req.url).origin;
    const sessionObj = {
      currency: "usd",
      billing_address_collection: "required",
      mode: "payment",
      ui_mode: "hosted",
      success_url: `${process.env.NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cancel`,
      phone_number_collection: {
        enabled: true,
      },
      automatic_tax: {
          enabled: true,
      },
      payment_method_types: ["card", "us_bank_account", "amazon_pay"],
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      line_items,
    };

    if(metadata)
      sessionObj.metadata = metadata

    if(email)
      sessionObj.customer_email = email;

    const session = await stripe.checkout.sessions.create(sessionObj);

    return NextResponse.json({ session });
  } catch (error) {
    console.error("err", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
