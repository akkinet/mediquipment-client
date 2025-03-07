"use client";

import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SHIPPO_API_KEY = process.env.NEXT_PUBLIC_SHIPPO_API_KEY;

export default function BorderfreeStyleCheckout() {
  // =========================================================
  // 1) State
  // =========================================================
  const [receiver, setReceiver] = useState({
    email: "test@example.com",
    firstName: "John",
    lastName: "Doe",
    address: "123 Main St",
    address2: "Apt 4B",
    postalCode: "94103",
    city: "San Francisco",
    region: "CA",
    phone: "5551234567",
    location: "US",
  });

  // Array of parcels (for Shippo)
  const [parcels, setParcels] = useState([]);

  // Shipment object from /api/shipment call (includes rates)
  const [shipment, setShipment] = useState(null);

  // Selected shipping rate
  const [selectedRate, setSelectedRate] = useState(null);

  // Tracking info
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [trackingError, setTrackingError] = useState("");

  // Cart items from localStorage
  const [cartItems, setCartItems] = useState([]);

  // Loading/spinner states
  const [isCreatingShipment, setIsCreatingShipment] = useState(false);
  const [isTracking, setIsTracking] = useState(false);

  // Recommended address suggestion (from Shippo)
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);

  // =========================================================
  // 2) Load cart & parcels from localStorage on mount
  // =========================================================
  useEffect(() => {
    const medCart = JSON.parse(localStorage.getItem("medCart")) || [];
    setCartItems(medCart);

    // Convert each cart item to a Shippo parcel
    const formattedParcels = medCart.map((item) => {
      const length = item.parcel_info?.length ?? 10;
      const width = item.parcel_info?.width ?? 5;
      const height = item.parcel_info?.height ?? 2;
      const weight = item.parcel_info?.weight ?? 1;
      const massUnit = item.parcel_info?.mass_unit ?? "lb";
      const distUnit = item.parcel_info?.distance_unit ?? "in";
      return {
        length,
        width,
        height,
        weight,
        mass_unit: massUnit,
        distance_unit: distUnit,
      };
    });
    setParcels(formattedParcels);
  }, []);

  // Close the suggestions dropdown if the user clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // =========================================================
  // 3) Fetch shipping rates automatically
  //    once the address is reasonably complete
  // =========================================================
  useEffect(() => {
    if (receiver.address && receiver.city && receiver.region && receiver.postalCode) {
      fetchRates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiver, parcels]);

  const fetchRates = async () => {
    try {
      setIsCreatingShipment(true);
      setSelectedRate(null);
      setTrackingInfo(null);
      setTrackingError("");

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
          name: receiver.firstName + " " + receiver.lastName,
          street1: receiver.address,
          street2: receiver.address2,
          city: receiver.city,
          state: receiver.region,
          zip: receiver.postalCode,
          country: receiver.location,
          email: receiver.email,
          phone: receiver.phone,
        },
        parcels,
        carrier_accounts: null,
        shipment_date: new Date().toISOString().replace("Z", "+00:00"),
      };

      const response = await fetch("/api/shipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shipmentData),
      });

      const data = await response.json();
      if (data.error) {
        toast.error(`Failed to fetch rates: ${data.error}`);
        setShipment(null);
        return;
      }

      setShipment(data);
      toast.success("Shipping rates fetched!");
    } catch (error) {
      toast.error("Error fetching rates: " + error.message);
      console.error("Error fetching rates:", error);
      setShipment(null);
    } finally {
      setIsCreatingShipment(false);
    }
  };

  // =========================================================
  // 4) Create Shipment (Finalize)
  // =========================================================
  const handleCreateShipment = async () => {
    if (!selectedRate) {
      toast.warn("Please select a shipping method first!");
      return;
    }
    // For demonstration, just show a toast
    toast.success("Shipment created with selected rate!");
  };

  // =========================================================
  // 5) Track Shipment
  // =========================================================
  const handleTrackShipment = async () => {
    if (!selectedRate) {
      toast.warn("Please select a shipping rate first!");
      return;
    }
    try {
      setIsTracking(true);

      const carrierMapping = {
        UPS: "ups",
        USPS: "usps",
        FEDEX: "fedex",
        DHL: "dhl",
        DEFAULT: "shippo",
      };
      const providerKey = (selectedRate.provider || "").toUpperCase();
      const carrier = carrierMapping[providerKey] || carrierMapping.DEFAULT;
      // For demo, we use a fake tracking number
      const trackingNumber = "SHIPPO_TRANSIT";

      const response = await fetch(
        `/api/track?carrier=${carrier}&tracking=${trackingNumber}`
      );
      const data = await response.json();

      if (data.error) {
        setTrackingError(data.error);
        setTrackingInfo(null);
        toast.error(`Tracking error: ${data.error}`);
      } else {
        setTrackingInfo(data);
        setTrackingError("");
        toast.success("Tracking info loaded!");
      }
    } catch (error) {
      console.error("Error tracking shipment:", error);
      setTrackingError("An error occurred while tracking shipment.");
      setTrackingInfo(null);
      toast.error("An error occurred while tracking shipment.");
    } finally {
      setIsTracking(false);
    }
  };

  // =========================================================
  // 6) Address Handlers (with recommended_address)
  // =========================================================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReceiver((prev) => ({ ...prev, [name]: value }));
  };

  // We'll call the Shippo address validation endpoint.
  // This endpoint returns "recommended_address" in the shape:
  // {
  //   "recommended_address": {
  //     "address_line_1": "...",
  //     "address_line_2": "...",
  //     "city_locality": "...",
  //     "state_province": "...",
  //     "postal_code": "...",
  //     ...
  //   }
  // }
  const handleAddressChangeAndSuggest = async (e) => {
    handleInputChange(e);

    const updatedValue = e.target.value;
    // Only attempt to validate if user typed at least 5 chars
    if (updatedValue.length < 5) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      // Build the GET URL for address validation
      const url = new URL("https://api.goshippo.com/v2/addresses/validate");
      url.searchParams.set("name", `${receiver.firstName} ${receiver.lastName}`);
      url.searchParams.set("organization", "Shippo");
      url.searchParams.set("address_line_1", receiver.address ?? "");
      url.searchParams.set("address_line_2", receiver.address2 ?? "");
      url.searchParams.set("city_locality", receiver.city ?? "");
      url.searchParams.set("state_province", receiver.region ?? "");
      url.searchParams.set("postal_code", receiver.postalCode ?? "");
      url.searchParams.set("country_code", receiver.location ?? "US");

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Authorization: `ShippoToken ${SHIPPO_API_KEY}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recommended address from Shippo.");
      }

      const data = await response.json();

      // If Shippo provides a recommended address, place it in our suggestions
      // For example, data.recommended_address
      if (data.recommended_address) {
        // We'll store it as a single-element array
        setAddressSuggestions([data.recommended_address]);
        setShowSuggestions(true);
      } else {
        setAddressSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Error fetching recommended address:", error);
      setAddressSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // If the user selects the recommended address, fill out our fields
  const handleSelectSuggestedAddress = (suggestion) => {
    setReceiver((prev) => ({
      ...prev,
      address: suggestion.address_line_1 || prev.address,
      address2: suggestion.address_line_2 || prev.address2,
      city: suggestion.city_locality || prev.city,
      region: suggestion.state_province || prev.region,
      postalCode: suggestion.postal_code || prev.postalCode,
      location: suggestion.country_code || prev.location,
    }));

    setShowSuggestions(false);
  };

  // =========================================================
  // 7) Compute item subtotal, etc.
  // =========================================================
  const itemSubtotal = cartItems.reduce((sum, item) => {
    const itemPrice = parseFloat(item.price) || 0;
    return sum + itemPrice * item.quantity;
  }, 0);

  const shippingCost = selectedRate ? parseFloat(selectedRate.amount) : 0;
  const grandTotal = itemSubtotal + shippingCost;

  // Identify cheapest/fastest for tagging
  let minCost = Infinity;
  let minDays = Infinity;
  if (shipment?.rates?.length) {
    shipment.rates.forEach((rate) => {
      const cost = parseFloat(rate.amount) || Infinity;
      const days = rate.estimated_days ?? Infinity;
      if (cost < minCost) minCost = cost;
      if (days < minDays) minDays = days;
    });
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />

      <div className="max-w-7xl mx-auto mt-36 px-4 md:px-0">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">     
          Secure Checkout
        </h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* =========================================== */}
          {/* LEFT: Delivery & Shipping Method */}
          {/* =========================================== */}
          <div className="w-full md:w-2/3 bg-white border rounded-lg shadow-md p-6 space-y-6">
            {/* 1) Delivery / Address Info */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                1) Delivery
              </h2>

              {/* Email, first & last name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={receiver.firstName}
                      onChange={handleInputChange}
                      className="border rounded w-full px-3 py-2"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={receiver.lastName}
                      onChange={handleInputChange}
                      className="border rounded w-full px-3 py-2"
                    />
                  </div>
                </div>
              </div>

              {/* Address line 1 & 2 (with recommended-address dropdown) */}
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
                ref={suggestionsRef}
              >
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={receiver.address}
                    onChange={handleAddressChangeAndSuggest}
                    className="border rounded w-full px-3 py-2"
                    autoComplete="off"
                  />

                  {/* Suggestions dropdown (1 recommended address) */}
                  {showSuggestions && addressSuggestions.length > 0 && (
                    <ul className="absolute z-10 bg-white border border-gray-200 w-full mt-1">
                      {addressSuggestions.map((suggest, idx) => (
                        <li
                          key={idx}
                          className="p-2 cursor-pointer hover:bg-gray-100 text-sm"
                          onClick={() => handleSelectSuggestedAddress(suggest)}
                        >
                          {/* Show complete_address if available, otherwise combine fields */}
                          {suggest.complete_address
                            ? suggest.complete_address
                            : `${suggest.address_line_1}, ${suggest.city_locality}, ${suggest.state_province} ${suggest.postal_code}`}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address 2 (Optional)
                  </label>
                  <input
                    type="text"
                    name="address2"
                    value={receiver.address2}
                    onChange={handleInputChange}
                    className="border rounded w-full px-3 py-2"
                  />
                </div>
              </div>

              {/* Postal code, city, region, phone, country */}
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={receiver.postalCode}
                    onChange={handleInputChange}
                    className="border rounded w-full px-3 py-2"
                  />
                </div>
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
                    Region (State/Province)
                  </label>
                  <input
                    type="text"
                    name="region"
                    value={receiver.region}
                    onChange={handleInputChange}
                    className="border rounded w-full px-3 py-2"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location (Country)
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={receiver.location}
                    onChange={handleInputChange}
                    className="border rounded w-full px-3 py-2"
                  />
                </div>
              </div>
            </div>

            {/* 2) Delivery Method (rates) */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                2) Delivery Method
              </h2>
              {!shipment && (
                <p className="text-sm text-gray-500 mb-2">
                  Enter a valid address to see available delivery methods.
                </p>
              )}
              {shipment && shipment.rates && shipment.rates.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b bg-gray-100">
                        <th className="py-2 px-3 text-left">Delivery Method</th>
                        <th className="py-2 px-3 text-left">Est. Arrival</th>
                        <th className="py-2 px-3 text-left">Shipping Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shipment.rates.map((rate) => {
                        const isSelected =
                          selectedRate?.object_id === rate.object_id;
                        const cost = parseFloat(rate.amount);
                        const days = rate.estimated_days;

                        return (
                          <tr
                            key={rate.object_id}
                            onClick={() => setSelectedRate(rate)}
                            className={`border-b cursor-pointer ${
                              isSelected ? "bg-blue-50" : ""
                            }`}
                          >
                            <td className="py-3 px-3">
                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  name="shippingRate"
                                  checked={isSelected}
                                  onChange={() => setSelectedRate(rate)}
                                  className="mr-2"
                                />
                                <div>
                                  <div className="font-semibold">
                                    {rate.servicelevel?.display_name ||
                                      rate.servicelevel?.name ||
                                      rate.servicelevel?.token}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {rate.servicelevel?.token?.includes("EXPRESS")
                                      ? "No additional import charges at delivery"
                                      : "Import charges collected upon delivery"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              {days ? `${days} business days` : "—"}
                            </td>
                            <td className="py-3 px-3">
                              {cost ? `$${cost.toFixed(2)}` : "—"}
                              {/* Show tags */}
                              <span className="ml-2 inline-block text-xs font-semibold text-gray-600">
                                {cost === minCost && "Cheapest "}
                                {days === minDays && "Fastest"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Buttons (Create / Track) */}
            <div className="pt-4 flex flex-col md:flex-row gap-3">
              <button
                onClick={handleCreateShipment}
                disabled={!selectedRate || isCreatingShipment}
                className={`bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-md flex items-center justify-center ${
                  (!selectedRate || isCreatingShipment)
                    ? "opacity-80 cursor-not-allowed"
                    : ""
                }`}
              >
                {isCreatingShipment && (
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                )}
                {isCreatingShipment
                  ? "Please wait..."
                  : "Proceed to Pay"}
              </button>

              {/* {shipment && shipment.rates && shipment.rates.length > 0 && (
                <button
                  onClick={handleTrackShipment}
                  disabled={isTracking}
                  className={`bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-md flex items-center justify-center ${
                    isTracking ? "opacity-80 cursor-not-allowed" : ""
                  }`}
                >
                  {isTracking && (
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                  )}
                  {isTracking ? "Tracking..." : "Track Shipment"}
                </button>
              )} */}
            </div>
          </div>
          {/* =========================================== */}
          {/* RIGHT: Order Summary */}
          {/* =========================================== */}
          <div className="w-full md:w-1/3 space-y-6">
            <div className="bg-white border rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Your Order
              </h2>
              {cartItems.length === 0 ? (
                <p className="text-gray-500">No items in cart.</p>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 border-b pb-4"
                    >
                      {/* Product Image */}
                      <div className="w-16 h-16 flex-shrink-0 border border-gray-200">
                        {item.images && item.images[0] ? (
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full bg-gray-100">
                            <span className="text-xs text-gray-500">
                              No Image
                            </span>
                          </div>
                        )}
                      </div>
                      {/* Product Info */}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      {/* Price */}
                      <div>
                        <p className="font-semibold text-gray-700">
                          $
                          {(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="bg-white border rounded-lg shadow-md p-6">
              <div className="flex justify-between mb-2">
                <p className="text-gray-700">Items</p>
                <p className="font-medium text-gray-700">
                  ${itemSubtotal.toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-gray-700">Shipping</p>
                <p className="font-medium text-gray-700">
                  {selectedRate ? `$${shippingCost.toFixed(2)}` : "—"}
                </p>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between mb-4">
                <p className="text-lg font-semibold text-gray-800">Total</p>
                <p className="text-lg font-semibold text-gray-800">
                  ${grandTotal.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================== */}
        {/* Tracking Info (If any) */}
        {/* =========================================== */}
        <div className="mt-6">
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
                  <strong>Tracking Number:</strong>{" "}
                  {trackingInfo.tracking_number}
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

              {/* Address From / To */}
              <div className="grid gap-4 md:grid-cols-2 mb-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Address From
                  </h3>
                  <p className="text-gray-700 text-sm">
                    {trackingInfo.address_from?.city},{" "}
                    {trackingInfo.address_from?.state}{" "}
                    {trackingInfo.address_from?.zip},{" "}
                    {trackingInfo.address_from?.country}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Address To
                  </h3>
                  <p className="text-gray-700 text-sm">
                    {trackingInfo.address_to?.city},{" "}
                    {trackingInfo.address_to?.state}{" "}
                    {trackingInfo.address_to?.zip},{" "}
                    {trackingInfo.address_to?.country}
                  </p>
                </div>
              </div>

              {/* Tracking History */}
              <h3 className="font-semibold text-gray-700 mb-2">
                Tracking History
              </h3>
              {trackingInfo.tracking_history &&
              trackingInfo.tracking_history.length > 0 ? (
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
                <p className="text-gray-500 text-sm">
                  No tracking history available.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
