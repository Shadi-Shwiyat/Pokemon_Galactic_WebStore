// Simple Express server with Firebase Admin SDK

// Import the express library
const express = require('express');
const app = express();

// Firebase Admin SDK
const admin = require('firebase-admin');
const credentials = require('./credentials.json');

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(credentials)
});

//Endpoint
// Get Requests

// Post Requests

// Delete Requests

// Post Requests

      
      
      
      

const db = admin.firestore();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Port for the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

