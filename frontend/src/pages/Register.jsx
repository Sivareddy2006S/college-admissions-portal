import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../utils/api.js"; // This is your configured axios instance

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirmPassword: "", role: "student",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (formData.password !== formData.confirmPassword)
      return setError("Passwords do not match");
    if (formData.password.length < 6)
      return setError("Password must be at least 6 characters");

    setLoading(true);
    try {
      // ✅ FIX: Use API instead of axios
      const res = await API.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      setSuccess("Registration successful! Redirecting...");
      
      // Save user data to your Context/LocalStorage
      login(res.data.user, res.data.token);

      setTimeout(() => {
        navigate(res.data.user.role === "admin" ? "/admin" : "/dashboard");
      }, 1000);
    } catch (err) {
      // ✅ FIX: Improved error catching
      setError(err.response?.data?.message || "Registration failed. Check if Backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="auth-subtitle">Join the admissions portal</p>
        {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
        {success && <div style={{ color: "green", marginBottom: "10px" }}>{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" style={{ display: "block", width: "100%" }}
              value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" style={{ display: "block", width: "100%" }}
              value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" style={{ display: "block", width: "100%" }}
              value={formData.password} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" style={{ display: "block", width: "100%" }}
              value={formData.confirmPassword} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Register As</label>
            <select name="role" value={formData.role} onChange={handleChange} style={{ display: "block", width: "100%" }}>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" disabled={loading} style={{ marginTop: "20px", width: "100%" }}>
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>
        <p style={{ marginTop: "15px" }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;