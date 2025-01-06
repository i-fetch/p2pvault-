import React, { useState, useEffect } from "react";
import Tesseract from "tesseract.js";
import { toast } from "react-toastify";
import axios from "axios";

const KYCPage = () => {
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [frontText, setFrontText] = useState("");
  const [backText, setBackText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [kycStatus, setKycStatus] = useState(null); // To track KYC status
  const API_URL =process.env.REACT_APP_API_URL;


  // Fetch KYC status on page load
  useEffect(() => {
    const fetchKycStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(`${API_URL}api/kyc/status`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.status) {
          setKycStatus(response.data.status); // Set the KYC status
        } else {
          setKycStatus("notSubmitted"); // If no status returned, mark it as "notSubmitted"
        }
      } catch (error) {
        console.error("Error fetching KYC status:", error);
        setKycStatus("notSubmitted"); // If there's an error, mark it as "notSubmitted"
      }
    };

    fetchKycStatus();
  }, []);

  // Handle image upload
  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "front") {
        setFrontImage(file);
        processImage(file, "front");
      } else {
        setBackImage(file);
        processImage(file, "back");
      }
    }
  };

  // Process the uploaded image using Tesseract.js OCR
  const processImage = (file, type) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setLoading(true);
      Tesseract.recognize(reader.result, "eng", {
        logger: (m) => console.log(m), // Log progress
      })
        .then(({ data: { text } }) => {
          if (type === "front") {
            setFrontText(text);
          } else {
            setBackText(text);
          }
          setLoading(false);
        })
        .catch(() => {
          toast.error("Error processing image. Please try again.", { position: "top-right" });
          setLoading(false);
        });
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!frontText || !backText) {
      toast.error("Please upload both the front and back images of your National ID.", {
        position: "top-right",
      });
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
    formData.append("frontText", frontText);
    formData.append("backText", backText);

    try {
      const response = await axios.post(`${API_URL}/api/kyc/submit`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setIsSubmitted(true);
        toast.success("KYC submitted successfully!", { position: "top-right" });
      } else {
        toast.error(response.data.message || "KYC submission failed.", { position: "top-right" });
      }
    } catch (error) {
      console.error("Error submitting KYC:", error);
      toast.error("An error occurred while submitting your KYC. Please try again.", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-stone-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">KYC Verification</h2>
      <p className="text-white mb-4">
        Please upload the front and back images of your ID card or document for verification (Mandatory).
      </p>

      {/* Check KYC Status */}
      {kycStatus === "notSubmitted" && (
        <div className="text-white mb-4">
          <p>Your KYC has not been submitted yet.</p>
          {/* KYC Submission Form */}
          <div>
            <div className="mb-4">
              <label className="block text-white mb-2">Front of Document</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "front")}
                className="block w-full text-sm text-gray-500 border border-white rounded-lg cursor-pointer focus:outline-none"
              />
              {frontImage && (
                <img
                  src={URL.createObjectURL(frontImage)}
                  alt="Front Document"
                  className="mt-2 w-24 h-32 object-cover"
                />
              )}
            </div>
            <div className="mb-4">
              <label className="block text-white mb-2">Back of Document</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "back")}
                className="block w-full text-sm text-gray-500 border border-white rounded-lg cursor-pointer focus:outline-none"
              />
              {backImage && (
                <img
                  src={URL.createObjectURL(backImage)}
                  alt="Back Document"
                  className="mt-2 w-24 h-32 object-cover"
                />
              )}
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading || !frontImage || !backImage}
              className={`w-full py-2 mt-4 rounded-lg text-white font-semibold transition ${
                loading || !frontImage || !backImage ? "bg-gray-500 cursor-not-allowed" : "bg-pink-500 hover:bg-pink-600"
              }`}
            >
              {loading ? "Submitting..." : "Submit KYC"}
            </button>
          </div>
        </div>
      )}

      {/* Display KYC Status */}
      {kycStatus === "pending" && (
        <div className="text-white mb-4">
          <p>Your KYC status: Pending Approval</p>
        </div>
      )}

      {kycStatus === "approved" && (
        <div className="text-white mb-4">
          <p>Your KYC status: Approved</p>
        </div>
      )}

      {kycStatus === "rejected" && (
        <div className="text-white mb-4">
          <p>Your KYC status: Rejected</p>
        </div>
      )}
    </div>
  );
};

export default KYCPage;
