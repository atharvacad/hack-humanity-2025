// src/signin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const SignIn = ({ onUserUpdate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState('donor');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const response = await axios.post('http://localhost:3001/login', {
        email,
        password,
        type
      });
      setError('');
      console.log(response.data);

      // Set cookie with session data
      const userData = {
        id: type === 'donor' ? response.data.data.donor_id : response.data.data.community_partner_id,
        email: response.data.data.contact_email,
        type: type
      };
      Cookies.set('user', JSON.stringify(userData), { expires: 1 }); // Cookie expires in 1 day

      // Update user data in the parent component
      onUserUpdate(userData);

      // Navigate to the appropriate home page based on user type
      if (type === 'donor') {
        navigate('/donor-home');
      } else if (type === 'community-partner') {
        navigate('/community-partner-home');
      }
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Error signing in');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Sign In</h2>
      {error && <p className="text-danger">{error}</p>}
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Password:</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Type:</label>
        <select
          className="form-control"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="donor">Donor</option>
          <option value="community-partner">Community Partner</option>
        </select>
      </div>
      <button className="btn btn-primary" onClick={handleSignIn}>
        Sign In
      </button>
    </div>
  );
};

export default SignIn;