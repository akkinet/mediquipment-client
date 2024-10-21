import { NextResponse } from "next/server";
import {
  DeleteCommand,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../../../config/ddbDocClient";

export const PUT = async (req, ctx) => {
  try {
    const { quantity, product_id } = await req.json();

    const result = await ddbDocClient.send(
      new GetCommand({ TableName: "Cart", Key: { email: ctx.params.user } })
    );

    if (result.Item) {
      const itemList = result.Item ? result.Item.items : [];
      const productIndex = itemList.findIndex(
        (item) => item.product_id == product_id
      );

      const params = {
        TableName: "Cart",
        Key: { email: ctx.params.user },
        UpdateExpression: `SET #items[idx].quantity = :newQuantity`,
        ExpressionAttributeNames: {
          "#items": "items",
        },
        ExpressionAttributeValues: {
          ":newQuantity": quantity,
        },
        ConditionExpression:
          "attribute_exists(#items) AND contains(#items, :productExists)",
        ReturnValues: "UPDATED_NEW",
      };

      if (productIndex !== -1) {
        params.ExpressionAttributeValues[":productExists"] =
          itemList[productIndex];
        params.UpdateExpression = `SET #items[${productIndex}].quantity = :newQuantity`;

        await ddbDocClient.send(new UpdateCommand(params));

        return NextResponse.json(
          { message: "updated the cart" },
          { status: 201 }
        );
      }
    }
    console.log("resullt", result)
    return NextResponse.json({ message: "Not Found" }, { status: 404 });
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

      return NextResponse.json({message: "bad request"}, {status: 400})
    }

    return NextResponse.json({ message: "no such user" }, { status: 404 });
  } catch (error) {
    console.error(error);
    return new Response(error.message, { status: 500 });
  }
};
