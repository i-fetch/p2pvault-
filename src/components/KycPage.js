import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const KYCPage = () => {
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [kycStatus, setKycStatus] = useState(null);
  const [idType, setIdType] = useState(""); // ID type state
  const API_URL = process.env.REACT_APP_API_URL2; // Backend API URL

  const idOptions = ["ID Card", "Driver's License", "Passport", "NIN"];

  const toastOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    className: "text-sm max-w-[90%] mx-auto", // Mobile-friendly styling
  };

  // Fetch KYC status on page load
  useEffect(() => {
    const fetchKycStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(`${API_URL}/api/kyc/status`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setKycStatus(response.data.status || "notSubmitted");
      } catch (error) {
        console.error("Error fetching KYC status:", error);
        setKycStatus("notSubmitted");
      }
    };

    fetchKycStatus();
  }, []);

  const handleImageSelect = (e, type) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (file) {
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPG and PNG files are allowed.", toastOptions);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB.", toastOptions);
        return;
      }

      if (type === "front") {
        setFrontImage(file);
      } else {
        setBackImage(file);
      }
    }
  };

  const handleSubmit = async () => {
    if (kycStatus === "submitted" || kycStatus === "verified") {
      toast.info("You have already submitted your KYC.", toastOptions);
      return;
    }
  
    if (!idType) {
      toast.error("Please select the type of ID you are uploading.", toastOptions);
      return;
    }
  
    if (!frontImage || !backImage) {
      toast.error("Please upload both the front and back images of your ID.", toastOptions);
      return;
    }
  
    setLoading(true);
  
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication token is missing.", toastOptions);
      setLoading(false);
      return;
    }
  
    const formData = new FormData();
    formData.append("idType", idType);
    formData.append("frontImage", frontImage);
    formData.append("backImage", backImage);
  
    // Debugging: Log FormData content
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
  
    try {
      const response = await axios.post(`${API_URL}/api/kyc/submit`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,

        },
        
      });
  
      if (response.data.message) {
        toast.success(response.data.message, toastOptions);
        setKycStatus("submitted");
      }
    } catch (error) {
      console.error("Error submitting KYC:", error);
      toast.error("Error submitting KYC. Please try again.", toastOptions);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="w-full max-w-md mx-auto bg-stone-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-white mb-4">KYC Verification</h2>

      {/* Display KYC Status */}
      <div className="mb-4">
        {kycStatus === "pending" && (
          <p className="text-yellow-400">Your KYC is pending approval.</p>
        )}
        {kycStatus === "verified" && (
          <p className="text-green-400">Your KYC has been verified!</p>
        )}
        {kycStatus === "notSubmitted" && (
          <p className="text-red-400">You have not submitted your KYC yet.</p>
        )}
        {kycStatus === "submitted" && (
          <p className="text-blue-400">Your KYC is under review.</p>
        )}
      </div>

      {/* Render KYC Form */}
      <div>
        <label className="block text-white">ID Type</label>
        <select
          className="w-full p-2 mb-4 bg-stone-800 text-white rounded"
          value={idType}
          onChange={(e) => setIdType(e.target.value)}
        >
          <option value="">Select ID Type</option>
          {idOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-white">Front Image</label>
        <input
          type="file"
          onChange={(e) => handleImageSelect(e, "front")}
          className="w-full p-2 mb-4 bg-stone-800 text-white rounded"
        />
      </div>

      <div>
        <label className="block text-white">Back Image</label>
        <input
          type="file"
          onChange={(e) => handleImageSelect(e, "back")}
          className="w-full p-2 mb-4 bg-stone-800 text-white rounded"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || kycStatus === "submitted" || kycStatus === "verified"}
        className={`mt-4 w-full ${
          loading ? "bg-gray-600" : "bg-blue-600"
        } text-white py-2 rounded-md`}
      >
        {loading ? "Submitting..." : "Submit KYC"}
      </button>
    </div>
  );
};

export default KYCPage;
