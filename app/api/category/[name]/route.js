import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";
import { ddbDocClient } from "../../../../config/ddbDocClient";

export const GET = async (req, ctx) => {
  try {
    const params = {
      TableName: "RealCategories",
      Key: {
        name: ctx.params.name,
      },
    };
    const command = new GetCommand(params);
    const result = await ddbDocClient.send(command);
    if (result.Item) {
      const obj = result.Item;
      return NextResponse.json(obj, { status: 200 });
    }
    return NextResponse.json({ message: "Not Found!" }, { status: 404 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
