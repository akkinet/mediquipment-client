import { NextResponse } from "next/server";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../../config/ddbDocClient";

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const num = searchParams.get("num");

    const command = new ScanCommand({ TableName: "RealCategories", Limit: parseInt(num) ?? 8 });
    const result = await ddbDocClient.send(command);

    let categories = [];
    if (result.Items && result.Items.length > 0) categories = result.Items;

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("er", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};