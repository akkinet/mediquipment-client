import { NextResponse } from "next/server";
import { getUser } from "../../../../../lib/db-utils";

export const GET = async (req, ctx) => {
  try {
    const info = ctx.params.id;

    const user = await getUser(info);

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
