const express = require('express');
const router = express.Router();

const { initializeApp } = require("firebase/app");
const { getDatabase, ref, set, onValue } = require("firebase/database");
require('dotenv').config();
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
};

// Initialize Firebase
const firebaeInit = initializeApp(firebaseConfig);

// Get reference to the Firebase database
const db = getDatabase(firebaeInit);

// Generate a short URL
function generateShortURL() {
  // Your implementation to generate a short URL
  return "abc123";
}

// Store the short URL and the original URL in the database
function storeURL(shortURL, originalURL) {
  set(ref(db, 'urls/' + shortURL), {
    originalURL: originalURL
  });
}

// Redirect the user to the original URL
router.get('/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  onValue(ref(db, 'urls/' + shortURL), (snapshot) => {
    const originalURL = (snapshot.val()) ? snapshot.val().originalURL : null;
    (originalURL) ? res.redirect(originalURL) : console.log('false');
  });
});

// Endpoint to generate and store a short URL
router.get('/new/:originalURL', (req, res) => {
  const originalURL = req.params.originalURL;
  const shortURL = generateShortURL();
  storeURL(shortURL, originalURL);
  res.send({ shortURL: shortURL });
});

module.exports = router;