import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "./lib/authOptions";

export const middleware = async (req) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

export const config = {
  matcher: ["/api/stripe/checkout"],
};
