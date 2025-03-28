"use client";
import React, { useState, useContext } from "react";
import { Button } from "../ui/moving-border";
import Link from "next/link";
import { fetcher } from "../../lib/helperFunction";
import { DataContext } from "./DataContextProvider";

const ProductCategory = ({ prod }) => {
  const [products, setProducts] = useState(prod);
  const [category, setCategory] = useState("Pap Devices");
  const data = useContext(DataContext);

  // Track the active category
  const [activeCategory, setActiveCategory] = useState(category);

  const handleCategoryChange = async (cat) => {
    try {
      const res = await fetcher(`/api/product?category=${cat}&num=2`);
      setCategory(cat);
      setActiveCategory(cat); // Set the active category
      setProducts(res);
    } catch (err) {
      console.log(err);
    }
  };

  const brands = [
    { name: "ReactHealth", logo: "https://www.reacthealth.com/images/logo.jpg" },
    { name: "ResMed", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/ResMed_logo.svg/800px-ResMed_logo.svg.png" },
    { name: "Rhythm Healthcare", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT07F7mfZp98yQZi4NpX7TJemK2oHVos7wPxg&s" },
    { name: "Fisher & Paykel Healthcare", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRm7A27QJxK1JAXhvJq7e_0Q_-vIjOvk6dxg&s" },
    { name: "Sentec", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5kRz6HKcS3W6GHg0_9h2FpUVtGNNPJjZOTw&s" },
  ];

  return (
    <div>
      <section className="text-black body-font md:flex md:justify-center font-montserrat">
        <div className="container px-5 lg:py-12 lg:pb-0 sm:py-4 lg:mx-auto md:mx-0 flex flex-col items-center justify-center">
          {/* Title Section */}
          <div className="lg:w-3/4 sm:w-full product-title flex flex-col justify-center items-center mb-5">
            <h1 className="text-center lg:text-5xl sm:text-3xl font-bold mb-3 font-montserrat tracking-tighter">
              Shop By Category
            </h1>
            <p className="text-center lg:text-xl sm:text-md my-2 font-montserrat">
              Explore our advanced medical equipment collection, designed for
              precision and reliability. From diagnostic tools to surgical
              instruments, ensure optimal patient care with our state-of-art
              solutions. Quality you can trust.
            </p>
          </div>

          {/* Products Section */}
          <section className="text-gray-600 body-font lg:w-[90%]">
            <div className="flex flex-wrap lg:justify-around md: justify-center items-center w-full bg-gray-100 p-2 rounded-lg shadow-md">
              {data?.map((d) => (
                <div key={d.name} className="m-1"> {/* Small margin for reduced spacing */}
                  <button
                    className={`px-4 py-2 text-base md:text-lg font-medium rounded-lg transition-all duration-200 
          ${activeCategory === d.name
                        ? "bg-customPink text-white"
                        : "bg-white text-black hover:bg-gray-200"
                      }`}
                    onClick={() => handleCategoryChange(d.name)}
                  >
                    {d.name}
                  </button>
                </div>
              ))}
            </div>
            <div className="container px-5 py-12 mx-auto">
              <div className="flex flex-wrap -m-4">
                {products?.map((prod) => (
                  <Link
                    href={`/product/${prod._id}`}
                    className="p-4 lg:w-1/3 sm:w-1/2 transition-transform duration-200 transform hover:scale-105"
                    key={prod._id}
                  >
                    <div className="bg-white h-full border shadow-xl hover:shadow-customPink/20 hover:border-customPink rounded-lg overflow-hidden">
                      <img
                        className="lg:h-56 md:h-36 lg:w-full object-contain object-center p-4 border-b border-black"
                        src={prod.prod_images[0]}
                        alt={prod.prod_name}
                      />
                      <div className="p-6">
                        <h1 className="title-font text-lg font-medium text-gray-900 mb-3 line-clamp-1">
                          {prod.prod_name}
                        </h1>
                        <div className="flex items-center flex-wrap">
                          <div className="text-customBlue inline-flex items-center md:mb-2 lg:mb-0">
                            View Product
                            <svg
                              className="w-4 h-4 ml-2"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 12h14"></path>
                              <path d="M12 5l7 7-7 7"></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Shop All Button */}
          <div className="button">
            <Link href={`/product`}>
              <Button
                borderRadius="1rem"
                className="text-white bg-black-800/30 font-semibold text-lg"
              >
                Shop All
              </Button>
            </Link>
          </div>

          {/* Shop By Brand Section */}
          <section>
            <div className="bg-white py-8 px-4 rounded-2xl my-12">
              <h2 className="text-center text-xl md:text-2xl font-bold text-black mb-6">
                SHOP BY BRAND
              </h2>
              <div className="flex flex-wrap justify-center gap-8 items-center">
                {brands.map((brand, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="h-12 md:h-16 object-contain"
                    />
                    <p className="text-sm text-gray-700 mt-2">{brand.name}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <a
                  href="#"
                  className="text-blue-600 hover:underline font-medium lg:text-2xl"
                >
                  View All
                </a>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default ProductCategory;
