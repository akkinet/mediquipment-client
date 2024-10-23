"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";


const filterOrdersByDate = (orders, filter) => {
  const now = new Date();
  return orders.filter((order) => {
    const orderDate = new Date(order.orderPlaced);
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

const ProductPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all"); 
  const [filteredOrders, setFilteredOrders] = useState(orderData);

  
  useEffect(() => {
    let filtered = orderData;

   
    filtered = filterOrdersByDate(filtered, dateFilter);

    if (searchTerm) {
      filtered = filtered.filter((order) =>
        order.orderId.toString().includes(searchTerm)
      );
    }

    setFilteredOrders(filtered);
  }, [searchTerm, dateFilter]);
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
                <strong>ORDER PLACED</strong> <br /> {order.orderPlaced}
              </p>

              <div className="flex items-center space-x-4">
                <p className="text-sm text-gray-600">
                  <strong>ORDER #</strong> <br /> {order.orderId}
                </p>
                <button className="bg-yellow-400 text-sm font-semibold text-black px-4 py-2 rounded-md hover:bg-yellow-500">
                  Get Order Support
                </button>
              </div>
            </div>

            <div className={`overflow-y-auto ${order.products.length > 1 ? "h-48" : ""} pr-2`}>
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
                  {order.products.map((product, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="py-4">{idx + 1}</td>
                      <td className="py-4">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={80}
                          height={80}
                          className="rounded-lg"
                        />
                      </td>
                      <td className="py-4">
                        <h2 className="text-lg font-semibold text-blue-600 hover:underline">
                          {product.name}
                        </h2>
                      </td>
                      <td className="py-4">{product.quantity}</td>
                      <td className="py-4">${product.price}</td>
                      <td className="py-4">
                        ${(product.quantity * product.price).toFixed(2)}
                      </td>
                      <td className="py-4">
                        <button className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600">
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
                <p>Original Price: ${order.originalPrice}</p>
                <p>Discount: -${order.discount}</p>
                <p>Coupons Applied: -${order.coupons}</p>
                <p className="font-bold">Total: ${order.total}</p>
              </div>

         
              <div className="text-sm">
                <h3 className="font-bold">Shipping Address:</h3>
                <p className="text-gray-700">{order.shippingAddress}</p>
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


const orderData = [
  {
    orderId: 1728971862582,
    orderPlaced: "2024-03-31",
    originalPrice: 3500,
    discount: 200,
    coupons: 94,
    total: 3206,
    vendor_name: "3B Medical",
    shippingAddress: "1234 Medical Drive, New York, NY 10001, USA",
    products: [
      {
        name: "Luna II CPAP/Auto PAP",
        image: "https://s3.ap-south-1.amazonaws.com/medicom.hexerve/product_images/luna_2_1728971862582.jpg",
        quantity: 1,
        price: 1100,
      },
      {
        name: "CPAP Mask",
        image: "https://s3.ap-south-1.amazonaws.com/medicom.hexerve/product_images/cpap_mask.jpg",
        quantity: 2,
        price: 300,
      },
      {
        name: "CPAP Humidifier",
        image: "https://s3.ap-south-1.amazonaws.com/medicom.hexerve/product_images/cpap_humidifier.jpg",
        quantity: 1,
        price: 500,
      },
    ],
  },
  {
    orderId: 1718984955073,
    orderPlaced: "2024-02-27",
    originalPrice: 5000,
    discount: 300,
    coupons: 194,
    total: 4506,
    vendor_name: "Bosch",
    shippingAddress: "5678 Tool Lane, Chicago, IL 60607, USA",
    products: [
      {
        name: "Bosch GSB 450-Watt Plastic Impact Drill",
        image: "https://s3.ap-south-1.amazonaws.com/medicom.hexerve/product_images/OIP_1728971862582.o2UZ_HxK7X3QPpC3uaR-SAHaHa",
        quantity: 1,
        price: 2000,
      },
      {
        name: "Bosch Drill Set",
        image: "https://s3.ap-south-1.amazonaws.com/medicom.hexerve/product_images/drill_set.jpg",
        quantity: 1,
        price: 1000,
      },
    ],
  },
];

export default ProductPage;
