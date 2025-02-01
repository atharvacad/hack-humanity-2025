// src/components/SignOut.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const SignOut = ({ onUserUpdate }) => {
  const navigate = useNavigate();

  useEffect(() => {
    Cookies.remove('user');
    onUserUpdate(null);
    navigate('/signin');
  }, [navigate, onUserUpdate]);

  return (
    <div className="container mt-5">
      <h2>Signing out...</h2>
    </div>
  );
};

export default SignOut;