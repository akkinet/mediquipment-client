import { QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../../../config/ddbDocClient";
import { NextResponse } from "next/server";

export const GET = async (req, ctx) => {
  try {
    const email = ctx.params.user;
    const { searchParams } = new URL(req.url);
    const order_id = searchParams.get("id");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    let command;

    if (from && to) {
      const params = {
        TableName: "Orders",
        FilterExpression:
          "customer_email = :email AND order_date BETWEEN :from AND :to",
        ExpressionAttributeValues: {
          ":email": email,
          ":from": from,
          ":to": to,
        },
      };

      command = new ScanCommand(params);
    }else if(order_id){
      const params = {
        TableName: "Orders",
        FilterExpression: "customer_email = :email AND contains(id, :id)",
        ExpressionAttributeValues: {
          ":id": order_id,
          ":email": email
        },
      };
      command = new ScanCommand(params);
    }else{
      const params = {
        TableName: "Orders",
        IndexName: "sort-index",
        KeyConditionExpression: "customer_email = :email",
        ExpressionAttributeValues: {
          ":email": email,
        },
      };
      command = new QueryCommand(params);
    }
    
    const result = await ddbDocClient.send(command);
    let orderList = [];
    if (result.Items.length > 0) orderList = result.Items;

    return NextResponse.json(orderList, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
