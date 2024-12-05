"use client";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

const EditProfile = () => {
  let localUser =
    typeof window !== "undefined" && window.localStorage.getItem("nextUser");
  localUser = JSON.parse(localUser);

  const [name, setName] = useState(localUser ? localUser.fullName : "");
  const [activeOption, setActiveOption] = useState("/profile-detail");
  const [phone, setPhone] = useState(localUser ? localUser.phone : "");
  const [address, setAddress] = useState(localUser ? localUser.address : {});
  const [profilePhoto, setProfilePhoto] = useState(
    localUser?.image ??
      "https://s3.ap-south-1.amazonaws.com/medicom.hexerve/profilelogo.png"
  ); // Default profile photo
  const [file, setFile] = useState(null);

  const { data: session, update, status } = useSession();
  const router = useRouter();
  const pageTitle = "Profile Detail";

  useEffect(() => {
    document.title = pageTitle;
    if (status == "unauthenticated") {
      router.push("/login");
      return;
    }
  }, [pageTitle]);

  const handleNavigation = (path) => {
    setActiveOption(path); // Update the active option
    router.push(path);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value.trim();
    if (!isNaN(val)) setPhone(val);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress({
      ...address,
      [name]:
        name === "postal_code"
          ? !isNaN(value.trim())
            ? value.trim()
            : ""
          : value,
    });
  };

  const handlePhotoChange = async (e) => {
    const fileInput = e.target.files?.[0];
    setFile(fileInput);
    setProfilePhoto(URL.createObjectURL(fileInput));
  };

  const triggerPhotoUpload = () => {
    document.getElementById("profilePhotoInput").click();
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (
        name === "" ||
        phone === "" ||
        !address ||
        address?.country === "" ||
        address?.state === "" ||
        address?.city === "" ||
        address?.postal_code === "" ||
        address?.line1 === ""
      ) {
        toast.error("Some fields are missing!");
        return;
      }

      const formData = new FormData();
      if(file)
        formData.append("profile", file);

      formData.append("fullName", name);
      formData.append("address", JSON.stringify(address));
      formData.append("phone", phone);
      formData.append("updatedAt", new Date().toLocaleString());
      formData.append("createdAt", localUser.createdAt);

      const res = await fetch(`/api/user/update/${localUser.username}`, {
        method: "PUT",
        body: formData,
      });

      const updatedUser = await res.json();
      delete formData.delete("profile");
      const updatedSession = {
        ...session,
        user: {
          ...session.user,
          name,
          ...updatedUser.user
        },
      };
      await update(updatedSession);
      window.localStorage.setItem(
        "nextUser",
        JSON.stringify({
          ...session.user,
          ...updatedUser.user

        })
      );

      toast.success("Data updated successfully!");
    } catch (err) {
      console.error("err", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-32 py-10 px-6 sm:px-8 lg:px-10">
      <ToastContainer />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Breadcrumb and Sidebar */}
        <div className="col-span-1 space-y-6">
          <div className="flex items-center space-x-2 cursor-pointer text-customPink hover:text-customBlue">
            <FaArrowLeft />
            <button onClick={() => router.push("/")}>Back to Home</button>
          </div>
          <div className="bg-white shadow-lg rounded-md p-4">
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li
                onClick={() => handleNavigation("/profile-detail")}
                className={`cursor-pointer text-customPink hover:text-customBlue hover:underline ${
                  activeOption === "/profile-detail"
                    ? "border-l-4 border-black font-bold"
                    : "border-l-4 border-transparent"
                }`}
              >
                Edit Profile
              </li>
              <li
                onClick={() => handleNavigation("/order-history")}
                className={`cursor-pointer text-customPink hover:text-customBlue hover:underline ${
                  activeOption === "/order-history"
                    ? "border-l-4 border-black font-bold"
                    : "border-l-4 border-transparent"
                }`}
              >
                My Orders
              </li>
              <li
                onClick={() => handleNavigation("/address-book")}
                className={`cursor-pointer text-customPink hover:text-customBlue hover:underline ${
                  activeOption === "/address-book"
                    ? "border-l-4 border-black font-bold"
                    : "border-l-4 border-transparent"
                }`}
              >
                Address Book
              </li>
              <li
                onClick={() => handleNavigation("/gift-card")}
                className={`cursor-pointer text-customPink hover:text-customBlue hover:underline ${
                  activeOption === "/gift-card"
                    ? "border-l-4 border-black font-bold"
                    : "border-l-4 border-transparent"
                }`}
              >
                Gift Card
              </li>
            </ul>
          </div>
        </div>

        {/* Edit Profile Section */}
        <div className="col-span-1 lg:col-span-3">
          <div className="bg-white shadow-xl rounded-lg p-8 border">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Edit Profile
            </h2>
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Profile Photo Section */}
              <div className="flex flex-col items-center lg:w-1/3">
                <img
                  src={profilePhoto}
                  alt="Profile Photo"
                  className="rounded-full w-32 h-32 mb-4 object-cover border"
                />
                <button
                  onClick={triggerPhotoUpload}
                  className="bg-customPink text-white py-2 px-6 rounded-md"
                >
                  Change Photo
                </button>
                <input
                  type="file"
                  id="profilePhotoInput"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>
              {/* Form Section */}
              <div className="lg:w-2/3">
                <form
                  encType="multipart/form-data"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-gray-600 mb-1">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={handleNameChange}
                      className="block w-full border rounded-md px-4 py-2 shadow-sm"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={handlePhoneChange}
                      className="block w-full border rounded-md px-4 py-2 shadow-sm"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      value={address?.line1}
                      name="line1"
                      onChange={handleAddressChange}
                      className="block w-full border rounded-md px-4 py-2 shadow-sm"
                      placeholder="Address line 1"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">
                      {" "}
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={address?.line2}
                      name="line2"
                      onChange={handleAddressChange}
                      className="block w-full border rounded-md px-4 py-2 shadow-sm"
                      placeholder="Address line 2"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-600 mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={address?.city}
                        onChange={handleAddressChange}
                        className="block w-full border rounded-md px-4 py-2 shadow-sm"
                        placeholder="Enter city"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1">State</label>
                      <input
                        type="text"
                        name="state"
                        value={address?.state}
                        onChange={handleAddressChange}
                        className="block w-full border rounded-md px-4 py-2 shadow-sm"
                        placeholder="Enter state"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-600 mb-1">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        name="postal_code"
                        value={address?.postal_code}
                        maxLength={6}
                        onChange={handleAddressChange}
                        className="block w-full border rounded-md px-4 py-2 shadow-sm"
                        placeholder="Enter postal code"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={address?.country}
                        onChange={handleAddressChange}
                        className="block w-full border rounded-md px-4 py-2 shadow-sm"
                        placeholder="Enter country"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-customPink text-white py-2 px-6 rounded-md"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
