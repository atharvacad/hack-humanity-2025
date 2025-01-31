// src/components/DonorList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api'
});

const DonorList = () => {
  const [donorList, setDonorList] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDonorList = async () => {
      try {
        const response = await api.get('/donors/get-donors-list');
        setDonorList(response.data.data);
        setError('');
      } catch (err) {
        setError(err.response ? err.response.data.error : 'Error fetching data');
      }
    };

    fetchDonorList();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Donor List</h2>
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
          {donorList.map((donor) => (
            <tr key={donor.donor_id}>
              <td>{donor.name}</td>
              <td>{donor.contact_name}</td>
              <td>{donor.contact_email}</td>
              <td>{donor.contact_phone}</td>
              <td>{donor.address}</td>
              <td>{donor.city}</td>
              <td>{donor.zip_code}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DonorList;