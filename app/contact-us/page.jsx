"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 25.7617,
  lng: -80.1918,
};

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    comment: "",
  });

  const pageTitle = "Contact Us";

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(form);
  };

  return (

    <div className="lg:mt-24">
      <Head>
        <title>Contact</title>
      </Head>
      <div className="min-h-screen flex flex-col bg-gray-100 py-16">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Map Section */}
              <div className="relative">
                <LoadScript googleMapsApiKey="AIzaSyAlEgLIgIlVsoN7-rNOF06Hr6r6klGYz4g">
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={12}
                  >
                    <Marker position={center} />
                  </GoogleMap>
                </LoadScript>
              </div>
              {/* Form Section */}
              <div className="p-8 lg:px-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Contact Us
                </h2>
                <p className="text-gray-600 mb-2">
                  We’d love to hear from you! Fill out the form below or contact
                  us using the information provided.
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name and Phone Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-customPink"
                        placeholder="Your Name"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-customPink"
                        placeholder="Phone Number"
                      />
                    </div>
                  </div>
                  {/* Email Field */}
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-customPink"
                      placeholder="Email Address"
                    />
                  </div>
                  {/* Comment Field */}
                  <div>
                    <textarea
                      name="comment"
                      value={form.comment}
                      onChange={handleChange}
                      className="w-full h-32 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-customPink"
                      placeholder="Your Message"
                    />
                  </div>
                  {/* Submit Button */}
                  <div className="text-right">
                    <button
                      type="submit"
                      className="inline-block bg-customPink text-white font-medium py-3 px-6 rounded-md shadow-lg hover:bg-customBlue transition duration-200"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
            {/* Contact Information Section */}
            <div className="bg-gray-50 p-6 lg:p-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-customPink">
                    Address
                  </h4>
                  <p className="text-gray-700">
                    SPEC MEDICAL, INC
                    <br />
                    4710 SW 74 AVE Miami, FL 33155
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-customPink">
                    Contact Details
                  </h4>
                  <p className="text-gray-700">
                    Email: info@cpapmiami.com
                    <br />
                    Toll Free: 855.717.7378
                    <br />
                    Phone: 305.266.6701
                    <br />
                    Fax: 305.266.9943
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
