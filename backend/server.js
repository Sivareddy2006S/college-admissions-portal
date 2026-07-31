const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Import Routes
const authRoutes = require("./routes/authRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// 1. Middleware Setup
app.use(cors()); // Simplified CORS for development
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Static Folder for File Uploads
// This ensures your browser can actually "see" the uploaded PDFs/Images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 3. Define API Routes
// Make sure these variables match the imports above
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);

// 4. Base Route / Health Check
app.get("/", (req, res) => {
  res.json({ message: "College Admissions API is running!" });
});

// 5. Global Error Handler (The Fix)
// We keep the 'next' parameter so Express recognizes this as an error handler,
// but we ensure it doesn't crash the app.
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error("Error Message:", err.message);
  
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// 6. Database Connection & Server Start
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });