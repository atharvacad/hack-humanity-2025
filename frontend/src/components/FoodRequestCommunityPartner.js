// src/components/FoodRequestCommunityPartner.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './FoodRequestCommunityPartner.css'; // Import the custom CSS

const api = axios.create({
  baseURL: 'http://localhost:3001/api'
});

const FoodRequestCommunityPartner = () => {
  const [foodRequests, setFoodRequests] = useState([]);
  const [error, setError] = useState('');
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    const fetchFoodRequests = async () => {
      const userCookie = Cookies.get('user');
      if (!userCookie) {
        setError('User data not found in cookies');
        return;
      }

      const userData = JSON.parse(userCookie);
      const { id, type } = userData;

      if (type !== 'community-partner') {
        setError('User is not a community partner');
        return;
      }

      try {
        const response = await api.get(`/food-requests/get-food-requests/${id}`);
        setFoodRequests(response.data.data);
        setError('');
      } catch (err) {
        setError(err.response ? err.response.data.error : 'Error fetching data');
      }
    };

    fetchFoodRequests();
  }, []);

  const toggleRow = (food_request_id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [food_request_id]: !prev[food_request_id]
    }));
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Food Requests for Community Partner</h2>
      <p className="lead">Here you can see all the food requests made by your community. Click on "Show Donor Info" to view more information about each donor.</p>
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {foodRequests.map((request) => (
            <React.Fragment key={request.food_request_id}>
              <tr>
                <td>{request.food_name}</td>
                <td>
                  <span className="badge badge-primary">{request.quantity_requested}</span>
                </td>
                <td>{new Date(request.pickupdate).toLocaleDateString()}</td>
                <td>{new Date(request.request_date).toLocaleDateString()}</td>
                <td>{request.total_quantity}</td>
                <td>{request.available_quantity}</td>
                <td>
                  <button
                    className="btn btn-info mb-2"
                    onClick={() => toggleRow(request.food_request_id)}
                  >
                    {expandedRows[request.food_request_id] ? 'Hide Donor Info' : 'Show Donor Info'}
                  </button>
                </td>
              </tr>
              {expandedRows[request.food_request_id] && (
                <tr>
                  <td colSpan="7">
                    <div className="details">
                      <p><strong>Donor Name:</strong> {request.donor_name}</p>
                      <p><strong>Donor Email:</strong> {request.donor_email}</p>
                      <p><strong>Donor Phone:</strong> {request.donor_phone}</p>
                      <p><strong>Donor Address:</strong> {request.donor_address}</p>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FoodRequestCommunityPartner;