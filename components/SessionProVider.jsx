"use client";
import { SessionProvider } from "next-auth/react";
import { createContext, useEffect, useState } from "react";
import io from "socket.io-client";


export const CartContext = createContext([]);
export const socket = io("http://localhost:1008");

function SessionProVider({ children, session }) {
  const [cartItems, setCartIItems] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      // console.log("Connected to server");
    });
    // return () => socket.disconnect();
  }, []);

  const setCartItems = (data) => {
    socket.emit("update cart", data);
    setCartIItems(data);
  };

  socket.on('update cart', data => {
    // console.log("navbar data", data);
    setCartIItems(data);
  })

  return (
    <CartContext.Provider value={[cartItems, setCartItems]}>
      <SessionProvider session={session}>{children}</SessionProvider>
    </CartContext.Provider>
  );
}

export default SessionProVider;
