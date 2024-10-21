import React from 'react'
import Link from 'next/link'

function Notification({ subject, body }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <h1 className="text-2xl font-semibold text-blue-500">{subject}</h1>
                <p className="mt-2 text-gray-700">{body}</p>
                <Link href="/">Go to homepage</Link>
            </div>
        </div>
    )
}

export default Notification