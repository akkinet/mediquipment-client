import { NextResponse } from "next/server";
import sendMail from "../../../lib/sendMail";
import Order from "../../../models/Order";
import Stripe from "stripe";
// import { transaction } from "../../../lib/shippo";
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export const POST = async (req) => {
  try {
    const body = await req.json();
    // let checkout_session = await fetch(
    //   `${process.env.NEXT_PUBLIC_API_URL}/stripe/checkout/${body.sessionID}`
    // );
    // checkout_session = await checkout_session.json();

    const checkout_session = await stripe.checkout.sessions.retrieve(body.sessionID, {
      expand: ['line_items'],
    });
    const customer = checkout_session.customer_details;
    let user_info = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/info/${customer.email}`
    );
    const user = await user_info.json();

    const paymentIntent = await stripe.paymentIntents.retrieve(checkout_session.payment_intent);
    
    if (user.message == "Not Found") {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/create`, {
        method: "POST",
        body: JSON.stringify(customer),
      });
    }
    const productItems = checkout_session.line_items.data;
    const date = new Date();

    // const trans = await transaction(checkout_session.metadata.shipping_rate);

    const orderParams = {
      checkout_session: body.sessionID,
      // shipping_rate: checkout_session.metadata.shipping_rate,
      // carrier: trans.carrier,
      // tracking_number: trans.tracking_number,
      total_amount: checkout_session.amount_total,
      order_status: JSON.parse(checkout_session.metadata.prescription_required)
        ? "Pending"
        : "Completed",
      comment: "",
      customer_email: customer.email,
      customer_name: customer.name,
      customer_phone: customer.phone,
      order_date: date.toLocaleString(),
      // shipping_address: checkout_session.shipping_details.address,
      shipping_address: paymentIntent.shipping.address,
      billing_address: customer.address,
      total_amount: (checkout_session.amount_total / 100).toFixed(2),
      sub_amount: (checkout_session.amount_subtotal / 100).toFixed(2),
      discount_amount: (
        checkout_session.total_details.amount_discount / 100
      ).toFixed(2),
      shipping_amount: (
        checkout_session.total_details.amount_shipping / 100
      ).toFixed(2),
      tax_amount: (checkout_session.total_details.amount_tax / 100).toFixed(2),
      insurance_pdf: checkout_session.metadata.insurance_file ?? "",
      insurance_company: checkout_session.metadata.insurance_company ?? "",
      prescription_required: JSON.parse(
        checkout_session.metadata.prescription_required
      ),
      prescription_status: checkout_session.metadata.prescription_status,
      items: [],
    };

    let presItems = {};
    if (checkout_session.metadata.prescription_items)
      presItems = JSON.parse(checkout_session.metadata.prescription_items);

    const parsedProdList = JSON.parse(checkout_session.metadata.products);
    for (const item of productItems) {
      const prodResp = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product/${parsedProdList[item.description]}`,
        {
          method: "PUT",
          body: JSON.stringify({
            quantity: Number(item.quantity)
          }),
        }
      );

      const product = await prodResp.json();

      orderParams.items.push({
        product_id: product.product._id,
        product_name: product.product.prod_name,
        description: product.product.prod_desc,
        image: product.product.prod_images[0],
        quantity: item.quantity,
        price: (item.amount_total / 100).toFixed(2),
        prescription_required: product.product._id in presItems || presItems[product.product._id] == "",
        prescription_file: presItems[product.product._id] ?? "",
      });
    }

    const orderCrt = await Order.create(orderParams);
    
    const ship = orderParams.shipping_address;
    const bill = orderParams.billing_address;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Completed</title>
  <style type="text/css">
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  </style>
</head>
<body class="font-sans bg-gray-100">
  <div class="container mx-auto p-6 bg-white rounded-lg shadow-md">
    <h1 class="text-3xl font-bold mb-4">Order Completed!</h1>

    <p class="mb-4">Hi ${customer.name},</p>

    <p class="mb-4">
      This email confirms that your order (#${orderCrt._id}) has been
      successfully processed and is now complete.
    </p>

    <h2 class="text-xl font-semibold mb-2">Order Summary:</h2>
    <ul class="list-disc list-inside mb-4">
      <li>Order Number: #${orderCrt._id}</li>
      <li>Order Date: ${orderParams.order_date}</li>
      <li>Shipping Address: ${ship.line1}, ${
      ship.line2 ? `${ship.line2},` : ""
    } ${ship.city}, ${ship.state} - ${ship.postal_code}, ${ship.country}</li>
      <li>Billing Address: ${bill.line1}, ${
      bill.line2 ? `${bill.line2},` : ""
    } ${bill.city}, ${bill.state} - ${bill.postal_code}, ${bill.country}</li>
      <li>Items Ordered:
        <ul class="list-disc list-inside ml-6">
          ${orderParams.items.map(
            (item) =>
              `<li key=${item.product_id}>${item.product_name} x ${item.quantity} - ${item.price}</li>`
          )}
          </ul>
      </li>
      <li>Subtotal: ${orderParams.sub_amount}</li>
      <li>Shipping: 0</li>
      <li><strong>Total: ${orderParams.total_amount}</strong></li>
    </ul>
    <p>you can view your order history by clicking on this <a href=${process.env.NEXTAUTH_URL}/order-history>link<a/></p>

    <p class="mb-4">
      Thank you for your order! If you have any questions, please don't
      hesitate to contact us.
    </p>

    <p class="text-gray-600">
      Sincerely,<br>
      The Jkare Team
    </p>
  </div>
</body>
</html>`;

    await sendMail(customer.email, "Order Booked", html);

    return NextResponse.json({ message: "order created" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
