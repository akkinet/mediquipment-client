"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import Image from "next/image";

const ProductByCategoryPage = ({ productList, category, brandList }) => {
  const [arrow, setArrow] = useState(true);
  const [arrow1, setArrow1] = useState(true);
  const [arrow2, setArrow2] = useState(true);
  const [products, setProducts] = useState(productList);
  const [filters, setFilters] = useState({
    prescription: null,
    brand: [],
    price: "",
  });

  const handleFilterChange = async (e) => {
    const { checked, name, value } = e.target;
    const params = { ...filters };

    if(!params.prescription) delete params.prescription
    if (params.brand.length == 0) delete params.brand;
    if (params.price == "") delete params.price;

    if (name === "prescription") {
      setFilters({ ...filters, [name]: !filters.prescription });
      params[name] = !filters.prescription;
    } else if (name === "price") {
      setFilters({ ...filters, [name]: value });
      params[name] = value;
    } else {
      if (checked) {
        setFilters({ ...filters, [name]: filters[name].concat(value) });
        params[name] = filters[name].concat(value);
      } else {
        const temp = [...filters[name]];
        temp.splice(temp.indexOf(value), 1);
        setFilters({ ...filters, [name]: temp });
        params[name] = temp;
      }
    }
    const urlSearchParams = new URLSearchParams(params);

    const queryString = urlSearchParams.toString();
    const res = await fetch(`/api/product?${queryString}&category=${category}`);
    const data = await res.json();
    setProducts(data);
  };

  const clearAllFilters = async () => {
    const reset = {
      prescription: null,
      brand: [],
      price: "",
    };
    setFilters(reset);
    const res = await fetch(`/api/product?category=${category}`);
    const data = await res.json();
    setProducts(data);
  };

  const isFilterActive = () => {
    return (
      filters.prescription !== null ||
      filters.brand.length > 0 ||
      filters.price !== ""
    );
  };

  const renderSkeletonFilters = () => (
    <div className="leftcontainer lg:h-auto lg:w-1/4 p-4 mt-2 bg-gray-100 rounded-xl shadow-md animate-pulse">
      <div className="h-10 bg-gray-300 rounded mb-4"></div>
      <hr className="border-2 border-gray-300 mb-2" />
      <div className="h-6 bg-gray-300 rounded mb-4"></div>
      <hr className="border-2 border-gray-300 my-2" />
      <div className="dropdowncontainer font-bold mb-4">
        <div className="dropdown-container flex justify-between items-center p-2 bg-white rounded-lg shadow-sm">
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          <div className="h-6 bg-gray-300 rounded w-1/4"></div>
        </div>
        <div className="dropdown-menu flex flex-col bg-white p-3 mt-2 rounded-lg shadow-sm">
          <div className="inner flex items-center mb-2 h-6 bg-gray-300 rounded"></div>
          <div className="inner flex items-center mb-2 h-6 bg-gray-300 rounded"></div>
        </div>
      </div>
      <div className="dropdowncontainer font-bold mb-4">
        <div className="dropdown-container flex justify-between items-center p-2 bg-white rounded-lg shadow-sm">
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          <div className="h-6 bg-gray-300 rounded w-1/4"></div>
        </div>
        <div className="dropdown-menu flex flex-col bg-white p-3 mt-2 rounded-lg shadow-sm">
          {[...Array(3)].map((_, i) => (
            <div
              className="inner flex items-center mb-2 h-6 bg-gray-300 rounded"
              key={i}
            ></div>
          ))}
        </div>
      </div>
      <div className="dropdowncontainer font-bold mb-4">
        <div className="dropdown-container flex justify-between items-center p-2 bg-white rounded-lg shadow-sm">
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          <div className="h-6 bg-gray-300 rounded w-1/4"></div>
        </div>
        <div className="dropdown-menu flex flex-col bg-white p-3 mt-2 rounded-lg shadow-sm">
          {[...Array(3)].map((_, i) => (
            <div
              className="inner flex items-center mb-2 h-6 bg-gray-300 rounded"
              key={i}
            ></div>
          ))}
        </div>
      </div>
      <div className="h-10 bg-gray-300 rounded mt-4"></div>
    </div>
  );

  const renderSkeletonProducts = () => (
    <div className="rightcontainer lg:h-fit lg:w-3/4 lg:p-1 lg:pt-0 grid gap-4 p-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div className="p-2 flex flex-col" key={i}>
          <div className="border shadow-xl  border-customBlue rounded-lg overflow-hidden h-full flex flex-col items-center justify-between">
            <div className="h-48 w-full bg-gray-300"></div>
            <div className="p-4 flex-grow flex flex-col items-center justify-between bg-gray-50 w-full">
              <div className="h-6 bg-gray-300 w-3/4 mb-2 rounded"></div>
              <div className="h-6 bg-gray-300 w-1/2 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="text-black mt-32 lg:flex lg:mx-20 font-montserrat">
      {productList.length == 0 ? (
        renderSkeletonFilters()
      ) : (
        <div className="leftcontainer lg:h-auto lg:w-1/4 p-4 mt-2 bg-gray-100 rounded-xl shadow-md ">
          <h1 className="text-4xl font-semibold mb-4 capitalize">{category}</h1>
          <hr className="border-2 border-customBlue mb-2" />
          <div className="flex justify-between items-center h-10">
            <h3 className="text-2xl font-semibold">FILTER :</h3>
            {isFilterActive() && (
              <button className="text-red-600" onClick={clearAllFilters}>
                Clear filters
              </button>
            )}
          </div>
          <hr className="border-2 border-customBlue my-2" />
          <div className="dropdowncontainer font-bold mb-4">
            <div className="dropdown-container flex justify-between items-center p-2 bg-white rounded-lg shadow-sm">
              <p>Prescription Required</p>
              <button
                className="dropdown-button"
                onClick={() => setArrow(!arrow)}
              >
                {arrow ? <FaArrowDown /> : <FaArrowUp />}
              </button>
            </div>
            {!arrow && (
              <div className="dropdown-menu flex flex-col bg-white p-3 mt-2 rounded-lg shadow-sm">
                <div className="inner flex items-center mb-2">
                  <input
                    type="radio"
                    name="prescription"
                    id="yes"
                    className="border-2 border-gray-300 accent-customBlue h-4 w-4"
                    checked={filters.prescription === true}
                    onChange={(e) => handleFilterChange(e)}
                  />
                  <label htmlFor="yes" className="ml-4 text-md font-light">
                    Yes
                  </label>
                </div>
                <div className="inner flex items-center mb-2">
                  <input
                    type="radio"
                    name="prescription"
                    id="no"
                    className="border-2 border-gray-300 accent-customBlue h-4 w-4"
                    checked={filters.prescription === false}
                    onChange={(e) => handleFilterChange(e)}
                  />
                  <label htmlFor="no" className="ml-4 text-md font-light">
                    No
                  </label>
                </div>
              </div>
            )}
          </div>
          <div className="dropdowncontainer font-bold mb-4">
            <div className="dropdown-container flex justify-between items-center p-2 bg-white rounded-lg shadow-sm">
              <p>Brand</p>
              <button
                className="dropdown-button"
                onClick={() => setArrow1(!arrow1)}
              >
                {arrow1 ? <FaArrowDown /> : <FaArrowUp />}
              </button>
            </div>
            {!arrow1 && (
              <div className="dropdown-menu flex flex-col bg-white p-3 mt-2 rounded-lg shadow-sm">
                {brandList.map((brand) => (
                  <div className="inner flex items-center mb-2" key={brand}>
                    <input
                      type="checkbox"
                      name="brand"
                      value={brand}
                      className="border-2 border-gray-300 accent-customBlue h-4 w-4"
                      checked={filters.brand.includes(brand)}
                      onChange={(e) => handleFilterChange(e)}
                    />
                    <label htmlFor="brand" className="ml-4 text-md font-light">
                      {brand}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="dropdowncontainer font-bold mb-4">
            <div className="dropdown-container flex justify-between items-center p-2 bg-white rounded-lg shadow-sm">
              <p>Price Range</p>
              <button
                className="dropdown-button"
                onClick={() => setArrow2(!arrow2)}
              >
                {arrow2 ? <FaArrowDown /> : <FaArrowUp />}
              </button>
            </div>
            {!arrow2 && (
              <div className="dropdown-menu flex flex-col bg-white p-3 mt-2 rounded-lg shadow-sm">
                <div className="inner flex items-center mb-2">
                  <input
                    type="radio"
                    name="price"
                    id="low"
                    className="border-2 border-gray-300 accent-customBlue h-4 w-4"
                    value='{"$lt":2000}'
                    checked={filters.price === '{"$lt":2000}'}
                    onChange={(e) => handleFilterChange(e)}
                  />
                  <label htmlFor="low" className="ml-4 text-md font-light">
                    {" "}
                    less than $2000{" "}
                  </label>
                </div>
                <div className="inner flex items-center mb-2">
                  <input
                    type="radio"
                    name="price"
                    id="medium"
                    value='{"$gte":2000,"$lt":5000}'
                    className="border-2 border-gray-300 accent-customBlue h-4 w-4"
                    checked={filters.price === '{"$gte":2000,"$lt":5000}'}
                    onChange={(e) => handleFilterChange(e)}
                  />
                  <label htmlFor="medium" className="ml-4 text-md font-light">
                    {" "}
                    equal or more than $2000{" "}
                  </label>
                </div>
                <div className="inner flex items-center mb-2">
                  <input
                    type="radio"
                    name="price"
                    id="high"
                    value='{"$gte":5000}'
                    className="border-2 border-gray-300 accent-customBlue h-4 w-4"
                    checked={filters.price === '{"$gte":5000}'}
                    onChange={(e) => handleFilterChange(e)}
                  />
                  <label htmlFor="high" className="ml-4 text-md font-light">
                    {" "}
                    more than $5000{" "}
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {productList.length == 0 ? (
        renderSkeletonProducts()
      ) : (
        <div className="rightcontainer lg:h-fit lg:w-3/4 lg:p-9 lg:pt-0 grid gap-4 p-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 ">
          {products.length ? (
            products.map((prod) => (
              <div className="p-2 flex flex-col" key={prod._id}>
                <Link href={`/product/${prod._id}`}>
                  <div className="border shadow-xl shadow-customBlue/20 border-customBlue hover:shadow-customBlue/40 hover:border-2 rounded-lg overflow-hidden  flex flex-col items-center justify-between cursor-pointer transition-transform transform hover:scale-105">
                    <img
                      className="h-48 w-full object-contain object-center p-4"
                      src={prod.prod_images[0]}
                      alt={prod.prod_name}
                    />
                    <div className="p-4 flex-grow flex flex-col items-center justify-between bg-gray-200 w-full">
                      <h1 className="title-font text-md font-normal text-gray-900 text-center mb-1 line-clamp-1">
                        {prod.prod_name}
                      </h1>
                      <p className="text-md text-center bg-customBlue text-white py-2 w-full rounded-lg shadow-sm">
                        $ {parseFloat(prod.prod_value).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="text-center  lg:w-[60vw] lg:h-[50vh] mt-5 flex items-center justify-center">
              <Image
                src="https://s3.ap-south-1.amazonaws.com/medicom.hexerve/data-search-not-found-concept-vector-36073021_1-removebg-preview.png"
                height={600}
                width={500}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductByCategoryPage;
