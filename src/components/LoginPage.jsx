import React, { useState } from 'react';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost/trac-system/backend/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.success) {
      alert('Login successful!');
    } else {
      setErrorMsg(data.message);
    }
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
          <h2>Log in</h2>
          <p>Welcome to TRAC System</p>
          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

            <button type="submit">Log In</button>
          </form>
          {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
