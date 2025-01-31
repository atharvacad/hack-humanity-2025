// src/components/FoodListDonar.js
import React, { useState } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001'
});

const FoodListDonar = () => {
  const [donarid, setDonarid] = useState('');
  const [email, setEmail] = useState('');
  const [foodList, setFoodList] = useState([]);
  const [error, setError] = useState('');

  const fetchFoodList = async () => {
    try {
      const response = await api.get('/get-food-list-donar', {
        params: {
          donarid,
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

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Food List for Donar</h2>
      <div className="form-group">
        <label>Donar ID:</label>
        <input
          type="text"
          className="form-control"
          value={donarid}
          onChange={(e) => setDonarid(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button className="btn btn-primary mb-4" onClick={fetchFoodList}>
        Get Food List
      </button>
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
            <th>Storage Instructions</th>
            <th>Expiry Date</th>
            <th>Prepared Date</th>
            <th>Available From</th>
            <th>Available To</th>
            <th>Pickup Location</th>
            <th>Brand</th>
            <th>Dietary Restrictions</th>
            <th>Special Notes</th>
          </tr>
        </thead>
        <tbody>
          {foodList.map((food) => (
            <tr key={food.foods_id}>
              <td>{food.food_name}</td>
              <td>{food.food_type}</td>
              <td>{food.description}</td>
              <td>{food.quantity}</td>
              <td>{food.unit}</td>
              <td>{food.packaging_type}</td>
              <td>{food.storage_instructions}</td>
              <td>{food.expiry_date}</td>
              <td>{food.prepared_date}</td>
              <td>{food.available_from}</td>
              <td>{food.available_to}</td>
              <td>{food.pickup_location}</td>
              <td>{food.brand}</td>
              <td>{food.dietary_restrictions}</td>
              <td>{food.special_notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FoodListDonar;