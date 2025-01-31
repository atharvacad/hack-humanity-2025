const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming you have a db.js file to handle the database connection

router.get('/get-community-partners-list', (req, res) => {
  db.all('SELECT * FROM community_partner', [], (err, rows) => {
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

router.post('/add-community-partners', (req, res) => {
  const { name, contact_name, contact_email, contact_phone, address, city, zip_code } = req.body;
  const sql = `INSERT INTO community_partner (name, contact_name, contact_email, contact_phone, address, city, zip_code)
               VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const params = [name, contact_name, contact_email, contact_phone, address, city, zip_code];

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

module.exports = router;