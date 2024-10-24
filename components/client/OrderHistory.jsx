'use client';
import Image from "next/image";
import { useState, useEffect } from 'react';

function OrderHistory({ orders }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 4;

  useEffect(() => {
    let sortedOrders = [...orders].sort((a, b) => new Date(b.order_date) - new Date(a.order_date));

    if (fromDate || toDate) {
      sortedOrders = sortedOrders.filter((order) => {
        const orderDate = new Date(order.order_date);
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;

        if (from && to) {
          return orderDate >= from && orderDate <= to;
        } else if (from) {
          return orderDate >= from;
        } else if (to) {
          return orderDate <= to;
        }
        return true;
      });
    }

    // adding filter by order id
    if (searchTerm) {
      sortedOrders = sortedOrders.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(sortedOrders);
  }, [orders, fromDate, toDate, searchTerm]);

  // Handle pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleResetDate = () => {
    setFromDate('');
    setToDate('');
    const sortedOrders = [...orders].sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
    setFilteredOrders(sortedOrders);
    setCurrentPage(1);
  };

  // Function to handle view product (navigates to the product detail page using window.location.href)
  const handleViewProduct = (productId) => {
    window.location.href = `/product/${productId}`; // Navigate to the product detail page using the product ID
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

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block mb-2">From Date</label>
              <input
                type="date"
                className="border p-2 rounded-md"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2">To Date</label>
              <input
                type="date"
                className="border p-2 rounded-md"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <button 
                className="bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-red-600 mt-6" 
                onClick={handleResetDate}
              >
                Reset Date
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className="mb-6 font-semibold">Showing {filteredOrders.length} orders</p>

      {currentOrders.length > 0 ? (
        currentOrders.map((order, index) => (
          <div key={index} className="bg-white border rounded-lg shadow-md p-6 mb-4">
            <div className="bg-gray-100 px-4 py-1 rounded-lg mb-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                <strong>ORDER PLACED</strong> <br /> {order.order_date}
              </p>

              <div className="flex items-center space-x-4">
                <p className="text-sm text-gray-600">
                  <strong>ORDER ID #</strong> <br /> {order.id}
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
                        <h2 className="text-md font-semibold text-black hover:underline">
                          {product.product_name}
                        </h2>
                      </td>
                      <td className="py-4 text-center">{product.quantity}</td>
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
        <div className="flex flex-col items-center justify-center">
          <Image
            src="https://s3.ap-south-1.amazonaws.com/medicom.hexerve/removing-goods-from-basket-refusing-purchase-changing-decision-item-deletion-emptying-trash-online-shopping-app-laptop-user-cartoon-character_335657-1172.avif"
            alt="No orders"
            width={300}
            height={300}
            className="mb-4"
          />
          <p className="text-lg font-semibold text-gray-700">No orders were placed</p>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
          <button
            key={pageNumber}
            className={`mx-1 px-4 py-2 rounded-md ${currentPage === pageNumber ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
      </div>
    </div>
  );
}

export default OrderHistory;
