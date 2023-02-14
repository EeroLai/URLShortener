const { initializeApp } = require("firebase/app");
const { getDatabase } = require("firebase/database");
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

module.exports = db;