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

app.post('/add-food', (req, res) => {
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

app.get('/get-food-list', (req, res) => {
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

app.post('/food-requests', (req, res) => {
  const { foods_id, community_partner_id, quantity_requested } = req.body;

  // Check if the requested quantity is available
  db.get('SELECT quantity, available_to FROM foods WHERE foods_id = ?', [foods_id], (err, row) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!row || row.quantity < quantity_requested) {
      return res.status(400).json({ message: 'Requested quantity not available' });
    }

    // Insert the food request
    const sql = `INSERT INTO food_requests (foods_id, community_partner_id, quantity_requested, pickupdate)
                 VALUES (?, ?, ?, ?)`;
    const params = [foods_id, community_partner_id, quantity_requested, row.available_to];

    db.run(sql, params, function(err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      // Update the available quantity in the foods table
      const newQuantity = row.quantity - quantity_requested;
      db.run('UPDATE foods SET quantity = ? WHERE foods_id = ?', [newQuantity, foods_id], function(err) {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        res.json({
          message: 'success',
          data: req.body,
          id: this.lastID
        });
      });
    });
  });
});

app.get('/get-food-requests/:community_partner_id', (req, res) => {
  const { community_partner_id } = req.params;
  const sql = `SELECT * FROM food_requests WHERE community_partner_id = ?`;
  db.all(sql, [community_partner_id], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

app.get('/get-donor-requests/:donor_id', (req, res) => {
  const { donor_id } = req.params;
  const sql = `
    SELECT fr.*, cp.name AS community_partner_name
    FROM food_requests fr
    JOIN foods f ON fr.foods_id = f.foods_id
    JOIN community_partner cp ON fr.community_partner_id = cp.community_partner_id
    WHERE f.donor_id = ?
  `;
  db.all(sql, [donor_id], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});