// AuthenticationPage.jsx
import React, { useState } from "react";
import "./AuthenticationPage.css";

const AuthenticationPage = ({ onVerify }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost/tracsystem/backend/verify_otp.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });

      const data = await response.json();
      if (data.success) {
        onVerify(); // Call parent function to proceed
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost/tracsystem/backend/resend_otp.php", {
        method: "POST",
      });

      const data = await response.json();
      if (data.success) {
        alert("OTP has been resent to your email.");
      } else {
        setError(data.message || "Failed to resend OTP.");
      }
    } catch (err) {
      setError("Server error while resending OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src="/logo.png" alt="RCC TRACS Logo" className="auth-logo" />
        <h2>Email Verification</h2>
        <p>Enter the One-Time PIN (OTP) sent to your registered email.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            maxLength="6"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            required
          />
          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <button
          type="button"
          className="resend-btn"
          onClick={handleResend}
          disabled={isLoading}
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
};

export default AuthenticationPage;
