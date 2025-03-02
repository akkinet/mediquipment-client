import { NextResponse } from "next/server";
import { removeStopWords } from "../../../../lib/helperFunction";
import Product from "../../../../models/Product";

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
    const result = await Product.findOne({prod_id: ctx.params.id})

    const jsonRes = await fetch('https://s3.ap-south-1.amazonaws.com/medicom.hexerve/stopWords.json');
    const stopWords = await jsonRes.json();

    if (Object.keys(result).length > 0) {
      const product = result;
      let relatedProducts = [];

      const filteredText = removeStopWords(product.prod_name, stopWords);
      for (const text of filteredText.trim().split(" ")) {
        let filterText = text.trim();
        filterText = filterText[0].toUpperCase() + filterText.substr(1);
        
        const query = {
          prod_id: { $ne: ctx.params.id }, // Exclude a specific prod_id
          prod_name: { $regex: new RegExp(filterText, "i") } // Case-insensitive search in product name
        };
        
        const products = await Product.find(query);
        if (products) relatedProducts.push(...products);
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
    let { quantity } = await req.json(); // Get quantity to reduce
    const productId = ctx.params.id; // Get product ID from request params
    quantity = parseInt(quantity);

    if (!quantity || quantity <= 0) {
      return NextResponse.json(
        { message: "Invalid quantity value" },
        { status: 400 }
      );
    }

    // Find the product and check stock availability
    const product = await Product.findOne({ prod_id: productId });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    if (product.stockQuantity < quantity) {
      return NextResponse.json(
        { message: "Insufficient stock" },
        { status: 400 }
      );
    }

    // Update stock quantity by decrementing the given value
    const updatedProduct = await Product.findOneAndUpdate(
      { prod_id: productId },
      { $inc: { stockQuantity: -quantity } }, // Reduce stock quantity
      { new: true } // Return updated product
    );

    return NextResponse.json(
      { message: "Stock updated successfully", product: updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};