/** Simple Express server with Firebase Admin SDK */

/** Import the express library */
const express = require('express');
const app = express();

/** Import routes */
const pokemonRoutes = require('./pokemonRoutes');
const userRoutes = require('./userRoutes');

// const itemRoutes = require('./itemRoutes');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** Use Routes */
app.use(pokemonRoutes);
app.use(userRoutes);
// app.use(itemRoutes);

// TESTING REACT APP
app.use(express.static('../app../build'));

/** Port for the server to run on */
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
