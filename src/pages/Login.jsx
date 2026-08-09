import "./Login.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

function Login() {
  // ===========================
  // States
  // ===========================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ===========================
  // Navigation
  // ===========================
  const navigate = useNavigate();

  // ===========================
  // Login Function
  // ===========================
  const handleLogin = async (e) => {
    e.preventDefault();

    // Validation
    if (!email.trim() || !password.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      // Backend error
      if (!response.ok) {
        alert(data.message || "Login failed.");
        return;
      }

      // Save JWT token
      localStorage.setItem("token", data.token);

      // Save logged-in user information
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      alert("Login Successful!");

      // Clear fields
      setEmail("");
      setPassword("");

      // Go to dashboard
      navigate("/dashboard");

    } catch (error) {
      console.error("Login Error:", error);

      alert(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <form onSubmit={handleLogin}>

          {/* Logo */}
          <img
            src="/hero.png"
            alt="Agrove Logo"
            className="logo"
          />

          {/* Heading */}
          <div className="title-section">
            <h1>AgrooveInd</h1>

            <p className="subtitle">
              Digital Farm Management Portal
            </p>
          </div>

          <h2>Welcome Back!</h2>

          <p className="desc">
            Login to manage your farm efficiently.
          </p>

          {/* Email */}
          <div className="input-box">
            <FaEnvelope className="icon" />

            <label>Username</label>

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </div>

          {/* Password */}
          <div className="input-box">
            <FaLock className="icon" />

            <label>Password</label>

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            {showPassword ? (
              <FaEye
                className="eye"
                onClick={() =>
                  setShowPassword(false)
                }
              />
            ) : (
              <FaEyeSlash
                className="eye"
                onClick={() =>
                  setShowPassword(true)
                }
              />
            )}
          </div>

          {/* Remember Me */}
          <div className="options">
            <label>
              <input type="checkbox" />
              Remember Me
            </label>

            <a href="#">
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="login-btn"
          >
            Login
          </button>

          {/* Register */}
          <p className="register">
            Don't have an account?

            <Link to="/signup">
              {" "}Register
            </Link>
          </p>

        </form>

      </div>
    </div>
  );
}

export default Login;