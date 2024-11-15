"use client";
import React, { useState, useContext } from "react";
import { Button } from "../ui/moving-border";
import Link from "next/link";
import { fetcher } from "../../lib/helperFunction";
import { DataContext } from "./DataContextProvider";

const ProductCategory = ({ prod }) => {
  const [products, setProducts] = useState(prod);
  const [category, setCategory] = useState("Oxygen Therapy Devices");
  const data = useContext(DataContext);
  const handleCategoryChange = async (cat) => {
    try {
      const res = await fetcher(`/api/product?category=${cat}&num=6`);
      setCategory(cat);
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
    <div className="">
      <section className="text-black body-font md:flex md:justify-center font-montserrat">
        <div className="container px-5 lg:py-12 lg:pb-0 sm: py-4  lg:mx-auto md:mx-0 flex flex-col items-center justify-center">
          <div className="lg:w-3/4 sm:w-full product-title flex flex-col justify-center items-center mb-5">
            <h1 className="text-center lg:text-5xl sm: text-3xl font-bold mb-3 font-montserrat tracking-tighter">
              Shop By Category
            </h1>
            <p className="text-center lg:text-xl sm: text-md my-2 font-montserrat">
              Explore our advanced medical equipment collection, designed for
              precision and reliability. From diagnostic tools to surgical
              instruments, ensure optimal patient care with our state-of-art
              solutions. Quality you can trust.
            </p>
          </div>
          <div className="flex justify-evenly flex-wrap w-[80%] cursor-pointer max-w-sm: gap-6">
            {data?.map((d) => (
              <div key={d.name} className="button">
                <Button
                  borderRadius="1rem"
                  className="text-white  bg-black-800/30  font-montserrat text-lg"
                  onClick={() => handleCategoryChange(d.name)}
                >
                  {d.name}
                </Button>
              </div>
            ))}
          </div>
          <section className="text-gray-600 body-font lg:w-[90%]">
            <div className="container px-5 py-12 mx-auto">
              <div className="flex flex-wrap -m-4">

                {products?.map((prod) => {
                  return (

                    <Link href={`/product/${prod.prod_id}`}
                      className="p-4 lg:w-1/3 sm:w-1/2 transition-transform duration-200 transform hover:scale-105 "
                      key={prod.prod_id}
                    >
                      <div className="bg-white h-full border shadow-xl hover:shadow-customPink/20 hover:border-customPink rounded-lg overflow-hidden">
                        <img
                          className="lg:h-56 md:h-36 lg:w-full  object-contain object-center p-4 border-b border-black"
                          src={prod.prod_images[0]}
                          alt={prod.prod_name}
                        />
                        <div className="p-6">
                          {/* <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                            CATEGORY
                          </h2> */}
                          <h1 className="title-font text-lg font-medium text-gray-900 mb-3 line-clamp-1">
                            {prod.prod_name}
                          </h1>
                          {/* <p className="leading-relaxed mb-3 line-clamp-3">{prod.prod_desc}</p> */}
                          <div className="flex items-center flex-wrap">
                            <div
                              className="text-customBlue inline-flex items-center md:mb-2 lg:mb-0"
                            >
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
                            <span className="text-gray-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1">
                              <svg
                                className="w-4 h-4 mr-1"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                viewBox="0 0 24 24"
                              >
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                              1.2K
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>

                  );
                })}

              </div>
            </div>
          </section>
          <div className="button">
            <Link href={`/category/${category}`}>
              <Button
                borderRadius="1rem"
                className="text-white bg-black-800/30  font-semibold text-lg"
              >
                Shop All
              </Button>
            </Link>
          </div>

          {/* shop by brand section  */}
          <section>
            <div className="bg-white py-8 px-4 rounded-full my-12 ">
              {/* Title */}
              <h2 className="text-center text-xl md:text-2xl font-bold text-black mb-6">
                SHOP BY BRAND
              </h2>

              {/* Brand Logos */}
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

              {/* View All */}
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
