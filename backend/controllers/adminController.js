const Application = require("../models/Application");

// @route  GET /api/admin/applications
// @access Private (admin)
const getAllApplications = async (req, res) => {
  try {
    const { search = "", status = "", course = "" } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (course) filter.course = course;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const applications = await Application.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({ count: applications.length, applications });
  } catch (err) {
    console.error("Get all error:", err.message);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

// @route  GET /api/admin/applications/:id
// @access Private (admin)
const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate("userId", "name email");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ application });
  } catch (err) {
    console.error("Get by id error:", err.message);
    res.status(500).json({ message: "Failed to fetch application" });
  }
};

// @route  PUT /api/admin/applications/:id/status
// @access Private (admin)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, adminRemark } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be Approved or Rejected" });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    application.adminRemark = adminRemark || "";
    await application.save();

    res.json({ message: "Application " + status + " successfully", application });
  } catch (err) {
    console.error("Update status error:", err.message);
    res.status(500).json({ message: "Failed to update status" });
  }
};

// @route  GET /api/admin/stats
// @access Private (admin)
const getDashboardStats = async (req, res) => {
  try {
    const total = await Application.countDocuments();
    const pending = await Application.countDocuments({ status: "Pending" });
    const approved = await Application.countDocuments({ status: "Approved" });
    const rejected = await Application.countDocuments({ status: "Rejected" });

    res.json({ total, pending, approved, rejected });
  } catch (err) {
    console.error("Stats error:", err.message);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

module.exports = { getAllApplications, getApplicationById, updateApplicationStatus, getDashboardStats };