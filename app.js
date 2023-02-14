const express = require('express');
const app = express();
const routes = require('./routes/index');

// Set Route
app.use('/', routes);

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});