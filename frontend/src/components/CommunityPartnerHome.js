// src/components/CommunityPartnerHome.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import './CommunityPartnerHome.css'; // Import the custom CSS

const CommunityPartnerHome = () => {
  const [partnerData, setPartnerData] = useState(null);
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

    if (type !== 'community-partner') {
      navigate('/404');
      return;
    }

    const fetchPartnerData = async () => {
      try {
        const response = await axios.post('http://localhost:3001/api/community-partners/get-community-partner-by-id-and-email', {
          id,
          email
        });
        console.log('Response data:', response.data);
        if (response.data && response.data.data) {
          setPartnerData(response.data.data);
        } else {
          setError('Invalid response data');
        }
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Error fetching community partner data');
      }
    };

    fetchPartnerData();
  }, [navigate]);

  if (error) {
    return <div className="container mt-5"><p className="text-danger">{error}</p></div>;
  }

  if (!partnerData) {
    return <div className="container mt-5"><p>Loading...</p></div>;
  }

  return (
    <div className="container mt-5 community-partner-home">
      <h2 className="mb-4">Welcome, {partnerData.name}!</h2>
      <p className="lead">Thank you for being a valued community partner. Your efforts make a significant impact in our community.</p>
      <div className="partner-info">
        <p><strong>Contact Name:</strong> {partnerData.contact_name}</p>
        <p><strong>Contact Email:</strong> {partnerData.contact_email}</p>
        <p><strong>Contact Phone:</strong> {partnerData.contact_phone}</p>
        <p><strong>Address:</strong> {partnerData.address}</p>
        <p><strong>City:</strong> {partnerData.city}</p>
        <p><strong>Zip Code:</strong> {partnerData.zip_code}</p>
      </div>
      <p className="mt-4">We appreciate your dedication and support. Together, we can make a difference!</p>
    </div>
  );
};

export default CommunityPartnerHome;