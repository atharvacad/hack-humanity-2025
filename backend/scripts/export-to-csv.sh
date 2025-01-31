#!/bin/bash

# Export donors table to CSV
sqlite3 -header -csv sample.db "SELECT * FROM donors;" > donors.csv

# Export community partners table to CSV
sqlite3 -header -csv sample.db "SELECT * FROM community_partner;" > community_partner.csv

# Export foods table to CSV
sqlite3 -header -csv sample.db "SELECT * FROM foods;" > foods.csv

# Export food requests table to CSV
sqlite3 -header -csv sample.db "SELECT * FROM food_requests;" > food_requests.csv

echo "Export completed."