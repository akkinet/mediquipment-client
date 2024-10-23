"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";

export const generateMetadata = () => {
  return {
      title: "Order History"
  }
}

const filterOrdersByDate = (orders, filter) => {
  const now = new Date();
  return orders.filter((order) => {
    const orderDate = new Date(order.order_date); 
    switch (filter) {
      case "3_months":
        return now - orderDate <= 3 * 30 * 24 * 60 * 60 * 1000;
      case "2024":
        return orderDate.getFullYear() === 2024;
      case "2023":
        return orderDate.getFullYear() === 2023;
      default:
        return true;
    }
  });
};


const SkeletonLoader = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 h-6 w-3/4 mb-4 rounded"></div>
      <div className="bg-gray-200 h-6 w-1/2 mb-4 rounded"></div>
      <div className="bg-gray-200 h-24 mb-4 rounded"></div>
    </div>
  );
};

const ProductPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

  

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/order/${session.user.email}`);
        const data = await response.json();
        setFilteredOrders(data); 
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load orders");
        setIsLoading(false);
      }
    };
    fetchOrders();
   
  }, []);

  // Filter the orders based on the search term and date filter
  useEffect(() => {
    if (!isLoading && filteredOrders) {
      let filtered = filteredOrders;
      filtered = filterOrdersByDate(filtered, dateFilter);

      if (searchTerm) {
        filtered = filtered.filter((order) =>
          order.id.toString().includes(searchTerm)
        );
      }
      setFilteredOrders(filtered);
    }
  }, [searchTerm, dateFilter, filteredOrders, isLoading]);

  const getOrderCountMessage = () => {
    const totalOrders = filteredOrders.length;

    let timePeriod;
    switch (dateFilter) {
      case "3_months":
        timePeriod = "the last 3 months";
        break;
      case "2024":
        timePeriod = "2024";
        break;
      case "2023":
        timePeriod = "2023";
        break;
      default:
        timePeriod = "all time";
    }

    return (
      <p className="font-bold text-md font-montserrat">
        {totalOrders} {totalOrders === 1 ? "order" : "orders"}{" "}
        <span>were placed in {timePeriod}</span>
      </p>
    );
  };

  const handleViewProduct = (productId) => {
  
    window.location.href = `/product/${productId}`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 mt-20 w-[70%]">
        <SkeletonLoader />
        <SkeletonLoader />
        <SkeletonLoader />
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container mx-auto p-6 border-2 border-gray-200/80 mt-20 w-[70%] font-montserrat">
      <h1 className="text-3xl font-bold mb-4">Your Orders</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by Order ID"
            className="border p-2 rounded-md w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute right-2 top-3 text-gray-500">🔍</span>
        </div>

        <select
          className="border p-2 rounded-md"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <option value="all">All Orders</option>
          <option value="3_months">Last 3 months</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
        </select>
      </div>
      <div className="mb-4">
        <p className="text-gray-700">{getOrderCountMessage()}</p>
      </div>

      {filteredOrders.length > 0 ? (
        filteredOrders.map((order, index) => (
          <div key={index} className="bg-white border rounded-lg shadow-md p-6 mb-4">
            <div className="bg-gray-100 px-4 py-1 rounded-lg mb-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                <strong>ORDER PLACED</strong> <br /> {order.order_date}
              </p>

              <div className="flex items-center space-x-4">
                <p className="text-sm text-gray-600">
                  <strong>ORDER #</strong> <br /> {order.id}
                </p>
                <button className="bg-yellow-400 text-sm font-semibold text-black px-4 py-2 rounded-md hover:bg-yellow-500">
                  Get Order Support
                </button>
              </div>
            </div>

            <div className={`overflow-y-auto ${order.items.length > 1 ? "h-48" : ""} pr-2`}>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="pb-2">S.No</th>
                    <th className="pb-2">Image</th>
                    <th className="pb-2">Product Name</th>
                    <th className="pb-2">Quantity</th>
                    <th className="pb-2">Price</th>
                    <th className="pb-2">Total</th>
                    <th className="pb-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((product, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="py-2">{idx + 1}</td>
                      <td className="py-2">
                        <Image
                          src={product.image}
                          alt={product.product_name}
                          width={80}
                          height={80}
                          className="rounded-lg"
                        />
                      </td>
                      <td className="py-4">
                        <h2 className="text-lg font-semibold text-blue-600 hover:underline">
                          {product.product_name}
                        </h2>
                      </td>
                      <td className="py-4">{product.quantity}</td>
                      <td className="py-4">${product.price}</td>
                      <td className="py-4">
                        ${(product.quantity * product.price).toFixed(2)}
                      </td>
                      <td className="py-4">
                        <button
                          className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600"
                          onClick={() => handleViewProduct(product.product_id)} 
                        >
                          View Product
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 bg-gray-100 px-4 py-1 rounded-lg flex justify-between">
              <div className="text-sm">
                <h3 className="font-bold">Price Breakdown:</h3>
                <p>Original Price: ${order.sub_amount}</p>
                <p>Discount: -${order.discount_amount}</p>
                <p className="font-bold">Total: ${order.total_amount}</p>
              </div>

              <div className="text-sm">
                <h3 className="font-bold">Shipping Address:</h3>
                <p className="text-gray-700">
                  {order.shipping_address.line1}, {order.shipping_address.city}, {order.shipping_address.state}, {order.shipping_address.country} - {order.shipping_address.postal_code}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default ProductPage;
