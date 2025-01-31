// src/components/ViewFoodList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api'
});

const ViewFoodList = () => {
  const [foodList, setFoodList] = useState([]);
  const [error, setError] = useState('');
  const [expandedRows, setExpandedRows] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

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

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedFoodList = [...foodList].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Food List</h2>
      {error && <p className="text-danger">{error}</p>}
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th onClick={() => handleSort('food_name')}>Food Name</th>
            <th onClick={() => handleSort('food_type')}>Type</th>
            <th onClick={() => handleSort('description')}>Description</th>
            <th onClick={() => handleSort('quantity')}>Quantity</th>
            <th onClick={() => handleSort('unit')}>Unit</th>
            <th onClick={() => handleSort('packaging_type')}>Packaging Type</th>
            <th>Extra Details</th>
          </tr>
        </thead>
        <tbody>
          {sortedFoodList.map((food) => (
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
                    className="btn btn-info"
                    onClick={() => toggleRow(food.foods_id)}
                  >
                    {expandedRows[food.foods_id] ? 'Hide Details' : 'Show Details'}
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