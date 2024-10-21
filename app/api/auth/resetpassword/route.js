import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'

export const PUT = async (req) => {
    try {
        const authHeader = req.headers.get('Authorization')
        const token = authHeader.split(' ')[1]
        const { email } = jwt.verify(token, process.env.SECRET_KEY)
        const { password } = await req.json()
        let user = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/user/info/${email}`
        );
        user = await user.json();

        if (user && user.message)
            return NextResponse.json(
                { error: "no such user exists" },
                { status: 400 }
            );

        const hashPass = await bcrypt.hash(password, 10)

        await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/user/update/${user.username}`, {
            method: "PUT",
            body: JSON.stringify({
                password: hashPass
            })
        }
        );
        return new Response('Password updated', { status: 200 })
    } catch (err) {
        return NextResponse.json({ err: err.message }, { status: 400 })
    }
}