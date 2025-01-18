import React, { useState, useRef } from "react";
import { upload } from "@vercel/blob/client";

const KycPage = () => {
  const [idType, setIdType] = useState("");
  const frontFileRef = useRef(null);
  const backFileRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

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

      // Upload front image
      const frontBlob = await upload(frontFile.name, frontFile, {
        access: "public",
        handleUploadUrl: "https://vcfi3s637pmbt6ul.public.blob.vercel-storage.com", // Replace with your actual endpoint
      });

      // Upload back image
      const backBlob = await upload(backFile.name, backFile, {
        access: "public",
        handleUploadUrl: "https://vcfi3s637pmbt6ul.public.blob.vercel-storage.com", // Replace with your actual endpoint
      });

      if (!frontBlob.url || !backBlob.url) {
        throw new Error("Failed to upload one or both images.");
      }

      // Send KYC details to the backend
      const response = await fetch("/api/kyc/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idType,
          frontUrl: frontBlob.url,
          backUrl: backBlob.url,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit KYC details.");
      }

      setSuccessMessage("KYC details submitted successfully.");
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-stone-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-white mb-4">KYC Upload</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="idType" className="block text-white mb-2">
          Select ID Type
        </label>
        <select
          id="idType"
          value={idType}
          onChange={(e) => setIdType(e.target.value)}
          className="w-full p-2 mb-4 bg-stone-800 text-white rounded"
          required
        >
          <option value="" disabled>
            -- Select ID Type --
          </option>
          <option value="passport">Passport</option>
          <option value="driver_license">Driver's License</option>
          <option value="national_id">National ID</option>
          <option value="ssn">Social Security Number</option>
        </select>

        <label htmlFor="frontFile" className="block text-white mb-2">
          Upload Front Image
        </label>
        <input
          id="frontFile"
          type="file"
          ref={frontFileRef}
          accept="image/*"
          className="w-full p-2 mb-4 bg-stone-800 text-white rounded"
          required
        />

        <label htmlFor="backFile" className="block text-white mb-2">
          Upload Back Image
        </label>
        <input
          id="backFile"
          type="file"
          ref={backFileRef}
          accept="image/*"
          className="w-full p-2 mb-4 bg-stone-800 text-white rounded"
          required
        />

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
