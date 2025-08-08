import React, { useState } from 'react';
import './LoginPage.css';
import OTPVerification from './OTPVerification'

const LoginPage = () => {
  const [step, setStep] = useState('login'); // 'login' | 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const res = await fetch('http://localhost/trac-system/backend/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        setStep('otp');
        // No need to call send_otp.php again!
      } else {
        setErrorMsg(data.message);
      }
    } catch (error) {
      setErrorMsg('Unable to connect to the server.');
    }
  };

  const handleOtpVerified = () => {
    alert('Login + OTP verified!');
    // TODO: Redirect or store session/token
  };

  return (
    <div className="login-container">
      <div className="left-side">
        <div className="logo-wrapper">
          <img src="/logo.png" alt="RCC TRACS Logo" className="logo" />
        </div>
      </div>

      <div className="right-side">
        <div className="form-card">
          {step === 'login' && (
            <>
              <h2>Log in</h2>
              <p>Welcome to TRAC System</p>
              <form onSubmit={handleLogin}>
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button type="submit">Log In</button>
              </form>
              {errorMsg && <p className="error-msg">{errorMsg}</p>}
            </>
          )}

          {step === 'otp' && (
            <OTPVerification email={email} onVerified={handleOtpVerified} />
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;