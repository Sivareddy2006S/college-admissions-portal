const Application = require("../models/Application");
const upload = require('../middleware/uploadMiddleware');
// @route  POST /api/applications/submit
// @access Private (student)
const submitApplication = async (req, res) => {
  try {
    const { name, email, phone, course, tenthMarks, twelfthMarks, address } = req.body;

    if (!name || !email || !phone || !course || !tenthMarks || !twelfthMarks || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if already applied
    const existing = await Application.findOne({ userId: req.user._id });
    if (existing) {
      return res.status(400).json({ message: "You have already submitted an application" });
    }

    // Build documents list from uploaded files
    const documents = (req.files || []).map((file) => ({
      filename: file.originalname,
      path: file.filename,
    }));

    const application = await Application.create({
      userId: req.user._id,
      name,
      email,
      phone,
      course,
      tenthMarks: Number(tenthMarks),
      twelfthMarks: Number(twelfthMarks),
      address,
      documents,
    });

    res.status(201).json({
      message: "Application submitted successfully!",
      application,
    });
  } catch (err) {
    console.error("Submit error:", err.message);
    res.status(500).json({ message: "Failed to submit application" });
  }
};

// @route  GET /api/applications/my
// @access Private (student)
const getMyApplication = async (req, res) => {
  try {
    const application = await Application.findOne({ userId: req.user._id });

    if (!application) {
      return res.status(404).json({ message: "No application found" });
    }

    res.json({ application });
  } catch (err) {
    console.error("Get application error:", err.message);
    res.status(500).json({ message: "Failed to fetch application" });
  }
};

module.exports = { submitApplication, getMyApplication };