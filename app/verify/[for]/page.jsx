import React from 'react'
import Notification from "../../../components/Notification"
import Link from 'next/link'

export const generateMetadata = () => {
    return {
        title: "Verify"
    }
}

function page({ params }) {
    if (params.for == 'email')
        return <Notification subject="Verification Successful!" body="Congratulations, you have been successfully verified." />

    if (params.for == 'user_created')
        return <Notification subject="User Created Successful!" body="Congratulations, you have been successfully registered with us." />

    return (
        <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-md my-10">
            <h1 className="text-2xl font-semibold mb-4 text-center">Password Reset Successful</h1>

            <p className="mb-6">Your password has been successfully reset!</p>

            <div className="text-center">
                <Link href="/api/auth/signin" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-block">
                    Login Now
                </Link>
            </div>

            <p className="mt-6 text-gray-600 text-sm text-center">
                If you did not reset your password, please contact us immediately.
            </p>

        </div>
    )
}

export default page