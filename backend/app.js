const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 3001;

// Use CORS middleware
app.use(cors());
app.use(express.json());

// Database connection
let db = new sqlite3.Database('./sample.db');

// Import routes
const donorsRoutes = require('./routes/donors');
const communityPartnersRoutes = require('./routes/communityPartners');
const foodsRoutes = require('./routes/foods');
const foodRequestsRoutes = require('./routes/foodRequests');

// Login route
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

// Use routes
app.use('/api/donors', donorsRoutes);
app.use('/api/community-partners', communityPartnersRoutes);
app.use('/api/foods', foodsRoutes);
app.use('/api/food-requests', foodRequestsRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});