/** Pokemon Routes */

const express = require('express');
const router = express.Router();
const { db, bucket} = require('../firebaseAdminConfig'); // Import the Firebase Admin SDK

/** Pokemon Routes */////////////////////////////////////////////////////////////////////////////////
/** Post Requests (Create) *////////////////////////////////////////////////////////////////////////////////
// Create a new Pokemon
router.post('/pokemon', async (req, res) => {
  const { id, name, generation, region } = req.body;

  // Validation for required fields
  if (!id || !name || !generation || !region) {
    return res.status(400).json({ message: 'ID, name, generation, and region are required' });
  }

  // Check for existing ID or Name
  const existingCheckQuery = db.collection('PokemonList').where('id', '==', id).get()
    .then(snapshot => {
      if (!snapshot.empty) return 'ID';
      return db.collection('PokemonList').where('name', '==', name).get();
    })
    .then(snapshot => {
      if (!snapshot.empty) return 'Name';
      return null;
    });

  // Check for existing Generation and Region
  const generationExists = db.collection('Generations').doc(generation).get()
    .then(doc => doc.exists);
  const regionExists = db.collection('Regions').doc(region).get()
    .then(doc => doc.exists);

  try {
    const [existingType, genExists, regExists] = await Promise.all([existingCheckQuery, generationExists, regionExists]);

    if (existingType === 'ID') {
      return res.status(409).json({ message: 'A Pokemon with this ID already exists' });
    }

    if (existingType === 'Name') {
      return res.status(409).json({ message: 'A Pokemon with this name already exists' });
    }

    if (!genExists || !regExists) {
      return res.status(400).json({ message: 'Generation or Region does not exist' });
    }

    // If checks pass, create the new Pokemon
    await db.collection('PokemonList').doc(String(id)).set(req.body);
    res.status(201).json({ message: 'Pokemon created successfully', id });

  } catch (error) {
    console.error('Error creating Pokemon:', error);
    res.status(500).json({ message: 'Error creating Pokemon', error: error.message });
  }
});  
  

/** Get Requests (Read) *////////////////////////////////////////////////////////////////////////////////

/** Search by multiple attributes of Pokemon ( Examples are name, type, generation etc)
Case Sensitivity is important during search based off Firebase Firestore
Wil need to update the search when adding other attributes to the PokemonList */
router.get('/pokemon/search', async (req, res) => {
  let query = db.collection('PokemonList');

  /** Check for each query parameter and apply filters accordingly */
  if (req.query.type) {
    query = query.where('name', 'array-contains', req.query.type);
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
  if (req.query.id) {
    query = query.where('id', '==', req.query.id);
  }
  if (req.query.sprite) {
    query = query.where('sprite', '==', req.query.sprite);
  }
  if (req.query.name) {
    query = query.where('name', '==', req.query.name);
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

/** Get a single Pokemon by ID */
router.get('/pokemon/:id', async (req, res) => {
  const doc = await db.collection('PokemonList').doc(req.params.id).get();
  if (!doc.exists) {
    res.status(404).send('Pokémon not found');
  } else {
    res.status(200).json({ id: doc.id, ...doc.data() });
  }
});

/** Get all Pokemon */
router.get('/pokemon', async (req, res) => {
  const snapshot = await db.collection('PokemonList').get();
  const pokemon = [];
  snapshot.forEach((doc) => {
    pokemon.push({ id: doc.id, ...doc.data() });
  });
  res.status(200).json(pokemon);
});

/** Get Pokemon Sprite by ID NOT GIF */
router.get('/pokemon/sprite/:id', async (req, res) => {
  const doc = await db.collection('PokemonSprites').doc(req.params.id).get();
  if (!doc.exists) {
    res.status(404).send('Pokémon sprite not found');
  } else {
    res.status(200).json({ id: doc.id, ...doc.data() });
  }
});

/** Get Pokemon Sprite actually .gif */
router.get('/pokemon-gif/:name', (req, res) => {
  const fileName = req.params.name;
  const file = bucket.file(`sprites/pokemon/${fileName}.gif`);

  file.getSignedUrl({
    action: 'read',
    expires: '03-09-2491' // Far future date
  }).then(signedUrls => {
    // signedUrls[0] contains the file's URL
    res.redirect(signedUrls[0]);
  }).catch(err => {
    console.error('Error fetching signed URL:', err);
    res.status(500).send('Could not get file.');
  });
});

/** Get a list of all Pokemon by type */
router.get('/pokemon/type/:type', async (req, res) => {
  const snapshot = await db.collection('PokemonList').where('typing', 'array-contains', req.params.type).get();
  const pokemon = [];
  snapshot.forEach((doc) => {
    pokemon.push({ id: doc.id, ...doc.data() });
  });
  res.status(200).json(pokemon);
});

/** Get a list of all Pokemon by generation */
router.get('/pokemon/generation/:generation', async (req, res) => {
  const snapshot = await db.collection('PokemonList').where('generation', '==', req.params.generation).get();
  const pokemon = [];
  snapshot.forEach((doc) => {
    pokemon.push({ id: doc.id, ...doc.data() });
  });
  res.status(200).json(pokemon);
});

/** Get a list of all Pokemon by name */
router.get('/pokemon/name/:name', async (req, res) => {
  const snapshot = await db.collection('PokemonList').where('name', '==', req.params.name).get();
  const pokemon = [];
  snapshot.forEach((doc) => {
    pokemon.push({ id: doc.id, ...doc.data() });
  });
  res.status(200).json(pokemon);
});

/** Get a list of all Pokemon by region */
router.get('/pokemon/region/:region', async (req, res) => {
  const snapshot = await db.collection('PokemonList').where('region', '==', req.params.region).get();
  const pokemon = [];
  snapshot.forEach((doc) => {
    pokemon.push({ id: doc.id, ...doc.data() });
  });
  res.status(200).json(pokemon);
});

/** Get a list of all Pokemon by moves */
router.get('/pokemon/moves/:moves', async (req, res) => {
  const snapshot = await db.collection('PokemonList').where('moves', 'array-contains', req.params.moves).get();
  const pokemon = [];
  snapshot.forEach((doc) => {
    pokemon.push({ id: doc.id, ...doc.data() });
  });
  res.status(200).json(pokemon);
});

/** Get a list of all Pokemon by abilities */
router.get('/pokemon/abilities/:abilities', async (req, res) => {
  const snapshot = await db.collection('PokemonList').where('abilities', 'array-contains', req.params.abilities).get();
  const pokemon = [];
  snapshot.forEach((doc) => {
    pokemon.push({ id: doc.id, ...doc.data() });
  });
  res.status(200).json(pokemon);
});



/** Put Requests (Update) *////////////////////////////////////////////////////////////////////////////////

/** Delete Requests (Delete) *////////////////////////////////////////////////////////////////////////////////


/** Export to server/index.js */
module.exports = router;
