// src/components/AddFoodDonation.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import './AddFoodDonation.css'; // Import the custom CSS

const api = axios.create({
  baseURL: 'http://localhost:3001/api/foods'
});

const AddFoodDonation = () => {
  const [foodData, setFoodData] = useState({
    food_name: '',
    food_type: '',
    description: '',
    quantity: '',
    unit: '',
    packaging_type: '',
    storage_instructions: '',
    expiry_date: '',
    prepared_date: '',
    available_from: '',
    available_to: '',
    pickup_location: '',
    brand: '',
    dietary_restrictions: '',
    special_notes: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFoodData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      const response = await api.post('/add-food-donations', {
        donor_id: id,
        ...foodData
      });
      if (response.data.message === 'success') {
        alert('OK, thanks for the donation');
        navigate('/foodlistdonar');
      } else {
        setError('Failed to add food donation');
      }
    } catch (err) {
      setError(err.response ? err.response.data.error : 'Error adding food donation');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Add Food Donation</h2>
      <p className="lead">Please fill out the form below to add a new food donation. Your contributions make a significant impact in our community.</p>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Food Name:</label>
          <input
            type="text"
            className="form-control"
            name="food_name"
            value={foodData.food_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Food Type:</label>
          <select
            className="form-control"
            name="food_type"
            value={foodData.food_type}
            onChange={handleChange}
            required
          >
            <option value="">Select Food Type</option>
            <option value="Fruit">Fruit</option>
            <option value="Vegetable">Vegetable</option>
            <option value="Dairy">Dairy</option>
            <option value="Meat">Meat</option>
            <option value="Grain">Grain</option>
          </select>
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            className="form-control"
            name="description"
            value={foodData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Quantity:</label>
          <input
            type="number"
            className="form-control"
            name="quantity"
            value={foodData.quantity}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Unit:</label>
          <select
            className="form-control"
            name="unit"
            value={foodData.unit}
            onChange={handleChange}
            required
          >
            <option value="">Select Unit</option>
            <option value="kg">kg</option>
            <option value="g">g</option>
            <option value="lb">lb</option>
            <option value="oz">oz</option>
            <option value="liters">liters</option>
          </select>
        </div>
        <div className="form-group">
          <label>Packaging Type:</label>
          <select
            className="form-control"
            name="packaging_type"
            value={foodData.packaging_type}
            onChange={handleChange}
            required
          >
            <option value="">Select Packaging Type</option>
            <option value="Sealed box">Sealed box</option>
            <option value="Plastic bag">Plastic bag</option>
            <option value="Glass jar">Glass jar</option>
            <option value="Metal can">Metal can</option>
            <option value="Paper bag">Paper bag</option>
          </select>
        </div>
        <div className="form-group">
          <label>Storage Instructions:</label>
          <input
            type="text"
            className="form-control"
            name="storage_instructions"
            value={foodData.storage_instructions}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Expiry Date:</label>
          <input
            type="date"
            className="form-control"
            name="expiry_date"
            value={foodData.expiry_date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Prepared Date:</label>
          <input
            type="date"
            className="form-control"
            name="prepared_date"
            value={foodData.prepared_date}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Available From:</label>
          <input
            type="datetime-local"
            className="form-control"
            name="available_from"
            value={foodData.available_from}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Available To:</label>
          <input
            type="datetime-local"
            className="form-control"
            name="available_to"
            value={foodData.available_to}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Pickup Location:</label>
          <input
            type="text"
            className="form-control"
            name="pickup_location"
            value={foodData.pickup_location}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Brand:</label>
          <select
            className="form-control"
            name="brand"
            value={foodData.brand}
            onChange={handleChange}
          >
            <option value="">Select Brand</option>
            <option value="Brand A">Brand A</option>
            <option value="Brand B">Brand B</option>
            <option value="Brand C">Brand C</option>
            <option value="Brand D">Brand D</option>
            <option value="Brand E">Brand E</option>
          </select>
        </div>
        <div className="form-group">
          <label>Dietary Restrictions:</label>
          <select
            className="form-control"
            name="dietary_restrictions"
            value={foodData.dietary_restrictions}
            onChange={handleChange}
          >
            <option value="">Select Dietary Restrictions</option>
            <option value="None">None</option>
            <option value="Gluten-Free">Gluten-Free</option>
            <option value="Vegan">Vegan</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Nut-Free">Nut-Free</option>
          </select>
        </div>
        <div className="form-group">
          <label>Special Notes:</label>
          <textarea
            className="form-control"
            name="special_notes"
            value={foodData.special_notes}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Food Donation</button>
      </form>
    </div>
  );
};

export default AddFoodDonation;