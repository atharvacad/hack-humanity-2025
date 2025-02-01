const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming you have a db.js file to handle the database connection

// Add a new food request
router.post('/food-requests', (req, res) => {
  const { foods_id, community_partner_id, quantity_requested } = req.body;
  console.log('Received request to add a new food request:', req.body);

  // Check if the requested quantity is available
  db.get('SELECT quantity, available_to FROM foods WHERE foods_id = ?', [foods_id], (err, row) => {
    if (err) {
      console.error(`Error fetching food quantity: ${err.message}`);
      return res.status(400).json({ error: err.message });
    }
    if (!row || row.quantity < quantity_requested) {
      console.log('Requested quantity not available');
      return res.status(400).json({ message: 'Requested quantity not available' });
    }

    // Insert the food request
    const sql = `INSERT INTO food_requests (foods_id, community_partner_id, quantity_requested, pickupdate)
                 VALUES (?, ?, ?, ?)`;
    const params = [foods_id, community_partner_id, quantity_requested, row.available_to];

    db.run(sql, params, function(err) {
      if (err) {
        console.error(`Error adding food request: ${err.message}`);
        return res.status(400).json({ error: err.message });
      }

      // Update the available quantity in the foods table
      const newQuantity = row.quantity - quantity_requested;
      db.run('UPDATE foods SET quantity = ? WHERE foods_id = ?', [newQuantity, foods_id], function(err) {
        if (err) {
          console.error(`Error updating food quantity: ${err.message}`);
          return res.status(400).json({ error: err.message });
        }
        console.log('Food request added with ID:', this.lastID);
        res.json({
          message: 'success',
          data: req.body,
          id: this.lastID
        });
      });
    });
  });
});

// Get all food requests for a community partner - Community Partner
router.get('/get-food-requests/:community_partner_id', (req, res) => {
  const { community_partner_id } = req.params;
  console.log(`Received request to get food requests for community partner with ID: ${community_partner_id}`);
  const sql = `
    SELECT fr.*, f.food_name, f.quantity AS total_quantity, (f.quantity - fr.quantity_requested) AS available_quantity,
           d.name AS donor_name, d.contact_email AS donor_email, d.contact_phone AS donor_phone, d.address AS donor_address
    FROM food_requests fr
    JOIN foods f ON fr.foods_id = f.foods_id
    JOIN donors d ON f.donor_id = d.donor_id
    WHERE fr.community_partner_id = ?
  `;
  db.all(sql, [community_partner_id], (err, rows) => {
    if (err) {
      console.error(`Error fetching food requests: ${err.message}`);
      return res.status(400).json({ error: err.message });
    }
    console.log('Food requests found for community partner:', rows);
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// Get all food requests for a donation - this is for the donors
router.get('/get-donor-requests/:donor_id', (req, res) => {
  const { donor_id } = req.params;
  console.log(`Received request to get food requests for donor with ID: ${donor_id}`);
  const sql = `
    SELECT fr.*, cp.name AS community_partner_name, f.food_name, f.quantity AS total_quantity
    FROM food_requests fr
    JOIN foods f ON fr.foods_id = f.foods_id
    JOIN community_partner cp ON fr.community_partner_id = cp.community_partner_id
    WHERE f.donor_id = ?
  `;
  db.all(sql, [donor_id], (err, rows) => {
    if (err) {
      console.error(`Error fetching donor food requests: ${err.message}`);
      return res.status(400).json({ error: err.message });
    }
    console.log('Food requests found for donor:', rows);
    res.json({
      message: 'success',
      data: rows
    });
  });
});

module.exports = router;