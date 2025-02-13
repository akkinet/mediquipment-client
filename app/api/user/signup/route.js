import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import sendMail from "../../../../lib/sendMail";
import { getBaseURL } from "../../utils";
import bcrypt from "bcrypt";
import Users from "../../../../models/Users";

export const POST = async (req) => {
  try {
    const userData = await req.json();

    let exUser = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/info/${userData.username}`
    );
    exUser = await exUser.json();

    if (!exUser?.message)
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 }
      );

    const password = await bcrypt.hash(userData.password, 10);
    const { username, phone, email } = userData;

    await Users.create({
      username,
      phone,
      email,
      password,
      verified: false,
    });

    const token = jwt.sign(
      { username: userData.username, email: userData.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    const baseURL = getBaseURL(req);
    const html = `<!DOCTYPE html>
<html>
<head>
  <title>Email Verification</title>
</head>
<body>
  <div style="text-align: center; padding: 20px;">
    <h1>Verify Your Email Address</h1>

    <p>Thank you for signing up! To complete your registration, please click the button below to verify your email address:</p>

    <button type="button" onclick="location.href='${baseURL}/api/auth/verify?for=email&token=${token}'" style="background-color: #007bff; color: white; padding: 10px 20px; border: none; cursor: pointer;">
      Verify Now
    </button>

    <p>If the button doesn't work, you can copy and paste the following link into your browser:</p>

    <p>This link will expire in 24 hours.</p>

    <p>If you did not sign up for an account, you can ignore this email.</p>
  </div>
</body>
</html>
`;

    await sendMail(userData.email, "Email verification", html);

    return NextResponse.json(
      {
        message: "Success",
        email: userData.email,
        username: userData.username,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
