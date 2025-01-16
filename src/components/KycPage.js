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
        if (response.data && response.data.status) {
          setKycStatus(response.data.status);
        } else {
          setKycStatus("notSubmitted");
        }
      } catch (error) {
        console.error("Error fetching KYC status:", error);
        setKycStatus("notSubmitted");
      }
    };

    fetchKycStatus();
  }, []);

  // Handle image file selection
  const handleImageSelect = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "front") {
        setFrontImage(file);
      } else {
        setBackImage(file);
      }
    }
  };

  // Upload image to Blob via serverless function
  const uploadToBlob = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${API_URL}/api/upload-to-blob`, formData);
      if (response.data && response.data.url) {
        return response.data.url;
      } else {
        throw new Error("Failed to upload to Blob.");
      }
    } catch (error) {
      console.error("Error uploading to Blob:", error);
      toast.error("Failed to upload file. Please try again.", { position: "top-right" });
      return null;
    }
  };

  // Handle form submission
  // Handle form submission
const handleSubmit = async () => {
  if (!idType) {
    toast.error("Please select the type of ID you are uploading.", { position: "top-right" });
    return;
  }

  if (!frontImage || !backImage) {
    toast.error("Please upload both the front and back images of your ID.", { position: "top-right" });
    return;
  }

  setLoading(true);

  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("Authentication token is missing.", { position: "top-right" });
    setLoading(false);
    return;
  }

  try {
    // Create a FormData object
    const formData = new FormData();
    formData.append("frontImage", frontImage);
    formData.append("backImage", backImage);
    formData.append("idType", idType); // Send the selected ID type

    // Send the data to the backend
    const response = await axios.post(
      `${API_URL}/api/kyc/submit`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Use multipart/form-data for sending both files and form data
        },
      }
    );

    if (response.data && response.data.message) {
      toast.success(response.data.message, { position: "top-right" });
      setKycStatus("submitted");
    } else {
      toast.error("Error submitting KYC. Please try again.", { position: "top-right" });
    }
  } catch (error) {
    console.error("Error submitting KYC:", error);
    toast.error("Error submitting KYC. Please try again.", { position: "top-right" });
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="w-full max-w-md mx-auto bg-stone-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-white mb-4">KYC Verification</h2>
      
      {kycStatus === null ? (
        <p className="text-white">Loading KYC status...</p>
      ) : kycStatus === "pending" ? (
        <p className="text-yellow-400">Your KYC is pending approval.</p>
      ) : kycStatus === "approved" ? (
        <p className="text-green-400">Your KYC has been approved.</p>
      ) : kycStatus === "rejected" ? (
        <p className="text-red-400">Your KYC has been rejected. Please try again.</p>
      ) : (
        <p className="text-white">You have not submitted your KYC yet.</p>
      )}

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
        disabled={loading}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md"
      >
        {loading ? "Submitting..." : "Submit KYC"}
      </button>
    </div>
  );
};

export default KYCPage;
