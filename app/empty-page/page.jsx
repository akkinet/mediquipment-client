import Link from 'next/link';
import { PiShoppingCartDuotone } from "react-icons/pi";

export default function Cart() {
    return (
        <div className=" flex flex-col items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-2xl text-center">
                <h1 className="text-3xl font-bold mb-6 mt-14 sm:text-4xl">Cart</h1>
                <div className="flex justify-center mb-10">
                    <PiShoppingCartDuotone className="h-16 w-16 text-teal-500 sm:h-20 sm:w-20" />
                </div>
                <h2 className="text-xl font-semibold mb-6 sm:text-2xl">YOUR CART IS EMPTY. LET&apos;S CHANGE THAT!</h2>
                <p className="text-gray-600 mb-8 text-base sm:text-lg">
                    Browse our awesome store,
                    <Link href="#" legacyBehavior>
                        <a className="text-teal-400 underline ml-2 text-base sm:text-lg">start shopping now!</a>
                    </Link>
                    ,
                    <span className="mx-2 text-base sm:text-lg">Check out our</span>
                    <Link href="#" legacyBehavior>
                        <a className="text-teal-400 underline ml-2 text-base sm:text-lg">best sellers</a>
                    </Link>
                    ,
                    <span className="mx-2 text-base sm:text-lg">catch the last of our</span>
                    <Link href="#" legacyBehavior>
                        <a className="text-teal-400 underline ml-2 text-base sm:text-lg">final clearance products</a>
                    </Link>
                    ,
                    <span className="mx-2 text-base sm:text-lg">and</span>
                    <Link href="#" legacyBehavior>
                        <a className="text-teal-400 underline ml-2 text-base sm:text-lg">join our mailing list</a>
                    </Link>
                    <span className="mx-2 text-base sm:text-lg">to stay in the loop about new releases.</span>
                </p>
            </div>
            <div className="absolute top-4 right-4">
                <Link href="/" legacyBehavior>
                    <a className="text-gray-600 text-base sm:text-lg">Home / Cart</a>
                </Link>
            </div>
        </div>
    );
}
