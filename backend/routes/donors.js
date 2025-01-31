const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming you have a db.js file to handle the database connection

router.get('/get-donors-list', (req, res) => {
  db.all('SELECT * FROM donors', [], (err, rows) => {
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

router.post('/add-donors', (req, res) => {
  const { name, contact_name, contact_email, contact_phone, address, city, zip_code } = req.body;
  const sql = `INSERT INTO donors (name, contact_name, contact_email, contact_phone, address, city, zip_code)
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

router.get('/get-food-list-donar', (req, res) => {
  const { donarid, email, type } = req.query;

  if (type !== 'donor') {
    return res.status(400).json({ error: 'Invalid type' });
  }

  const verifyDonarQuery = 'SELECT * FROM donors WHERE donor_id = ? AND contact_email = ?';
  db.get(verifyDonarQuery, [donarid, email], (err, donor) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!donor) {
      return res.status(404).json({ error: 'Donor not found or email does not match' });
    }

    const getFoodListQuery = 'SELECT * FROM foods WHERE donor_id = ?';
    db.all(getFoodListQuery, [donarid], (err, rows) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      res.json({
        message: 'success',
        data: rows
      });
    });
  });
});

module.exports = router;