"use client";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const EditProfile = () => {
  let localUser = typeof window !== 'undefined' && window.localStorage.getItem("nextUser");
  localUser = JSON.parse(localUser);
  const [name, setName] = useState(localUser ? localUser.fullName : "");
  const [phone, setPhone] = useState(localUser ? localUser.phone : "");
  const [address, setAddress] = useState(localUser ? localUser.address : null);
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

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value.trim();
    if(!isNaN(val))
      setPhone(val);
  };

  const handleAddressChange = (e) => {
    const {name, value} = e.target;

    setAddress({
      ...address,
      [name]: name == "postal_code" ? (!isNaN(value.trim()) ? value.trim() : "") : value
    })
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
      let imgData = null;
      if (file) {
        const formData = new FormData();
        formData.set("profile", file);

        const imgRes = await fetch("/api/user/image", {
          method: "POST",
          body: formData,
        });
        imgData = await imgRes.json();
      }

      if(name == "" || phone == "" || !address || address?.country == "" || address?.state == "" || address?.city == "" || address?.postal_code == "" || address?.line1 == ""){
        toast.error("Some fields are missing!");
        return;
      }

      const userData = {
        fullName: name,
        phone,
        address
      };

      if (imgData?.success) 
        userData.image = imgData.secureUrl;

      const res = await fetch(`/api/user/update/${localUser.username}`, {
        method: "PUT",
        body: JSON.stringify({ ...userData, createdAt: localUser.createdAt}),
      });

      await res.json();
      const updatedSession = {
        ...session,
        user: {
          ...session.user,
          ...userData,
          name
        },
      };
      window.localStorage.setItem(
        "nextUser",
        JSON.stringify({
          ...session.user,
          ...userData,
          fullName: name
        })
      );
      await update(updatedSession);

      toast.success("Data updated successfully!");
    } catch (err) {
      console.error("err", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-20 py-15 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="bg-white shadow-xl shadow-teal-300/60 rounded-lg p-8 w-full md:w-4/5 mx-auto border-2 border-teal-400 ">
        <h2 className="text-2xl font-semibold mb-6 text-center md:text-left">
          Edit your Profile
        </h2>
        <div className="flex flex-col md:flex-row">
          <div className="flex flex-col items-center mb-6 md:mb-0 md:w-1/3">
            <img
              src={profilePhoto}
              alt="Profile Photo"
              className="rounded-full w-24 h-24 md:w-32 md:h-32 mb-4 object-contain object-center"
            />
            <button
              onClick={triggerPhotoUpload}
              className="bg-teal-400 text-white py-2 px-4 rounded"
            >
              CHANGE PHOTO
            </button>
            <input
              type="file"
              id="profilePhotoInput"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>
          <div className="md:w-2/3 md:pl-8">
            <form
              encType="multipart/form-data"
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your First Name"
                />
              </div>
              <div>
                <label className="block text-gray-700">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your Phone Number"
                />
              </div>
              <div>
                <label className="block text-gray-700">Line 1</label>
                <input
                  type="text"
                  value={address?.line1}
                  name="line1"
                  onChange={handleAddressChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your Address"
                />
              </div>
              <div>
                <label className="block text-gray-700">Line 2</label>
                <input
                  type="text"
                  value={address?.line2}
                  name="line2"
                  onChange={handleAddressChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your Address"
                />
              </div>
              <div>
                <label className="block text-gray-700">City</label>
                <input
                  type="text"
                  name="city"
                  value={address?.city}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your City"
                />
              </div>
              <div>
                <label className="block text-gray-700">State</label>
                <input
                  type="text"
                  name="state"
                  value={address?.state}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your State"
                />
              </div>
              <div>
                <label className="block text-gray-700">Zip Code</label>
                <input
                  type="text"
                  name="postal_code"
                  value={address?.postal_code}
                  maxLength={6}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your Zip Code"
                />
              </div>
              <div>
                <label className="block text-gray-700">Country</label>
                <input
                  type="text"
                  name="country"
                  value={address?.country}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your Country"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  className="bg-teal-400 text-white py-2 px-4 rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
