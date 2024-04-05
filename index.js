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

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//Endpoint
// Post Requests (Create)

//TESTING DB for POST
app.post('/create', async (req, res) => {
  try {
    console.log(req.body);
    const id = req.body.email;
    const userJson = {
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    };
    const response = await db.collection('users').add(userJson);
    res.status(200).send('User created successfully');
  } catch (error) {
    res.status
  }
});

// Get Requests (Read)

// Put Requests (Update)

// Delete Requests (Delete)

      
      
      
      

const db = admin.firestore();

// Port for the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

