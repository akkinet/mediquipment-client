import { NextResponse } from "next/server";
import { removeStopWords } from "../../../../lib/helperFunction";
import { ddbDocClient } from "../../../../config/ddbDocClient";
import { GetCommand, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

function getUniqueObjects(arr) {
  const uniqueObjects = [];
  const seenObjects = new Set();

  for (const obj of arr) {
    const serializedObj = JSON.stringify(obj); // Convert object to a string for comparison

    if (!seenObjects.has(serializedObj)) {
      uniqueObjects.push(obj);
      seenObjects.add(serializedObj);
    }
  }

  return uniqueObjects;
}

export const GET = async (req, ctx) => {
  try {
    const params = {
      TableName: "RealProducts",
      Key: {
        prod_id: Number(ctx.params.id),
      },
    };
    const command = new GetCommand(params);
    const result = await ddbDocClient.send(command);

    const jsonRes = await fetch('https://s3.ap-south-1.amazonaws.com/medicom.hexerve/stopWords.json');
    const stopWords = await jsonRes.json();

    if (result.Item) {
      const product = result.Item;
      let relatedProducts = [];

      const filteredText = removeStopWords(product.prod_name, stopWords);
      for (const text of filteredText.trim().split(" ")) {
        let filterText = text.trim();
        filterText = filterText[0].toUpperCase() + filterText.substr(1);
        const params = {
          TableName: "RealProducts",
          FilterExpression: "#qid <> :qidval AND contains(#qtitle, :qtitleval)",
          ExpressionAttributeNames: {
            "#qid": "prod_id",
            "#qtitle": "prod_name",
          },
          ExpressionAttributeValues: {
            ":qidval": Number(ctx.params.id),
            ":qtitleval": filterText,
          },
        };
        const command = new ScanCommand(params);
        const result = await ddbDocClient.send(command);
        if (result.Items) relatedProducts.push(...result.Items);
      }
      relatedProducts = getUniqueObjects(relatedProducts);
      return NextResponse.json({ product, relatedProducts }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Not Found" }, { status: 404 });
    }
  } catch (error) {
    console.error("er", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};

export const PUT = async (req, ctx) => {
  try {
    const { stockQuantity, quantity } = await req.json();

    const params = {
      TableName: "RealProducts",
      Key: {
        prod_id: Number(ctx.params.id),
      },
      UpdateExpression: "set stockQuantity = :stockQuantity",
      ExpressionAttributeValues: { ":stockQuantity": stockQuantity - quantity },
      ReturnValues: "UPDATED_NEW",
    };

    await ddbDocClient.send(new UpdateCommand(params));

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};