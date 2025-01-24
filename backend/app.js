const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(express.json());

let db = new sqlite3.Database('./sample.db');

app.get('/get-donors-list', (req, res) => {
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

app.get('/get-community-partners-list', (req, res) => {
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

app.post('/add-donors', (req, res) => {
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

app.post('/add-community-partners', (req, res) => {
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

app.post('/add-food-donation', (req, res) => {
  const { donor_id, food_name, food_type, description, quantity, unit, packaging_type, storage_instructions, expiry_date, prepared_date, available_from, available_to, pickup_location, brand, dietary_restrictions, special_notes } = req.body;
  const sql = `INSERT INTO food_donations (donor_id, food_name, food_type, description, quantity, unit, packaging_type, storage_instructions, expiry_date, prepared_date, available_from, available_to, pickup_location, brand, dietary_restrictions, special_notes)
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

app.get('/get-donation-list', (req, res) => {
  db.all('SELECT * FROM food_donations', [], (err, rows) => {
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

app.post('/login', (req, res) => {
  const { email, password, type } = req.body;

  if (password !== '1234') {
    return res.status(401).json({ message: 'Invalid password' });
  }

  let table = '';
  if (type === 'donor') {
    table = 'donors';
  } else if (type === 'community-partner') {
    table = 'community_partner';
  } else {
    return res.status(400).json({ message: 'Invalid type' });
  }

  const sql = `SELECT * FROM ${table} WHERE contact_email = ?`;
  db.get(sql, [email], (err, row) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});