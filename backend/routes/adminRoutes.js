const express = require("express");
const router = express.Router();
const { getAllApplications, getApplicationById, updateApplicationStatus, getDashboardStats } = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.use(protect, adminOnly);
router.get("/stats", getDashboardStats);
router.get("/applications", getAllApplications);
router.get("/applications/:id", getApplicationById);
router.put("/applications/:id/status", updateApplicationStatus);

module.exports = router;