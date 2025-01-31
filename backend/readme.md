## API Routes

### Donors
- **GET** `/api/donors/get-donors-list`: Get the list of all donors.
- **POST** `/api/donors/add-donors`: Add a new donor.
- **GET** `/api/donors/get-food-list-donar`: Get the food list for a specific donor.

### Community Partners
- **GET** `/api/community-partners/get-community-partners-list`: Get the list of all community partners.
- **POST** `/api/community-partners/add-community-partners`: Add a new community partner.

### Foods
- **POST** `/api/foods/add-food`: Add a new food item.
- **GET** `/api/foods/get-food-list`: Get the list of all food items.

### Food Requests
- **POST** `/api/food-requests/food-requests`: Request a food item.
- **GET** `/api/food-requests/get-food-requests/:community_partner_id`: Get all food requests for a specific community partner.
- **GET** `/api/food-requests/get-donor-requests/:donor_id`: Get all food requests for a specific donor.
