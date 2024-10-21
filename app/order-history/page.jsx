"use client";
import React, { useState } from "react";
import { FaStar } from "react-icons/fa6";

const products = [
  {
    image:
      "https://res.cloudinary.com/dduiqwdtr/image/upload/v1722336716/assets/AirSense10AutoSet.jpg",
    title: "AirSense TM 10 AutoSet ™ with Heated Humidifier",
    price: "999.00",
    status: "Your item has been delivered",
    date: "Apr 28",
  },
  {
    image:
      "https://res.cloudinary.com/dduiqwdtr/image/upload/v1722337327/assets/ResMedAirMini.png",
    title: "AirSense™ 10 AutoSet ™ For Her is Discontinued",
    price: "999.00",
    status: "Your item has been delivered",
    date: "Apr 28",
  },
];

const ProductCard = ({ image, title, price, status, date }) => {
  return (
    <div className="flex flex-col justify-evenly md:flex-row items-center p-5 bg-white rounded-lg mb-3 shadow-lg border border-gray-300">
      <div className="image mb-3 md:mb-0">
        <img
          src={image}
          alt={title}
          className="w-36 h-auto md:mr-5 rounded-lg"
        />
      </div>
      <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left flex-grow md:flex-grow-0">
        <p className="mb-2 w-[90%]">{title}</p>
        <h4 className="text-xl font-bold">${price}</h4>
      </div>
      <div className="text-center md:text-right mt-3 md:mt-0">
        <p className="text-black-500 font-bold text-lg">Delivered on {date}</p>
        <p className="text-gray-500">{status}</p>
        <a
          href="#"
          className="text-teal-400 no-underline mt-1 inline-flex items-center"
        >
          <FaStar className="mr-1 text-teal-600" /> Rate & Review Product
        </a>
      </div>
    </div>
  );
};

const Filters = () => {
  return (
    <div className="bg-gray-100 p-5 rounded-lg">
      <h3 className="font-bold mb-3">Filters</h3>
      <div className="mb-5">
        <h4 className="mb-2 font-bold">ORDER STATUS</h4>
        <div className="mb-2">
          <input type="checkbox" id="on-the-way" />
          <label htmlFor="on-the-way" className="ml-2">
            On the way
          </label>
        </div>
        <div className="mb-2">
          <input type="checkbox" id="delivered" />
          <label htmlFor="delivered" className="ml-2">
            Delivered
          </label>
        </div>
        <div className="mb-2">
          <input type="checkbox" id="cancelled" />
          <label htmlFor="cancelled" className="ml-2">
            Cancelled
          </label>
        </div>
        <div className="mb-2">
          <input type="checkbox" id="returned" />
          <label htmlFor="returned" className="ml-2">
            Returned
          </label>
        </div>
      </div>
      <div className="mb-5">
        <h4 className="mb-2 font-bold">ORDER TIME</h4>
        <div className="mb-2">
          <input type="checkbox" id="time-1" />
          <label htmlFor="time-1" className="ml-2">
            Time Option 1
          </label>
        </div>
        <div className="mb-2">
          <input type="checkbox" id="time-2" />
          <label htmlFor="time-2" className="ml-2">
            Time Option 2
          </label>
        </div>
        <div className="mb-2">
          <input type="checkbox" id="time-3" />
          <label htmlFor="time-3" className="ml-2">
            Time Option 3
          </label>
        </div>
        <div className="mb-2">
          <input type="checkbox" id="time-4" />
          <label htmlFor="time-4" className="ml-2">
            Time Option 4
          </label>
        </div>
      </div>
    </div>
  );
};

export default function ProductsPage() {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="container mx-auto p-5 bg-gray-50 rounded-lg shadow-lg mt-24">
      <div className="md:hidden mb-5">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full bg-teal-600 text-white py-2 rounded-lg"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>
      <div className="flex flex-col md:flex-row">
        <aside
          className={`w-full md:w-1/5 mb-5 md:mb-0 pr-0 md:pr-5 ${
            showFilters ? "block" : "hidden md:block"
          }`}
        >
          <Filters />
        </aside>
        <main className="w-full md:w-4/5">
          {products.map((product, index) => (
            <div key={index} className="mb-5">
              <ProductCard {...product} />
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
