const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

let db = new sqlite3.Database('./sample.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS donors (
    donor_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    contact_name TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    address TEXT,
    city TEXT,
    zip_code TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS community_partner (
    community_partner_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    contact_name TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    address TEXT,
    city TEXT,
    zip_code TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS foods (
    foods_id INTEGER PRIMARY KEY AUTOINCREMENT,
    donor_id INTEGER,
    food_name TEXT,
    food_type TEXT,
    description TEXT,
    quantity DECIMAL(10, 2),
    unit TEXT,
    packaging_type TEXT,
    storage_instructions TEXT,
    expiry_date DATE,
    prepared_date DATETIME,
    available_from DATETIME,
    available_to DATETIME,
    pickup_location TEXT,
    brand TEXT,
    dietary_restrictions TEXT,
    special_notes TEXT,
    FOREIGN KEY(donor_id) REFERENCES donors(donor_id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS food_requests (
    food_request_id INTEGER PRIMARY KEY AUTOINCREMENT,
    foods_id INTEGER,
    community_partner_id INTEGER,
    quantity_requested DECIMAL(10, 2),
    pickupdate DATETIME,
    request_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(foods_id) REFERENCES foods(foods_id),
    FOREIGN KEY(community_partner_id) REFERENCES community_partner(community_partner_id)
  )`);
const sql = fs.readFileSync('scripts/insert.sql', 'utf8');
db.exec(sql, (err) => {
        if (err) {
                console.error('Error executing SQL file:', err.message);
        } else {
                console.log('SQL file executed successfully');
        }
});

const sql2 = fs.readFileSync('scripts/insert2.sql', 'utf8');
db.exec(sql2, (err) => {
        if (err) {
                console.error('Error executing SQL file:', err.message);
        } else {
                console.log('SQL file executed successfully');
        }
});
  // Insert sample records into donors
//   db.run(`INSERT INTO donors (name, contact_name, contact_email, contact_phone, address, city, zip_code)
//           VALUES ('Donor 1', 'Contact 1', 'contact1@example.com', '1234567890', 'Address 1', 'City 1', '12345')`);

//   db.run(`INSERT INTO donors (name, contact_name, contact_email, contact_phone, address, city, zip_code)
//           VALUES ('Donor 2', 'Contact 2', 'contact2@example.com', '0987654321', 'Address 2', 'City 2', '54321')`);

//   // Insert sample records into community_partner
//   db.run(`INSERT INTO community_partner (name, contact_name, contact_email, contact_phone, address, city, zip_code)
//           VALUES ('Partner 1', 'Contact 1', 'partner1@example.com', '1234567890', 'Address 1', 'City 1', '12345')`);

//   db.run(`INSERT INTO community_partner (name, contact_name, contact_email, contact_phone, address, city, zip_code)
//           VALUES ('Partner 2', 'Contact 2', 'partner2@example.com', '0987654321', 'Address 2', 'City 2', '54321')`);

//   // Insert sample records into foods
//   db.run(`INSERT INTO foods (donor_id, food_name, food_type, description, quantity, unit, packaging_type, storage_instructions, expiry_date, prepared_date, available_from, available_to, pickup_location, brand, dietary_restrictions, special_notes)
//           VALUES (1, 'Apples', 'Fruit', 'Fresh apples', 10.0, 'kg', 'Sealed box', 'Keep refrigerated', '2023-12-31', NULL, '2023-10-01 08:00:00', '2023-10-01 18:00:00', 'Location 1', 'Brand A', 'None', 'None')`);

//   db.run(`INSERT INTO foods (donor_id, food_name, food_type, description, quantity, unit, packaging_type, storage_instructions, expiry_date, prepared_date, available_from, available_to, pickup_location, brand, dietary_restrictions, special_notes)
//           VALUES (2, 'Bread', 'Bakery', 'Whole grain bread', 5.0, 'pieces', 'Tupperware', 'Keep in a cool place', '2023-10-15', '2023-10-01 06:00:00', '2023-10-01 08:00:00', '2023-10-01 20:00:00', 'Location 2', 'Brand B', 'Vegan', 'Contains nuts')`);
});

db.close();