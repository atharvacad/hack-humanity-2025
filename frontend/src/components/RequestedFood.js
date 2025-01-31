// src/components/RequestedFood.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: 'http://localhost:3001/api'
});

const RequestedFood = () => {
  const [foodRequests, setFoodRequests] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFoodRequests = async () => {
      const userCookie = Cookies.get('user');
      if (!userCookie) {
        setError('User data not found in cookies');
        return;
      }

      const userData = JSON.parse(userCookie);
      const { id, type } = userData;

      if (type !== 'donor') {
        setError('User is not a donor');
        return;
      }

      try {
        const response = await api.get(`/food-requests/get-donor-requests/${id}`);
        setFoodRequests(response.data.data);
        setError('');
      } catch (err) {
        setError(err.response ? err.response.data.error : 'Error fetching data');
      }
    };

    fetchFoodRequests();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Requested Food</h2>
      {error && <p className="text-danger">{error}</p>}
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Food Name</th>
            <th>Quantity Requested</th>
            <th>Pickup Date</th>
            <th>Request Date</th>
            <th>Total Quantity</th>
            <th>Community Partner Name</th>
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
              <td>{request.community_partner_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestedFood;