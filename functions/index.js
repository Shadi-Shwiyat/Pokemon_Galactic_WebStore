<<<<<<< HEAD
/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
=======
/** Simple Express server with Firebase Admin SDK */

// Firebase Functions
const functions = require('firebase-functions');

/** Import the express library */
const express = require('express');
const cors = require('cors');
const app = express();

/** Enable CORS */
app.use(cors({ origin: true }));

// Your middleware and routes
app.use(express.json());

/** Import routes */
const pokemonRoutes = require('./pokemonRoutes');
const userRoutes = require('./userRoutes');
const itemsRoutes = require('./itemsRoutes');

// const itemRoutes = require('./itemRoutes');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** Use Routes */
app.use(pokemonRoutes);
app.use(userRoutes);
app.use(itemsRoutes);

// TESTING REACT APP
app.use(express.static('../app/build'));

// /** Port for the server to run on local*/
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}.`);
// });

/** Export the API to Firebase Cloud Functions */
exports.api = functions.https.onRequest(app);
>>>>>>> b0678fc5eca59528d1d4e3bb2297dce71a83922d
