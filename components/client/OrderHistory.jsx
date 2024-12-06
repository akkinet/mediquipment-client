"use client";
import Image from "next/image";
import { useState } from "react";
import Alert from "../../components/ui/Alert";

function OrderHistory({ orders, email }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentOrders, setCurrentOrders] = useState(orders);
  const [errMsg, setErrMsg] = useState(null);
  const ordersPerPage = 4;

  //   // Handle pagination
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
    const res = await fetch(`/api/order/${email}`);
    const myOrders = await res.json();
    setCurrentOrders(myOrders);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const searchByID = async (value) => {
    try {
      let myOrders;
      setSearchTerm(value);
      if (value.length > 0) {
        const res = await fetch(`/api/order/${email}?id=${value}`);
        myOrders = await res.json();
      } else {
        const res = await fetch(`/api/order/${email}`);
        myOrders = await res.json();
      }
      setCurrentOrders(myOrders);
    } catch (error) {
      setErrMsg(error);
      setTimeout(() => setErrMsg(null), [3000]);
    }
  };

  const searchByDate = async () => {
    try {
      if (fromDate == "" || toDate == "") {
        setErrMsg("date must be selected!");
        setTimeout(() => setErrMsg(null), [3000]);
        return;
      }

      if (new Date(fromDate) > new Date(toDate)) {
        setErrMsg("date must follow the order!");
        setTimeout(() => setErrMsg(null), [3000]);
        return;
      }

      const from = formatDate(new Date(fromDate));
      const to = formatDate(new Date(toDate));
      const res = await fetch(`/api/order/${email}?from=${from}&to=${to}`);
      const myOrders = await res.json();
      setCurrentOrders(myOrders);
    } catch (error) {
      setErrMsg(error);
      setTimeout(() => setErrMsg(null), [3000]);
    }
  };

  return (
    <div className="container mx-auto p-6 border-2 border-gray-200/80 mt-32 mb-10 w-[70%] font-montserrat">
      {errMsg && (
        <Alert message={errMsg} closeHandler={() => setErrMsg(null)} />
      )}
      <h1 className="text-3xl font-bold mb-4 border-b-2 border-gray-300 pb-2">
        Your Orders
      </h1>


      <div className="flex justify-between items-center mb-6 ">
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
                search
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

      {orderList.length > 0 ? (
        orderList.map((order, index) => (
          <div
            key={index}
            className="bg-white border rounded-lg shadow-md p-6 mb-4"
          >
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

            <div
              className={`overflow-y-auto ${order.items.length > 1 ? "h-48" : ""
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
                  {order.shipping_address.line1}, {order.shipping_address.city},{" "}
                  {order.shipping_address.state},{" "}
                  {order.shipping_address.country} -{" "}
                  {order.shipping_address.postal_code}
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
              className={`mx-1 px-4 py-2 rounded-md ${currentPage === pageNumber
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
    </div>
  );
}

export default OrderHistory;

