"use client"
import { IoTrashBinSharp } from "react-icons/io5"; // Correct import for the trash bin icon
import Image from 'next/image';
import { useState, useEffect, useMemo, useContext } from 'react';
import { useRouter } from 'next/navigation'; // Correct import for app directory
import { CartContext } from '../../components/SessionProVider';
import { useSession } from 'next-auth/react';
import Cart from '../empty-page/page';
import Link from 'next/link';


const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [cartItems, setCartItems] = useContext(CartContext);
  const { data: session } = useSession();
  const pageTitle = 'Cart';

  const totalAmount = useMemo(() => {
    if (cart?.length > 0)
      return cart.reduce((total, c) => total + (c.price * c.quantity), 0);
    return 0;
  }, [cart]);

  useEffect(() => {
    const myCart = window.localStorage.getItem("medCart");
    document.title = pageTitle;
    setCart(JSON.parse(myCart));
  }, [pageTitle]);

  const router = useRouter();

  const handleQuantityChange = (id, delta) => {
    let myCart = [];
    if (delta === 1) {
      myCart = cart?.map(item =>
        item._id === id && item.quantity < item.stockQuantity ?
          { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      );
      setCart(myCart);
      window.localStorage.setItem("medCart", JSON.stringify(myCart));
      return;
    }

    myCart = cart?.map(item =>
      item._id === id ?
        { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );
    window.localStorage.setItem("medCart", JSON.stringify(myCart));
    setCart(myCart);
  };

  const handleRemoveItem = async (id) => {
    const myCart = cart.filter(item => item._id !== id);
    setCart(myCart);

    if (session) {
      await fetch(`/api/cart/${session.user.email}?product_id=${id}`, {
        method: "DELETE"
      });
    }
    setCartItems(cartItems - 1);
    window.localStorage.setItem("medCart", JSON.stringify(myCart));
  };

  const handleCheckout = () => {
    if (session)
      router.push('/checkout');
    else
      router.push("/login");
  };

  return (
    <div className="container mt-24 mx-auto p-4 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">YOUR CART</h1>
        <Link href={"/product"}>
          <button className="bg-teal-400 text-white px-4 py-2 rounded mt-4 sm:mt-0">
            CONTINUE SHOPPING
          </button>
        </Link>
      </div>
      {!cart || cart.length === 0 ? (
        <Cart />
      ) : (
        <>
          <div className="mt-8 mx-auto p-4">
            <div className="hidden sm:flex justify-between items-center">
              <h2 className="text-2xl text-teal-400 font-bold w-1/4">PRODUCT</h2>
              <h2 className="text-2xl text-teal-400 font-bold w-1/4 text-center">QUANTITY</h2>
              <h2 className="text-2xl text-teal-400 font-bold w-1/4 text-center">TOTAL</h2>
              <h2 className="text-2xl text-teal-400 font-bold w-1/4 text-center">REMOVE</h2>
            </div>
          </div>
          {cart?.map((item, index) => (
            <div key={item._id} className={`border-t border-gray-300 py-4 ${index === cart.length - 1 ? '' : 'border-b border-gray-300'}`}>
              <div className="flex flex-wrap items-center">
                <div className="w-full sm:w-1/4 flex items-center justify-center">
                  <div className="relative w-32 h-32 flex justify-center items-center">
                    <Image
                      src={item.prod_images[0]}
                      alt="Product"
                      width={128}
                      height={128}
                      className="object-contain"
                    />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl font-bold">{item.title}</h2>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="w-full sm:w-1/4 flex justify-center items-center mt-4 sm:mt-0">
                  <div className="flex items-center border border-transparent rounded px-2 py-1">
                    <button
                      onClick={() => handleQuantityChange(item._id, -1)}
                      className="border rounded px-2 py-1"
                    >
                      -
                    </button>
                    <span className="mx-2 border-t border-b border-transparent px-4 py-1">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item._id, 1)}
                      className="border rounded px-2 py-1"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="w-full sm:w-1/4 flex justify-center items-center mt-4 sm:mt-0">
                  <p className="text-gray-600 font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div className="w-full sm:w-1/4 flex justify-center items-center mt-4 sm:mt-0">
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="text-red-500"
                  >
                    <IoTrashBinSharp /> {/* Updated to Ionicons trash icon */}
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="flex flex-col items-center sm:items-end mt-8">
            <div className="w-full sm:w-7/8 border-t border-gray-300 pt-4">
              <div className="text-center sm:text-right">
                <p className="text-lg font-bold">Estimated total <span className="text-xl">
                  ${totalAmount.toFixed(2)} USD
                </span></p>
                <p className="text-gray-600 text-sm">Taxes, discounts and shipping calculated at checkout</p>
                <button
                  className="bg-teal-400 text-white px-4 py-2 rounded mt-2"
                  onClick={handleCheckout}
                >
                  CHECK OUT
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
