import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const POST = async (req) => {
  try {
    const { line_items, email, metadata, selectedRate, total_amount, name, address } = await req.json();

    // Create the session object
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
      // automatic_tax: {
      //   enabled: true,
      // },
      payment_method_types: ["card", "us_bank_account", "amazon_pay"],
      // shipping_address_collection: {
      //   allowed_countries: ["US"],
      // },
      payment_intent_data: {
        shipping: {
          name,
          address,
        },
      },
      line_items,
    };


    if (selectedRate) {
      // Convert the shipping rate amount to cents (Stripe requires amounts in cents)
      const shippingAmount = Math.round(parseFloat(selectedRate.amount) * 100);
      sessionObj.shipping_options = [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: total_amount < 500 ? shippingAmount : 0, 
              currency: "usd",
            },
            display_name: selectedRate.servicelevel.display_name, // Shipping method name (e.g., "UPS® Ground")
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: selectedRate.estimated_days, // Estimated delivery time
              },
              maximum: {
                unit: "business_day",
                value: selectedRate.estimated_days + 2, // Add buffer for maximum delivery time
              },
            },
          },
        },
      ];
    }

    // Add metadata if provided
    if (metadata) {
      sessionObj.metadata = metadata;
    }

    // Add customer email if provided
    if (email) {
      sessionObj.customer_email = email;
    }

    // Create the Stripe Checkout Session
    const session = await stripe.checkout.sessions.create(sessionObj);

    // Return the session object
    return NextResponse.json({ session });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
