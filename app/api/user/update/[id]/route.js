import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import Users from "../../../../../models/Users";

export const PUT = async (req, ctx) => {
  try {
    const formData = await req.formData();
    const file = formData.get("profile");
    let imageUrl;

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

    formData.delete("createdAt");
    if (file) formData.delete("profile");

    const existingUser = await Users.findOne({username: ctx.params.id});
    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found in the database" },
        { status: 404 }
      );
    }

    let updateData = {};

    for (const [key, value] of formData.entries()) {
      updateData[key] = key === "address" ? JSON.parse(value) : value;
    }

    if (file) {
      updateData.image = imageUrl;
    }

    if (Object.keys(updateData).length > 0) {
      // Only update if there are fields to update
      const updatedUser = await Users.findOneAndUpdate({username: ctx.params.id}, updateData, {
        new: true, // Return the updated document
      });

      return NextResponse.json(
        { message: "Update successful", user: updatedUser },
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
