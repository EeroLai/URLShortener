const express = require('express');
const path = require('path');
const app = express();
const routes = require('./routes/index');

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: false })); // to support URL-encoded bodies

// Set Api Route
app.use('/', routes);

// Set Static
app.use('/static/', express.static('static'));

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
