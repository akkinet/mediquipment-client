import { NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

export const GET = async (req, ctx) => {
  try {
    const id = ctx.params.id;
    let checkout_session = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/stripe/checkout/${id}`
    );
    checkout_session = await checkout_session.json();
    const s3 = new S3Client();

    const lineItems = checkout_session.metadata.prescription_items
      ? JSON.parse(checkout_session.metadata.prescription_items)
      : {};
    for (const item in lineItems) {
      const fileName = lineItems[item].split("/").pop();
      const params = {
        Bucket: "medicom.hexerve",
        Key: fileName,
      };
      await s3.send(new DeleteObjectCommand(params));
    }

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
