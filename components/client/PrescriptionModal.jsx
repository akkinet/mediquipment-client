import { useEffect, useRef, useState, memo } from "react";
import { useRouter } from "next/navigation";

function PrescriptionModal({ cart, isModalOpen, setIsModalOpen, email }) {
  const [uploadLater, setUploadLater] = useState(false); // New state for uploading prescription later
  const [sameFileForAll, setSameFileForAll] = useState(false);
  const [insuranceOption, setInsuranceOption] = useState("no-insurance"); // State for insurance options
  const [selectedInsurance, setSelectedInsurance] = useState(""); // Selected insurance company
  const [insuranceFile, setInsuranceFile] = useState(null); // Insurance file
  const [isCheckoutDisabled, setIsCheckoutDisabled] = useState(true); // Insurance file
  const [sameFile, setSameFile] = useState(null);
  const [prescriptionItems, setPrescriptionItems] = useState(
    cart.length > 0 ? cart.filter((item) => item.prescription) : []
  );
  const fileInputRefs = useRef([]);
  const sameRef = useRef(null);
  const router = useRouter();

  const checkDisabled = (later, file) => {
    const full =
      fileInputRefs.current.length > 0 &&
      fileInputRefs.current.every((file) => file && file.value != "");
    if (full || file || later || prescriptionItems.length == 0)
      setIsCheckoutDisabled(false);
    else setIsCheckoutDisabled(true);
  };

  useEffect(() => {
    checkDisabled(uploadLater, sameFile);
  }, [fileInputRefs, uploadLater, sameFile, prescriptionItems, isModalOpen]);

  if (!isModalOpen) return;

  const clearList = () => {
    if (fileInputRefs.current.length > 0)
      for (const file of fileInputRefs.current) file.value = "";
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const duplicate = [...prescriptionItems];
        const target = duplicate[index];
        duplicate[index] = {
          ...target,
          file: {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            filePreview: reader.result,
          },
        };

        setPrescriptionItems(duplicate);
      };

      reader.readAsDataURL(file);
      fileInputRefs.current[index] = file;
    }
  };

  const sameUploadHandler = () => {
    setSameFileForAll(!sameFileForAll);
    if (!sameFileForAll) {
      setUploadLater(false); // Uncheck the uploadLater option if this is checked
      const duplicate = [...prescriptionItems];

      for (const c of duplicate) {
        if (c.file) {
          delete c.file;
        }
      }

      setPrescriptionItems(duplicate);
    } else {
      setSameFile(null);
      if (sameRef.current) sameRef.current.value = "";
    }

    clearList();
  };

  const updloadLaterHandler = () => {
    setUploadLater(!uploadLater);
    if (!uploadLater) {
      const duplicate = [...prescriptionItems];
      for (const c of duplicate) {
        if (c.file) delete c.file;
      }
      setPrescriptionItems(duplicate);
      setSameFileForAll(false); // Uncheck the sameFileForAll option if this is checked
      setSameFile(null);
      if (sameRef.current) sameRef.current.value = "";
    }

    clearList();
  };

  const handleInsuranceUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setInsuranceFile({
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          filePreview: reader.result,
        });
      };

      reader.readAsDataURL(file);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsCheckoutDisabled(true);
  };

  const checkoutHandler = async () => {
    let lineItems = [],
      metadata = {};
    let file = "";
    const metaProd = {};

    if(insuranceOption == "upload" && (!insuranceFile || selectedInsurance == "")){
        alert("missing fields!");
        return;
    }

    if (prescriptionItems.length > 0) {
      metadata.prescription_required = true;
      const uploadedAll = prescriptionItems.every((p) => p.file);
      metadata.prescription_status = sameFile
        ? "Received"
        : uploadedAll
        ? "Received"
        : "Pending";
      metadata.prescription_items = {};
    } else {
      metadata.prescription_required = false;
      metadata.prescription_status = "";
    }

    if (sameFileForAll && sameFile) {
      const formData = new FormData();
      formData.set("profile", sameFile);

      const imgRes = await fetch("/api/user/image", {
        method: "POST",
        body: formData,
      });
      const { secureUrl } = await imgRes.json();
      file = secureUrl;
    }

    for (const item of cart) {
      metaProd[item.title] = item.product_id;
      if (item.prescription) {
        const itemToUpdate = prescriptionItems.find(
          (c) => c.product_id == item.product_id
        );
        if (itemToUpdate?.file) {
          const res = await fetch("/api/upload", {
            method: "POST",
            body: JSON.stringify({ ...itemToUpdate.file }),
          });
          const { fileURL } = await res.json();
          file = fileURL;
        }
        metadata.prescription_items[item.product_id] = file;
      }

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            description: item.description,
            images: item.images,
          },
          unit_amount: item.price * 100,
        },
        quantity: parseInt(item.quantity),
        adjustable_quantity: {
          enabled: true,
        },
      });
    }

    if (metadata?.prescription_items)
      metadata.prescription_items = JSON.stringify(metadata.prescription_items);
    metadata.products = JSON.stringify(metaProd);
    const checkoutObj = {
      line_items: lineItems,
      metadata,
    };
    if (email) checkoutObj.email = email;

    if(insuranceOption == "upload"){
      const res = await fetch("/api/upload", {
        method: "POST",
        body: JSON.stringify(insuranceFile),
      });
      const { fileURL } = await res.json();
      const inc = fileURL;
      metadata.insurance_file = inc;
      metadata.insurance_company = selectedInsurance;
    }

    const checkoutResponse = await fetch("/api/stripe/checkout", {
      method: "POST",
      body: JSON.stringify(checkoutObj),
    });
    const { session } = await checkoutResponse.json();

    router.push(session.url);
  };

  const sameFileUploader = (e) => {
    const file = e.target.files[0];
    setSameFile(file);
  };

  return (
    <div className="fixed  !ml-0 z-50 flex items-center justify-center bg-black bg-opacity-50 w-[100vw] h-[100vh] top-0 left-0">
      <div className="bg-white w-full max-w-5xl p-6 rounded-lg shadow-lg relative">
        {prescriptionItems.length > 0 && (
          <>
            <h2 className="text-lg font-semibold mb-4">Upload Prescription</h2>
            <div
              className={`overflow-x-auto ${
                prescriptionItems.length > 3 ? "overflow-y-auto" : ""
              }`}
              style={{ maxHeight: "250px" }}
            >
              <table className="w-full border-collapse border border-gray-300">
                <thead className="sticky top-0 bg-white">
                  <tr>
                    <th className="border border-gray-300 p-2">S.no</th>
                    <th className="border border-gray-300 p-2">Image</th>
                    <th className="border border-gray-300 p-2">Product Name</th>
                    <th className="border border-gray-300 p-2">Price in $</th>
                    <th className="border border-gray-300 p-2">Quantity</th>
                    <th className="border border-gray-300 p-2">Upload</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptionItems.map((item, index) => (
                    <tr key={index} className="text-center">
                      <td className="border border-gray-300 p-2">
                        {index + 1}.
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="h-10 w-10 rounded-lg object-contain "
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        {item.title}
                      </td>
                      <td className="border border-gray-300 p-2">
                      {item.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {item.quantity}
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className=" flex items-center justify-center p-1 box-border">
                          <input
                            type="file"
                            ref={(el) => (fileInputRefs.current[index] = el)}
                            disabled={uploadLater || sameFileForAll}
                            onChange={(event) => handleFileChange(index, event)}
                            className=" file:rounded file:px-4 file:h-8 file:cursor-pointer file:bg-white file:border file:border-gray-400 file:shadow file:mr-4 file:transition file:duration-200 hover:file:bg-customBlue hover:file:text-white active:file:bg-gray-300"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Checkbox for same prescription */}
            {prescriptionItems.length > 1 && (
              <div className="flex justify-between">
                <div className="mt-4">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={sameFileForAll}
                      onChange={sameUploadHandler}
                    />
                    <span className="ml-2">
                      Use the same prescription for all items
                    </span>
                  </label>
                  <p className="text-xs text-red-500">
                    Upload at least one file to use the same prescription for
                    all items
                  </p>
                </div>
                {sameFileForAll && (
                  <div className="mt-4">
                    <input
                      type="file"
                      ref={sameRef}
                      onChange={sameFileUploader}
                      className=" file:rounded file:px-4 file:h-8 file:cursor-pointer file:bg-white file:border file:border-gray-400 file:shadow file:mr-4 file:transition file:duration-200 hover:file:bg-customBlue hover:file:text-white active:file:bg-gray-300"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Checkbox for upload prescription later */}
            <div className="mt-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={uploadLater}
                  onChange={updloadLaterHandler}
                />
                <span className="ml-2">Upload the prescription later</span>
              </label>
            </div>
          </>
        )}

        <div className="mt-4">
          <h2 className="text-lg font-semibold my-3">
            Choose insurance option
          </h2>
          <div className="mt-2">
            <label className="inline-flex items-center mr-4">
              <input
                type="radio"
                className="form-radio"
                value="upload"
                name="insurance"
                checked={insuranceOption === "upload"}
                onChange={() => setInsuranceOption("upload")}
              />
              <span className="ml-2">Upload Insurance</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                value="no-insurance"
                name="insurance"
                checked={insuranceOption === "no-insurance"}
                onChange={() => setInsuranceOption("no-insurance")}
              />
              <span className="ml-2">I don't have insurance</span>
            </label>
          </div>

          {insuranceOption === "upload" && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Upload Insurance (if you have)
              </label>
              <div className="flex mt-2">
                <select
                  value={selectedInsurance}
                  onChange={(e) => setSelectedInsurance(e.target.value)}
                  className="block w-full p-2 bg-white border border-gray-300 rounded-lg"
                >
                  <option value="" disabled>
                    Select Insurance Company
                  </option>
                  {insuranceCompanies.map((company, index) => (
                    <option key={index} value={company}>
                      {company}
                    </option>
                  ))}
                </select>
                <input
                  type="file"
                  className="ml-4 block text-sm text-gray-900   file:rounded file:px-4 file:h-8 file:cursor-pointer file:bg-white file:border file:border-gray-400 file:shadow file:mr-4 file:transition file:duration-200 hover:file:bg-customBlue hover:file:text-white active:file:bg-gray-300"
                  onChange={handleInsuranceUpload}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-4 space-x-2">
          <button
            className="bg-red-500 text-white rounded-lg px-4 py-2"
            onClick={closeModal}
          >
            Cancel
          </button>

          <button
            className={`${
              isCheckoutDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-customBlue hover:bg-customPink"
            } text-white rounded-lg px-4 py-2`}
            onClick={checkoutHandler}
            disabled={isCheckoutDisabled}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

const insuranceCompanies = [
  "State Farm",
  "Geico",
  "Progressive",
  "Allstate",
  "Liberty Mutual",
  "USAA",
  "Farmers Insurance",
  "Nationwide",
  "American Family Insurance",
  "Travelers",
  "MetLife",
  "Chubb",
  "Hartford",
  "CNA Financial",
  "Aflac",
  "Mutual of Omaha",
  "New York Life",
  "Northwestern Mutual",
  "Prudential Financial",
  "Guardian Life",
  "MassMutual",
  "Cigna",
  "Humana",
  "Blue Cross Blue Shield",
  "UnitedHealthcare",
  "Aetna",
  "Anthem",
  "Colonial Life",
  "American National Insurance",
  "Principal Financial",
  "Pacific Life",
  "Lincoln Financial",
  "Protective Life",
  "Ameritas",
  "EmblemHealth",
  "American Fidelity",
  "Plymouth Rock Assurance",
  "Erie Insurance",
  "Kemper",
  "Lemonade",
  "SafeAuto",
  "Mercury Insurance",
  "Amica Mutual Insurance",
  "Markel Corporation",
  "Western & Southern Financial",
  "Horace Mann",
  "OneBeacon",
  "Selective Insurance Group",
  "Alfa Insurance",
  "Acadia Insurance",
  "Esurance",
];

export default memo(PrescriptionModal);
