# Backend Project

## Overview

This backend project is built using Node.js, Express, and SQLite. It provides APIs for managing donors, community partners, and food donations.

## Prerequisites

- Node.js
- npm

## Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    cd backend
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Set up the database:
    ```sh
    node setupDatabase.js
    ```

## Running the Server

Start the server using the following command, and it will run at `http://localhost:3000/`:
```sh
node app.js
```

## API Endpoints

### Donors

- **Get all donors**  
  Endpoint: `GET /get-donors-list`  
  Example using `curl`:
  ```sh
  curl -X GET http://localhost:3000/get-donors-list
  ```
### Community Partners

- **Get all community partners**  
    Endpoint: `GET /get-community-partners-list`  
    Example using `curl`:
    ```sh
    curl -X GET http://localhost:3000/get-community-partners-list
    ```

### Food Donations

- **Get all food donations**  
    Endpoint: `GET /get-food-donations-list`  
    Example using `curl`:
    ```sh
    curl -X GET http://localhost:3000/get-food-donations-list
    ```
### Helpful text

```
CREATE TABLE donors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  contact_name VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(15),
  address TEXT,
  city VARCHAR(100),
  zip_code VARCHAR(10)
);


CREATE TABLE community_partner (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  contact_name VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(15),
  address TEXT,
  city VARCHAR(100),
  zip_code VARCHAR(10)
);


CREATE TABLE food_donations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    donor_id INT,
    food_name VARCHAR(255),
    food_type VARCHAR(100), -- e.g., Vegetarian, Grocery, Dessert
    description TEXT,
    quantity DECIMAL(10, 2),
    unit VARCHAR(50), -- e.g., kg, pieces, boxes
    packaging_type VARCHAR(100), -- e.g., Sealed box, Tupperware
    storage_instructions VARCHAR(255), -- e.g., Keep frozen
    expiry_date DATE,
    prepared_date DATETIME, -- For cooked food
    available_from DATETIME,
    available_to DATETIME,
    pickup_location TEXT,
    brand VARCHAR(100), -- For groceries
    dietary_restrictions VARCHAR(255), -- e.g., Vegan, Halal
    special_notes TEXT, -- E.g., Contains nuts
    FOREIGN KEY (donor_id) REFERENCES donors(id)
);



curl -X POST http://localhost:3000/add-community-partners -H "Content-Type: application/json" -d '{
  "name": "Partner 3",
  "contact_name": "Contact 3",
  "contact_email": "partner3@example.com",
  "contact_phone": "2233445566",
  "address": "Address 3",
  "city": "City 3",
  "zip_code": "67890"
}'


curl -X POST http://localhost:3000/add-donors -H "Content-Type: application/json" -d '{
  "name": "Donor 3",
  "contact_name": "Contact 3",
  "contact_email": "contact3@example.com",
  "contact_phone": "1122334455",
  "address": "Address 3",
  "city": "City 3",
  "zip_code": "67890"
}'


curl -X POST http://localhost:3000/add-food-donations -H "Content-Type: application/json" -d '{
  "donor_id": 1,
  "food_name": "Bananas",
  "food_type": "Fruit",
  "description": "Fresh bananas",
  "quantity": 20.0,
  "unit": "kg",
  "packaging_type": "Sealed box",
  "storage_instructions": "Keep refrigerated",
  "expiry_date": "2023-12-31",
  "prepared_date": null,
  "available_from": "2023-10-01T08:00:00",
  "available_to": "2023-10-01T18:00:00",
  "pickup_location": "Location 3",
  "brand": "Brand C",
  "dietary_restrictions": "None",
  "special_notes": "None"
}'


curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{
  "email": "contact1@example.com",
  "password": "1234",
  "type": "donor"
}'


curl -X POST http://localhost:3000/food-requests -H "Content-Type: application/json" -d '{
  "foods_id": 1,
  "community_partner_id": 1,
  "quantity_requested": 5.0
}'

curl -X GET http://localhost:3000/get-donor-requests/1

curl -X GET http://localhost:3000/get-food-requests/1


```