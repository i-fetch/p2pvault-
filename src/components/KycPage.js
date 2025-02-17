import React, { useState, useRef, useEffect, useCallback } from "react";

const KycPage = () => {
  const [idType, setIdType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [kycStatus, setKycStatus] = useState("loading"); // "not_verified", "pending", "verified", "rejected", "loading"
  const frontFileRef = useRef(null);
  const backFileRef = useRef(null);
  const API_URL = process.env.REACT_APP_API_URL2;

  // Fetch KYC status
  const fetchKycStatus = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/kyc/status`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch KYC status.");
      }

      const data = await response.json();
      console.log("KYC status response from backend:", data); // Debugging line
      console.log("Setting KYC status to:", data.status); // Additional debugging line
      setKycStatus(data.status);
    } catch (error) {
      console.error("Error fetching KYC status:", error);
      setKycStatus("error");
    }
  }, [API_URL]);

  // Fetch KYC status on component mount
  useEffect(() => {
    fetchKycStatus();

    // Poll KYC status every 5 seconds
    const interval = setInterval(fetchKycStatus, 5000);
    return () => clearInterval(interval);
  }, [fetchKycStatus]);

  // Handle KYC submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (kycStatus === "verified") {
      setError("Your KYC is already verified.");
      setLoading(false);
      return;
    }

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

      // Prepare FormData for file upload
      const formData = new FormData();
      formData.append("frontFile", frontFile);
      formData.append("backFile", backFile);

      // Upload files
      const uploadResponse = await fetch(`${API_URL}/api/kyc/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });

      if (!uploadResponse.ok) {
        const { error } = await uploadResponse.json();
        throw new Error(error || "File upload failed.");
      }

      const { frontUrl, backUrl } = await uploadResponse.json();

      // Submit KYC details
      const response = await fetch(`${API_URL}/api/kyc/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ idType, frontUrl, backUrl }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "KYC submission failed.");
      }

      setSuccess(true);
      setLoading(false);
      fetchKycStatus(); // Refresh KYC status after submission
    } catch (err) {
      setError(err.message || "Failed to submit KYC.");
      setLoading(false);
    }
  };

  // Get status message
  const getStatusMessage = () => {
    console.log("Rendering status message for:", kycStatus); // Debugging log

    switch (kycStatus) {
      case "not_verified":
        return "Not Verified";
      case "pending":
        return "Pending Verification";
      case "approved":
      case "verified":
        return "Verified";
      case "rejected":
        return "Rejected. Please contact support.";
      case "error":
        return "Error fetching status.";
      case "unknown":
        return "Unknown status.";
      default:
        return "Loading status...";
    }
  };

  // Get status color
  const getStatusColor = () => {
    switch (kycStatus) {
      case "not_verified":
        return "text-red-500";
      case "pending":
        return "text-yellow-500";
      case "approved":
      case "verified":
        return "text-green-500";
      case "rejected":
        return "text-red-500";
      case "error":
        return "text-red-500";
      case "unknown":
        return "text-gray-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-stone-900 text-white p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">KYC Verification</h1>

      {/* KYC Status */}
      <div className="mb-4">
        <p className={`text-lg font-semibold ${getStatusColor()}`}>
          KYC Status: {getStatusMessage()}
        </p>
      </div>

      {/* Show form only if KYC is not verified */}
      {kycStatus !== "verified" && kycStatus !== "approved" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="idType" className="block mb-2">Select ID Type</label>
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
            <label htmlFor="frontFile" className="block mb-2">Upload Front Image</label>
            <input
              type="file"
              id="frontFile"
              ref={frontFileRef}
              accept="image/*"
              className="block w-full bg-stone-800 text-white rounded p-2"
            />
          </div>
          <div>
            <label htmlFor="backFile" className="block mb-2">Upload Back Image</label>
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
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {success && <p className="text-green-500 mt-4">KYC submitted successfully!</p>}
    </div>
  );
};

export default KycPage;
