import { NextResponse } from "next/server";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../../../config/ddbDocClient";

export const GET = async (req) => {
  try {
    const product_res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`);
    const products = await product_res.json();

    for (const product of products) {
      const images = [];
      for (const image of product.prod_images) {
        const fileName = image.split("/").pop();
        images.push(
          `https://s3.ap-south-1.amazonaws.com/medicom.hexerve/product_images/${fileName}`
        );
      }

      const command = new UpdateCommand({
        TableName: "RealProducts",
        Key: {
          prod_id: product.prod_id,
        },
        UpdateExpression: "set #fieldToUpdate = :newValue",
        ExpressionAttributeNames: {
          "#fieldToUpdate": "prod_images", 
        },
        ExpressionAttributeValues: {
          ":newValue": images, 
        },
      });

      await ddbDocClient.send(command);
    }

    return NextResponse.json({ message: "success" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
