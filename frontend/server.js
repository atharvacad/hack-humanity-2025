const express = require('express');
const path = require('path');
const app = express();
const port = 3001;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Handle all other routes by serving the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});