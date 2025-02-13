import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Users from "../../../../models/Users";

export const GET = async (req, ctx) => {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const useCase = searchParams.get("for");
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    if (!decodedToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }
    if (useCase == "email") {
      await Users.updateOne({ email: decodedToken.email }, {
        $set: {
            verify: true
        }
      });

      return NextResponse.redirect(new URL("/verify/email", req.url));
    }

    return NextResponse.json(
      { error: "Insufficient query parameter" },
      { status: 400 }
    );
  } catch (err) {
    if (err.name == "TokenExpiredError")
      return NextResponse.json({ error: "Token expired" }, { status: 400 });
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
};
