import { createUploadHandler } from "@vercel/blob/server";

export const config = {
  api: {
    bodyParser: false, // Disable body parsing to handle file uploads
  },
};

export default async function handler(req, res) {
  // Handle preflight requests for CORS
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "https://www.p2pvaults.com");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.status(200).end();
    return;
  }

  // Check for the correct HTTP method
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    // Handle file upload using Vercel Blob's upload handler
    const uploadHandler = createUploadHandler();
    await uploadHandler(req, res);
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "File upload failed." });
  }
}
