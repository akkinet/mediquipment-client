"use client";
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 25.7617,
  lng: -80.1918,
};

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    comment: '',
  });

  const pageTitle = 'Contact Us';

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
    <>
      <Head>
        <title>Contact</title>
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center bg-transparent md:bg-gray-100 p-4">
        <div className="w-full max-w-5xl mt-24 bg-white text-black rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Contact</h2>
          <div className="w-full h-96 mb-6">
            <LoadScript googleMapsApiKey="AIzaSyAlEgLIgIlVsoN7-rNOF06Hr6r6klGYz4g">
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
              >
                <Marker position={center} />
              </GoogleMap>
            </LoadScript>
          </div>
          <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 mt-2 border border-gray-400 rounded-md shadow-sm focus:outline-none"
                      placeholder="Name"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 mt-2 border border-gray-400 rounded-md shadow-sm focus:outline-none"
                      placeholder="Phone Number"
                    />
                  </div>
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-2 border border-gray-400 rounded-md shadow-sm focus:outline-none"
                    placeholder="Email"
                  />
                </div>
                <div>
                  <textarea
                    name="comment"
                    value={form.comment}
                    onChange={handleChange}
                    className="w-full h-32 px-4 py-2 mt-2 border border-gray-400 rounded-md shadow-sm focus:outline-none"
                    placeholder="Comment"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="inline-flex justify-center py-1 px-4 border border-transparent shadow-sm text-lg font-medium rounded-lg text-white bg-teal-400 hover:bg-teal-600 focus:outline-none"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
            <div className="md:col-span-1">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">ADDRESS</h3>
                <p>If you have any additional questions or concerns about our privacy policy, please contact us:</p>
                <p className="font-bold">SPEC MEDICAL, INC</p>
                <p>4710 SW 74 AVE Miami, FL 33155</p>
                <p>Email: info@cpapmiami.com</p>
                <h4 className="text-md font-bold text-gray-900">TELEPHONE:</h4>
                <p>Toll Free: 855.717.7378</p>
                <p>Call Us: 305.266.6701</p>
                <p>Fax: 305.266.9943</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}