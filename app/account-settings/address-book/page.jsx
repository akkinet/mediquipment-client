"use client";
import React, { useState } from "react";

const AddressBook = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "shivam awasthi",
      flat: "Hno - 48/4, street no 3F",
      area: "chandan vihar , nehru gali",
      city: "NEW DELHI",
      state: "DELHI",
      pincode: "110084",
      phone: "9958241284",
      isDefault: true,
    },
    {
      id: 2,
      name: "V.S. power tools",
      flat: "137/3/1, Shop No 4/5",
      area: "Nehru Gali, Chandan Vihar, Sant Nagar Burari",
      city: "NEW DELHI",
      state: "DELHI",
      pincode: "110084",
      phone: "9958241284",
      isDefault: false,
    },
    {
      id: 3,
      name: "Hexerve Solutions",
      flat: "Noida sector 122 , ",
      area: "Nehru Gali, Chandan Vihar, Sant Nagar Burari",
      city: "NEW DELHI",
      state: "DELHI",
      pincode: "110084",
      phone: "9958241284",
      isDefault: false,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    pincode: "",
    flat: "",
    area: "",
    landmark: "",
    city: "",
    state: "",
    isDefault: false,
  });

  // Open Add Modal
  const handleAddClick = () => {
    setShowModal(true);
    setIsEditMode(false);
    setFormData({
      name: "",
      phone: "",
      pincode: "",
      flat: "",
      area: "",
      landmark: "",
      city: "",
      state: "",
      isDefault: false,
    });
  };

  // Open Edit Modal
  const handleEditClick = (address) => {
    setShowModal(true);
    setIsEditMode(true);
    setEditId(address.id);
    setFormData({ ...address });
  };

  // Save Address (Add or Edit)
  const handleSaveAddress = () => {
    // Validate required fields
    const requiredFields = ["name", "phone", "pincode", "flat", "area", "city", "state"];
    const isFormValid = requiredFields.every((field) => formData[field]?.trim() !== "");
  
    if (!isFormValid) {
      alert("Please fill in all required fields before saving the address.");
      return; // Stop further execution
    }
  
    if (isEditMode) {
      // Update the existing address
      setAddresses((prevAddresses) => {
        const updatedAddresses = prevAddresses.map((addr) =>
          addr.id === editId ? { ...formData, id: editId } : addr
        );
  
        // If the edited address is set as default, reset other defaults
        if (formData.isDefault) {
          return updatedAddresses
            .map((addr) => ({
              ...addr,
              isDefault: addr.id === editId, // Only the edited address is default
            }))
            .sort((a, b) => (a.isDefault ? -1 : 1)); // Move default to top
        }
  
        return updatedAddresses;
      });
    } else {
      // If adding a new address
      let newAddress = { ...formData, id: addresses.length + 1 };
  
      // If the new address is set as default
      if (formData.isDefault) {
        newAddress = { ...newAddress, isDefault: true };
        setAddresses((prevAddresses) =>
          [
            ...prevAddresses.map((addr) => ({ ...addr, isDefault: false })), // Unset previous defaults
            newAddress,
          ].sort((a, b) => (a.isDefault ? -1 : 1)) // Sort to move default address to top
        );
      } else {
        setAddresses([...addresses, newAddress]);
      }
    }
    setShowModal(false);
  };
  


  const confirmDeleteAddress = () => {
    setAddresses(addresses.filter((addr) => addr.id !== addressToDelete));
    setShowConfirmDelete(false); // Close the modal after deletion
    setAddressToDelete(null); // Reset the address to delete
  };



  // Remove Address
  const handleRemoveAddress = (id) => {
    setAddressToDelete(id);
    setShowConfirmDelete(true);
  };

  // Set as Default Address
  const handleSetDefault = (id) => {
    setAddresses((prevAddresses) =>
      prevAddresses
        .map((addr) => ({ ...addr, isDefault: addr.id === id }))
        .sort((a, b) => (a.isDefault ? -1 : 1)) // Move default to the top
    );
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  return (
    <div className="p-6 my-32 w-full h-full">
      <h2 className="text-2xl font-semibold mb-4">Your Addresses</h2>
      <div className="flex gap-6 flex-wrap">
        <div
          onClick={handleAddClick}
          className="border-dashed border-2 border-gray-300 rounded-md w-80  flex items-center justify-center cursor-pointer min-h-[250px]"
        >
          <div className="text-center">
            <p className="text-6xl text-gray-300">+</p>
            <p className="text-gray-600 font-semibold text-2xl"> Add address</p>
          </div>
        </div>
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`border p-4 rounded-md w-80 min-h-[250px] flex flex-col justify-between shadow-[4px_4px_12px_0px_rgba(0,_0,_0,_0.1)]
              ${address.isDefault ? "border-customBlue" : "border-gray-300"
              }`}
          >

            {address.isDefault && (
              <div className="text-customPink font-semibold mb-2">Default</div>
            )}
            <div className="flex-1">
              <h3 className="font-bold mb-2">{address.name}</h3>
              <p className="mb-1">
                {address.flat}, {address.area}
              </p>

              <p className="mb-1">
                {address.city}, {address.state} {address.pincode}
              </p>
              {address.landmark && (
                <p className="mb-1">
                  Landmark: {address.landmark}
                </p>
              )}
              <p>Phone number: {address.phone}</p>
            </div>


            <div className="flex gap-4 mt-auto pt-4">

              <button
                className="text-customBlue"
                onClick={() => handleEditClick(address)}
              >
                Edit
              </button>
              <button
                className="text-red-600 border-l-2 border-customBlue pl-4"
                onClick={() => handleRemoveAddress(address.id)}
              >
                Remove
              </button>

              {!address.isDefault && (
                <button
                  className="text-customBlue border-l-2 border-customBlue pl-4"
                  onClick={() => handleSetDefault(address.id)}
                >
                  Set as Default
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Adding/Editing Address */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white p-6 rounded-md w-[400px] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              &#x2715;
            </button>

            <h3 className="text-xl font-semibold mb-4">
              {isEditMode ? "Edit Address" : "Add a new address"}
            </h3>
            <form>
              <input
                type="text"
                name="name"
                placeholder="Full name"
                value={formData.name}
                className="border p-2 w-full mb-2"
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="phone"
                placeholder="Mobile number"
                value={formData.phone}
                className="border p-2 w-full mb-2"
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={formData.pincode}
                className="border p-2 w-full mb-2"
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="flat"
                placeholder="Flat, House no., Building, Company"
                value={formData.flat}
                className="border p-2 w-full mb-2"
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="area"
                placeholder="Area, Street, Sector, Village"
                value={formData.area}
                className="border p-2 w-full mb-2"
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="landmark"
                placeholder="Landmark"
                value={formData.landmark}
                className="border p-2 w-full mb-2"
                onChange={handleInputChange}
              />
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  name="city"
                  placeholder="Town/City"
                  value={formData.city}
                  className="border p-2 w-1/2"
                  onChange={handleInputChange}
                />
                <select
                  name="state"
                  className="border p-2 w-1/2"
                  value={formData.state}
                  onChange={handleInputChange}
                >
                  <option value="">Choose a state</option>
                  <option value="DELHI">DELHI</option>
                  <option value="UP">Uttar Pradesh</option>
                  <option value="HARYANA">Haryana</option>
                </select>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                />
                Make this my default address
              </label>
              <button
                type="button"
                onClick={handleSaveAddress}
                className="bg-yellow-500 text-white px-4 py-2 mt-4 w-full rounded-md"
              >
                {isEditMode ? "Save Changes" : "Add address"}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Confirm Deletion Modal */}
      {showConfirmDelete && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          onClick={() => setShowConfirmDelete(false)} // Close modal on outside click
        >
          <div
            className="bg-white p-6 rounded-md w-[400px] relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-4">Are you sure you want to delete this address?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAddress}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AddressBook;
