"use client";
import { useState, useEffect, useRef } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";

const libraries = ["places"];

export default function ShipmentForm() {
  const [receiver, setReceiver] = useState({
    name: "Receiver",
    street1: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
    email: "receiver@example.com",
    phone: "+15559876543",
  });

  const [parcels, setParcels] = useState([]);
  const autocompleteRef = useRef(null);

  // Load parcel data from localStorage (medCart)
  useEffect(() => {
    const medCart = JSON.parse(localStorage.getItem("medCart")) || [];
    const formattedParcels = medCart.map((item) => ({
      length: item.parcel_info.length,
      width: item.parcel_info.width,
      height: item.parcel_info.height,
      weight: item.parcel_info.weight,
      mass_unit: item.parcel_info.mass_unit,
      distance_unit: item.parcel_info.distance_unit,
    }));
    setParcels(formattedParcels);
  }, []);

  // Handle Google Places API Autocomplete
  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place && place.address_components) {
        const addressObj = extractAddressComponents(place.address_components);
        setReceiver((prev) => ({
          ...prev,
          ...addressObj,
          street1: place.formatted_address,
        }));
      }
    }
  };

  // Extract address components from Google Places response
  const extractAddressComponents = (components) => {
    let address = { city: "", state: "", zip: "" };

    components.forEach((component) => {
      const types = component.types;
      if (types.includes("locality")) address.city = component.long_name;
      if (types.includes("administrative_area_level_1"))
        address.state = component.short_name;
      if (types.includes("postal_code")) address.zip = component.long_name;
    });

    return address;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const shipmentPayload = {
      address_to: receiver,
      parcels,
    };
    console.log("Shipment Payload:", shipmentPayload);
  };

  return (
    <div className="max-w-lg mx-auto p-6 border rounded-lg shadow-md bg-white mt-28">
      <h2 className="text-xl font-semibold mb-4">Create Shipment</h2>

      {/* Google Places Autocomplete Input */}
      <LoadScript googleMapsApiKey={process.env.GOOGLE_PLACES_API_KEY} libraries={libraries}>
        <Autocomplete onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)} onPlaceChanged={handlePlaceChanged}>
          <input
            type="text"
            placeholder="Enter address"
            className="border p-2 w-full mb-3"
          />
        </Autocomplete>
      </LoadScript>

      {/* Display Address Fields */}
      <input type="text" placeholder="Receiver Name" value={receiver.name} readOnly className="border p-2 w-full mb-3" />
      <input type="text" placeholder="Street" value={receiver.street1} readOnly className="border p-2 w-full mb-3" />
      <input type="text" placeholder="City" value={receiver.city} readOnly className="border p-2 w-full mb-3" />
      <input type="text" placeholder="State" value={receiver.state} readOnly className="border p-2 w-full mb-3" />
      <input type="text" placeholder="ZIP Code" value={receiver.zip} readOnly className="border p-2 w-full mb-3" />
      <input type="text" placeholder="Country" value={receiver.country} readOnly className="border p-2 w-full mb-3" />

      {/* Parcel Details */}
      <h3 className="text-lg font-semibold mb-2">Parcel Details</h3>
      {parcels.length === 0 ? (
        <p>No parcels found in medCart.</p>
      ) : (
        parcels.map((parcel, index) => (
          <div key={index} className="p-3 border mb-3 bg-gray-100 rounded-md">
            <p><strong>Length:</strong> {parcel.length} {parcel.distance_unit}</p>
            <p><strong>Width:</strong> {parcel.width} {parcel.distance_unit}</p>
            <p><strong>Height:</strong> {parcel.height} {parcel.distance_unit}</p>
            <p><strong>Weight:</strong> {parcel.weight} {parcel.mass_unit}</p>
          </div>
        ))
      )}

      {/* Submit Button */}
      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded-md w-full mt-4">
        Create Shipment
      </button>
    </div>
  );
}
