const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming you have a db.js file to handle the database connection

// Get the list of all community partners
router.get('/get-community-partners-list', (req, res) => {
  console.log('Received request to get the list of all community partners');
  db.all('SELECT * FROM community_partner', [], (err, rows) => {
    if (err) {
      console.error(`Error fetching community partners: ${err.message}`);
      res.status(400).json({ error: err.message });
      return;
    }
    console.log('Community partners found:', rows);
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// Get a community partner by ID and email
router.post('/get-community-partner-by-id-and-email', (req, res) => {
  const { id, email } = req.body;
  console.log(`Received request to get community partner with ID: ${id} and Email: ${email}`);
  const sql = 'SELECT * FROM community_partner WHERE community_partner_id = ? AND contact_email = ?';
  const params = [id, email];

  db.get(sql, params, (err, row) => {
    if (err) {
      console.error(`Error fetching community partner: ${err.message}`);
      res.status(400).json({ error: err.message });
      return;
    }
    if (!row) {
      console.log('Community partner not found');
      res.status(404).json({ message: 'Community partner not found' });
      return;
    }
    console.log('Community partner found:', row);
    res.json({
      message: 'success',
      data: row
    });
  });
});

// Add a new community partner
router.post('/add-community-partners', (req, res) => {
  const { name, contact_name, contact_email, contact_phone, address, city, zip_code } = req.body;
  console.log('Received request to add a new community partner:', req.body);
  const sql = `INSERT INTO community_partner (name, contact_name, contact_email, contact_phone, address, city, zip_code)
               VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const params = [name, contact_name, contact_email, contact_phone, address, city, zip_code];

  db.run(sql, params, function(err) {
    if (err) {
      console.error(`Error adding community partner: ${err.message}`);
      res.status(400).json({ error: err.message });
      return;
    }
    console.log('Community partner added with ID:', this.lastID);
    res.json({
      message: 'success',
      data: req.body,
      id: this.lastID
    });
  });
});

module.exports = router;