import React, { useState, useRef } from "react";
import { upload } from "@vercel/blob/client";

const KycPage = () => {
  const [idType, setIdType] = useState("");
  const [frontBlob, setFrontBlob] = useState(null);
  const [backBlob, setBackBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const frontFileRef = useRef(null);
  const backFileRef = useRef(null);
  const API_URL =process.env.REACT_APP_API_URL2;



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

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
        handleUploadUrl: `${API_URL}/api/kyc/upload`,
      });
      setFrontBlob(frontBlob);

      // Upload back image
      const backBlob = await upload(backFile.name, backFile, {
        access: "public",
        handleUploadUrl: `${API_URL}/api/kyc/upload`,
      });
      setBackBlob(backBlob);

      // Send data to backend
      const response = await fetch(`${API_URL}/api/kyc/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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

      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to submit KYC details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-stone-900 text-white p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">KYC Verification</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="idType" className="block mb-2">
            Select ID Type
          </label>
          <select
            id="idType"
            value={idType}
            onChange={(e) => setIdType(e.target.value)}
            className="w-full bg-stone-800 text-white rounded p-2"
          >
            <option value="">-- Select ID Type --</option>
            <option value="passport">Passport</option>
            <option value="driver_license">Driver's License</option>
            <option value="national_id">National ID</option>
          </select>
        </div>
        <div>
          <label htmlFor="frontFile" className="block mb-2">
            Upload Front Image
          </label>
          <input
            type="file"
            id="frontFile"
            ref={frontFileRef}
            accept="image/*"
            className="block w-full bg-stone-800 text-white rounded p-2"
          />
        </div>
        <div>
          <label htmlFor="backFile" className="block mb-2">
            Upload Back Image
          </label>
          <input
            type="file"
            id="backFile"
            ref={backFileRef}
            accept="image/*"
            className="block w-full bg-stone-800 text-white rounded p-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit KYC"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {success && (
        <p className="text-green-500 mt-4">KYC submitted successfully!</p>
      )}
      {frontBlob && (
        <div>
          <p>Front Blob URL: <a href={frontBlob.url} target="_blank" rel="noopener noreferrer">{frontBlob.url}</a></p>
        </div>
      )}
      {backBlob && (
        <div>
          <p>Back Blob URL: <a href={backBlob.url} target="_blank" rel="noopener noreferrer">{backBlob.url}</a></p>
        </div>
      )}
    </div>
  );
};

export default KycPage;
