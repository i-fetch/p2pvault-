import React, { useState, useEffect } from "react";
import axios from "axios";

const KycPage = () => {
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [frontText, setFrontText] = useState("");
  const [backText, setBackText] = useState("");
  const [frontDocType, setFrontDocType] = useState("");
  const [backDocType, setBackDocType] = useState("");
  const [kycStatus, setKycStatus] = useState("notSubmitted");
  const [error, setError] = useState(null);
  const API_URL= process.env.REACT_APP_API_URL2;

  useEffect(() => {
    // Fetch the current KYC status on page load
    const fetchKycStatus = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${API_URL}/api/kyc/status`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setKycStatus(response.data.status);
      } catch (err) {
        setError("Error fetching KYC status.");
      }
    };
    fetchKycStatus();
  }, []);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("frontImage", frontImage);
    formData.append("backImage", backImage);
    formData.append("frontText", frontText);
    formData.append("backText", backText);
    formData.append("frontDocType", frontDocType);
    formData.append("backDocType", backDocType);

    try {
      const response = await axios.post(`${API_URL}/api/kyc/submit`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setKycStatus("awaiting approval");
      alert("KYC submitted successfully!");
    } catch (err) {
      setError("Error submitting KYC.");
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 text-white p-8">
      <h2 className="text-3xl font-semibold mb-6">Submit KYC</h2>
      {kycStatus === "notSubmitted" && (
        <div className="bg-stone-800 p-6 rounded-lg shadow-md">
          <input
            type="file"
            className="block w-full mb-4 text-sm text-gray-300"
            onChange={(e) => setFrontImage(e.target.files[0])}
          />
          <input
            type="file"
            className="block w-full mb-4 text-sm text-gray-300"
            onChange={(e) => setBackImage(e.target.files[0])}
          />
          <input
            type="text"
            placeholder="Front Text"
            className="block w-full p-3 mb-4 bg-stone-700 text-white rounded-md"
            value={frontText}
            onChange={(e) => setFrontText(e.target.value)}
          />
          <input
            type="text"
            placeholder="Back Text"
            className="block w-full p-3 mb-4 bg-stone-700 text-white rounded-md"
            value={backText}
            onChange={(e) => setBackText(e.target.value)}
          />
          <input
            type="text"
            placeholder="Front Document Type"
            className="block w-full p-3 mb-4 bg-stone-700 text-white rounded-md"
            value={frontDocType}
            onChange={(e) => setFrontDocType(e.target.value)}
          />
          <input
            type="text"
            placeholder="Back Document Type"
            className="block w-full p-3 mb-4 bg-stone-700 text-white rounded-md"
            value={backDocType}
            onChange={(e) => setBackDocType(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
          >
            Submit
          </button>
        </div>
      )}

      {kycStatus === "awaiting approval" && (
        <p className="text-lg text-yellow-400 mt-6">KYC is awaiting approval.</p>
      )}
      {kycStatus === "approved" && (
        <p className="text-lg text-green-400 mt-6">KYC has been approved.</p>
      )}
      {kycStatus === "rejected" && (
        <div className="mt-6">
          <p className="text-lg text-red-400">KYC has been rejected. Please submit again.</p>
          <button
            onClick={() => setKycStatus("notSubmitted")}
            className="mt-4 py-2 px-6 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Resubmit
          </button>
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default KycPage;
