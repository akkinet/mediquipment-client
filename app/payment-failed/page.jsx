// Create a new file at pages/payment-failed.jsx

import Link from 'next/link';
import { CiCircleRemove } from "react-icons/ci";

const PaymentFailedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-montserrat">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
            <CiCircleRemove className="w-12 h-12 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-red-500 mb-2">Payment Failed</h2>
          <p className="text-center mb-6">
            We&apos;re sorry, but your payment was not successful. Please contact your bank to resolve the issue and try again.
          </p>
        </div>
        {/* <div className="flex justify-center">
          <Link href="/try-again">
            <div className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-customPink cursor-pointer">
              Try Again
            </div>
          </Link>
        </div> */}
        
      </div>
    </div>
  );
};

export default PaymentFailedPage;
