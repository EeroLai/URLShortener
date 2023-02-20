const express = require('express');
const router = express.Router();
const urlShortener =  require('../controllers/urlShortener');

// Redirect the user to the original URL
router.get('/:shortURL', urlShortener.shortURL);

// Endpoint to generate and store a short URL
router.post('/new/:originalURL', urlShortener.newShortURL);

module.exports = router;