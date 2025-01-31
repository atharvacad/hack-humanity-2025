const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming you have a db.js file to handle the database connection

// Add a new food
router.post('/add-food', (req, res) => {
  const { donor_id, food_name, food_type, description, quantity, unit, packaging_type, storage_instructions, expiry_date, prepared_date, available_from, available_to, pickup_location, brand, dietary_restrictions, special_notes } = req.body;
  console.log('Received request to add a new food:', req.body);
  const sql = `INSERT INTO foods (donor_id, food_name, food_type, description, quantity, unit, packaging_type, storage_instructions, expiry_date, prepared_date, available_from, available_to, pickup_location, brand, dietary_restrictions, special_notes)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [donor_id, food_name, food_type, description, quantity, unit, packaging_type, storage_instructions, expiry_date, prepared_date, available_from, available_to, pickup_location, brand, dietary_restrictions, special_notes];

  db.run(sql, params, function(err) {
    if (err) {
      console.error(`Error adding food: ${err.message}`);
      res.status(400).json({ error: err.message });
      return;
    }
    console.log('Food added with ID:', this.lastID);
    res.json({
      message: 'success',
      data: req.body,
      id: this.lastID
    });
  });
});

// Get the list of all foods
router.get('/get-food-list', (req, res) => {
  console.log('Received request to get the list of all foods');
  db.all('SELECT * FROM foods', [], (err, rows) => {
    if (err) {
      console.error(`Error fetching foods: ${err.message}`);
      res.status(400).json({ error: err.message });
      return;
    }
    console.log('Foods found:', rows);
    res.json({
      message: 'success',
      data: rows
    });
  });
});

module.exports = router;