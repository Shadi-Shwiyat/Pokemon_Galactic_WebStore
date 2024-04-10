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
