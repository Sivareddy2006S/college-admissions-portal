const express = require("express");
const router = express.Router();
const { submitApplication, getMyApplication } = require("../controllers/applicationController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/submit", protect, upload.array("documents", 5), submitApplication);
router.get("/my", protect, getMyApplication);

module.exports = router;