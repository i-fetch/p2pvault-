import React, { useState, useRef } from "react";

const KycPage = () => {
  const [idType, setIdType] = useState(""); // Dropdown selection
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

      // Prepare form data
      const formData = new FormData();
      formData.append("idType", idType);
      formData.append("frontImage", frontFile);
      formData.append("backImage", backFile);

      // Send data to the backend
      const token = localStorage.getItem("authToken"); // Adjust as per your auth flow
      const response = await fetch("/api/kyc/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload KYC details.");
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
