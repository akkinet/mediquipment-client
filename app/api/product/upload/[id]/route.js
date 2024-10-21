import { NextResponse } from "next/server";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../../../../config/ddbDocClient";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import https from "https";
const file = ["name", "range"];
export const GET = async (req, ctx) => {
  try {
    const products = file.products;
    const s3 = new S3Client();
    let num = parseInt(ctx.params.id);
    const product = products[num];
    const images = [];
    const uuid = new Date().getTime();
    const params = {
      ...product,
      prod_id: uuid,
      prescription: false,
      isFeatured: true,
      stockQuantity: 50,
    };

    for (const image of product.prod_images) {
      const url = new URL(image);
      const baseUrl = url.origin + url.pathname;
      const imageFile = url.pathname.split("/").pop();
      const inx = imageFile.lastIndexOf(".");
      const fileName = imageFile.slice(0, inx);
      const extension = imageFile.slice(inx + 1);
      const newFileName = `${fileName}_${uuid}.${extension}`;

      try {
        const imageData = await new Promise((resolve, reject) => {
          https.get(baseUrl, (response) => {
            if (response.statusCode !== 200) {
              reject(
                new Error(
                  `Failed to fetch image: ${response.statusCode} ${response.statusMessage}`
                )
              );
              return;
            }
            const chunks = [];
            response.on("data", (chunk) => chunks.push(chunk));
            response.on("end", () => resolve(Buffer.concat(chunks)));
            response.on("error", reject);
          });
        });

        const Bucket = "medicom.hexerve";
        const Key = `product_images/${newFileName}`;
        await s3.send(
          new PutObjectCommand({
            Bucket,
            Key,
            Body: imageData,
          })
        );
        const imageUrl = `https://${Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${Key}`;
        images.push(imageUrl);
      } catch (error) {
        console.error(`Error processing image ${image}:`, error);
        // Skip this image and continue with the next one
      }
    }

    params.prod_images = images;
    const command = new PutCommand({
      TableName: "RealProducts",
      Item: params,
    });
    await ddbDocClient.send(command);

    if (++num >= products.length)
      return NextResponse.json({ message: "success" });

    return NextResponse.redirect(
      new URL(`/api/product/${num}`, req.url)
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
