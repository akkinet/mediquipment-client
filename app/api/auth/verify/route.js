import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken'
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient } from '../../../../config/ddbDocClient';

export const GET = async (req, ctx) => {
    try {
        const { searchParams } = new URL(req.url)
        const token = searchParams.get('token')
        const useCase = searchParams.get('for')
        const createdAt = searchParams.get('createdAt')
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
        if (!decodedToken) {
            return NextResponse.json({ error: "Invalid token" }, { status: 400 })
        }
        if (useCase == 'email') {
            const cmdParams = {
                TableName: "Users",
                Key: {
                  email: decodedToken.email, //primaryKey
                  createdAt
                },
                UpdateExpression: "set verify = :v",
                ExpressionAttributeValues: {
                  ":v": true
                },
              };

              await ddbDocClient.send(new UpdateCommand(cmdParams));
            
            return NextResponse.redirect(new URL('/verify/email', req.url));
        }

        return NextResponse.json({ error: "Insufficient query parameter" }, { status: 400 })
    } catch (err) {
        if (err.name == 'TokenExpiredError')
            return NextResponse.json({ error: "Token expired" }, { status: 400 })
        return NextResponse.json({ error: err.message }, { status: 400 })
    }
}