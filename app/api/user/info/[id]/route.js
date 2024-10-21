import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../../../../config/ddbDocClient";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  const data = params.id;

  try {
    const params = {
      TableName: "Users",
      KeyConditionExpression: "username = :username",
      ExpressionAttributeValues: {
        ":username": data,
      },
    };

    const command = new QueryCommand(params);
    let result = await ddbDocClient.send(command);

    if (!result.Items || result.Items.length === 0) {
      const params = {
        TableName: "Users",
        IndexName: "email-index",
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: {
          ":email": data,
        },
      };

      const command = new QueryCommand(params);
      result = await ddbDocClient.send(command);
    }

    if (result.Items && result.Items.length > 0) {
      const user = result.Items[0];
      return NextResponse.json(user, { status: 200 });
    }

    return NextResponse.json({ message: "Not Found" }, { status: 404 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
