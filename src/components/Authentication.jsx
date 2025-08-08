// src/components/Authentication.jsx
import React, { useState, useRef } from 'react';
import './Authentication.css';

const Authentication = ({ userId, onSuccess }) => {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [message, setMessage] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const inputs = useRef([]);

  const handleChange = (element, index) => {
    const val = element.value;
    if (/^[0-9]$/.test(val)) {
      const newOtp = [...otp];
      newOtp[index] = val;
      setOtp(newOtp);

      // Focus next input
      if (index < 5 && inputs.current[index + 1]) {
        inputs.current[index + 1].focus();
      }
    } else if (val === '') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) return setMessage('Please enter a 6-digit code.');

    try {
      const response = await fetch('http://localhost/trac-system/backend/verify_otp.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, otp: enteredOtp }),
      });

      const data = await response.json();
      if (data.success) {
        setIsVerified(true);
        setMessage('OTP Verified!');
        setTimeout(() => onSuccess && onSuccess(), 1000);
      } else {
        setMessage(data.message || 'Invalid OTP');
      }
    } catch (error) {
      setMessage('Server error.');
    }
  };

  const handleResend = async () => {
    setMessage('Resending...');
    try {
      const response = await fetch('http://localhost/trac-system/backend/resend_otp.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      setMessage(data.message || 'OTP resent');
    } catch {
      setMessage('Failed to resend code.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Authentication</h2>
        <p>We’ve sent a one-time password to your email</p>

        <div className="otp-inputs">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              ref={(el) => (inputs.current[idx] = el)}
            />
          ))}
        </div>

        {!isVerified && (
          <>
            <p className="resend-text">
              Didn’t receive code? <span onClick={handleResend}>Resend Code</span>
            </p>
            <button onClick={handleVerify}>Confirm</button>
          </>
        )}

        {isVerified && (
          <>
            <p className="verified-text">OTP Verified!</p>
            <button onClick={onSuccess}>Continue</button>
          </>
        )}

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Authentication;
