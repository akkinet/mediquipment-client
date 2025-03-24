"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SHIPPO_API_KEY = process.env.NEXT_PUBLIC_SHIPPO_API_KEY;

export default function BorderfreeStyleCheckout() {
  // =========================================================
  // 1) State
  // =========================================================
  const router = useRouter();
  const [receiver, setReceiver] = useState({
    email: "",
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
  const [parcels, setParcels] = useState([]);
  const [shipment, setShipment] = useState(null);
  const [selectedRate, setSelectedRate] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // This tracks whether we’re busy fetching rates or finalizing the checkout
  const [isFetchingRates, setIsFetchingRates] = useState(false);
  const [isCreatingShipment, setIsCreatingShipment] = useState(false);

  // For address suggestions
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
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
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
    if (
      receiver.address &&
      receiver.city &&
      receiver.region &&
      receiver.postalCode
    ) {
      fetchRates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiver, parcels]);

  const fetchRates = async () => {
    try {
      setIsFetchingRates(true);
      setSelectedRate(null);

      const shipmentData = {
        address_from: {
          name: "Jkare",
          street1: "4101 SW 73rd Ave",
          city: "Miami",
          state: "FL",
          zip: "33155-4520",
          country: "US",
          email: "akash@hexerve.com",
          phone: "+13052481003",
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
      setIsFetchingRates(false);
    }
  };

  // =========================================================
  // 4) Stripe Checkout
  // =========================================================
  const handleProceedToPayment = async () => {
    // If user clicks without selecting any shipping option
    if (!selectedRate) {
      toast.warn("Please select any one delivery option to proceed for payment!");
      return;
    }

    try {
      setIsCreatingShipment(true);

      let checkoutObj = JSON.parse(localStorage.getItem("checkoutStorage"));

      if(!checkoutObj.email)
        checkoutObj.email = receiver.email;

      checkoutObj.selectedRate = selectedRate;
      const checkoutResponse = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({...checkoutObj,
          metadata: {...checkoutObj.metadata, shipping_rate: selectedRate.object_id},
          name: receiver.firstName.trim() + " " + receiver.lastName.trim(),
          address: {
            line1: receiver.address,
            line2: receiver.address2,
            city: receiver.city,
            state: receiver.region,
            postal_code: receiver.postalCode,
            country: receiver.location,
          },
        }),
      });

      if (!checkoutResponse.ok) {
        throw new Error("Failed to initiate Stripe checkout.");
      }

      const { session } = await checkoutResponse.json();

      router.push(session.url);
    } catch (error) {
      toast.error("Error redirecting to payment: " + error.message);
      console.error(error);
    } finally {
      setIsCreatingShipment(false);
    }
  };
  // =========================================================
  // 6) Address Handlers (with recommended_address)
  // =========================================================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReceiver((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChangeAndSuggest = async (e) => {
    handleInputChange(e);
    const updatedValue = e.target.value;
    if (updatedValue.length < 5) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
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
      if (data.recommended_address) {
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
  // 7) Compute item subtotal, shipping, tax, etc.
  // =========================================================
  const itemSubtotal = cartItems.reduce((sum, item) => {
    const itemPrice = parseFloat(item.price) || 0;
    return sum + itemPrice * item.quantity;
  }, 0);

  const shippingCost = selectedRate ? parseFloat(selectedRate.amount) : 0;
  const grandTotal = itemSubtotal + shippingCost;

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
                  {/* If fetching suggestions, show them */}
                  {showSuggestions && addressSuggestions.length > 0 && (
                    <ul className="absolute z-10 bg-white border border-gray-200 w-full mt-1">
                      {addressSuggestions.map((suggest, idx) => (
                        <li
                          key={idx}
                          className="p-2 cursor-pointer hover:bg-gray-100 text-sm"
                          onClick={() => handleSelectSuggestedAddress(suggest)}
                        >
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

              {/* If we're currently fetching shipping rates, show a "loading" card */}
              {isFetchingRates && !shipment && (
                <div className="flex items-center justify-center bg-gray-50 border border-gray-200 p-4 rounded-md mb-4">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-blue-600"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.383 0 0 5.383 0 12h4z"
                    ></path>
                  </svg>
                  <span className="text-gray-700">Fetching shipping rates. Please wait...</span>
                </div>
              )}

              {!shipment && !isFetchingRates && (
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

            {/* Buttons */}
            <div className="pt-4 flex flex-col md:flex-row gap-3">
              <button
                onClick={handleProceedToPayment}
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
                {isCreatingShipment ? "Please wait..." : "Proceed to Pay"}
              </button>
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
                          ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Totals (Items, Shipping, Tax placeholder, Grand Total) */}
            <div className="bg-white border rounded-lg shadow-md p-6">
              {/* Items */}
              <div className="flex justify-between mb-2">
                <p className="text-gray-700">Items</p>
                <p className="font-medium text-gray-700">
                  ${itemSubtotal.toFixed(2)}
                </p>
              </div>

              {/* Shipping */}
              <div className="flex justify-between mb-2">
                <p className="text-gray-700">Shipping</p>
                <p className="font-medium text-gray-700">
                  {selectedRate
                    ? `$${shippingCost.toFixed(2)}`
                    : "—"}
                </p>
              </div>

              {/* Taxes */}
              <div className="flex justify-between mb-2">
                <p className="text-gray-700">Taxes</p>
                <p className="font-medium text-gray-700 text-sm italic">
                  Yet to be calculated while payment
                </p>
              </div>

              <hr className="my-2" />

              {/* Grand Total */}
              <div className="flex justify-between mb-4">
                <p className="text-lg font-semibold text-gray-800">Total</p>
                <p className="text-lg font-semibold text-gray-800">
                  ${grandTotal.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
