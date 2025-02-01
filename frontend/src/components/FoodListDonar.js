// src/components/FoodListDonar.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './FoodListDonar.css'; // Import the custom CSS

const api = axios.create({
  baseURL: 'http://localhost:3001/api/donors'
});

const FoodListDonar = () => {
  const [foodList, setFoodList] = useState([]);
  const [error, setError] = useState('');
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    const fetchFoodList = async () => {
      const userCookie = Cookies.get('user');
      if (!userCookie) {
        setError('User data not found in cookies');
        return;
      }

      const userData = JSON.parse(userCookie);
      const { id, email, type } = userData;

      if (type !== 'donor') {
        setError('User is not a donor');
        return;
      }

      try {
        const response = await api.get('/get-food-list-donar', {
          params: {
            donarid: id,
            email,
            type: 'donor'
          }
        });
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

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Your Food Donations</h2>
      <p className="lead">Here you can see all the food items you have donated. Click on "Show Details" to view more information about each item.</p>
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
                <td>
                  <span className="badge badge-primary">{food.quantity}</span>
                </td>
                <td>{food.unit}</td>
                <td>{food.packaging_type}</td>
                <td>
                  <button
                    className="btn btn-info mb-2"
                    onClick={() => toggleRow(food.foods_id)}
                  >
                    {expandedRows[food.foods_id] ? 'Hide Details' : 'Show Details'}
                  </button>
                </td>
              </tr>
              {expandedRows[food.foods_id] && (
                <tr>
                  <td colSpan="7">
                    <div className="details">
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
      <p className="mt-4">Thank you for your generous donations! Your contributions make a significant impact in the community.</p>
    </div>
  );
};

export default FoodListDonar;