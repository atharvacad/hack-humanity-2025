const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming you have a db.js file to handle the database connection

router.post('/add-food', (req, res) => {
  const { donor_id, food_name, food_type, description, quantity, unit, packaging_type, storage_instructions, expiry_date, prepared_date, available_from, available_to, pickup_location, brand, dietary_restrictions, special_notes } = req.body;
  const sql = `INSERT INTO foods (donor_id, food_name, food_type, description, quantity, unit, packaging_type, storage_instructions, expiry_date, prepared_date, available_from, available_to, pickup_location, brand, dietary_restrictions, special_notes)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [donor_id, food_name, food_type, description, quantity, unit, packaging_type, storage_instructions, expiry_date, prepared_date, available_from, available_to, pickup_location, brand, dietary_restrictions, special_notes];

  db.run(sql, params, function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: req.body,
      id: this.lastID
    });
  });
});

router.get('/get-food-list', (req, res) => {
  db.all('SELECT * FROM foods', [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

module.exports = router;