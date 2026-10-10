import React from 'react';
import { Link } from 'react-router-dom';  // ✅ import Link

const Navbar = () => {
  return (
    <nav style={{ padding: "10px", background: "#333", color: "#fff" }}>
      <Link to="/" style={{ color: "#fff", marginRight: "15px" }}>Home</Link>
      <Link to="/login" style={{ color: "#fff", marginRight: "15px" }}>Login</Link>
      <Link to="/admin/dashboard" style={{ color: "#fff", marginRight: "15px" }}>Admin</Link>
      <Link to="/customer/dashboard" style={{ color: "#fff" }}>Customer</Link>
    </nav>
  );
};

export default Navbar;
