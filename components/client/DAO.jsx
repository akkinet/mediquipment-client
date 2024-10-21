"use client";
import { useRouter } from "next/navigation";

function DAO({ product1, product2 }) {
  const router = useRouter();

  const buyHandler = async (e, product) => {
    const button = e.target;

    button.disabled = true;
    const checkoutResponse = await fetch("/api/stripe/checkout", {
      method: "POST",
      body: JSON.stringify({
        line_items: [
          {
            // price: product.price_id,
            price_data: {
              currency: "usd",
              product_data: {
                name: product.prod_name,
                description: product.prod_desc,
                images: product.prod_images,
              },
              unit_amount: product.prod_value * 100,
            },
            quantity: 1,
            adjustable_quantity: {
              enabled: true,
            },
          },
        ],
      }),
    });
    const { session } = await checkoutResponse.json();
    router.push(session.url);
    button.disabled = false;
  };

  return (
    <section className="text-black body-font md:flex md:justify-center">
      <div className="container px-5 lg:mx-auto md:mx-0 flex flex-col items-center justify-center max-w-lg: py-0">
        <section className="text-gray-800 body-font flex flex-col lg:px-16 lg:py-10 sm: py-2 max-w-sm: px-0">
          {product1?.product && (
            <div className="upper-container lg:flex">
              <div className="container rounded-2xl lg:mx-auto lg:my-0 max-w-sm: my-10 flex px-5 py-5 md:flex-row flex-col items-center lg:w-[55%] max-w-sm:w-0 border border-customPink hover:shadow-xl hover:shadow-customPink/30 mx-auto md:mx-0">
                <div className="lg:h-[100%] lg:flex-grow md:w-full lg:pr-5 mb:pr-16 flex flex-col justify-evenly md:items-start md:text-left items-center text-center">
                  <h1 className="title-font sm:text-4xl text-3xl mb-4 font-bold text-gray-900">
                    {product1?.product.prod_name}
                  </h1>
                  <p className="lg:mb-8 mb: mb-2 leading-relaxed font-medium line-clamp-3">
                    {product1?.product.prod_desc}
                  </p>
                  <div className="flex justify-center">
                    <button
                      onClick={(e) => buyHandler(e, product1?.product)}
                      className="inline-flex text-white bg-customPink border py-2 px-6 focus:outline-none hover:bg-customBlue rounded text-lg"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
                <img
                  className="object-contain object-center lg:w-1/4 md: w-1/2"
                  alt={product1?.product.prod_name}
                  src={product1?.product.prod_images[0]}
                />
              </div>
              <div className="container rounded-2xl mx-auto flex px-5 py-5 md:flex-row flex-col items-center bg-customPink lg:w-[45%] lg:ml-10 font-bold text-white  md:mx-0">
                <div className="lg:h-[100%] lg:flex-grow md:w-full lg:pr-5 md:pr-16 flex flex-col justify-evenly md:items-start md:text-left  md:mb-0 items-center text-center">
                  <h1 className="title-font sm:text-4xl text-3xl mb-4 font-bold">
                    Free Shipping
                  </h1>
                  <h1 className="title-font sm:text-4xl text-3xl mb-4 font-bold">
                    45% OFF
                  </h1>
                  <p className="leading-relaxed">
                    Enjoy free shipping and a massive 45% discount on our
                    premium medical equipment. Shop now to take advantage of
                    these unbeatable savings and receive top-quality products
                    delivered right to your doorstep at no extra cost!
                  </p>
                </div>
              </div>
            </div>
          )}
          {product2?.product && (
            <div className="lower-container lg:flex lg:flex-row-reverse max-w-sm:flex-col mt-10">
              <div className="container rounded-2xl lg:ml-10 max-w-sm: ml-0 flex px-5 py-5 md:flex-row flex-col items-center lg:w-[55%] border border-customBlue hover:shadow-xl hover:shadow-customBlue/30 mx-auto md:mx-0">
                <div className="lg:h-[100%] lg:flex-grow md:w-full lg:pr-5 mb:pr-16 flex flex-col justify-evenly md:items-start md:text-left items-center text-center">
                  <h1 className="title-font sm:text-4xl text-3xl mb-4 font-bold text-gray-900">
                    {product2?.product.prod_name}
                  </h1>
                  <p className="lg:mb-8 mb: mb-2 leading-relaxed font-medium line-clamp-3">
                    {product2?.product.prod_desc}
                  </p>
                  <div className="flex justify-center">
                    <button
                      onClick={(e) => buyHandler(e, product2?.product)}
                      className="inline-flex text-white bg-customBlue border py-2 px-6 focus:outline-none hover:bg-customPink rounded text-lg"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
                <img
                  className="object-contain object-center lg:w-1/4 md: w-1/2"
                  alt={product2?.product.prod_name}
                  src={product2?.product.prod_images[0]}
                />
              </div>

              <div className="container rounded-2xl mx-auto lg:my-0 max-w-sm: my-6 flex px-5 py-5 md:flex-row flex-col items-center bg-customBlue lg:w-[45%] mr-10 font-bold text-white  md:mx-0">
                <div className="lg:h-[100%] lg:flex-grow md:w-full lg:pr-5 md:pr-16 flex flex-col md:items-start md:text-left  md:mb-0 items-center text-center">
                  <h1 className="title-font sm:text-4xl text-3xl mb-4 font-bold">
                    Trusted Brands
                  </h1>
                  <p className="leading-relaxed text-lg">
                    We collaborate with trusted brands and partners to offer
                    top-quality medical equipment, ensuring reliability,
                    durability, and excellent performance. Your health and
                    satisfaction are our top priorities.
                  </p>
                  <ul className="mt-3 ml-5 text-xl">
                    <li className="list-disc">Huge Selection</li>
                    {/* <li className="list-disc">Always Low Price</li> */}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

export default DAO;
