import React, { useState } from 'react';
import './LoginPage.css';
import OTPVerification from './OTPVerification';

const LoginPage = () => {
  const [step, setStep] = useState('login'); // 'login' | 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null); // Store user ID for OTP step

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost/tracsystem/backend/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // Handle non-200 HTTP responses
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        setUserId(data.userId);
        setStep('otp');
      } else {
        setErrorMsg(data.message || 'Login failed.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMsg('Unable to connect to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerified = () => {
    alert('Login + OTP verified!');
    // TODO: Redirect to dashboard or store session token here
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

                <button type="submit" disabled={loading}>
                  {loading ? 'Logging in...' : 'Log In'}
                </button>
              </form>
              {errorMsg && <p className="error-msg">{errorMsg}</p>}
            </>
          )}

          {step === 'otp' && (
            <OTPVerification
              email={email}
              userId={userId}
              onVerified={handleOtpVerified}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
