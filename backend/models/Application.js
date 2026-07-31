const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    course: {
      type: String,
      required: true,
      enum: [
        "B.Tech Computer Science",
        "B.Tech Electronics",
        "B.Tech Mechanical",
        "B.Com",
        "BBA",
        "B.Sc Mathematics",
        "B.Sc Physics",
        "B.Sc Chemistry",
      ],
    },
    tenthMarks: { type: Number, required: true, min: 0, max: 100 },
    twelfthMarks: { type: Number, required: true, min: 0, max: 100 },
    documents: [
      {
        filename: String,
        path: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    adminRemark: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);