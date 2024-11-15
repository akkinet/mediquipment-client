import React from "react";
import { FaUserMd, FaHome, FaFirstAid } from "react-icons/fa";

const TagLine = () => {
  return (
    <div className="flex flex-col md:flex-row items-stretch bg-gray-100 w-full p-6 md:p-0 font-montserrat">
      {/* Left Section */}
      <div className="relative flex flex-col items-center justify-end w-full md:w-[35%] bg-gray-200">
        {/* Image */}
        <div className="relative w-full h-64 md:h-full overflow-hidden">
          <img
            src="https://s3.ap-south-1.amazonaws.com/medicom.hexerve/Doctor+and+Patient.jpg"
            alt="Doctor and patient"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        {/* Icons */}
        <div className="relative z-10 flex space-x-6 bg-white/70 p-4 rounded-t-lg">
          <div className="flex flex-col items-center">
            <FaUserMd className="text-blue-600 text-4xl" />
            <p className="text-xs text-gray-700 mt-1 text-center">Licensed Therapists</p>
          </div>
          <div className="flex flex-col items-center">
            <FaHome className="text-blue-600 text-4xl" />
            <p className="text-xs text-gray-700 mt-1 text-center">In-home Medical Services</p>
          </div>
          <div className="flex flex-col items-center">
            <FaFirstAid className="text-blue-600 text-4xl" />
            <p className="text-xs text-gray-700 mt-1 text-center">Medical Equipments</p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div
        className="relative flex-1 bg-purple-50 bg-cover bg-center bg-no-repeat flex flex-col justify-center p-6 md:p-12"
        style={{
          backgroundImage: `url('https://s3.ap-south-1.amazonaws.com/medicom.hexerve/purple+base.png')`,
        }}
      >
        {/* Content on top of the background */}
        <div className="relative z-10">
          <h2 className="text-white text-lg md:text-3xl font-bold">
            OUR SERVICES
          </h2>
          <h3 className="text-white text-xl md:text-4xl font-bold mt-2">
            Attentive Care Right at Your Home
          </h3>
          <p className="text-white mt-4 text-sm md:text-xl">
            Providing expert in-home respiratory services, reliable oxygen
            medical supplies, and a full range of medical equipment to support
            your health and independence.
          </p>

          {/* Cards */}
          <div className="mt-6 flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            {/* Card 1 */}
            <div className="bg-white p-4 rounded-lg shadow-md flex-1">
              <h4 className="text-blue-600 font-bold border-b-2 border-gray-400 text-xl">
                In-home & Clinical Respiratory Services
              </h4>
              <p className="text-gray-600 mt-2 text-lg italic">
                Our respiratory team provides a range of equipment, from basic
                nasal cannulas to advanced mechanical ventilation and urological
                supplies, specializing in sales.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-4 rounded-lg shadow-md flex-1">
              <h4 className="text-blue-600 font-bold border-b-2 border-gray-400 text-xl">
                Medical Equipments and Supplies
              </h4>
              <p className="text-gray-600 mt-2 text-lg italic">
                Our skilled respiratory therapists oversee patients' medical
                equipment, ensuring high-quality respiratory health through
                regular check-ins and dependable on-call service.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-4 rounded-lg shadow-md flex-1">
              <h4 className="text-blue-600 font-bold border-b-2 border-gray-400 text-xl">
                Health Services and Staffing
              </h4>
              <p className="text-gray-600 mt-2 text-lg italic">
                Certified by the AHCA as a Healthcare Service Pool, we provide
                licensed respiratory therapists for in-home care and as temporary
                staff for residential facilities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagLine;
