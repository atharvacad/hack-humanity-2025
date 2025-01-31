// src/components/ViewFoodList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
  baseURL: 'http://localhost:3001/api'
});

const ViewFoodList = () => {
  const [foodList, setFoodList] = useState([]);
  const [error, setError] = useState('');
  const [quantityRequested, setQuantityRequested] = useState({});
  const [expandedRows, setExpandedRows] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoodList = async () => {
      try {
        const response = await api.get('/foods/get-food-list');
        setFoodList(response.data.data);
        setError('');
      } catch (err) {
        setError(err.response ? err.response.data.error : 'Error fetching data');
      }
    };

    fetchFoodList();
  }, []);

  const toggleRow = (foods_id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [foods_id]: !prev[foods_id]
    }));
  };

  const handleQuantityChange = (foods_id, value) => {
    setQuantityRequested((prev) => ({
      ...prev,
      [foods_id]: value
    }));
  };

  const handleRequestFood = async (foods_id) => {
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
      const response = await api.post('/food-requests/food-requests', {
        foods_id,
        community_partner_id: id,
        quantity_requested: quantityRequested[foods_id] || 1
      });
      if (response.data.message === 'success') {
        navigate(`/food-requests/${id}`);
      } else {
        setError('Failed to request food');
      }
    } catch (err) {
      setError(err.response ? err.response.data.error : 'Error requesting food');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Food List</h2>
      {error && <p className="text-danger">{error}</p>}
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Food Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Packaging Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {foodList.map((food) => (
            <React.Fragment key={food.foods_id}>
              <tr>
                <td>{food.food_name}</td>
                <td>{food.food_type}</td>
                <td>{food.description}</td>
                <td>{food.quantity}</td>
                <td>{food.unit}</td>
                <td>{food.packaging_type}</td>
                <td>
                  <button
                    className="btn btn-info mb-2"
                    onClick={() => toggleRow(food.foods_id)}
                  >
                    {expandedRows[food.foods_id] ? 'Hide Details' : 'Show Details'}
                  </button>
                  <input
                    type="number"
                    value={quantityRequested[food.foods_id] || 1}
                    onChange={(e) => handleQuantityChange(food.foods_id, e.target.value)}
                    min="1"
                    className="form-control mb-2"
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => handleRequestFood(food.foods_id)}
                  >
                    Request Food
                  </button>
                </td>
              </tr>
              {expandedRows[food.foods_id] && (
                <tr>
                  <td colSpan="7">
                    <div>
                      <p><strong>Storage Instructions:</strong> {food.storage_instructions}</p>
                      <p><strong>Expiry Date:</strong> {food.expiry_date}</p>
                      <p><strong>Prepared Date:</strong> {food.prepared_date}</p>
                      <p><strong>Available From:</strong> {food.available_from}</p>
                      <p><strong>Available To:</strong> {food.available_to}</p>
                      <p><strong>Pickup Location:</strong> {food.pickup_location}</p>
                      <p><strong>Brand:</strong> {food.brand}</p>
                      <p><strong>Dietary Restrictions:</strong> {food.dietary_restrictions}</p>
                      <p><strong>Special Notes:</strong> {food.special_notes}</p>
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

export default ViewFoodList;