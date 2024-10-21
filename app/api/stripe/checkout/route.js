import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const POST = async (req) => {
  try {
    const { line_items, email, metadata } = await req.json();
    const baseURL = new URL(req.url).origin;
    const sessionObj = {
      currency: "usd",
      billing_address_collection: "required",
      mode: "payment",
      ui_mode: "hosted",
      success_url: `${baseURL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseURL}/cancel`,
      phone_number_collection: {
        enabled: true,
      },
      // automatic_tax: {
      //     enabled: true,
      // },
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

    // await stripe.checkout.sessions.create({
    //   currency: 'usd',
    //   success_url: 'http://www.success.com'
    // ,
    //   mode: 'payment',
    //   line_items: [
    //     {
    //       price_data: {
    //         currency: 'usd',
    //         product_data: {
    //           name: 'Luna G3 CPAP & Auto PAP',
    //           description: 'The Luna G3 CPAP/Auto PAP (LG3600, LG36002) devices are packed with features all in a smaller, more modern footprint and design. The Luna G3 CPAP & Auto PAP is an advanced, user-friendly device designed to provide effective CPAP therapy with customizable pressure settings and integrated comfort features. It is ideal for users seeking enhanced therapy with smart features like auto-adjusting pressure, built-in humidifier, and a quiet operation for a better nights sleep.',
    //           images: [
    //             'https://www.reacthealth.com/uploads/userfiles/files/documents/G3_APAP_Black%206-Recovered.png',
    //             'https://cdn.shopify.com/s/files/1/2790/7304/products/G3_CPAP_APAP_Black-1_1ce874d4-98a2-4ec7-9cc7-c5c4464148b6_1200x.jpg'
    //           ],
    //         },
    //         unit_amount: 34400,
    //       },
    //       quantity: 1,
    //       adjustable_quantity: {
    //         enabled: true,
    //       },
    //     },
    //   ],
    //   payment_method_types: ['amazon_pay', 'card'],
    // });

    const session = await stripe.checkout.sessions.create(sessionObj);

    return NextResponse.json({ session });
  } catch (error) {
    console.error("err", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
