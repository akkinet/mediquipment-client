import { NextResponse } from "next/server";
import Users from "../../../../../models/Users";

export const GET = async (req, ctx) => {
  try {
    const info = ctx.params.id;

    const user = await Users.findOne(
      {
        $or: [{ username: info }, { email: info }],
      },
      {
        createdAt: 0,
        updatedAt: 0,
        verified: 0,
        password: 0
      }
    );

    if (user) {
      return NextResponse.json(user, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "No user found with the given criteria" },
        { status: 404 }
      );
    }
  } catch (err) {
    console.error("Error fetching user:", err);
    return NextResponse.json(
      { message: "Internal server error", error: err.message },
      { status: 500 }
    );
  }
};
