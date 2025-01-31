// src/DonorHome.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const DonorHome = () => {
  const [donorData, setDonorData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userCookie = Cookies.get('user');
    if (!userCookie) {
      navigate('/404');
      return;
    }

    const userData = JSON.parse(userCookie);
    const { id, email, type } = userData;

    if (type !== 'donor') {
      navigate('/404');
      return;
    }

    const fetchDonorData = async () => {
      try {
        const response = await axios.post('http://localhost:3001/api/donors/get-donor-by-id-and-email', {
          id,
          email
        });
        console.log('Response data:', response.data);
        if (response.data && response.data.data) {
          setDonorData(response.data.data);
        } else {
          setError('Invalid response data');
        }
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Error fetching donor data');
      }
    };

    fetchDonorData();
  }, [navigate]);

  if (error) {
    return <div className="container mt-5"><p className="text-danger">{error}</p></div>;
  }

  if (!donorData) {
    return <div className="container mt-5"><p>Loading...</p></div>;
  }

  return (
    <div className="container mt-5">
      <h2>Welcome, {donorData.name}!</h2>
      <p><strong>Contact Name:</strong> {donorData.contact_name}</p>
      <p><strong>Contact Email:</strong> {donorData.contact_email}</p>
      <p><strong>Contact Phone:</strong> {donorData.contact_phone}</p>
      <p><strong>Address:</strong> {donorData.address}</p>
      <p><strong>City:</strong> {donorData.city}</p>
      <p><strong>Zip Code:</strong> {donorData.zip_code}</p>
    </div>
  );
};

export default DonorHome;