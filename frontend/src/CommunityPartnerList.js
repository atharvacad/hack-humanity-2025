// src/components/CommunityPartnerList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api'
});

const CommunityPartnerList = () => {
  const [communityPartnerList, setCommunityPartnerList] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCommunityPartnerList = async () => {
      try {
        const response = await api.get('/community-partners/get-community-partners-list');
        setCommunityPartnerList(response.data.data);
        setError('');
      } catch (err) {
        setError(err.response ? err.response.data.error : 'Error fetching data');
      }
    };

    fetchCommunityPartnerList();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Community Partner List</h2>
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
          {communityPartnerList.map((partner) => (
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
    </div>
  );
};

export default CommunityPartnerList;