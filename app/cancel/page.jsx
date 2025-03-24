"use client"; // Specify this is a client component
import { useEffect } from "react";
import { useRouter } from 'next/navigation';

export default function CancelPage() {
    const router = useRouter();

    useEffect(() => {
        // Optional: You can add logic to log cancellation data or trigger any necessary actions.
        // console.log("Payment cancelled.");

        // Redirect back to the home page after a short delay
        const timeout = setTimeout(() => {
            router.push('/');
        }, 3000); // Redirect after 3 seconds

        return () => clearTimeout(timeout); // Clear timeout if component unmounts
    }, [router]); // Add router to the dependency array

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
            <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-md text-center">
                <h1 className="text-3xl font-bold mb-4">Payment Cancelled</h1>
                <p className="text-gray-600 mb-8">
                    Your payment was not processed. You will be redirected to the home page shortly.
                </p>
                <button
                    className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => router.push('/')}
                >
                    Return to Home
                </button>
            </div>
        </main>
    );
}