"use client";
import React from "react";
import { Button } from "./ui/moving-border";
import Link from "next/link";

function HeroSection() {
  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Video Element */}
      <div className="absolute inset-0 w-full h-full">
        <video
          className="w-full h-full object-cover"
          controls={false}
          autoPlay
          loop
          muted
          src="https://s3.ap-south-1.amazonaws.com/medicom.hexerve/coverr-doctor-wearing-mask-2797-1080p.mp4"
        ></video>
      </div>
      <div className="absolute inset-0 w-full h-full bg-black opacity-25 z-10"></div>

      {/* Text Element */}
      <div className="relative z-20 text-center px-4 py-6 lg:px-10 lg:py-8 font-montserrat">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight lg:leading-snug max-w-6xl mx-auto ">
          Perfect Medical Equipment From Your Favourite Brand
        </h1>
        <p className="mt-4 text-base md:text-lg lg:text-2xl text-white max-w-6xl mx-auto">
          At SPEC Medical, we provide high-quality medical equipment designed to
          support healthcare professionals in delivering exceptional patient care. Discover our innovative solutions and elevate your medical practice.
        </p>
        <div className="mt-6">
          <Link href={"/product"}>
            <Button
              borderRadius="1rem"
              className="text-white bg-black-800/30  font-semibold text-lg"
            >
              Our Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
