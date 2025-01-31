const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

let db = new sqlite3.Database('./sample.db');

// Sign-up route
app.post('/signup', (req, res) => {
  const { name, contactName, contactEmail, contactPhone, address, city, zipCode } = req.body;
  const query = `INSERT INTO donors (name, contact_name, contact_email, contact_phone, address, city, zip_code)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.run(query, [name, contactName, contactEmail, contactPhone, address, city, zipCode], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ donor_id: this.lastID });
  });
});

// Sign-in route (example)
app.post('/signin', (req, res) => {
  const { contactEmail, contactPhone } = req.body;
  const query = `SELECT * FROM donors WHERE contact_email = ? AND contact_phone = ?`;
  db.get(query, [contactEmail, contactPhone], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (row) {
      res.status(200).json(row);
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});