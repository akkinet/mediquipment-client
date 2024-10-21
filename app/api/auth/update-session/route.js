import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "next-auth";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        const { firstName, lastName, image } = await req.json()
        
        if (session) {
            const updatedSession = { ...session, user: { ...session.user, name: `${firstName} ${lastName}`, image } };
            return NextResponse.json(updatedSession);
        }

        return new NextResponse(null, { status: 401 });
    } catch (err) {
        console.log("err", err)
        return new Response(err.message, { status: 500 })
    }
}
