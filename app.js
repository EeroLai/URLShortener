const express = require('express');
const app = express();
const routes = require('./routes/index');

// Set Api Route
app.use('/', routes);

// Set Static
app.use('/static/', express.static('static'));

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});