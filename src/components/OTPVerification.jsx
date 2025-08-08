// src/components/OTPVerification.jsx
import React, { useState, useRef } from 'react';
import './OTPVerification.css'; // optional styling

const OTPVerification = ({ email, onVerified }) => {
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
    if (enteredOtp.length !== 6) {
      setMessage('Please enter all 6 digits.');
      return;
    }

    try {
      const response = await fetch('http://localhost/trac-system/backend/verify_otp.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: enteredOtp }),
      });

      const data = await response.json();
      if (data.success) {
        setIsVerified(true);
        setMessage('OTP Verified!');
        setTimeout(() => onVerified && onVerified(), 1000);
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
      const response = await fetch('http://localhost/trac-system/backend/send_otp.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setMessage(data.message || 'OTP resent.');
    } catch {
      setMessage('Failed to resend code.');
    }
  };

  return (
    <div className="otp-verification">
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

      {!isVerified ? (
        <>
          <p className="resend-text">
            Didn’t receive code? <span onClick={handleResend}>Resend Code</span>
          </p>
          <button onClick={handleVerify}>Confirm</button>
        </>
      ) : (
        <>
          <p className="verified-text">OTP Verified!</p>
          <button onClick={onVerified}>Continue</button>
        </>
      )}

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default OTPVerification;
