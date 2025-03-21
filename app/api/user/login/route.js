import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import Users from "../../../../models/Users";

export const POST = async (req) => {
  try {
    const { username, password } = await req.json();
    // let user = await fetch(
    //   `${process.env.NEXT_PUBLIC_API_URL}/user/info/${username}`
    // );
    // user = await user.json();
    let user = await Users.findOne({
      $or: [{ username: username }, { email: username }],
    }).lean();

    if (user && user.message)
      return NextResponse.json(
        { error: "no such user exists" },
        { status: 400 }
      );

    const correctPass = await bcrypt.compare(password, user.password);

    if (!correctPass)
      return NextResponse.json(
        { error: "invalid credentials" },
        { status: 400 }
      );

    const chosenField = ["fullName", "username", "email", "image"];

    user = Object.fromEntries(
      Object.entries(user)
        .filter((u) => chosenField.includes(u[0]))
        .map((f) => [f[0], f[1]])
    );

    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
