import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

// -------------------------
// Middleware
// -------------------------
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// -------------------------
// Environment Variables
// -------------------------
const { UPLOADCARE_PUBLIC_KEY, UPLOADCARE_SECRET_KEY, PORT } = process.env;

if (!UPLOADCARE_PUBLIC_KEY || !UPLOADCARE_SECRET_KEY) {
  console.error("❌ Missing Uploadcare API keys in .env file!");
  process.exit(1);
}

// -------------------------
// Routes
// -------------------------

// ✅ 1. Fetch all uploads from Uploadcare
app.get("/api/uploads", async (req, res) => {
  try {
    const response = await axios.get("https://api.uploadcare.com/files/", {
      headers: {
        Accept: "application/vnd.uploadcare-v0.7+json",
        Authorization: `Uploadcare.Simple ${UPLOADCARE_PUBLIC_KEY}:${UPLOADCARE_SECRET_KEY}`,
      },
    });

    // Simplify data for frontend
    const uploads = response.data.results.map((file) => ({
      id: file.uuid,
      title: file.original_filename || "Untitled",
      file_url: file.original_file_url || file.url || "",
      uploaded_at: file.datetime_uploaded,
      size: file.size,
      mime_type: file.mime_type,
      is_ready: file.is_ready,
    }));

    res.json(uploads);
  } catch (error) {
    console.error("❌ Error fetching uploads:", error.message);
    res.status(500).json({
      error: "Failed to fetch uploads",
      details: error.message,
    });
  }
});

// ✅ 2. Add new upload metadata (optional)
app.post("/api/uploads", async (req, res) => {
  try {
    const uploadData = req.body;
    if (!uploadData || !uploadData.file_url) {
      return res.status(400).json({ error: "Missing upload data" });
    }

    console.log("📦 Received upload data:", uploadData);
    // You can save this to a database later
    res.json({ message: "Upload received successfully", data: uploadData });
  } catch (error) {
    console.error("❌ Error adding upload:", error.message);
    res.status(500).json({
      error: "Failed to add upload",
      details: error.message,
    });
  }
});

// ✅ 3. Delete file from Uploadcare
app.delete("/api/uploads/:uuid", async (req, res) => {
  const { uuid } = req.params;
  try {
    const response = await axios.delete(
      `https://api.uploadcare.com/files/${uuid}/`,
      {
        headers: {
          Accept: "application/vnd.uploadcare-v0.7+json",
          Authorization: `Uploadcare.Simple ${UPLOADCARE_PUBLIC_KEY}:${UPLOADCARE_SECRET_KEY}`,
        },
      }
    );
    res.json({ message: `File ${uuid} deleted successfully` });
  } catch (error) {
    console.error(`❌ Error deleting file ${uuid}:`, error.message);
    res.status(500).json({
      error: "Failed to delete file",
      details: error.message,
    });
  }
});

// -------------------------
// Server Startup
// -------------------------
const SERVER_PORT = PORT || 5000;
app.listen(SERVER_PORT, () => {
  console.log(`✅ Backend running at http://localhost:${SERVER_PORT}`);
});
