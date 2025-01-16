import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const API_URL = "p2pvaultuserbackend-production.up.railway.app";

const KYCSubmission = ({ API_URL }) => {
  const [idType, setIdType] = useState("");
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async () => {
    if (!idType || !frontImage || !backImage) {
      toast.error("Please complete all fields before submitting.", { position: "top-right" });
      return;
    }

    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication token is missing.", { position: "top-right" });
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("frontImage", frontImage);
    formData.append("backImage", backImage);
    formData.append("frontDocType", idType);
    formData.append("backDocType", idType);

    try {
      const response = await axios.post(`${API_URL}/api/kyc/submit`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.message) {
        toast.success("KYC submitted successfully!", { position: "top-right" });
      } else {
        toast.error(response.data.message || "KYC submission failed.", { position: "top-right" });
      }
    } catch (error) {
      console.error("Error submitting KYC:", error);
      toast.error("An error occurred while submitting your KYC. Please try again.", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold text-center mb-4">KYC Submission</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">ID Type</label>
          <input
            type="text"
            value={idType}
            onChange={(e) => setIdType(e.target.value)}
            className="w-full p-2 border border-gray-600 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter ID type (e.g., Passport, Driver's License)"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Front Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setFrontImage)}
            className="w-full p-2 border border-gray-600 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Back Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setBackImage)}
            className="w-full p-2 border border-gray-600 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-2 px-4 rounded text-white font-semibold ${
            loading ? "bg-gray-600" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Submitting..." : "Submit KYC"}
        </button>
      </div>
    </div>
  );
};

export default KYCSubmission;
