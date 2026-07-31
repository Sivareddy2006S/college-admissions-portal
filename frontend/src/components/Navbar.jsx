import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">🎓 College Admissions Portal</Link>
      </div>
      <div className="navbar-links">
        {user ? (
          <>
            {user.role === "student" && (
              <>
                <Link to="/dashboard">My Dashboard</Link>
                <Link to="/apply">Apply Now</Link>
              </>
            )}
            {user.role === "admin" && (
              <Link to="/admin">Admin Panel</Link>
            )}
            <span className="navbar-user">👤 {user.name}</span>
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;