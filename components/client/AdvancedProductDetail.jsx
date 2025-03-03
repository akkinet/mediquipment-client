"use client";
import { useState, useContext, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import ImageModal from "./ImageModal";
import { FaPlus, FaMinus, FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { CartContext } from "../SessionProVider";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
 
const AdvancedProductDetail = ({ data }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const [, setCartItems] = useContext(CartContext);
  const { data: session } = useSession();
 
  const handleImageClick = () => {
    setIsModalOpen(true);
  };
 
  const handleThumbnailClick = (index) => {
    setSelectedImage(index);
  };
 
  const handleQuantityChange = (action) => {
    if (action === "increase") {
      setQuantity(quantity + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
 
  async function addToCart(product) {
    await fetch("/api/cart", {
      method: "POST",
      body: JSON.stringify(product),
    });
  }
 
  async function upToDateCart(product) {
    await fetch(`/api/cart/${product.email}?product_id=${product.product_id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    });
  }
 
  const cartHandler = () => {
    if (data.product.stockQuantity === 0) {
      // Disable adding to cart if out of stock
      return;
    }
 
    let cart = [];
    const medCart =
      typeof window !== "undefined" && window.localStorage.getItem("medCart");
    const newProduct = {
      quantity,
      product_id: data.product.prod_id,
      description: data.product.prod_desc,
      prescription: data.product.key_features.rx_required,
      images: data.product.prod_images,
      title: data.product.prod_name,
      price: data.product.prod_value,
      stockQuantity: data.product.stockQuantity,
      parcel_info: data.product.parcel,
    };
 
    if (medCart) {
      const localCart = JSON.parse(medCart);
 
      if (localCart.length < 10) {
        toast("Item added successfully", {
          position: "top-center",
          autoClose: 1500,
          type: "success",
        });
      } else {
        toast("Cart is full, no more items will be added", {
          position: "top-center",
          autoClose: 3000,
          type: "error",
        });
        return;
      }
 
      const exist = localCart.find((c) => c.product_id == data.product.prod_id);
      if (exist) {
        cart = localCart.map((c) => {
          if (c.product_id == data.product.prod_id) {
            if (session && session.user) {
              upToDateCart({
                quantity,
                product_id: data.product.prod_id,
                email: session.user.email,
              });
            }
            return newProduct;
          }
          return {
            quantity: c.quantity,
            product_id: c.product_id,
            images: c.images,
            title: c.title,
            price: c.price,
            stockQuantity: c.stockQuantity,
            prescription: c.prescription,
            description: c.description,
            parcel_info: c.parcel_info,
          };
        });
      } else {
        cart = [...localCart, newProduct];
        if (session && session.user) {
          addToCart({
            quantity,
            product_id: data.product.prod_id,
            email: session.user.email,
            ...data.product,
          });
        }
      }
    } else {
      if (session && session.user) {
        addToCart({
          quantity,
          product_id: data.product.prod_id,
          email: session.user.email,
          ...data.product,
        });
      }
      cart.push(newProduct);
    }
 
    setCartItems(cart.length);
    window.localStorage.setItem("medCart", JSON.stringify(cart));
  };
 
  const handleLeftArrowClick = () => {
    if (thumbnailIndex > 0) {
      setThumbnailIndex(thumbnailIndex - 1);
    }
  };
 
  const handleRightArrowClick = () => {
    if (thumbnailIndex < data?.product.prod_images.length - 4) {
      setThumbnailIndex(thumbnailIndex + 1);
    }
  };
 
  const isOutOfStock = data.product.stockQuantity === 0;
 
  return (
    <div className="container mx-auto p-6 lg:mt-24 font-montserrat">
      <div className="flex flex-col md:flex-row lg:mt-8 md: mt-16 space-y-6 md:space-y-0 md:space-x-6 ">
        <div className="flex flex-col items-center md:w-1/2 lg:sticky top-24 h-fit">
          <div className="lg:w-[30rem] lg:h-[30rem] sm: h-64 sm: w-96 overflow-hidden rounded-lg border-2 border-customBlue shadow-lg">
            <img
              src={data?.product.prod_images[selectedImage]}
              alt="Product"
              className="w-full h-full object-contain cursor-pointer"
              onClick={handleImageClick}
            />
          </div>
          <div className="relative flex items-center mt-4">
            <button
              onClick={handleLeftArrowClick}
              className="p-2 text-black border-none text-2xl"
            >
              <FaCaretLeft />
            </button>
            <div className="flex space-x-4 overflow-hidden">
              {data?.product.prod_images
                .slice(thumbnailIndex, thumbnailIndex + 4)
                .map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className={`w-20 h-20 rounded-lg cursor-pointer object-contain ${
                      selectedImage === thumbnailIndex + index
                        ? "border-2 border-customBlue"
                        : ""
                    }`}
                    onClick={() => handleThumbnailClick(thumbnailIndex + index)}
                  />
                ))}
            </div>
            <button
              onClick={handleRightArrowClick}
              className="p-2 text-black border-none text-2xl"
            >
              <FaCaretRight />
            </button>
          </div>
        </div>
        <div className="md:w-1/2">
          <h2 className="text-gray-600 uppercase">{data.product.brand_name}</h2>
          <h2 className="text-2xl font-bold">{data.product.prod_name}</h2>
          <div className="flex items-center justify-between lg:w-1/2 my-1">
            <span
              className={`text-lg cursor-pointer rounded-md font-medium ${
                isOutOfStock ? "text-red-600" : "text-green-700"
              }`}
            >
              {isOutOfStock ? "Out of Stock" : "In Stock"}
            </span>
            <p className="text-gray-600">PUI# : {data.product.prod_id}</p>
          </div>
          <div className="border-y-2 border-gray-200 mt-2 py-2">
            <ul className="list-disc px-4 text-md">
              {data.product.prod_highlight.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
          <p className="my-2 text-md font-bold">Starting at</p>
          <div className="flex items-center space-x-4">
            <div className="text-3xl font-bold flex">
              <p className="text-base">$</p>
              <p>
                {isOutOfStock
                  ? "---"
                  : data.product.prod_value.toLocaleString()}
              </p>
            </div>
            {!isOutOfStock && (
              <p className="text-white text-xl rounded-lg animate-bounce p-1 px-2 bg-red-500 font-montserrat">
                -50%
              </p>
            )}
          </div>
          {!isOutOfStock && (
            <div className="text-gray-500 text-sm m-1">
              <span>M.R.P.: </span>
              <span className="line-through">
                ${(data.product.prod_value * 2).toLocaleString()}
              </span>
            </div>
          )}
          <p className="my-2 lg:text-xl sm:text-sm font-bold">
            Questions about this product?{" "}
            <span className="text-customBlue lg:text-xl sm:text-sm">
              Call 1-866-414-9700.
            </span>
          </p>
          <div className="product-badges flex mt-4">
            {data.product.key_features.rx_required && (
              <div className="badge flex items-center flex-col mr-2 lg:w-24 sm: w-20">
                <img
                  className="badge-image"
                  loading="lazy"
                  src="https://www.thecpapshop.com/media/catalog/badges/CPAP-icons-56x56-16.png"
                  alt="Prescription Required"
                ></img>
                <div className="badge-title lg:text-sm sm: text-xs text-center ">
                  Prescription Required
                </div>
              </div>
            )}
            {data.product.key_features["2_years_warranty"] && (
              <div className="badge flex items-center flex-col mr-2 lg:w-24 sm: w-20">
                <img
                  className="badge-image"
                  loading="lazy"
                  src="https://www.thecpapshop.com/media/catalog/badges/CPAP-icons-56x56-05.png"
                  alt="2 Year Warranty"
                ></img>{" "}
                <div className="badge-title lg:text-sm sm: text-xs text-center ">
                  2 Year Warranty
                </div>
              </div>
            )}
            {data.product.key_features["free_shipping"] && (
              <div className="badge flex items-center flex-col mr-2 lg:w-24 sm: w-20">
                <img
                  className="badge-image"
                  loading="lazy"
                  src="https://www.thecpapshop.com/media/catalog/badges/CPAP-icons-56x56-04.png"
                  alt="Free Shipping Over $99"
                ></img>
                <div className="badge-title lg:text-sm sm: text-xs text-center ">
                  Free Shipping Over $99
                </div>
              </div>
            )}
            {data.product.key_features["pay_over_time"] && (
              <div className="badge flex items-center flex-col mr-2 lg:w-24 sm: w-20">
                <img
                  className="badge-image"
                  loading="lazy"
                  src="https://www.thecpapshop.com/media/catalog/badges/TCSbuynowpayovertime.jpg"
                  alt="Pay Over Time"
                ></img>{" "}
                <div className="badge-title lg:text-sm sm: text-xs text-center ">
                  Pay Over Time
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center mt-6 space-x-4">
            <div className="flex items-center border border-gray-200 rounded-lg bg-customBlue py-1">
              <button
                onClick={() => handleQuantityChange("decrease")}
                className="px-3 py-1 border-none text-white"
                disabled={isOutOfStock}
              >
                <FaMinus />
              </button>
              <span className="px-4 py-1 text-white font-bold">{quantity}</span>
              <button
                onClick={() => handleQuantityChange("increase")}
                className="px-3 py-1 border-none text-white"
                disabled={isOutOfStock}
              >
                <FaPlus />
              </button>
            </div>
            <button
              onClick={cartHandler}
              className={`flex items-center px-4 py-2 rounded-lg ${
                isOutOfStock
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-customPink text-white hover:bg-customBlue"
              }`}
              disabled={isOutOfStock}
            >
              <FaShoppingCart className="mr-2" />
              Add to Cart
            </button>
            <ToastContainer />
          </div>
          <div className="my-4 border-t-2 border-gray-200">
            <p className="text-2xl font-bold my-2">Product Description:</p>
            <div>
              <p>{data.product.prod_desc}</p>
              <ul className="list-decimal">
                {data.product.prod_detailed_desc.map((dtl, i) => (
                  <li key={i}>
                    <p className="my-2 text-xl font-bold ml-2">
                      {Object.keys(dtl)[1]}
                    </p>
                    <p>{Object.values(dtl)[1]}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-customBlue text-right border-t-2 border-gray-300">
            Sold by:{" "}
            <span className="text-black">{data.product.vendor_name}</span>
          </p>
        </div>
      </div>
      {/* Related Products Section */}
      <div className="container mx-auto lg:p-6 lg:px-20 sm:px-0">
        {data?.relatedProducts.length > 0 && (
          <div className="mt-8 border-t-2 border-gray-400">
            <h4 className="lg:text-2xl sm:text-xl font-bold mt-2">
              RELATED PRODUCTS
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
              {data.relatedProducts.map((pd) => (
                <Link
                  href={`/product/${pd.prod_id}`}
                  key={pd.prod_id}
                  className="flex flex-col justify-between items-center p-4 border border-customBlue hover:border-2 hover:shadow-customBlue/40 shadow-md rounded w-full transition-transform duration-200 transform hover:scale-105"
                >
                  <div>
                    <img
                      src={pd.prod_images[0]}
                      alt={`Related Product ${pd.prod_name}`}
                      width={150}
                      height={150}
                      className="w-full lg:h-[10rem] sm:h-[7rem] mb-3"
                    />
                  </div>
                  <p className="lg:text-md sm:text-sm my-1">{pd.prod_name}</p>
                  <p className="lg:text-md sm:text-xs mb-1">
                    {" "}
                    <span className="text-customPink">by: </span>
                    {pd.brand_name}
                  </p>
                  <button className="relative bottom-0 w-full border-2 py-1 border-customBlue rounded-md bg-customBlue text-white">
                    View Details
                  </button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <ImageModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        images={data?.product.prod_images}
        selectedImageIndex={selectedImage}
        setSelectedImage={setSelectedImage}
      />
    </div>
  );
};
 
export default AdvancedProductDetail;