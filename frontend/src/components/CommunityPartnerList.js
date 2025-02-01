// src/components/CommunityPartnerList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './CommunityPartnerList.css'; // Import the custom CSS

const api = axios.create({
  baseURL: 'http://localhost:3001/api'
});

const CommunityPartnerList = () => {
  const [communityPartners, setCommunityPartners] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommunityPartners = async () => {
      const userCookie = Cookies.get('user');
      if (!userCookie) {
        setError('User data not found in cookies');
        navigate('/404');
        return;
      }

      const userData = JSON.parse(userCookie);
      const { type } = userData;

      if (type !== 'donor') {
        setError('User is not a donor');
        navigate('/404');
        return;
      }

      try {
        const response = await api.get('/community-partners/get-community-partners-list');
        setCommunityPartners(response.data.data);
        setError('');
      } catch (err) {
        setError(err.response ? err.response.data.error : 'Error fetching data');
      }
    };

    fetchCommunityPartners();
  }, [navigate]);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Community Partners List</h2>
      <p className="lead">Here you can see all the community partners. </p>
      {error && <p className="text-danger">{error}</p>}
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Name</th>
            <th>Contact Name</th>
            <th>Contact Email</th>
            <th>Contact Phone</th>
            <th>Address</th>
            <th>City</th>
            <th>Zip Code</th>
          </tr>
        </thead>
        <tbody>
          {communityPartners.map((partner) => (
            <tr key={partner.community_partner_id}>
              <td>{partner.name}</td>
              <td>{partner.contact_name}</td>
              <td>{partner.contact_email}</td>
              <td>{partner.contact_phone}</td>
              <td>{partner.address}</td>
              <td>{partner.city}</td>
              <td>{partner.zip_code}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4">Thank you for your interest in our community partners! Your support helps us make a significant impact.</p>
    </div>
  );
};

export default CommunityPartnerList;