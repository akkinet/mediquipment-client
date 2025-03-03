import { NextResponse } from "next/server";
import Cart from "../../../models/Cart";

export const POST = async (req) => {
  try {
    const {
      prod_images,
      prescription,
      prod_value,
      quantity,
      prod_name,
      prod_id,
      prod_desc,
      email,
    } = await req.json();

    const itemToAdd = {
      quantity,
      images: prod_images,
      prescription,
      description: prod_desc,
      price: prod_value,
      title: prod_name,
      product_id: prod_id,
    };

    const result = await Cart.findOneAndUpdate(
      { email: email }, // Filter to find the document by email
      { $push: { items: itemToAdd } }, // Push the new item to the items array
      { new: true, upsert: true } // Options to return the new document and create it if it doesn't exist
    );

    if (result) {
      console.log("Updated document:", result);
      return NextResponse.json({
        message: "Item added to cart successfully",
        updatedCart: result.items,
      });
    }
    return NextResponse.json(
      { message: "Failed to add item to cart" },
      { status: 404 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
