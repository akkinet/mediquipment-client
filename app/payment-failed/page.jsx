// Create a new file at pages/payment-failed.jsx

import Link from 'next/link';
import { CiCircleRemove } from "react-icons/ci";

const PaymentFailedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mb-4">
            <CiCircleRemove className="w-10 h-10 text-white animate-ping" />
          </div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">Payment Failed</h2>
          <p className="text-center mb-6">
            We&apos;re sorry, but your payment was not successful. Please contact your bank to resolve the issue and try again.
          </p>
        </div>
        <div className="flex justify-center">
          <Link href="/try-again">
            <div className="bg-red-400 text-white px-4 py-2 rounded-lg hover:bg-teal-500 cursor-pointer">
              Try Again
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedPage;
