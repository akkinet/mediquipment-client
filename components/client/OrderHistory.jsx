"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Alert from "../../components/ui/Alert";

// mai bss emxample le rhahu static tracking data 
const staticTrackingData = {
  tracking_number: "SHIPPO_TRANSIT",
  carrier: "shippo",
  tracking_status: {
    status_date: "2025-03-19T17:00:35.846Z",
    status_details: "Your shipment has departed from the origin.",
    location: {
      city: "San Francisco",
      state: "CA",
      zip: "94103",
      country: "US",
    },
    status: "TRANSIT",
  },
  tracking_history: [
    {
      status_date: "2025-03-18T13:00:35.846Z",
      status_details:
        "The carrier has received the electronic shipment information.",
      location: null,
      status: "UNKNOWN",
    },
    {
      status_date: "2025-03-19T17:00:35.846Z",
      status_details: "Your shipment has departed from the origin.",
      location: {
        city: "San Francisco",
        state: "CA",
        zip: "94103",
        country: "US",
      },
      status: "TRANSIT",
    },
  ],
};

function OrderHistory({ orders, email }) {
  // Sort orders from newest to oldest
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.order_date) - new Date(a.order_date)
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentOrders, setCurrentOrders] = useState(sortedOrders);
  const [errMsg, setErrMsg] = useState(null);

  // Modal states
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Pagination
  const ordersPerPage = 4;
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const orderList = currentOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(currentOrders.length / ordersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  function formatDate(date) {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }

  const handleResetDate = async () => {
    setFromDate("");
    setToDate("");
    try {
      const res = await fetch(`/api/order/${email}`);
      const myOrders = await res.json();
      myOrders.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
      setCurrentOrders(myOrders);
      setSearchTerm("");
      setCurrentPage(1);
    } catch (error) {
      setErrMsg(error.message || "Something went wrong");
      setTimeout(() => setErrMsg(null), 3000);
    }
  };

  const searchByID = async (value) => {
    setSearchTerm(value);
    try {
      let myOrders;
      if (value.length > 0) {
        const res = await fetch(`/api/order/${email}?id=${value}`);
        myOrders = await res.json();
      } else {
        const res = await fetch(`/api/order/${email}`);
        myOrders = await res.json();
      }
      myOrders.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
      setCurrentOrders(myOrders);
      setCurrentPage(1);
    } catch (error) {
      setErrMsg(error.message || "Something went wrong");
      setTimeout(() => setErrMsg(null), 3000);
    }
  };

  const searchByDate = async () => {
    try {
      if (fromDate === "" || toDate === "") {
        setErrMsg("Date must be selected!");
        setTimeout(() => setErrMsg(null), 3000);
        return;
      }
      if (new Date(fromDate) > new Date(toDate)) {
        setErrMsg("Start date cannot be after end date!");
        setTimeout(() => setErrMsg(null), 3000);
        return;
      }

      const from = formatDate(new Date(fromDate));
      const to = formatDate(new Date(toDate));
      const res = await fetch(`/api/order/${email}?from=${from}&to=${to}`);
      const myOrders = await res.json();
      myOrders.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
      setCurrentOrders(myOrders);
      setCurrentPage(1);
    } catch (error) {
      setErrMsg(error.message || "Something went wrong");
      setTimeout(() => setErrMsg(null), 3000);
    }
  };

  // When user clicks "Track Shipment," store that order's ID & show the modal
  const handleTrackShipment = (orderId) => {
    setSelectedOrderId(orderId);
    setShowTrackingModal(true);
  };

  return (
    <div className="container mx-auto p-6 border-2 border-gray-200/80 mt-32 mb-10 w-[70%] font-montserrat">
      {errMsg && <Alert message={errMsg} closeHandler={() => setErrMsg(null)} />}
      <h1 className="text-3xl font-bold mb-4 border-b-2 border-gray-300 pb-2">
        Your Orders
      </h1>

      {/* Search & Date filters */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by Order ID"
            className="border p-2 rounded-md w-64"
            value={searchTerm}
            onChange={(e) => searchByID(e.target.value)}
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
                className="bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-green-600 mt-6"
                onClick={searchByDate}
              >
                Search
              </button>
              <button
                className="bg-red-500 text-white text-sm font-semibold ml-2 px-4 py-2 rounded-md hover:bg-red-600 mt-6"
                onClick={handleResetDate}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className="mb-6 font-semibold border-b-2 border-gray-300 pb-2">
        Showing {currentOrders.length} orders
      </p>

      {/* Orders List */}
      {orderList.length > 0 ? (
        orderList.map((order, index) => (
          <div
            key={index}
            className="bg-white border rounded-lg shadow-md p-6 mb-4"
          >
            {/* Top Row: Date & Order ID */}
            <div className="bg-gray-100 px-4 py-1 rounded-lg mb-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                <strong>ORDER PLACED</strong> <br /> {order.order_date}
              </p>

              <div className="flex items-center space-x-4">
                <p className="text-sm text-gray-600">
                  <strong>ORDER ID #</strong> <br /> {order._id}
                </p>
                <span className="bg-yellow-400 text-sm font-semibold text-black px-4 py-2 rounded-md">
                  {order.order_status}
                </span>
              </div>
            </div>

            {/* Items Table */}
            <div
              className={`overflow-y-auto ${
                order.items.length > 1 ? "h-48" : ""
              } pr-2`}
            >
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="pb-2">S.No</th>
                    <th className="pb-2">Image</th>
                    <th className="pb-2">Product Name</th>
                    <th className="pb-2">Quantity</th>
                    <th className="pb-2">Price</th>
                    <th className="pb-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((product, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="py-2">{idx + 1}</td>
                      <td className="py-2">
                        <Link href={`/product/${product.product_id}`}>
                          <Image
                            src={product.image}
                            alt={product.product_name}
                            width={80}
                            height={80}
                            className="rounded-lg cursor-pointer"
                          />
                        </Link>
                      </td>
                      <td className="py-4">
                        <Link href={`/product/${product.product_id}`}>
                          <h2 className="text-md font-semibold text-black hover:underline cursor-pointer">
                            {product.product_name}
                          </h2>
                        </Link>
                      </td>
                      <td className="py-4 text-center">{product.quantity}</td>
                      <td className="py-4">${product.price}</td>
                      <td className="py-4">
                        ${(product.quantity * product.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Addresses, Price Breakdown, and Track Shipment button */}
            <div className="mt-6 bg-gray-100 px-4 py-4 rounded-lg flex flex-col space-y-4">
              {/* Addresses Row */}
              <div className="flex flex-col md:flex-row md:justify-between md:space-x-4">
                <div className="text-sm mb-4 md:mb-0 md:w-1/2">
                  <h3 className="font-bold">Billing Address:</h3>
                  <p className="text-gray-700">
                    {order.billing_address.line1}, {order.billing_address.city},{" "}
                    {order.billing_address.state}, {order.billing_address.country} -{" "}
                    {order.billing_address.postal_code}
                  </p>
                </div>
                <div className="text-sm md:w-1/2">
                  <h3 className="font-bold">Shipping Address:</h3>
                  <p className="text-gray-700">
                    {order.shipping_address.line1}, {order.shipping_address.city},{" "}
                    {order.shipping_address.state}, {order.shipping_address.country} -{" "}
                    {order.shipping_address.postal_code}
                  </p>
                </div>
              </div>

              {/* Price + Tracking Row */}
              <div className="flex flex-col md:flex-row md:justify-between md:space-x-4">
                {/* Price Breakdown */}
                <div className="text-sm mb-4 md:mb-0 md:w-1/2">
                  <h3 className="font-bold">Price Breakdown:</h3>
                  <p>Original Price: ${order.sub_amount}</p>
                  <p>Discount: -${order.discount_amount}</p>
                  <p className="font-bold">Total: ${order.total_amount}</p>
                </div>

                {/* Track Shipment button */}
                <div className="text-sm md:w-1/2 flex items-center justify-center md:justify-end">
                  <button
                    onClick={() => handleTrackShipment(order._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    Track Shipment
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        // No Orders View
        <div className="flex flex-col items-center justify-center">
          <Image
            src="https://s3.ap-south-1.amazonaws.com/medicom.hexerve/removing-goods-from-basket-refusing-purchase-changing-decision-item-deletion-emptying-trash-online-shopping-app-laptop-user-cartoon-character_335657-1172.avif"
            alt="No orders"
            width={300}
            height={300}
            className="mb-4"
          />
          <p className="text-lg font-semibold text-gray-700">
            No orders were placed
          </p>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              className={`mx-1 px-4 py-2 rounded-md ${
                currentPage === pageNumber
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          )
        )}
      </div>

      {/* Modal: Tracking Info */}
      {showTrackingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          {/* Modal Content */}
          <div className="bg-white w-full max-w-lg rounded shadow-lg p-6 relative">
            {/* Close button */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowTrackingModal(false)}
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4 border-b-2 pb-2">
              Tracking Details
            </h2>
            {/* Show the selected order's ID */}
            <p className="mb-2">
              <strong>Order ID:</strong> {selectedOrderId}
            </p>

            <p className="mb-2">
              <strong>Tracking #:</strong> {staticTrackingData.tracking_number}
            </p>
            <p className="mb-2">
              <strong>Carrier:</strong> {staticTrackingData.carrier}
            </p>
            <p className="mb-4">
              <strong>Current Status:</strong>{" "}
              {staticTrackingData.tracking_status.status}
            </p>
            <h3 className="text-lg font-semibold mb-2">Shipment Timeline</h3>
            {/* Timeline container */}
            <div className="max-h-60 overflow-y-auto pr-2">
              {staticTrackingData.tracking_history.map((hist, i) => (
                <div key={i} className="relative pl-10 mb-8">
                  {/* Circle */}
                  <div className="absolute left-2 top-4 w-3 h-3 rounded-full bg-blue-500" />
                  {/* A vertical line continuing down, except for the last item */}
                  {i < staticTrackingData.tracking_history.length - 1 && (
                    <div className="absolute left-[3.5px] top-4 h-full border-l-2 border-blue-300" />
                  )}
                  <p
                    suppressHydrationWarning
                    className="text-xs text-gray-500 mb-1"
                  >
                    {new Date(hist.status_date).toLocaleString()}
                  </p>

                  {/* Status + details */}
                  <p className="text-sm font-semibold">{hist.status}</p>
                  <p className="text-sm">{hist.status_details}</p>

                  {hist.location && (
                    <p className="text-xs text-gray-500 mt-1">
                      {hist.location.city}, {hist.location.state}{" "}
                      {hist.location.zip}, {hist.location.country}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
