import { NextResponse } from "next/server";
import { ddbDocClient } from "../../../../../config/ddbDocClient";
import { UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const PUT = async (req, ctx) => {
  try {
    const formData = await req.formData();
    const file = formData.get("profile");
    let imageUrl;

    // Step 1: Upload the file to S3 (if provided)
    if (file) {
      const byteData = await file.arrayBuffer();
      const Bucket = "medicom.hexerve";
      const Body = Buffer.from(byteData);
      const lastDot = file.name.lastIndexOf(".");
      const file_name = file.name.slice(0, lastDot);
      const extension = file.name.slice(lastDot + 1);
      const Key = `profile/${file_name}_${new Date().getTime()}.${extension}`;
      const s3 = new S3Client();
      await s3.send(new PutObjectCommand({ Bucket, Key, Body }));
      imageUrl = `https://s3.${process.env.AWS_REGION}.amazonaws.com/${Bucket}/${Key}`;
    }

    // Step 2: Prepare keys and check if the item exists
    const createdAt = formData.get("createdAt");
    formData.delete("createdAt");
    if (file) formData.delete("profile");

    const Key = {
      username: ctx.params.id,
      createdAt,
    };

    // Check if the item exists in the table
    const getParams = {
      TableName: "Users",
      Key,
    };

    const existingItem = await ddbDocClient.send(new GetCommand(getParams));
    if (!existingItem.Item) {
      return NextResponse.json(
        { message: "Item not found in the database" },
        { status: 404 }
      );
    }

    // Step 3: Prepare the update parameters dynamically
    const updateParams = {
      TableName: "Users",
      Key,
      UpdateExpression: "set",
      ExpressionAttributeValues: {},
      ReturnValues: "UPDATED_NEW",
    };

    let updateExpressionArray = [];

    for (const [key, value] of formData.entries()) {
      updateExpressionArray.push(`${key} = :${key}`);
      updateParams.ExpressionAttributeValues[`:${key}`] =
        key === "address" ? JSON.parse(value) : value;
    }

    if (file) {
      updateExpressionArray.push(`image = :image`);
      updateParams.ExpressionAttributeValues[`:image`] = imageUrl;
    }

    // Combine expressions
    updateParams.UpdateExpression = "set " + updateExpressionArray.join(", ");

    if (updateExpressionArray.length > 0) {
      // Only update if there are fields to update
      const user = await ddbDocClient.send(new UpdateCommand(updateParams));
      return NextResponse.json(
        { message: "Update successful", user: {createdAt, ...user.Attributes} },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "No fields to update" },
        { status: 400 }
      );
    }
  } catch (err) {
    console.error(err);
    return new Response(err.message, { status: 500 });
  }
};
