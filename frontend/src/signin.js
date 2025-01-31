import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import './signin.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('donor'); // Default to 'donor'
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          type: userType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Login successful');
        console.log('Login successful:', data);
        // Redirect to Home page
        history.push('/');
      } else {
        setError(data.message || 'Login failed');
        console.error('Login error:', data);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="userType">User Type</label>
          <select
            id="userType"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            required
          >
            <option value="donor">Donor</option>
            <option value="community-partner">Community Partner</option>
          </select>
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <div className="signup-link">
        <Link to="/signup">Do not have an account? Sign Up</Link>
      </div>
    </div>
  );
};

export default SignIn;