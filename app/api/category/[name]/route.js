import { NextResponse } from "next/server";
import Category from "../../../../models/Category";

export const GET = async (req, ctx) => {
  try {
    const result = await Category.findOne({name: ctx.params.name});
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
