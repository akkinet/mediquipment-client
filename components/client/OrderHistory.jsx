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

    if (searchTerm) {
      sortedOrders = sortedOrders.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(sortedOrders);
  }, [orders, fromDate, toDate, searchTerm]);

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

  const handleViewProduct = (productId) => {
    window.location.href = `/product/${productId}`;
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 border-2 border-gray-200/80 mt-10 md:mt-20 w-full md:w-[90%] lg:w-[70%] font-montserrat">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 text-center md:text-left">Your Orders</h1>

      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0 w-full">
        <div className="relative w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by Order ID"
            className="border p-2 rounded-md w-full sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute right-3 top-3 text-gray-500">🔍</span>
        </div>

        <div className="flex flex-col md:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full">
            <div className="w-full">
              <label className="block text-xs sm:text-sm mb-2">From Date</label>
              <input
                type="date"
                className="border p-2 rounded-md w-full"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="w-full">
              <label className="block text-xs sm:text-sm mb-2">To Date</label>
              <input
                type="date"
                className="border p-2 rounded-md w-full"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <button
              className="bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-red-600 w-full md:w-auto"
              onClick={handleResetDate}
            >
              Reset Date
            </button>
          </div>
        </div>
      </div>

      <p className="mb-6 font-semibold text-center md:text-left">Showing {filteredOrders.length} orders</p>

      {currentOrders.length > 0 ? (
        currentOrders.map((order, index) => (
          <div key={index} className="bg-white border rounded-lg shadow-md p-4 sm:p-6 mb-4">
            <div className="bg-gray-100 px-4 py-2 rounded-lg mb-4 flex lg:flex-row  sm: flex-col justify-between items-start sm:items-center space-y-2 sm:space-y-0">
              <p className="text-sm text-gray-600">
                <strong>ORDER ID #</strong> <br /> {order.id}
              </p>
              <p className="text-sm text-gray-600 ">
                <strong>ORDER PLACED</strong> <br /> {order.order_date}
              </p>
                <button className="bg-yellow-400 text-sm font-semibold text-black px-4 py-2 rounded-md hover:bg-yellow-500 w-full sm:w-auto">
                  Get Order Support
                </button>
            </div>

            <div className={`overflow-y-auto ${order.items.length > 1 ? "h-48" : ""} pr-2`}>
              <table className="w-full text-left border-collapse text-xs sm:text-sm lg:text-base">
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
                          width={50}
                          height={50}
                          className="rounded-lg"
                        />
                      </td>
                      <td className="py-2 sm:py-4">
                        <h2 className="text-xs sm:text-sm lg:text-md font-semibold text-black hover:underline">
                          {product.product_name}
                        </h2>
                      </td>
                      <td className="py-2 sm:py-4 text-center">{product.quantity}</td>
                      <td className="py-2 sm:py-4">${product.price}</td>
                      <td className="py-2 sm:py-4">
                        ${(product.quantity * product.price).toFixed(2)}
                      </td>
                      <td className="py-2 sm:py-4">
                        <button
                          className="bg-blue-500 text-white text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-blue-600"
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

            <div className="mt-4 bg-gray-100 px-4 py-2 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0 text-xs sm:text-sm">
              <div>
                <h3 className="font-bold">Price Breakdown:</h3>
                <p>Original Price: ${order.sub_amount}</p>
                <p>Discount: -${order.discount_amount}</p>
                <p className="font-bold">Total: ${order.total_amount}</p>
              </div>

              <div>
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
            width={150}
            height={150}
            className="mb-4"
          />
          <p className="text-sm sm:text-lg font-semibold text-gray-700 text-center">No orders were placed</p>
        </div>
      )}

      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
          <button
            key={pageNumber}
            className={`mx-1 px-2 py-1 sm:px-3 sm:py-2 rounded-md ${currentPage === pageNumber ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
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
