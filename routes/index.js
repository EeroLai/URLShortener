const express = require('express');
const router = express.Router();
const urlShortener =  require('../controllers/urlShortener');

// Redirect the user to the original URL
router.get('/:shortURL', urlShortener.shortURL);

// Endpoint to generate and store a short URL
router.get('/new/:originalURL', urlShortener.shortURL);

module.exports = router;