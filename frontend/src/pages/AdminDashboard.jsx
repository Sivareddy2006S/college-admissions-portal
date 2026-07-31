import React, { useState, useEffect, useCallback } from "react";
import API from "../utils/api.js";

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [remark, setRemark] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await API.get("/admin/stats");
      setStats(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      let query = "/admin/applications?";
      if (search) query += "search=" + search + "&";
      if (statusFilter) query += "status=" + statusFilter;
      const res = await API.get(query);
      setApplications(res.data.applications);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [search, statusFilter]);

  useEffect(() => { fetchStats(); }, []);
  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  const handleStatusUpdate = async (id, newStatus) => {
    setActionLoading(true);
    try {
      await API.put("/admin/applications/" + id + "/status", { status: newStatus, adminRemark: remark });
      setSelected(null); setRemark("");
      fetchApplications(); fetchStats();
    } catch (err) { alert(err.response?.data?.message || "Failed"); }
    finally { setActionLoading(false); }
  };

  const badge = (s) => s === "Approved" ? "badge badge-approved" : s === "Rejected" ? "badge badge-rejected" : "badge badge-pending";

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage all student admission applications.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-blue"><div className="stat-value">{stats.total}</div><div className="stat-label">Total</div></div>
        <div className="stat-card stat-orange"><div className="stat-value">{stats.pending}</div><div className="stat-label">Pending</div></div>
        <div className="stat-card stat-green"><div className="stat-value">{stats.approved}</div><div className="stat-label">Approved</div></div>
        <div className="stat-card stat-red"><div className="stat-value">{stats.rejected}</div><div className="stat-label">Rejected</div></div>
      </div>

      <div className="filter-bar">
        <input type="text" placeholder="Search by name or email..." value={search}
          onChange={(e) => setSearch(e.target.value)} className="filter-input" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button className="btn-secondary" onClick={() => { setSearch(""); setStatusFilter(""); }}>Clear</button>
      </div>

      {loading ? <div className="loading-screen">Loading...</div> : applications.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">📭</div><h3>No applications found</h3></div>
      ) : (
        <div className="table-container">
          <table className="app-table">
            <thead>
              <tr><th>#</th><th>Name</th><th>Email</th><th>Course</th><th>10th</th><th>12th</th><th>Status</th><th>Date</th><th>Action</th></tr>
            </thead>
            <tbody>
              {applications.map((app, i) => (
                <tr key={app._id}>
                  <td>{i + 1}</td><td>{app.name}</td><td>{app.email}</td><td>{app.course}</td>
                  <td>{app.tenthMarks}%</td><td>{app.twelfthMarks}%</td>
                  <td><span className={badge(app.status)}>{app.status}</span></td>
                  <td>{new Date(app.createdAt).toLocaleDateString("en-IN")}</td>
                  <td><button className="btn-view" onClick={() => { setSelected(app); setRemark(app.adminRemark || ""); }}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selected.name}</h3>
              <span className={badge(selected.status)}>{selected.status}</span>
            </div>
            <div className="details-grid modal-grid">
              {[["Email", selected.email], ["Phone", selected.phone], ["Course", selected.course],
                ["10th", selected.tenthMarks + "%"], ["12th", selected.twelfthMarks + "%"], ["Address", selected.address]
              ].map(([label, value]) => (
                <div className="detail-row" key={label}>
                  <span className="detail-label">{label}</span>
                  <span className="detail-value">{value}</span>
                </div>
              ))}
            </div>
            {selected.documents?.length > 0 && (
              <div className="documents-section">
                <h4>Documents</h4>
                <ul className="document-list">
                  {selected.documents.map((doc, i) => (
                    <li key={i}><a href={"/uploads/" + doc.path} target="_blank" rel="noopener noreferrer">📄 {doc.filename}</a></li>
                  ))}
                </ul>
              </div>
            )}
            <div className="form-group" style={{ marginTop: "1rem" }}>
              <label>Admin Remark (optional)</label>
              <textarea value={remark} onChange={(e) => setRemark(e.target.value)} rows={2} placeholder="Add a note..." />
            </div>
            <div className="modal-actions">
              <button className="btn-approve" disabled={actionLoading || selected.status === "Approved"}
                onClick={() => handleStatusUpdate(selected._id, "Approved")}>✅ Approve</button>
              <button className="btn-reject" disabled={actionLoading || selected.status === "Rejected"}
                onClick={() => handleStatusUpdate(selected._id, "Rejected")}>❌ Reject</button>
              <button className="btn-secondary" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;