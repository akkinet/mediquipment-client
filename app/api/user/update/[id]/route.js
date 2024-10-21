import { NextResponse } from "next/server";
import { ddbDocClient } from "../../../../../config/ddbDocClient";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

export const PUT = async (req, ctx) => {
  try {
    const body = await req.json();

    const createdAt = body.createdAt;
    delete body.createdAt;
    
    const params = {
      TableName: "Users",
      Key: {
        username: ctx.params.id,
        createdAt
      },
      UpdateExpression: "set",
      ExpressionAttributeValues: {},
      ReturnValues: "UPDATED_NEW",
    };
    
    let updateExpressionParts = [];
    body.updatedAt = new Date().toLocaleString();

    for (const key in body) {
      updateExpressionParts.push(`${key} = :${key}`);
      params.ExpressionAttributeValues[`:${key}`] = body[key];
    }
    params.UpdateExpression += " " + updateExpressionParts.join(", ");

    await ddbDocClient.send(new UpdateCommand(params));

    return NextResponse.json(
      { message: "User updated Successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(err.message, { status: 500 });
  }
};
