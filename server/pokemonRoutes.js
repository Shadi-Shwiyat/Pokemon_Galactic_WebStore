// Pokemon Routes

const express = require('express');
const router = express.Router();
const { admin, db } = require('../server/firebaseAdminConfig'); // Import the Firebase Admin SDK

// Pokemon Routes ////////////////////////////////////////////////////////////////////////////////
// Post Requests (Create) ////////////////////////////////////////////////////////////////////////////////


// Get Requests (Read) ////////////////////////////////////////////////////////////////////////////////

// Search by multiple attributes of Pokemon ( Examples are name, type, generation etc)
// Case Sensitivity is important during search based off Firebase Firestore
// Wil need to update the search when adding other attributes to the PokemonList
router.get('/pokemon/search', async (req, res) => {
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
router.get('/pokemon/:id', async (req, res) => {
  const doc = await db.collection('PokemonList').doc(req.params.id).get();
  if (!doc.exists) {
    res.status(404).send('Pokémon not found');
  } else {
    res.status(200).json({ id: doc.id, ...doc.data() });
  }
});

// Get Pokemon Sprite by ID
router.get('/pokemon/sprite/:id', async (req, res) => {
  const doc = await db.collection('PokemonSprites').doc(req.params.id).get();
  if (!doc.exists) {
    res.status(404).send('Pokémon sprite not found');
  } else {
    res.status(200).json({ id: doc.id, ...doc.data() });
  }
});

// Get a list of all Pokemon by type
router.get('/pokemon/type/:type', async (req, res) => {
  const snapshot = await db.collection('PokemonList').where('typing', 'array-contains', req.params.type).get();
  const pokemon = [];
  snapshot.forEach((doc) => {
    pokemon.push({ id: doc.id, ...doc.data() });
  });
  res.status(200).json(pokemon);
});

// Get a list of all Pokemon by generation
router.get('/pokemon/generation/:generation', async (req, res) => {
  const snapshot = await db.collection('PokemonList').where('generation', '==', req.params.generation).get();
  const pokemon = [];
  snapshot.forEach((doc) => {
    pokemon.push({ id: doc.id, ...doc.data() });
  });
  res.status(200).json(pokemon);
});

// Get a list of all Pokemon by name
router.get('/pokemon/name/:name', async (req, res) => {
  const snapshot = await db.collection('PokemonList').where('name', '==', req.params.name).get();
  const pokemon = [];
  snapshot.forEach((doc) => {
    pokemon.push({ id: doc.id, ...doc.data() });
  });
  res.status(200).json(pokemon);
});

// Get a list of all Pokemon by region
router.get('/pokemon/region/:region', async (req, res) => {
  const snapshot = await db.collection('PokemonList').where('region', '==', req.params.region).get();
  const pokemon = [];
  snapshot.forEach((doc) => {
    pokemon.push({ id: doc.id, ...doc.data() });
  });
  res.status(200).json(pokemon);
});

// Get a list of all Pokemon by moves
router.get('/pokemon/moves/:moves', async (req, res) => {
  const snapshot = await db.collection('PokemonList').where('moves', 'array-contains', req.params.moves).get();
  const pokemon = [];
  snapshot.forEach((doc) => {
    pokemon.push({ id: doc.id, ...doc.data() });
  });
  res.status(200).json(pokemon);
});

// Get a list of all Pokemon by abilities
router.get('/pokemon/abilities/:abilities', async (req, res) => {
  const snapshot = await db.collection('PokemonList').where('abilities', 'array-contains', req.params.abilities).get();
  const pokemon = [];
  snapshot.forEach((doc) => {
    pokemon.push({ id: doc.id, ...doc.data() });
  });
  res.status(200).json(pokemon);
});



// Put Requests (Update) ////////////////////////////////////////////////////////////////////////////////

// Delete Requests (Delete) ////////////////////////////////////////////////////////////////////////////////


// Export to server/index.js
module.exports = router;
