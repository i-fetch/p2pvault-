import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const KycPage = () => {
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [frontText, setFrontText] = useState("");
  const [backText, setBackText] = useState("");
  const [frontDocType, setFrontDocType] = useState("");
  const [backDocType, setBackDocType] = useState("");

  // Handle file selection for front image
  const handleFrontImageChange = (e) => {
    setFrontImage(e.target.files[0]);
  };

  // Handle file selection for back image
  const handleBackImageChange = (e) => {
    setBackImage(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!frontImage || !backImage) {
      toast.error("Both front and back images are required.", {
        position: "top-right",
      });
      return;
    }

    try {
      // Upload the front and back images to Blob storage via the proxy
      const frontImageUrl = await uploadToBlob(frontImage);
      const backImageUrl = await uploadToBlob(backImage);

      if (!frontImageUrl || !backImageUrl) {
        toast.error("Failed to upload images. Please try again.", {
          position: "top-right",
        });
        return;
      }

      // Send KYC data to your backend (including image URLs)
      const response = await axios.post(
        "/api/kyc/submit",
        {
          frontText,
          backText,
          frontDocType,
          backDocType,
          frontImageUrl,
          backImageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming the token is stored in localStorage
          },
        }
      );

      toast.success(response.data.message, { position: "top-right" });
    } catch (error) {
      console.error("Error submitting KYC:", error);
      toast.error("Failed to submit KYC. Please try again.", {
        position: "top-right",
      });
    }
  };

  // Function to upload image to the proxy route (backend)
  const uploadToBlob = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Send the image to your backend's proxy route for uploading to Vercel Blob
      const response = await axios.post("/api/proxy/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
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

  return (
    <div className="kyc-container">
      <h2>Submit KYC</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="frontImage">Front Image</label>
          <input
            type="file"
            id="frontImage"
            onChange={handleFrontImageChange}
            accept="image/*"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="backImage">Back Image</label>
          <input
            type="file"
            id="backImage"
            onChange={handleBackImageChange}
            accept="image/*"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="frontText">Front Image Text</label>
          <textarea
            id="frontText"
            value={frontText}
            onChange={(e) => setFrontText(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="backText">Back Image Text</label>
          <textarea
            id="backText"
            value={backText}
            onChange={(e) => setBackText(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="frontDocType">Front Document Type</label>
          <input
            type="text"
            id="frontDocType"
            value={frontDocType}
            onChange={(e) => setFrontDocType(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="backDocType">Back Document Type</label>
          <input
            type="text"
            id="backDocType"
            value={backDocType}
            onChange={(e) => setBackDocType(e.target.value)}
            required
          />
        </div>

        <button type="submit">Submit KYC</button>
      </form>
    </div>
  );
};

export default KycPage;
