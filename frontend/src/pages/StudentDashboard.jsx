import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../utils/api.js";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get("/applications/my");
        setApplication(res.data.application);
      } catch (err) {
        if (err.response?.status !== 404)
          setError("Failed to load. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const getStatusClass = (status) => {
    if (status === "Approved") return "badge badge-approved";
    if (status === "Rejected") return "badge badge-rejected";
    return "badge badge-pending";
  };

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name} 👋</h1>
        <p>Track your admission application status below.</p>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      {!application ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No Application Found</h3>
          <p>You haven't submitted an application yet.</p>
          <Link to="/apply" className="btn-primary" style={{ width: "auto" }}>
            Apply for Admission
          </Link>
        </div>
      ) : (
        <div className="application-card">
          <div className="application-card-header">
            <h2>Your Application</h2>
            <span className={getStatusClass(application.status)}>
              {application.status}
            </span>
          </div>
          {application.adminRemark && (
            <div className="remark-box">
              <strong>Admin Remark:</strong> {application.adminRemark}
            </div>
          )}
          <div className="details-grid">
            <DetailRow label="Full Name" value={application.name} />
            <DetailRow label="Email" value={application.email} />
            <DetailRow label="Phone" value={application.phone} />
            <DetailRow label="Course" value={application.course} />
            <DetailRow label="10th Marks" value={application.tenthMarks + "%"} />
            <DetailRow label="12th Marks" value={application.twelfthMarks + "%"} />
            <DetailRow label="Address" value={application.address} />
            <DetailRow
              label="Submitted On"
              value={new Date(application.createdAt).toLocaleDateString("en-IN")}
            />
          </div>
          {application.documents?.length > 0 && (
            <div className="documents-section">
              <h4>Uploaded Documents</h4>
              <ul className="document-list">
                {application.documents.map((doc, i) => (
                  <li key={i}>
                    <a href={"/uploads/" + doc.path} target="_blank" rel="noopener noreferrer">
                      📄 {doc.filename}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="detail-row">
    <span className="detail-label">{label}</span>
    <span className="detail-value">{value}</span>
  </div>
);

export default StudentDashboard;