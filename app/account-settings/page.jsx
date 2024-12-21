"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

const Navigation = () => {
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(`/account-settings/${path}`); // Update the route dynamically
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 mt-32">
      {/* Sidebar Navigation */}
      <div className="col-span-1 space-y-6">
        {/* Back to Home Button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 bg-customPink text-white px-4 py-2 rounded-full shadow-md hover:bg-customBlue hover:shadow-lg transition duration-200"
          >
            <FaArrowLeft className="text-lg" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>
        </div>
        {/* Navigation Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 border-2">
          <h3 className="text-xl font-semibold mb-4 border-b-2 border-gray-300 pb-2">
            Navigation
          </h3>
          <ul className="space-y-4">
            <li
              onClick={() => handleNavigation("edit-profile")}
              className={`cursor-pointer flex items-center gap-3 p-3 rounded-lg transition duration-200`}
            >
              <span className="text-base">Edit Profile</span>
            </li>
            <li
              onClick={() => handleNavigation("my-order-section")}
              className={`cursor-pointer flex items-center gap-3 p-3 rounded-lg transition duration-200`}
            >
              <span className="text-base">My Orders</span>
            </li>
            <li
              onClick={() => handleNavigation("address-book")}
              className={`cursor-pointer flex items-center gap-3 p-3 rounded-lg transition duration-200`}
            >
              <span className="text-base">Address Book</span>
            </li>
            <li
              onClick={() => handleNavigation("gift-card")}
              className={`cursor-pointer flex items-center gap-3 p-3 rounded-lg transition duration-200`}
            >
              <span className="text-base">Gift Card</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="col-span-1 lg:col-span-3 bg-white shadow-lg rounded-lg p-6 border-2 ">
        {/* Main Content from Route */}
        <iframe
          src={router.pathname}
          title="Dynamic Content"
          className="w-full h-full border-0"
        ></iframe>
      </div>
    </div>
  );
};

export default Navigation;
