import React, { useState } from "react";
import PropTypes from "prop-types";
import "./LoginStyle.css";
import { useNavigate } from "react-router-dom";
import smallsmartLogo from "assets/images/logo-ct.png";

function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegisterClick = () => {
    setIsActive(true);
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/accounts/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        setIsActive(false); // Switch to login form
        setError("");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("An error occurred. Please try again.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/accounts/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data in localStorage or context if needed
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("isLoggedIn", "true");
        alert("Login successful!");
        onLoginSuccess(); // Call the callback to update parent state
        navigate("/dashboard"); // Use React Router navigation instead of window.location
      } else {
        setError(data.error || "Invalid username or password");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-form">
      <div className="auth-wrapper">
        <div className={`container ${isActive ? "active" : ""}`}>
          <div className="form-container sign-up">
            <form onSubmit={handleSignup}>
              <h1 style={{ fontFamily: "'Montserrat', sans-serif" }}>Create Account</h1>
              <span style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Use your username for registration
              </span>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <button type="submit">Sign Up</button>
              {error && <p className="error">{error}</p>}
            </form>
          </div>
          <div className="form-container sign-in">
            <form onSubmit={handleLogin}>
              <h1 style={{ fontFamily: "'Montserrat', sans-serif" }}>Sign In</h1>
              <span style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Use your username and Password for login
              </span>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <button type="submit" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Sign In
              </button>
              {error && <p className="error">{error}</p>}
            </form>
          </div>
          <div className="toggle-container">
            <div className="toggle">
              <div className="toggle-panel toggle-left">
                <img src={smallsmartLogo} alt="Logo" />
                <h1 style={{ fontFamily: "'Montserrat', sans-serif" }}>Welcome Back!</h1>
                <p style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Enter your personal details to use <br />
                  all of site features
                </p>
                <button className="hidden" id="login" onClick={handleLoginClick}>
                  Sign In
                </button>
              </div>
              <div className="toggle-panel toggle-right">
                <img src={smallsmartLogo} alt="Logo" />
                <h1 style={{ fontFamily: "'Montserrat', sans-serif" }}>Smart Guard!</h1>
                <p style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Register with your personal details <br />
                  to use all of site features
                </p>
                <button className="hidden" id="register" onClick={handleRegisterClick}>
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

LoginPage.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired,
};

export default LoginPage;
