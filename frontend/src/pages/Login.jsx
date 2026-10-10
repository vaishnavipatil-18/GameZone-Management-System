import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      alert("Please select a role before signing in.");
      return;
    }

    setLoading(true);
    console.log("📤 Sending login data to backend...", { email, password, role });

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, role })
      });

      console.log("📥 Backend response status:", response.status);
      
      const data = await response.json();
      console.log("📥 Backend response data:", data);

      if (response.ok) {
        console.log("✅ Login Successful!");
        
        // ✅ FIX: Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log("💾 User data saved to localStorage:", data.user);
        
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/customer/dashboard");
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      alert("Login failed. Please check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Sign in as</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">-- Select Role --</option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
            </select>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="register-text">
          Don't have an account?{" "}
          <span className="register-link" onClick={handleRegister}>
            Register here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;