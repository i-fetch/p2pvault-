import React, { useState, useRef, useEffect } from "react";

const KycPage = () => {
  const [idType, setIdType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [kycStatus, setKycStatus] = useState("loading"); // KYC status: "not_verified", "pending", "approved", "rejected", "loading"
  const frontFileRef = useRef(null);
  const backFileRef = useRef(null);
  const API_URL = process.env.REACT_APP_API_URL2;

  // Fetch KYC status when the component loads
  useEffect(() => {
    const fetchKycStatus = async () => {
      try {
        console.log("fetching kyc status...")
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
        console.log("kyc status fetched", data.status)
        setKycStatus(data.status);
      } catch (error) {
        console.error(error.message);
        setKycStatus("error");
      }
    };

    fetchKycStatus(); // Initial fetch

    // Polling for KYC status every 5 seconds
    const interval = setInterval(fetchKycStatus, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [API_URL]);

  // Handle KYC submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (kycStatus === "approved") {
      setError("Your KYC is already verified. No further action is required.");
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

      // Send the files to the backend for upload
      const uploadResponse = await fetch(`${API_URL}/api/kyc/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        const { error } = await uploadResponse.json();
        throw new Error(error || "Failed to upload files.");
      }

      const { frontUrl, backUrl } = await uploadResponse.json();

      // Send the KYC details to the backend
      const response = await fetch(`${API_URL}/api/kyc/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          idType,
          frontUrl,
          backUrl,
        }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Failed to submit KYC details.");
      }

      setSuccess(true);
      setLoading(false);
      // Re-fetch KYC status after submission to reflect the change
      await fetchKycStatus(); // Re-fetch KYC status
    } catch (err) {
      setError(err.message || "Failed to submit KYC details.");
      setLoading(false);
    }
  };

  // Fetch KYC status again to reflect the latest status
  const fetchKycStatus = async () => {
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
      setKycStatus(data.status);
    } catch (error) {
      console.error(error.message);
      setKycStatus("error");
    }
  };

  // Get status message to display
  const getStatusMessage = () => {
    switch (kycStatus) {
      case "not_verified":
        return "Not Verified";
      case "pending":
        return "Pending Verification";
      case "approved":
        return "Verified";
      case "rejected":
        return "Rejected. Please contact support.";
      default:
        return "Loading status...";
    }
  };

  // Get status color based on the current KYC status
  const getStatusColor = () => {
    switch (kycStatus) {
      case "not_verified":
        return "text-red-500";
      case "pending":
        return "text-yellow-500";
      case "approved":
        return "text-green-500";
      case "rejected":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-stone-900 text-white p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">KYC Verification</h1>

      {/* Display KYC Status */}
      <div className="mb-4">
        <p className={`text-lg font-semibold ${getStatusColor()}`}>
          KYC Status: {getStatusMessage()}
        </p>
      </div>

      {/* Disable form if KYC is already approved */}
      {kycStatus !== "approved" && (
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
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {success && (
        <p className="text-green-500 mt-4">KYC submitted successfully!</p>
      )}
    </div>
  );
};

export default KycPage;
