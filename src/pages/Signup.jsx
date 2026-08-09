import { useState } from "react";
import "./Signup.css";
import { useNavigate, Link } from "react-router-dom";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    // Check for empty fields
    if (
      !fullName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      alert("Please fill all fields.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Phone number validation
    if (phone.length !== 10) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }

    // Password length validation
    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    // Confirm password
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Terms & Conditions
    if (!agree) {
      alert("Please accept the Terms & Conditions.");
      return;
    }

    // Send data to Express + MongoDB
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName,
            email,
            phone,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Signup failed.");
        return;
      }

      alert("Account Created Successfully!");

      // Go to Login page
      navigate("/");

    } catch (error) {
      console.error("Signup Error:", error);

      alert(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">

        <form onSubmit={handleSignup}>

          {/* Logo */}
          <img
            src="/hero.png"
            alt="Agrove Logo"
            className="logo"
          />

          {/* Title */}
          <div className="title-section">
            <h1>AgrooveInd</h1>
            <p className="subtitle">
              Create Your Farmer Account
            </p>
          </div>

          {/* Full Name */}
          <div className="input-box">
            <FaUser className="icon" />

            <label>Username</label>

            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="input-box">
            <FaEnvelope className="icon" />

            <label>Email</label>

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Phone */}
          <div className="input-box">
            <FaPhone className="icon" />

            <label>Phone Number</label>

            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              maxLength={10}
              onChange={(e) =>
                setPhone(
                  e.target.value.replace(/[^0-9]/g, "")
                )
              }
            />
          </div>

          {/* Password */}
          <div className="input-box">
            <FaLock className="icon" />

            <label>Password</label>

            <input
              type={showPassword ? "text" : "password"}
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

          {/* Confirm Password */}
          <div className="input-box">
            <FaLock className="icon" />

            <label>ConfirmPassword</label>

            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
            />

            {showConfirmPassword ? (
              <FaEye
                className="eye"
                onClick={() =>
                  setShowConfirmPassword(false)
                }
              />
            ) : (
              <FaEyeSlash
                className="eye"
                onClick={() =>
                  setShowConfirmPassword(true)
                }
              />
            )}
          </div>

          {/* Checkbox */}
          <div className="signup-footer">

            <label className="checkbox">

              <input
                type="checkbox"
                checked={agree}
                onChange={(e) =>
                  setAgree(e.target.checked)
                }
              />

              <span>
                I agree to Terms & Conditions
              </span>

            </label>

            {/* Create Account Button */}
            <button
              className="create-account-btn"
              type="submit"
            >
              Create Account
            </button>

            {/* Login */}
            <p className="login-link">
              Already have an account?
              <Link to="/">
                {" "}Login
              </Link>
            </p>

          </div>

        </form>

      </div>
    </div>
  );
}

export default Signup;