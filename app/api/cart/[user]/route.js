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
    const params = {
      TableName: "Cart",
      Key: {
        email: ctx.params.user,
      },
    };
    const result = await ddbDocClient.send(new GetCommand(params));
    const cart = result.Item ? result.Item.items ?? [] : [];

    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(error.message, { status: 500 });
  }
};

export const DELETE = async (req, ctx) => {
  try {
    const { searchParams } = new URL(req.url);
    const product_id = searchParams.get("product_id");

    if (!product_id) {
      await ddbDocClient.send(
        new DeleteCommand({
          TableName: "Cart",
          Key: { email: ctx.params.user },
        })
      );
      return NextResponse.json([], { status: 200 });
    }

    const result = await ddbDocClient.send(
      new GetCommand({ TableName: "Cart", Key: { email: ctx.params.user } })
    );

    if (result.Item) {
      const itemList = result.Item ? result.Item.items : [];
      const productIndex = itemList.findIndex(
        (item) => item.product_id == product_id
      );

      if (productIndex !== -1) {
        const params = {
          TableName: "Cart",
          Key: { email: ctx.params.user },
          UpdateExpression: `REMOVE #items[${productIndex}]`,
          ExpressionAttributeNames: {
            "#items": "items",
          },
          ExpressionAttributeValues: {
            ":productExists": itemList[productIndex],
          },
          ConditionExpression:
            "attribute_exists(#items) AND contains(#items, :productExists)",
          ReturnValues: "UPDATED_NEW",
        };

        await ddbDocClient.send(new UpdateCommand(params));

        return NextResponse.json({ message: "deleted" });
      }

      return NextResponse.json({ message: "bad request" }, { status: 400 });
    }

    return NextResponse.json({ message: "no such user" }, { status: 404 });
  } catch (error) {
    console.error(error);
    return new Response(error.message, { status: 500 });
  }
};
