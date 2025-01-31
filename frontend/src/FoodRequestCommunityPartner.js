// src/components/FoodRequests.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api'
});

const FoodRequestCommunityPartner = ({ communityPartnerId }) => {
  const [foodRequests, setFoodRequests] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFoodRequests = async () => {
      try {
        const response = await api.get(`/food-requests/get-food-requests/${communityPartnerId}`);
        setFoodRequests(response.data.data);
        setError('');
      } catch (err) {
        setError(err.response ? err.response.data.error : 'Error fetching data');
      }
    };

    fetchFoodRequests();
  }, [communityPartnerId]);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Food Requests for Community Partner {communityPartnerId}</h2>
      {error && <p className="text-danger">{error}</p>}
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Food Name</th>
            <th>Quantity Requested</th>
            <th>Pickup Date</th>
            <th>Request Date</th>
            <th>Total Quantity</th>
            <th>Available Quantity</th>
          </tr>
        </thead>
        <tbody>
          {foodRequests.map((request) => (
            <tr key={request.food_request_id}>
              <td>{request.food_name}</td>
              <td>{request.quantity_requested}</td>
              <td>{request.pickupdate}</td>
              <td>{request.request_date}</td>
              <td>{request.total_quantity}</td>
              <td>{request.available_quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FoodRequestCommunityPartner;