// Simple Express server with Firebase Admin SDK

// Import the express library
const express = require('express');
const app = express();

// Firebase Admin SDK
const admin = require('firebase-admin');
const credentials = require('../credentials.json');

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

const db = admin.firestore();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//Endpoint
// Post Requests (Create) ////////////////////////////////////////////////////////////////////////////////


// Get Requests (Read) ////////////////////////////////////////////////////////////////////////////////

// Search by multiple attributes of Pokemon ( Examples are name, type, generation etc)
// Case Sensitivity is important during search based off Firebase Firestore
// Wil need to update the search when adding other attributes to the PokemonList
app.get('/pokemon/search', async (req, res) => {
  let query = db.collection('PokemonList');

  // Check for each query parameter and apply filters accordingly
  if (req.query.type) {
    query = query.where('typing', 'array-contains', req.query.type);
  }
  if (req.query.generation) {
    query = query.where('generation', '==', req.query.generation);
  }
  if (req.query.name) {
    query = query.where('name', '==', req.query.name);
  }
  if (req.query.region) {
    query = query.where('region', '==', req.query.region);
  }
  if (req.query.moves) {
    query = query.where('moves', 'array-contains', req.query.moves);
  }
  if (req.query.abilities) {
    query = query.where('abilities', 'array-contains', req.query.abilities);
  }

  try {
    const snapshot = await query.get();
    if (snapshot.empty) {
      return res.status(404).json({message: 'No Pokémon found matching the criteria'});
    }

    const pokemon = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(pokemon);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({message: 'Error processing search', error: error.message});
  }
});

// Get a single Pokemon by ID
app.get('/pokemon/:id', async (req, res) => {
  const doc = await db.collection('PokemonList').doc(req.params.id).get();
  if (!doc.exists) {
    res.status(404).send('Pokémon not found');
  } else {
    res.status(200).json({ id: doc.id, ...doc.data() });
  }
});

// Get a list of all Pokemon by type
app.get('/pokemon/type/:type', async (req, res) => {
  const snapshot = await db.collection('PokemonList').where('typing', 'array-contains', req.params.type).get();
  const pokemon = [];
  snapshot.forEach((doc) => {
    pokemon.push({ id: doc.id, ...doc.data() });
  });
  res.status(200).json(pokemon);
});

// Get a list of all Pokemon by generation
app.get('/pokemon/generation/:generation', async (req, res) => {
  const snapshot = await db.collection('PokemonList').where('generation', '==', req.params.generation).get();
  const pokemon = [];
  snapshot.forEach((doc) => {
    pokemon.push({ id: doc.id, ...doc.data() });
  });
  res.status(200).json(pokemon);
});

// Get a list of all Pokemon by name
app.get('/pokemon/name/:name', async (req, res) => {
  const snapshot = await db.collection('PokemonList').where('name', '==', req.params.name).get();
  const pokemon = [];
  snapshot.forEach((doc) => {
    pokemon.push({ id: doc.id, ...doc.data() });
  });
  res.status(200).json(pokemon);
});

// Get a list of all Pokemon by region
app.get('/pokemon/region/:region', async (req, res) => {
  const snapshot = await db.collection('PokemonList').where('region', '==', req.params.region).get();
  const pokemon = [];
  snapshot.forEach((doc) => {
    pokemon.push({ id: doc.id, ...doc.data() });
  });
  res.status(200).json(pokemon);
});

// Get a list of all Pokemon by moves
app.get('/pokemon/moves/:moves', async (req, res) => {
  const snapshot = await db.collection('PokemonList').where('moves', 'array-contains', req.params.moves).get();
  const pokemon = [];
  snapshot.forEach((doc) => {
    pokemon.push({ id: doc.id, ...doc.data() });
  });
  res.status(200).json(pokemon);
});

// Get a list of all Pokemon by abilities
app.get('/pokemon/abilities/:abilities', async (req, res) => {
  const snapshot = await db.collection('PokemonList').where('abilities', 'array-contains', req.params.abilities).get();
  const pokemon = [];
  snapshot.forEach((doc) => {
    pokemon.push({ id: doc.id, ...doc.data() });
  });
  res.status(200).json(pokemon);
});



// Put Requests (Update) ////////////////////////////////////////////////////////////////////////////////

// Delete Requests (Delete) ////////////////////////////////////////////////////////////////////////////////



// Port for the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

