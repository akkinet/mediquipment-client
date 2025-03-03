import { NextResponse } from "next/server";
import Product from "../../../models/Product";
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
    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (price) {
      const parsedPrice = JSON.parse(price);
      console.log("parsedPrice", parsedPrice, typeof(Object.values(parsedPrice)[0]));
 
      filter.prod_value = parsedPrice; // Assuming price is a single number
    }

    if (prescription) {
      filter["key_features.rx_required"] = JSON.parse(prescription);
    }

    if (brand) {
      const brandArray = brand.split(",");
      filter.brand_name = { $in: brandArray };
    }

    if (query) {
      filter.prod_name = { $regex: new RegExp(capitalize(query), "i") }; // Case-insensitive search
    }

    console.log("filter", filter);
    const productList = await Product.find(filter)
      .limit(num ? parseInt(num) : 0);

    return NextResponse.json(productList, { status: 200 });
  } catch (error) {
    console.error("er", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
