import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export const POST = async req => {
  try {
    const { fileName, filePreview, fileType } = await req.json();
    const fileBuffer = Buffer.from(filePreview.split(',')[1], 'base64');
    // const [file_name, extension] = fileName.split(".");
    const lastDot = fileName.lastIndexOf(".");
    const file_name = fileName.slice(0,lastDot);
    const extension = fileName.slice(lastDot + 1);
    const newFileName = `px&inc/${file_name}_${new Date().getTime()}.${extension}`;
    const s3 = new S3Client();
    const params = {
      Bucket: "medicom.hexerve", // Replace with your S3 bucket name
      Key: newFileName, 
      Body: fileBuffer,
      ContentType: fileType,
    };
    await s3.send(new PutObjectCommand(params));
    const fileURL = `https://medicom.hexerve.s3.${process.env.AWS_REGION}.amazonaws.com/${newFileName}`;
    return NextResponse.json({ fileURL }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};