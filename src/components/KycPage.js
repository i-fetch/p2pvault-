import React, { useState, useRef } from "react";
import { upload } from "@vercel/blob/client";

const KycPage = () => {
  const [idType, setIdType] = useState(""); // Dropdown selection
  const frontFileRef = useRef(null);
  const backFileRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const API_URL = process.env.REACT_APP_API_URL2; // Ensure this is set in your .env file
  const VERCELOB_TOKEN = process.env.REACT_APP_VERCEL_BLOB_READ_WRITE_TOKEN; // Ensure this matches your .env file

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    if (!idType) {
      setError("Please select an ID type.");
      setLoading(false);
      return;
    }

    try {
      const frontFile = frontFileRef.current.files[0];
      const backFile = backFileRef.current.files[0];

      if (!frontFile || !backFile) {
        setError("Both front and back images are required.");
        setLoading(false);
        return;
      }

      // Upload the front image via Vercel Blob
      const frontBlob = await upload(frontFile.name, frontFile, {
        access: "public",
        handleUploadUrl: `${API_URL}/api/blob/upload`, // Backend upload URL
        Content-Type: multipart/form-data;
        
      });
      if (!frontBlob || !frontBlob.url) {
        throw new Error("Failed to upload front image.");
      }

      // Upload the back image via Vercel Blob
      const backBlob = await upload(backFile.name, backFile, {
        access: "public",
        handleUploadUrl: `${API_URL}/api/blob/upload`, // Backend upload URL
        Content-Type: multipart/form-data;
    
      });
      if (!backBlob || !backBlob.url) {
        throw new Error("Failed to upload back image.");
      }

      // Get the token from localStorage
      const token = localStorage.getItem("token"); // Ensure the token is stored during login

      if (!token) {
        throw new Error("Token is missing. Please log in again.");
      }

      // Save the uploaded URLs and ID type to the database via your backend
      const response = await fetch(`${API_URL}/api/kyc/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        },
        body: JSON.stringify({
          idType,
          frontUrl: frontBlob.url,
          backUrl: backBlob.url,
        }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Failed to submit KYC details.");
      }

      setSuccessMessage("KYC details submitted successfully.");
    } catch (err) {
      setError(err.message || "Failed to upload files. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-stone-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-white mb-4">KYC Upload</h2>

      <form onSubmit={handleSubmit}>
        {/* Dropdown for ID type */}
        <label className="block text-white mb-2">Select ID Type</label>
        <select
          value={idType}
          onChange={(e) => setIdType(e.target.value)}
          className="w-full p-2 mb-4 bg-stone-800 text-white rounded"
        >
          <option value="" disabled>
            -- Select ID Type --
          </option>
          <option value="passport">Passport</option>
          <option value="driver_license">Driver's License</option>
          <option value="national_id">National ID</option>
          <option value="ssn">Social Security Number</option>
        </select>

        {/* Front image upload */}
        <label className="block text-white mb-2">Upload Front Image</label>
        <input
          type="file"
          ref={frontFileRef}
          accept="image/*"
          className="w-full p-2 mb-4 bg-stone-800 text-white rounded"
          required
        />

        {/* Back image upload */}
        <label className="block text-white mb-2">Upload Back Image</label>
        <input
          type="file"
          ref={backFileRef}
          accept="image/*"
          className="w-full p-2 mb-4 bg-stone-800 text-white rounded"
          required
        />

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md text-white ${loading ? "bg-gray-800" : "bg-pink-600"}`}
        >
          {loading ? "Uploading..." : "Submit"}
        </button>
      </form>

      {error && <p className="text-red-400 mt-4">{error}</p>}
      {successMessage && <p className="text-green-400 mt-4">{successMessage}</p>}
    </div>
  );
};

export default KycPage;
