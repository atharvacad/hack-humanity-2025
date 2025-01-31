const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming you have a db.js file to handle the database connection

// Get the list of all donors
router.get('/get-donors-list', (req, res) => {
  console.log('Received request to get the list of all donors');
  db.all('SELECT * FROM donors', [], (err, rows) => {
    if (err) {
      console.error(`Error fetching donors: ${err.message}`);
      res.status(400).json({ error: err.message });
      return;
    }
    console.log('Donors found:', rows);
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// Add a new donor
router.post('/add-donors', (req, res) => {
  const { name, contact_name, contact_email, contact_phone, address, city, zip_code } = req.body;
  console.log('Received request to add a new donor:', req.body);
  const sql = `INSERT INTO donors (name, contact_name, contact_email, contact_phone, address, city, zip_code)
               VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const params = [name, contact_name, contact_email, contact_phone, address, city, zip_code];

  db.run(sql, params, function(err) {
    if (err) {
      console.error(`Error adding donor: ${err.message}`);
      res.status(400).json({ error: err.message });
      return;
    }
    console.log('Donor added with ID:', this.lastID);
    res.json({
      message: 'success',
      data: req.body,
      id: this.lastID
    });
  });
});

// Get food list for a specific donor
router.get('/get-food-list-donar', (req, res) => {
  const { donarid, email, type } = req.query;
  console.log(`Received request to get food list for donor with ID: ${donarid} and Email: ${email}`);

  if (type !== 'donor') {
    console.error('Invalid type');
    return res.status(400).json({ error: 'Invalid type' });
  }

  const verifyDonarQuery = 'SELECT * FROM donors WHERE donor_id = ? AND contact_email = ?';
  db.get(verifyDonarQuery, [donarid, email], (err, donor) => {
    if (err) {
      console.error(`Error verifying donor: ${err.message}`);
      return res.status(400).json({ error: err.message });
    }

    if (!donor) {
      console.log('Donor not found or email does not match');
      return res.status(404).json({ error: 'Donor not found or email does not match' });
    }

    const getFoodListQuery = 'SELECT * FROM foods WHERE donor_id = ?';
    db.all(getFoodListQuery, [donarid], (err, rows) => {
      if (err) {
        console.error(`Error fetching food list: ${err.message}`);
        return res.status(400).json({ error: err.message });
      }

      console.log('Food list found for donor:', rows);
      res.json({
        message: 'success',
        data: rows
      });
    });
  });
});

module.exports = router;