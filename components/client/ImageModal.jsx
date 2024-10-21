import React, { useEffect, useRef, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const ImageModal = ({
  isOpen,
  closeModal,
  images,
  selectedImageIndex,
  setSelectedImage,
}) => {
  const modalRef = useRef(null);
  const [startIndex, setStartIndex] = useState(0);
  const imagesToShow = 5;
  const [zoomStyle, setZoomStyle] = useState({});
  const zoomRef = useRef(null);

  if (typeof closeModal !== "function") {
    throw new Error("closeModal prop must be a function");
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  const handleSlideLeft = () => {
    setStartIndex((prevIndex) =>
      prevIndex === 0 ? images.length - imagesToShow : prevIndex - 1
    );
  };

  const handleSlideRight = () => {
    setStartIndex((prevIndex) =>
      prevIndex + imagesToShow >= images.length ? 0 : prevIndex + 1
    );
  };

  const currentImages = images.slice(
    startIndex,
    Math.min(startIndex + imagesToShow, images.length)
  );

  const handleMouseMove = (e) => {
    const { left, top, width, height } = zoomRef.current.getBoundingClientRect();
    const mouseX = e.pageX - left;
    const mouseY = e.pageY - top;
    const boundedX = Math.max(0, Math.min(mouseX, width));
    const boundedY = Math.max(0, Math.min(mouseY, height));
    const percentX = (boundedX / width) * 100;
    const percentY = (boundedY / height) * 100;

    setZoomStyle({
      transformOrigin: `${percentX}% ${percentY}%`,
      transform: "scale(2.5)", 
      transition: "transform 0.1s ease-out", 
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transform: "scale(1)",
      transition: "transform 0.3s ease-out", 
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-opacity duration-300 ease-out">
      <div
        ref={modalRef}
        className="relative bg-white rounded-lg overflow-hidden max-w-4xl w-full transform transition-transform duration-300 ease-out"
      >
        <div className="relative">
          <div
            ref={zoomRef}
            className="w-full h-96 flex justify-center items-center overflow-hidden relative"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={images[selectedImageIndex]}
              alt="Product"
              className="w-full h-full object-contain transition-transform duration-300 ease-out"
              style={zoomStyle}
            />
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setSelectedImage(
                    (selectedImageIndex - 1 + images.length) % images.length
                  )
                }
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-200 transition"
              >
                <FaAngleLeft size={24} />
              </button>
              <button
                onClick={() =>
                  setSelectedImage((selectedImageIndex + 1) % images.length)
                }
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-200 transition"
              >
                <FaAngleRight size={24} />
              </button>
            </>
          )}
        </div>

        <div className="flex justify-center items-center space-x-2 p-4">
          {images.length > imagesToShow && (
            <button
              onClick={handleSlideLeft}
              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-200 transition"
            >
              <FaAngleLeft size={24} />
            </button>
          )}

          <div className="flex space-x-2 overflow-hidden">
            {currentImages.map((image, index) => (
              <img
                key={startIndex + index}
                src={image}
                alt={`Thumbnail ${startIndex + index + 1}`}
                className={`w-16 h-16 cursor-pointer rounded-md object-contain ${
                  startIndex + index === selectedImageIndex
                    ? "border-2 border-customBlue"
                    : "border border-gray-300"
                }`}
                onClick={() => setSelectedImage(startIndex + index)}
              />
            ))}
          </div>

          {images.length > imagesToShow && (
            <button
              onClick={handleSlideRight}
              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-200 transition"
            >
              <FaAngleRight size={24} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
