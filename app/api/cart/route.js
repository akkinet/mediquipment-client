import { NextResponse } from "next/server";
import { ddbDocClient } from "../../../config/ddbDocClient";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

export const POST = async (req) => {
  try {
    const {
      prod_images,
      prescription,
      prod_value,
      quantity,
      stockQuantity,
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
      stockQuantity,
      title: prod_name,
      product_id: prod_id,
    };

    const params = {
      TableName: "Cart",
      Key: { email },
      UpdateExpression: 'SET #items = list_append(if_not_exists(#items, :empty_list), :items)',
      ExpressionAttributeNames: {
        '#items': 'items' 
      },
      ExpressionAttributeValues: {
        ':items': [itemToAdd], // Add the product as an array element
        ':empty_list': [] 
      },
      ReturnValues: 'UPDATED_NEW'
    };

    await ddbDocClient.send(new UpdateCommand(params));

    return NextResponse.json({ message: "Product is Added." }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
