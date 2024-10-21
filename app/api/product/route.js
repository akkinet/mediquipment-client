import { NextResponse } from "next/server";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../../config/ddbDocClient";

function capitalize(str) {
  if (typeof str !== "string" || str.length === 0) {
    return str; // Handle empty or non-string input
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const brand = searchParams.get("brand");
    const prescription = searchParams.get("prescription");
    const price = searchParams.get("price");
    const category = searchParams.get("category");
    const query = searchParams.get("query");
    const num = searchParams.get("num");
    let productList = [];

    let params = {
      TableName: "RealProducts",
    };

    if (price || prescription || brand || category || query) {
      params.FilterExpression = "";
      params.ExpressionAttributeValues = {};

      if (category) {
        params.FilterExpression += "category = :category";
        params.ExpressionAttributeValues[":category"] = category;
      }

      if (price) {
        const parsedPrice = JSON.parse(price);
        switch (price) {
          case '{"$gte":2000,"$lt":5000}':
            if (params.FilterExpression.length == 0)
              params.FilterExpression +=
                "prod_value BETWEEN :priceLower AND :priceUpper";
            else
              params.FilterExpression +=
                " AND prod_value BETWEEN :priceLower AND :priceUpper";
            params.ExpressionAttributeValues[":priceLower"] = parsedPrice.$gte;
            params.ExpressionAttributeValues[":priceUpper"] = parsedPrice.$lt;
            break;
          case '{"$lt":2000}':
            if (params.FilterExpression.length == 0)
              params.FilterExpression += "prod_value < :price";
            else params.FilterExpression += " AND prod_value < :price";
            params.ExpressionAttributeValues[":price"] = parsedPrice.$lt;
            break;
          default:
            if (params.FilterExpression.length == 0)
              params.FilterExpression += "prod_value >= :price";
            else params.FilterExpression += " AND prod_value >= :price";
            params.ExpressionAttributeValues[":price"] = parsedPrice.$gte;
        }
      }

      if (prescription) {
        params.ExpressionAttributeValues[":prescription"] =
          JSON.parse(prescription);
        if (params.FilterExpression.length > 0)
          params.FilterExpression += " AND key_features.rx_required = :prescription";
        else params.FilterExpression += "key_features.rx_required = :prescription";
      }

      if (brand) {
        if (params.FilterExpression.length > 0)
          params.FilterExpression += " AND brand_name = :brand";
        else params.FilterExpression += "brand_name = :brand";

        const brandArray = searchParams.get("brand").split(",");
        for (const x of brandArray) {
          params.ExpressionAttributeValues[":brand"] = x;
          const command = new ScanCommand(params);
          const response = await ddbDocClient.send(command);
          if (response.Items.length > 0) productList.push(...response.Items
            .slice(0, num ? parseInt(num) : response.Items.length)
          );
        }

        return NextResponse.json(productList, { status: 200 });
      }

      if (query) {
        params.FilterExpression += "contains(prod_name, :title)";
        params.ExpressionAttributeValues[":title"] = capitalize(query);
      }
    }

    const command = new ScanCommand(params);
    const response = await ddbDocClient.send(command);
    if (response.Items.length > 0) productList.push(...response.Items
      .slice(0, num ? parseInt(num) : response.Items.length)
    );
    return NextResponse.json(productList, { status: 200 });
  } catch (error) {
    console.error("er", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
