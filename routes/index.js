const express = require('express');
const router = express.Router();
const urlShortener =  require('../controllers/urlShortener');

// Endpoint to generate and store a short URL
router.post('/new/', urlShortener.newShortURL);
router.post('/new', urlShortener.newShortURL);
router.get('/api/urls', urlShortener.listURLs);
router.delete('/api/urls/:shortURL', urlShortener.deleteURL);

// Redirect the user to the original URL
router.get('/:shortURL', urlShortener.shortURL);

module.exports = router;
