"use client";
import { useState, useEffect } from "react";
export default function ShipmentForm() {
  // ===============================
  // State
  // ===============================
  const [receiver, setReceiver] = useState({
    name: "Receiver",
    street1: "456 Maple Ave",
    city: "San Francisco",
    state: "CA",
    zip: "94103",
    country: "US",
    email: "receiver@example.com",
    phone: "+15559876543",
  });

  const [parcels, setParcels] = useState([]);
  const [shipment, setShipment] = useState(null); // Shippo shipment response (includes rates)
  const [selectedRate, setSelectedRate] = useState(null); // Track which rate card is chosen
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [trackingError, setTrackingError] = useState("");

  // ===============================
  // Load parcel data from localStorage (medCart)
  // ===============================
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

  // ===============================
  // CREATE SHIPMENT (calls /api/shipment)
  // ===============================
  const handleCreateShipment = async () => {
    try {
      const shipmentData = {
        address_from: {
          name: "Sender",
          street1: "123 Main St",
          city: "New York",
          state: "NY",
          zip: "10001",
          country: "US",
          email: "sender@example.com",
          phone: "+15551234567",
        },
        address_to: {
          name: receiver.name,
          street1: receiver.street1,
          city: receiver.city,
          state: receiver.state,
          zip: receiver.zip,
          country: receiver.country,
          email: receiver.email,
          phone: receiver.phone,
        },
        parcels: parcels,
        carrier_accounts: null, // Let Shippo auto-select carriers
        shipment_date: new Date().toISOString().replace("Z", "+00:00"),
      };

      const response = await fetch("/api/shipment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shipmentData),
      });

      const data = await response.json();
      if (data.error) {
        console.error("Failed to create shipment:", data.error);
        return;
      }
      setShipment(data);
      setSelectedRate(null); // reset selected rate if new shipment is created
      setTrackingInfo(null);
      setTrackingError("");
      console.log("Shipment created successfully:", data);
    } catch (error) {
      console.error("Error creating shipment:", error);
    }
  };

  // ===============================
  // TRACK SHIPMENT (calls /api/track)
  // ===============================
  const handleTrackShipment = async () => {
    if (!selectedRate) {
      alert("Please select a rate card first.");
      return;
    }

    // In a real scenario, you'd have a real tracking number from the Transaction or Rate.
    // For demonstration, we use "SHIPPO_TRANSIT" (Shippo test tracking).
    // But we can also map provider to something relevant ("ups", "usps", "dhl", "shippo").
    const carrierMapping = {
      UPS: "ups",
      USPS: "usps",
      FedEx: "fedex",
      DHL: "dhl",
      // fallback:
      default: "shippo",
    };

    // Determine carrier from selected rate's provider
    let carrierKey = (selectedRate.provider || "").toUpperCase();
    const carrier = carrierMapping[carrierKey] || carrierMapping.default;
    const trackingNumber = "SHIPPO_TRANSIT";

    try {
      const response = await fetch(
        `/api/track?carrier=${carrier}&tracking=${trackingNumber}`
      );
      const data = await response.json();
 
      if (data.error) {
        setTrackingError(data.error);
        setTrackingInfo(null);
      } else {
        setTrackingInfo(data);
        setTrackingError("");
      }
    } catch (error) {
      console.error("Error tracking shipment:", error);
      setTrackingError("An error occurred while tracking shipment.");
      setTrackingInfo(null);
    }
  };

  // ===============================
  // Handlers for manual input fields
  // ===============================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReceiver((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===============================
  // Render
  // ===============================
  return (
    <div className="max-w-7xl mx-auto mt-32 px-4 md:px-0">
      {/* Form Card */}
      <div className="bg-white border-2 border-red-500 rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Create Shipment</h2>

        {/* Address Fields */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Receiver Name
            </label>
            <input
              type="text"
              name="name"
              value={receiver.name}
              onChange={handleInputChange}
              className="border rounded w-full px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street
            </label>
            <input
              type="text"
              name="street1"
              value={receiver.street1}
              onChange={handleInputChange}
              className="border rounded w-full px-3 py-2"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              name="city"
              value={receiver.city}
              onChange={handleInputChange}
              className="border rounded w-full px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <input
              type="text"
              name="state"
              value={receiver.state}
              onChange={handleInputChange}
              className="border rounded w-full px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ZIP Code
            </label>
            <input
              type="text"
              name="zip"
              value={receiver.zip}
              onChange={handleInputChange}
              className="border rounded w-full px-3 py-2"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={receiver.country}
              onChange={handleInputChange}
              className="border rounded w-full px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={receiver.email}
              onChange={handleInputChange}
              className="border rounded w-full px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={receiver.phone}
              onChange={handleInputChange}
              className="border rounded w-full px-3 py-2"
            />
          </div>
        </div>

        {/* Parcel Details */}
        {/* <h3 className="text-lg font-semibold mt-6 mb-3 text-gray-700">
          Parcel Details
        </h3>
        {parcels.length === 0 ? (
          <p className="text-gray-500">No parcels found in medCart.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {parcels.map((parcel, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 bg-gray-50 flex flex-col justify-between"
              >
                <p className="mb-1">
                  <strong>Length:</strong> {parcel.length} {parcel.distance_unit}
                </p>
                <p className="mb-1">
                  <strong>Width:</strong> {parcel.width} {parcel.distance_unit}
                </p>
                <p className="mb-1">
                  <strong>Height:</strong> {parcel.height} {parcel.distance_unit}
                </p>
                <p className="mb-1">
                  <strong>Weight:</strong> {parcel.weight} {parcel.mass_unit}
                </p>
              </div>
            ))}
          </div>
        )} */}

        {/* Button to CREATE SHIPMENT */}
        <button
          onClick={handleCreateShipment}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-md mt-5"
        >
          Create Shipment
        </button>
      </div>

      {/* Display Available Rates */}
      {shipment && shipment.rates && shipment.rates.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Available Rates / Choose your provider
          </h3>
          <div className="grid gap-4 md:grid-cols-4">
            {shipment.rates.map((rate) => {
              // highlight this card if it is currently selected
              const isSelected = selectedRate?.object_id === rate.object_id;
              return (
                <div
                  key={rate.object_id}
                  onClick={() => setSelectedRate(rate)}
                  className={`cursor-pointer p-4 border-2 rounded-lg transition-colors 
                    ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                >
                  {/* Provider logo */}
                  {rate.provider_image_75 && (
                    <img
                      src={rate.provider_image_75}
                      alt="provider logo"
                      className="w-16 h-auto mb-2"
                    />
                  )}

                  <p className="text-lg font-semibold mb-1 text-gray-800">
                    {rate.provider}
                  </p>
                  <p className="text-gray-600 mb-1">
                    Service Level:{" "}
                    <span className="font-medium">
                      {rate.servicelevel.display_name || rate.servicelevel.name}
                    </span>
                  </p>
                  <p className="text-gray-600 mb-1">
                    <strong>Price:</strong> {rate.amount} {rate.currency}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <strong>Estimated Days:</strong> {rate.estimated_days}
                  </p>
                  {rate.duration_terms && (
                    <p className="text-gray-500 text-sm italic">
                      {rate.duration_terms}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Track Shipment Button */}
      {shipment && shipment.rates && shipment.rates.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <button
            onClick={handleTrackShipment}
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-md"
          >
            Track Shipment
          </button>
        </div>
      )}

      {/* Tracking Info */}
      {trackingError && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
          {trackingError}
        </div>
      )}

      {trackingInfo && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-2 text-gray-800">
            Tracking Info
          </h2>
          <div className="mb-4">
            <p className="text-gray-700 mb-1">
              <strong>Tracking Number:</strong> {trackingInfo.tracking_number}
            </p>
            <p className="text-gray-700 mb-1">
              <strong>Carrier:</strong> {trackingInfo.carrier}
            </p>
            <p className="text-gray-700 mb-1">
              <strong>Service Level:</strong>{" "}
              {trackingInfo.servicelevel?.name || "N/A"}
            </p>
            <p className="text-gray-700 mb-1">
              <strong>ETA:</strong>{" "}
              {trackingInfo.eta
                ? new Date(trackingInfo.eta).toLocaleString()
                : "N/A"}
            </p>
            <p className="text-gray-700 mb-3">
              <strong>Status:</strong>{" "}
              {trackingInfo.tracking_status?.status || "Unknown"}
            </p>

            {trackingInfo.tracking_status?.status_details && (
              <div className="bg-gray-50 border-l-4 border-blue-400 p-3 mb-3">
                <p className="text-sm text-gray-700">
                  {trackingInfo.tracking_status?.status_details}
                </p>
              </div>
            )}
          </div>

          {/* Show address_from and address_to */}
          <div className="grid gap-4 md:grid-cols-2 mb-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Address From</h3>
              <p className="text-gray-700 text-sm">
                {trackingInfo.address_from?.city}, {trackingInfo.address_from?.state}{" "}
                {trackingInfo.address_from?.zip}, {trackingInfo.address_from?.country}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Address To</h3>
              <p className="text-gray-700 text-sm">
                {trackingInfo.address_to?.city}, {trackingInfo.address_to?.state}{" "}
                {trackingInfo.address_to?.zip}, {trackingInfo.address_to?.country}
              </p>
            </div>
          </div>

          {/* Tracking History Timeline */}
          <h3 className="font-semibold text-gray-700 mb-2">Tracking History</h3>
          {trackingInfo.tracking_history && trackingInfo.tracking_history.length > 0 ? (
            <ul className="border-l-2 border-gray-300 pl-4">
              {trackingInfo.tracking_history.map((event) => (
                <li key={event.object_id} className="mb-6 relative">
                  <div className="absolute -left-3 top-0 w-5 h-5 bg-blue-400 rounded-full"></div>
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">
                      {new Date(event.status_date).toLocaleString()}
                    </span>{" "}
                    - {event.status_details}
                  </div>
                  {event.location && (
                    <p className="text-sm text-gray-500 ml-2">
                      {event.location.city}, {event.location.state}{" "}
                      {event.location.zip}, {event.location.country}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No tracking history available.</p>
          )}
        </div>
      )}
    </div>
  );
}
