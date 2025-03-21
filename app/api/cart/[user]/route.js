import { NextResponse } from "next/server";
import Cart from "../../../../models/Cart";

export const PUT = async (req, ctx) => {
  try {
    const { quantity, product_id } = await req.json();

    const result = await Cart.findOneAndUpdate(
      { email: ctx.params.user, "items.product_id": product_id }, // Filter to find the document
      { $set: { "items.$.quantity": quantity } }, // Update the first matching item in the array
      { new: true } // Return the updated document
    );

    if (result) {
      console.log("Updated document:", result);
      return NextResponse.json({ message: "Cart updated successfully" });
    }
    return NextResponse.json(
      { message: "No matching document found" },
      { status: 404 }
    );
  } catch (error) {
    console.error(error);
    return new Response(error.message, { status: 500 });
  }
};

export const GET = async (req, ctx) => {
  try {
    // Fetch the cart for the specified user
    const cart = await Cart.findOne(
      { email: ctx.params.user },
      { projection: { items: 1 } }
    );

    // Return the cart items or an empty array if no cart is found
    return NextResponse.json(cart?.items || [], { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(error.message, { status: 500 });
  }
};

export const DELETE = async (req, ctx) => {
  try {
    const { searchParams } = new URL(req.url);
    const product_id = searchParams.get('product_id');
    const userEmail = ctx.params.user;

    if (!product_id) {
      // If no product_id is provided, delete the entire cart for the user
      await Cart.deleteOne({ email: userEmail });
      return NextResponse.json([], { status: 200 });
    }

    // Find the cart for the user
    const cart = await Cart.findOne({ email: userEmail });

    if (!cart) {
      return NextResponse.json({ message: 'no such user' }, { status: 404 });
    }

    // Find the index of the product in the items array
    const productIndex = cart.items.findIndex(
      (item) => item.product_id.toString() === product_id
    );

    if (productIndex === -1) {
      return NextResponse.json({ message: 'bad request' }, { status: 400 });
    }

    // Remove the product from the items array
    cart.items.splice(productIndex, 1);

    // Save the updated cart
    await cart.save();

    return NextResponse.json({ message: 'deleted' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(error.message, { status: 500 });
  }
};

