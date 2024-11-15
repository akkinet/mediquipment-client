'use client';
import React from 'react';

export default function AboutUs() {
  return (
    <div className="font-montserrat">
      {/* Content */}
      <div className=" flex flex-col md:flex-row  ">
        {/* Left Section: Single Image */}
        <div className="relative z-10 p-12 ">
          {/* Decorative Image Behind (Hidden in smaller screens) */}
          <img
            src="https://s3.ap-south-1.amazonaws.com/medicom.hexerve/plus+image.png"
            alt="Decorative background"
            className="absolute bottom-0 left-0 h-[30%] w-auto pointer-events-none z-0 hidden md:block"
          />

          {/* Single Image (Foreground) */}
          <div className="relative z-10 w-full h-auto overflow-hidden">
            <img
              src="https://s3.ap-south-1.amazonaws.com/medicom.hexerve/Screenshot+2024-11-12+215710.png"
              alt="Healthcare related collage"
              className="w-full object-cover"
            />
          </div>
        </div>

        {/* Right Section: Text Content */}
        <div className="flex flex-col justify-around flex-1 text-left p-6 mt-6 md:mt-0">
          <h2 className="text-customBlue font-bold text-xl md:text-2xl">
            ABOUT US
          </h2>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-700 mt-2">
            Compassionate Care for Every Breath, Every Life
          </h1>
          <p className="text-lg md:text-2xl leading-relaxed mt-6 text-gray-600 italic">
            We started our company in 2010, intending to provide respiratory
            services to pediatric patients. We quickly saw a significant need
            for respiratory therapists to treat patients of all ages.
            Consequently, we expanded our practice and began operating under
            our DBA name, JKARE Miami. We want to stand out excellently for
            respiratory care services and products.
          </p>
          <div className="mt-6">
            <button className="bg-customPink hover:bg-customBlue text-white font-semibold px-6 py-3 rounded-full">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
