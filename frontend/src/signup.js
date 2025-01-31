import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import './signup.css';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('donor'); // Default to 'donor'
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phone, setPhone] = useState(''); // New state for phone number
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          type: userType,
          city,
          zipCode,
          phone, // Include phone number in the request body
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Sign-up successful');
        console.log('Sign-up successful:', data);
        // Redirect to Sign-in page
        history.push('/signin');
      } else {
        setError(data.message || 'Sign-up failed');
        console.error('Sign-up error:', data);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Sign-up error:', error);
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="signup-form-group">
          <label className="signup-label" htmlFor="name">Name</label>
          <input
            className="signup-input"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="signup-form-group">
          <label className="signup-label" htmlFor="email">Email</label>
          <input
            className="signup-input"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="signup-form-group">
          <label className="signup-label" htmlFor="phone">Phone Number</label>
          <input
            className="signup-input"
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="signup-form-group">
          <label className="signup-label" htmlFor="password">Password</label>
          <input
            className="signup-input"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="signup-form-group">
          <label className="signup-label" htmlFor="city">City</label>
          <input
            className="signup-input"
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div className="signup-form-group">
          <label className="signup-label" htmlFor="zipCode">Zip Code</label>
          <input
            className="signup-input"
            type="text"
            id="zipCode"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            required
          />
        </div>
        <div className="signup-form-group">
          <label className="signup-label" htmlFor="userType">User Type</label>
          <select
            className="signup-select"
            id="userType"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            required
          >
            <option value="donor">Donor</option>
            <option value="community-partner">Community Partner</option>
          </select>
        </div>
        <button className="signup-button" type="submit">Sign Up</button>
      </form>
      {error && <div className="signup-error">{error}</div>}
      {success && <div className="signup-success">{success}</div>}
      <div className="signup-footer">
        <Link to="/signin">Already have an account? Sign In</Link>
      </div>
    </div>
  );
};

export default SignUp;