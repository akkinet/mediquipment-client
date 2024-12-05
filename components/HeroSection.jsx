"use client";
import React from "react";
import { Button } from "./ui/moving-border";
import Link from "next/link";

function HeroSection() {
  return (
    <div
      className="relative w-full h-screen flex items-center justify-center sm:justify-start bg-cover bg-center bg-no-repeat"
      // style={{
      //   backgroundImage:
      //     "url('https://s3.ap-south-1.amazonaws.com/medicom.hexerve/hero+section+background.jpg')",
      // }}
    >
         <div className="absolute inset-0 w-full h-full">
        <video
          className="w-full h-full object-cover"
          controls={false}
          autoPlay
          loop
          muted
          src="https://s3.ap-south-1.amazonaws.com/medicom.hexerve/hero+section+video.mp4"
        ></video>
      </div>
      {/* Content */}
      <div className="relative z-20 text-center sm:text-left px-6 sm:px-10 lg:px-20 font-montserrat max-w-3xl mt-12">
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-customPink font-semibold">
          Welcome to JKARE!
        </h1>
        <h2 className="text-4xl text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray mt-4 leading-snug relative">
          IN-HOME CARE <br /> FOR EVERY{" "}
          <span className="inline-block relative">
            BREATH
            {/* Pink Curve Image */}
            <img
              src="https://s3.ap-south-1.amazonaws.com/medicom.hexerve/curve+line.png"
              alt="Pink Curve"
              className="absolute w-full -bottom-4 left-0"
              style={{ maxWidth: "1200px" }}
            />
          </span>
        </h2>
        <p className="mt-6 sm:mt-8 text-sm sm:text-base md:text-lg lg:text-xl text-white bg-black/50 px-4 sm:px-5 py-3 rounded max-w-lg mx-auto sm:mx-0">
          We are a Licensed and Certified One-stop Home Solution for your Respiratory Care Needs
        </p>
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center sm:justify-start">
          <Link href={"/contact-us"}>
            <button className="text-white bg-customPink hover:bg-customBlue font-semibold text-base sm:text-lg md:text-xl px-6 sm:px-8 py-3 sm:py-4 rounded-full">
              Contact Us
            </button>
          </Link>
          <Link href={"/product"}>
            <button className="text-white bg-customPink hover:bg-customBlue font-semibold text-base sm:text-lg md:text-xl px-6 sm:px-8 py-3 sm:py-4 rounded-full">
              Shop Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
