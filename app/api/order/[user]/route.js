import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../../../config/ddbDocClient";
import { NextResponse } from "next/server";

export const GET = async (req, ctx) => {
  try {
    const email = ctx.params.user;
    const params = {
      TableName: "Orders",
      IndexName: "sort-index",
      KeyConditionExpression: "customer_email = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
    };
    const command = new QueryCommand(params);
    const result = await ddbDocClient.send(command);
    let orderList = [];
    if(result.Items.length > 0)
      orderList = result.Items;
    
    return NextResponse.json(orderList, {status: 200})
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
