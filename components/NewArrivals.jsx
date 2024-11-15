import React from "react";
import Link from "next/link";

const NewArrivals = async () => {
  const urls = [
    `${process.env.NEXT_PUBLIC_API_URL}/product/1728971851696`,
    `${process.env.NEXT_PUBLIC_API_URL}/product/1728971862582`,
    `${process.env.NEXT_PUBLIC_API_URL}/product/1728971859384`,
  ];

  const promises = urls.map((url) =>
    fetch(url).then((response) => response.json())
  );
  let data = await Promise.all(promises);
  data = data.map((d) => d.product);

  return (
    <div>
      <section className="text-black font-montserrat ">
        <div className="container px-5 py-12  lg: pb-2 mx-auto flex flex-col items-center ">
          <div className=" lg:w-3/4 sm:w-full product-title flex flex-col justify-center items-center mb-5 ">
            <h1 className="lg:text-5xl sm: text-3xl font-bold mb-3 font-montserrat">Our Best Sellers</h1>
            <p className=" text-center lg:text-xl sm: text-md">
              Explore our advanced medical equipment collection, designed for
              precision and reliability. From diagnostic tools to surgical
              instruments, ensure optimal patient care with our state-of-the-art
              solutions. Quality you can trust.
            </p>
          </div>
          <section className="text-gray-600 body-font w-[90%]">
            <div className="container px-5 py-6 mx-auto">
              
              <div className="flex flex-wrap -m-4">
                {data?.map((d) => (
                  <div key={d.prod_id} className="p-4 md:w-1/3 ">
                    <Link href={`product/${d.prod_id}`}>
                      <div className="bg-white border shadow-xl items-center hover:shadow-customPink/20 hover:border-customPink rounded-lg overflow-hidden transition-transform duration-200 transform hover:scale-105">
                        <img
                          className="lg:h-48 md:h-36 lg:w-full  object-contain object-center p-4 border-b border-black" 
                          src={d.prod_images[0]}
                          alt="AirSense10"
                        />
                        <div className="p-6">
                          {/* <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                            Product
                          </h2> */}
                          <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                            {d.prod_name}
                          </h1>
                          {/* <p className="leading-relaxed mb-3 text-sm line-clamp-2">{d.prod_desc}</p> */}
                          <div className="flex items-center flex-wrap ">
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
                            <span className="text-gray-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
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
                            {/* <span className="text-gray-400 inline-flex items-center leading-none text-sm">
                              <svg
                                className="w-4 h-4 mr-1"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                viewBox="0 0 24 24"
                              >
                                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                              </svg>
                              6
                            </span> */}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
          {/* <section className="text-gray-800 body-font  flex flex-col lg:px-16  lg:py-10  max-w-sm:py-0 font-montserrat">
            <div className="upper-container lg:flex max-w-sm:flex-col-reverse ">
              <div className="container rounded-2xl lg:my-0 mx-auto max-w-sm: my-6 flex p-5 md:flex-row flex-col items-center lg:w-[55%]  bg-customPink hover:shadow-xl hover:shadow-customPink/30">
                <div className="lg:h-[100%]  text-white lg:flex-grow md:w-full lg:pr-5 md:pr-16 flex flex-col justify-evenly md:items-start md:text-left max-w-sm: mb-0 md:mb-0 items-center text-center ">
                  <h1 className="title-font sm:text-4xl text-3xl mb-4 font-bold">
                    Free Shipping
                  </h1>
                  <p className="mb-3 leading-relaxed font-bold text-lg">
                    Enjoy free shipping on all orders with no minimum purchase
                    required. Shop now and save on top-quality medical
                    equipment!
                  </p>
                </div>
              </div>
              <div className=" cursor-pointer container rounded-2xl mx-auto lg:ml-10 max-w-sm: ml-0 flex p-5 md:flex-row flex-col items-center  bg-customBlue hover:shadow-xl hover:shadow-sky-300/30  lg:w-[45%]  font-bold text-white ">
                <div className="lg:h-[100%] lg:flex-grow md:w-full lg:pr-5 md:pr-16 flex flex-col justify-evenly md:items-start md:text-left max-w-sm:mb-0 md:mb-0 items-center text-center ">
                  <h1 className="title-font sm:text-4xl text-3xl mb-4 font-bold">
                    24X7 Support
                  </h1>
                  <p className="mb-3 leading-relaxed font-bold text-lg">
                    Benefit from our 24/7 support, ensuring you receive
                    assistance anytime.
                  </p>
                </div>
              </div>
            </div>
          </section> */}
        </div>
      </section>
    </div>
  );
};

export default NewArrivals;
