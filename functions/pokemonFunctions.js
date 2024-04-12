const { admin } = require('./firebaseAdminConfig');
const functions = require('firebase-functions');
const cors = require('cors')({origin: true});

// Helper function to handle CORS and method checking
const runCorsAndMethod = (req, res, method, callback) => {
  cors(req, res, () => {
    if (req.method !== method) {
      return res.status(405).send({message: `Only ${method} method is allowed`});
    }
    callback();
  });
};

// Helper function to set up pagination
const setupPagination = async (query, req) => {
  const pageSize = parseInt(req.query.pageSize) || 10;  // Default page size
  const pageToken = req.query.pageToken;  // Document ID to start after

  if (pageToken) {
    const lastDocSnapshot = await admin.firestore().collection('PokemonList').doc(pageToken).get();
    if (!lastDocSnapshot.exists) {
      throw new Error("Invalid pageToken: Document does not exist.");
    }
    return query.startAfter(lastDocSnapshot).limit(pageSize);
  } else {
    return query.limit(pageSize);
  }
};


// Create a new Pokemon 
exports.createPokemon = functions.https.onRequest(async (req, res) => {
  // Add CORS support
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).send({message: 'Only POST requests are accepted'});
    return;
  }

  try {
    const {
      id, name, abilities, base_cost, base_stat_total, cry, flavor_text, generation, height,
      moves, region, shiny_cost, sprites, stats, typing, weight
    } = req.body;

    // Validate all fields are present and correctly formed
    if (
      typeof id !== 'number' ||
      typeof name !== 'string' || name.trim() === '' ||
      !Array.isArray(abilities) || abilities.length === 0 ||
      typeof base_cost !== 'number' ||
      typeof base_stat_total !== 'number' ||
      typeof cry !== 'string' || cry.trim() === '' ||
      typeof flavor_text !== 'string' || flavor_text.trim() === '' ||
      typeof generation !== 'string' || generation.trim() === '' ||
      typeof height !== 'number' ||
      !Array.isArray(moves) || moves.length === 0 ||
      typeof region !== 'string' || region.trim() === '' ||
      typeof shiny_cost !== 'number' ||
      typeof sprites !== 'object' || !sprites.default || !sprites.shiny ||
      typeof stats !== 'object' || Object.values(stats).some(v => typeof v !== 'number') ||
      !Array.isArray(typing) || typing.length === 0 ||
      typeof weight !== 'number'
    ) {
      return res.status(400).send({message: 'Missing or invalid fields'});
    }

    const db = admin.firestore();

    // Check if the Pokemon ID already exists
    const pokemonRefById = db.collection('PokemonList').doc(String(id));
    const docById = await pokemonRefById.get();
    if (docById.exists) {
      return res.status(409).send({message: 'A Pokemon with this ID already exists'});
    }

    // Check if the Pokemon name already exists
    const querySnapshot = await db.collection('PokemonList').where('name', '==', name).get();
    if (!querySnapshot.empty) {
      return res.status(409).send({message: 'A Pokemon with this name already exists'});
    }

    // If validation passes, and both checks are unique, set the document
    await pokemonRefById.set({
      id, name, abilities, base_cost, base_stat_total, cry, flavor_text, generation, height,
      moves, region, shiny_cost, sprites, stats, typing, weight
    });

    return res.status(201).send({message: 'Pokemon created successfully'});
  } catch (error) {
    console.error('Error creating Pokemon:', error);
    return res.status(500).send({message: 'Internal Server Error'});
  }
});


// Get a single Pokemon by ID
exports.getPokemonById = functions.https.onRequest((req, res) => {
  runCorsAndMethod(req, res, 'GET', async () => {
    const {id} = req.query; // Assuming ID is passed as a query parameter
    const db = admin.firestore();

    const doc = await db.collection('PokemonList').doc(id).get();
    if (!doc.exists) {
      return res.status(404).send({message: 'Pokémon not found'});
    }
    return res.status(200).json(doc.data());
  });
});

// Search for a Pokemon based on various criteria
exports.searchPokemon = functions.https.onRequest((req, res) => {
  runCorsAndMethod(req, res, 'GET', async () => {
    const db = admin.firestore();
    let query = db.collection('PokemonList').orderBy('id');

    // Adding filters based on query parameters
    if (req.query.type) query = query.where('type', 'array-contains', req.query.type);
    if (req.query.generation) query = query.where('generation', '==', req.query.generation);
    if (req.query.name) query = query.where('name', '==', req.query.name);
    if (req.query.region) query = query.where('region', '==', req.query.region);
    if (req.query.moves) query = query.where('moves', 'array-contains', req.query.moves);
    if (req.query.abilities) query = query.where('abilities', 'array-contains', req.query.abilities);
    if (req.query.id) query = query.where('id', '==', req.query.id);
    if (req.query.sprite) query = query.where('sprite', '==', req.query.sprite);

    // Setup pagination
    query = setupPagination(query, req);

    try {
      const snapshot = await query.get();
      const pokemon = snapshot.docs.map(doc => doc.data());

      let nextPageToken = null;
      if (!snapshot.empty && pokemon.length === parseInt(req.query.pageSize)) {
        nextPageToken = snapshot.docs[snapshot.docs.length - 1].id; // Use the last document ID as the next page token
      }

      return res.status(200).json({ pokemon, nextPageToken });
    } catch (error) {
      console.error('Error searching Pokémon:', error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  });
});


// Get all Pokemon
exports.getAllPokemon = functions.https.onRequest((req, res) => {
  runCorsAndMethod(req, res, 'GET', async () => {
    const db = admin.firestore();
    let query = db.collection('PokemonList').orderBy('id');

    try {
      // Setup pagination using the helper function
      query = await setupPagination(query, req);

      const snapshot = await query.get();
      const pokemon = snapshot.docs.map(doc => doc.data());

      // Prepare the next page token if there's more data
      let nextPageToken = null;
      if (!snapshot.empty && pokemon.length === parseInt(req.query.pageSize)) {
        nextPageToken = snapshot.docs[snapshot.docs.length - 1].id; // Last document's ID as the next page token
      }

      res.status(200).json({ pokemon, nextPageToken });
    } catch (error) {
      console.error('Error fetching all Pokémon:', error);
      return res.status(500).send({ message: 'Internal Server Error', error: error.message });
    }
  });
});

// Get a Pokemon sprite by ID NOT GIF
exports.getPokemonSpriteById = functions.https.onRequest((req, res) => {
  runCorsAndMethod(req, res, 'GET', async () => {
    const { id } = req.query; // Assuming sprite ID is passed as a query parameter
    const db = admin.firestore();

    try {
      const spriteDoc = await db.collection('PokemonSprites').doc(id).get();
      if (!spriteDoc.exists) {
        return res.status(404).send({message: 'Pokémon sprite not found'});
      }
      return res.status(200).json(spriteDoc.data());
    } catch (error) {
      console.error('Error fetching Pokemon sprite:', error);
      return res.status(500).send({message: 'Error fetching Pokemon sprite'});
    }
  });
});

// Get a Pokemon GIF sprite by name
exports.getPokemonGifByName = functions.https.onRequest((req, res) => {
  runCorsAndMethod(req, res, 'GET', async () => {
    const { name } = req.query;
    const bucket = admin.storage().bucket();

    try {
      const file = bucket.file(`sprites/pokemon/${name}.gif`);
      const signedUrls = await file.getSignedUrl({
        action: 'read',
        expires: '03-09-2491'
      });
      res.redirect(signedUrls[0]);
    } catch (error) {
      console.error('Error fetching Pokemon GIF:', error);
      res.status(500).send('Could not get Pokemon GIF.');
    }
  });
});

// Get a Pokemon by type
exports.getPokemonByType = functions.https.onRequest((req, res) => {
  runCorsAndMethod(req, res, 'GET', async () => {
    const db = admin.firestore();
    let query = db.collection('PokemonList').where('typing', 'array-contains', req.query.type).orderBy('id');

    // Setup pagination
    query = setupPagination(query, req);

    try {
      const snapshot = await query.get();
      const pokemon = snapshot.docs.map(doc => doc.data());

      let nextPageToken = null;
      if (!snapshot.empty && pokemon.length === parseInt(req.query.pageSize)) {
        nextPageToken = snapshot.docs[snapshot.docs.length - 1].id; // Use the last document ID as the next page token
      }

      return res.status(200).json({ pokemon, nextPageToken });
    } catch (error) {
      console.error('Error fetching Pokémon by type:', error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  });
});

// Get a Pokemon by generation
exports.getPokemonByGeneration = functions.https.onRequest((req, res) => {
  runCorsAndMethod(req, res, 'GET', async () => {
    const { generation } = req.query;
    const db = admin.firestore();
    let query = db.collection('PokemonList').where('generation', '==', generation).orderBy('id');

    try {
      const snapshot = await query.get();
      if (snapshot.empty) {
        return res.status(404).send({ message: 'No Pokémon found for the given generation' });
      }
      const pokemon = snapshot.docs.map(doc => doc.data());
      return res.status(200).json(pokemon);
    } catch (error) {
      console.error('Error fetching Pokémon by generation:', error);
      return res.status(500).send({ message: 'Error fetching Pokémon by generation' });
    }
  });
});

// Get a Pokemon by name
exports.getPokemonByName = functions.https.onRequest((req, res) => {
  runCorsAndMethod(req, res, 'GET', async () => {
    const { name } = req.query;
    const db = admin.firestore();

    try {
      const snapshot = await db.collection('PokemonList').where('name', '==', name).get();
      if (snapshot.empty) {
        return res.status(404).send({ message: 'Pokémon not found with the given name' });
      }
      const pokemon = snapshot.docs.map(doc => doc.data());
      return res.status(200).json(pokemon);
    } catch (error) {
      console.error('Error fetching Pokémon by name:', error);
      return res.status(500).send({ message: 'Error fetching Pokémon by name' });
    }
  });
});

// Get a Pokemon by region
exports.getPokemonByRegion = functions.https.onRequest((req, res) => {
  runCorsAndMethod(req, res, 'GET', async () => {
    const { region } = req.query;
    const db = admin.firestore();
    let query = db.collection('PokemonList').where('region', '==', region).orderBy('id');

    try {
      const snapshot = await query.get();
      if (snapshot.empty) {
        return res.status(404).send({ message: 'No Pokémon found for the given region' });
      }
      const pokemon = snapshot.docs.map(doc => doc.data());
      return res.status(200).json(pokemon);
    } catch (error) {
      console.error('Error fetching Pokémon by region:', error);
      return res.status(500).send({ message: 'Error fetching Pokémon by region' });
    }
  });
});

// Get a Pokemon by moves
exports.getPokemonByMoves = functions.https.onRequest((req, res) => {
  runCorsAndMethod(req, res, 'GET', async () => {
    const db = admin.firestore();
    const movesArray = req.query.moves ? req.query.moves.split(',') : [];

    let query = db.collection('PokemonList').where('moves', 'array-contains-any', movesArray).orderBy('id');

    // Setup pagination
    query = setupPagination(query, req);

    try {
      const snapshot = await query.get();
      const pokemon = snapshot.docs.map(doc => doc.data());

      let nextPageToken = null;
      if (!snapshot.empty && pokemon.length === parseInt(req.query.pageSize)) {
        nextPageToken = snapshot.docs[snapshot.docs.length - 1].id;
      }

      return res.status(200).json({ pokemon, nextPageToken });
    } catch (error) {
      console.error('Error fetching Pokémon by moves:', error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  });
});

// Get a Pokemon by abilities
exports.getPokemonByAbilities = functions.https.onRequest((req, res) => {
  runCorsAndMethod(req, res, 'GET', async () => {
    const db = admin.firestore();
    const abilitiesArray = req.query.abilities ? req.query.abilities.split(',') : [];

    let query = db.collection('PokemonList').where('abilities', 'array-contains-any', abilitiesArray).orderBy('id');

    // Setup pagination
    query = setupPagination(query, req);

    try {
      const snapshot = await query.get();
      const pokemon = snapshot.docs.map(doc => doc.data());

      let nextPageToken = null;
      if (!snapshot.empty && pokemon.length === parseInt(req.query.pageSize)) {
        nextPageToken = snapshot.docs[snapshot.docs.length - 1].id;
      }

      return res.status(200).json({ pokemon, nextPageToken });
    } catch (error) {
      console.error('Error fetching Pokémon by abilities:', error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  });
});
