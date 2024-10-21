"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CartContext } from "../../components/SessionProVider";
import { useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CiCircleCheck } from "react-icons/ci";
import Confetti from "react-confetti";

function page() {
  const [confettiVisible, setConfettiVisible] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const searchParams = useSearchParams();
  const [, setCartItems] = useContext(CartContext);
  const session_id = searchParams.get("session_id");
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setConfettiVisible(false);
    }, 15000);
  }, []);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (session_id) {
        const response = await fetch(
          `http://localhost:3000/api/stripe/checkout/${session_id}`
        );
        const data = await response.json();
        setPaymentDetails(data);
      }
    };

    fetchPaymentDetails();
  }, [session_id]);

  useEffect(() => {
    const callApi = async () => {
      if (session) {
        await fetch(`/api/cart/${session.user.email}`, {
          method: "DELETE",
        });
      }

      window.localStorage.removeItem("medCart");
      setCartItems(0);
    };

    callApi();
  }, [session, setCartItems]);

  if (!session_id) {
    router.push("/");
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 mt-7 relative font-montserrat">
      {confettiVisible && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md z-10">
        <div className="flex flex-col items-center ">
          <div className="w-16 h-16 bg-customPink rounded-full flex items-center justify-center mb-4 animate-pulse">
            <CiCircleCheck className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2 font-montserrat">
            Payment Successful
          </h2>
          <p className="text-center mb-6 font-montserrat">
            <b>Thank you 🙂 for your payment. Your order is being processed and you
            will receive a confirmation email shortly.</b>
          </p>
        </div>
        {paymentDetails && (
          <div className="bg-customPink p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-2 text-white">
              Payment Details
            </h3>
            <div className="flex justify-between mb-1">
              <span className="text-white">Order Value:</span>
              <span className="font-semibold text-white">
                ${(paymentDetails.amount_total)/ 100}
              </span>
            </div>
            <div className="flex justify-between mb-1">
              {/* <span className="text-white">Payment Method:</span> */}
              {/* <span className="font-semibold text-white">{paymentDetails.payment_intent?.slice(-4)}</span> */}
              {/* <span className="font-semibold text-white">{paymentDetails.payment_method_options}</span> */}
            </div>
            <div
              className="bg-white border border-white text-black px-4 py-3 rounded relative "
              role="alert"
            >
              <p className="block sm:inline font-bold">
                Your Checkout Session ID is:
              </p>
              <p id="checkoutSessionId" className="font-mono break-words">
                {session_id}
              </p>
            </div>
          </div>
        )}
        <div className="flex justify-center">
          <Link href={"/product"}>
            <button className="bg-customPink hover:bg-customPink/80 text-white font-bold py-2 px-4 border-b-4 border-customBlue rounded">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default page;
