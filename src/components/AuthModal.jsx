"use client";

import { useState } from "react";
import { FiEye, FiEyeOff, FiX } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import "./AuthModal.css";

function AuthModal({ onClose }) {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const friendlyError = (code) => {
    switch (code) {
      case "auth/invalid-email": return "Invalid email address.";
      case "auth/email-already-in-use": return "An account with this email already exists. Please login.";
      case "auth/weak-password": return "Password must be at least 6 characters.";
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found": return "Invalid email or password.";
      case "auth/network-request-failed": return "Network error. Check your connection.";
      default: return "Something went wrong. Please try again.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (mode === "signup" && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "signup") {
        await signup(name || email.split("@")[0], email, password);
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err) {
      alert(friendlyError(err?.code));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose} aria-label="Close">
          <FiX />
        </button>

        <h2 className="auth-title">{mode === "login" ? "Login" : "Sign Up"}</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === "signup" && (
            <div className="auth-field">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
          )}

          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <div className="auth-password">
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="auth-eye"
                onClick={() => setShowPwd((s) => !s)}
                aria-label={showPwd ? "Hide password" : "Show password"}
              >
                {showPwd ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {mode === "signup" && (
            <div className="auth-field">
              <label>Confirm Password</label>
              <div className="auth-password">
                <input
                  type={showConfirmPwd ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="auth-eye"
                  onClick={() => setShowConfirmPwd((s) => !s)}
                  aria-label={showConfirmPwd ? "Hide password" : "Show password"}
                >
                  {showConfirmPwd ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
          )}

          {mode === "login" && (
            <a className="auth-forgot" onClick={(e) => e.preventDefault()}>
              Forgot password?
            </a>
          )}

          <button type="submit" className="auth-submit" disabled={submitting}>
            {mode === "login" ? "Login" : "Create Account"}
          </button>
        </form>

        <div className="auth-switch">
          {mode === "login" ? (
            <>
              Don't have an Account?{" "}
              <a onClick={() => setMode("signup")}>Signup</a>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <a onClick={() => setMode("login")}>Login</a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
