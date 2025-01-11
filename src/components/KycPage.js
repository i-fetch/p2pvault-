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
  const [kycStatus, setKycStatus] = useState(null);
  const [idType, setIdType] = useState(""); // ID type state
  const API_URL = process.env.REACT_APP_API_URL2;
  const BLOB_API_URL = "https://vcfi3s637pmbt6ul.public.blob.vercel-storage.com"; // Blob API base URL

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

  // Handle image file selection
  const handleImageSelect = (e, type) => {
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

  // Upload image to Vercel Blob
  const uploadToBlob = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(BLOB_API_URL, formData, {
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_BLOB_API_TOKEN}`,
        },
      });

      if (response.data.url) {
        return response.data.url;
      } else {
        throw new Error("Failed to upload to Blob.");
      }
    } catch (error) {
      console.error("Error uploading to Blob:", error);
      toast.error("Failed to upload file. Please try again.", { position: "top-right" });
      return null;
    }
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

    try {
      // Upload images to Blob
      const frontImageUrl = await uploadToBlob(frontImage);
      const backImageUrl = await uploadToBlob(backImage);

      if (!frontImageUrl || !backImageUrl) {
        throw new Error("Image upload failed.");
      }

      // Send Blob URLs to the backend
      const response = await axios.post(
        `${API_URL}/api/kyc/submit`,
        {
          frontImageUrl,
          backImageUrl,
          frontText,
          backText,
          frontDocType: idType,
          backDocType: idType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message) {
        setKycStatus("pending");
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
      {/* Remaining JSX code is unchanged */}
    </div>
  );
};

export default KYCPage;
