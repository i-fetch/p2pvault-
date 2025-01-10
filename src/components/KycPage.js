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
  const [kycStatus, setKycStatus] = useState(null);
  const [idType, setIdType] = useState(""); // ID type state
  const API_URL = process.env.REACT_APP_API_URL2;

  const idOptions = ["ID Card", "Driver's License", "Passport", "NIN"];

  // Fetch KYC status on page load
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

  // Handle image upload
  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      try {
        // Upload to Vercel Blob
        const formData = new FormData();
        formData.append("file", file);

        const uploadResponse = await axios.post(`${API_URL}/api/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const uploadedUrl = uploadResponse.data.url;

        if (type === "front") {
          setFrontImage(uploadedUrl);
          processImage(file, "front");
        } else {
          setBackImage(uploadedUrl);
          processImage(file, "back");
        }
      } catch (error) {
        toast.error("Error uploading file. Please try again.", { position: "top-right" });
      } finally {
        setLoading(false);
      }
    }
  };

  // Process the uploaded image using Tesseract.js OCR
  const processImage = (file, type) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      Tesseract.recognize(reader.result, "eng", {
        logger: (m) => console.log(m),
      })
        .then(({ data: { text } }) => {
          if (type === "front") {
            setFrontText(text);
          } else {
            setBackText(text);
          }
        })
        .catch(() => {
          toast.error("Error processing image. Please try again.", { position: "top-right" });
        });
    };
    reader.readAsDataURL(file);
  };

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

    const formData = {
      frontImage,
      backImage,
      idType,
      frontText,
      backText,
    };

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

      {kycStatus === "notSubmitted" && (
        <div className="text-white mb-4">
          <label className="block text-white mb-2">Select ID Type</label>
          <select
            value={idType}
            onChange={(e) => setIdType(e.target.value)}
            className="block w-full p-2 border border-white rounded-lg bg-stone-800 text-white"
          >
            <option value="">-- Select ID Type --</option>
            {idOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <div className="mb-4 mt-4">
            <label className="block text-white mb-2">Front of Document</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "front")}
              className="block w-full text-sm text-gray-500 border border-white rounded-lg cursor-pointer focus:outline-none"
            />
            {frontImage && <img src={frontImage} alt="Front Document" className="mt-2 w-24 h-32 object-cover" />}
          </div>

          <div className="mb-4">
            <label className="block text-white mb-2">Back of Document</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "back")}
              className="block w-full text-sm text-gray-500 border border-white rounded-lg cursor-pointer focus:outline-none"
            />
            {backImage && <img src={backImage} alt="Back Document" className="mt-2 w-24 h-32 object-cover" />}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !frontImage || !backImage || !idType}
            className={`w-full py-2 mt-4 rounded-lg text-white font-semibold transition ${
              loading || !frontImage || !backImage || !idType
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-pink-500 hover:bg-pink-600"
            }`}
          >
            {loading ? "Submitting..." : "Submit KYC"}
          </button>
        </div>
      )}

      {kycStatus === "pending" && <p className="text-white">Your KYC status: Pending Approval</p>}
      {kycStatus === "approved" && <p className="text-white">Your KYC status: Approved</p>}
      {kycStatus === "rejected" && <p className="text-white">Your KYC status: Rejected</p>}
    </div>
  );
};

export default KYCPage;
