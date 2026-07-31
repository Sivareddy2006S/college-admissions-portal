import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../utils/api.js";

const COURSES = [
  "B.Tech Computer Science", "B.Tech Electronics", "B.Tech Mechanical",
  "B.Com", "BBA", "B.Sc Mathematics", "B.Sc Physics", "B.Sc Chemistry",
];

const ApplicationForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || "", email: user?.email || "",
    phone: "", course: "", tenthMarks: "", twelfthMarks: "", address: "",
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    API.get("/applications/my")
      .then(() => setAlreadyApplied(true))
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    const tenth = Number(formData.tenthMarks);
    const twelfth = Number(formData.twelfthMarks);
    if (tenth < 0 || tenth > 100) return setError("10th marks must be 0-100");
    if (twelfth < 0 || twelfth > 100) return setError("12th marks must be 0-100");

    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => data.append(k, v));
      files.forEach((f) => data.append("documents", f));
      await API.post("/applications/submit", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Application submitted! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  if (alreadyApplied) return (
    <div className="dashboard-container">
      <div className="empty-state">
        <div className="empty-icon">✅</div>
        <h3>Already Submitted</h3>
        <p>You have already submitted your application.</p>
        <button className="btn-primary" style={{ width: "auto" }}
          onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
      </div>
    </div>
  );

  return (
    <div className="form-page-container">
      <div className="form-card">
        <h2>Admission Application Form</h2>
        <p className="form-subtitle">Fill all details carefully. All fields are required.</p>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <h3 className="section-heading">Personal Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input type="text" name="name" value={formData.name}
                onChange={handleChange} placeholder="As per certificate" required />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input type="email" name="email" value={formData.email}
                onChange={handleChange} placeholder="your@email.com" required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone *</label>
              <input type="tel" name="phone" value={formData.phone}
                onChange={handleChange} placeholder="10-digit number" required />
            </div>
            <div className="form-group">
              <label>Course *</label>
              <select name="course" value={formData.course} onChange={handleChange} required>
                <option value="">-- Select Course --</option>
                {COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Address *</label>
            <textarea name="address" value={formData.address} onChange={handleChange}
              placeholder="Full residential address" rows={3} required />
          </div>
          <h3 className="section-heading">Academic Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label>10th Marks (%) *</label>
              <input type="number" name="tenthMarks" value={formData.tenthMarks}
                onChange={handleChange} placeholder="e.g. 85" min="0" max="100" required />
            </div>
            <div className="form-group">
              <label>12th Marks (%) *</label>
              <input type="number" name="twelfthMarks" value={formData.twelfthMarks}
                onChange={handleChange} placeholder="e.g. 78" min="0" max="100" required />
            </div>
          </div>
          <h3 className="section-heading">Upload Documents</h3>
          <div className="form-group">
            <label>Documents (PDF/JPG/PNG — Max 5 files)</label>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple
              onChange={(e) => setFiles(Array.from(e.target.files))} className="file-input" />
            {files.length > 0 && (
              <ul className="file-preview-list">
                {files.map((f, i) => <li key={i}>📎 {f.name}</li>)}
              </ul>
            )}
          </div>
          <button type="submit" className="btn-primary btn-large" disabled={loading}>
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;