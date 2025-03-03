import { NextResponse } from "next/server";
import Order from "../../../../models/Order";

export const GET = async (req, ctx) => {
  try {
    const email = ctx.params.user;
    const { searchParams } = new URL(req.url);
    const order_id = searchParams.get("id");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    let orderList = [];

    if (from && to) {
      orderList = await Order.find({
        customer_email: email,
        order_date: { $gte: from, $lte: to }, // Date range filter
      });
    } else if (order_id) {
      orderList = await Order.find({
        id: { $regex: new RegExp(order_id, "i") }, // Case-insensitive search
      });
    } else {
      orderList = await Order.find({ customer_email: email });
    }

    return NextResponse.json(orderList, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
