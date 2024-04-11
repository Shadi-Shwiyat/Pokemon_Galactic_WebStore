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
    const { type, generation, name, region, moves, abilities, id, sprite, startAfter, limit = 15 } = req.query;
    const db = admin.firestore();
    let query = db.collection('PokemonList').orderBy('id'); // You might need to adjust this based on your indexing strategy

    // Apply search filters
    if (type) query = query.where('type', 'array-contains', type);
    if (generation) query = query.where('generation', '==', generation);
    if (name) query = query.where('name', '==', name);
    if (region) query = query.where('region', '==', region);
    if (moves) query = query.where('moves', 'array-contains', moves);
    if (abilities) query = query.where('abilities', 'array-contains', abilities);
    if (id) query = query.where('id', '==', id);
    if (sprite) query = query.where('sprite', '==', sprite);

    // Pagination logic
    if (startAfter) {
      // Retrieve the document to start after
      const startAfterDoc = await db.collection('PokemonList').doc(startAfter).get();
      if (startAfterDoc.exists) {
        query = query.startAfter(startAfterDoc);
      }
    }
    query = query.limit(parseInt(limit, 15));

    try {
      const snapshot = await query.get();
      if (snapshot.empty) {
        return res.status(404).send({message: 'No Pokémon found matching the criteria'});
      }

      const pokemon = snapshot.docs.map(doc => doc.data());

      // Determine the next page token
      const lastVisible = snapshot.docs[snapshot.docs.length-1];
      const nextPageToken = lastVisible ? lastVisible.id : null;

      return res.status(200).json({
        pokemon,
        nextPageToken
      });
    } catch (error) {
      console.error('Error searching Pokémon:', error);
      return res.status(500).send({message: 'Internal Server Error'});
    }
  });
});


// Get all Pokemon
exports.getAllPokemon = functions.https.onRequest((req, res) => {
  runCorsAndMethod(req, res, 'GET', async () => {
    const db = admin.firestore();
    let query = db.collection('PokemonList').orderBy('id'); // Make sure to order by a field

    // Pagination parameters
    const limit = 15; // Items per page
    const { startAfter } = req.query; // ID of the last item of the previous page

    if (startAfter) {
      const startAfterDoc = await db.collection('PokemonList').doc(startAfter).get();
      if (startAfterDoc.exists) {
        query = query.startAfter(startAfterDoc);
      }
    }

    query = query.limit(limit);

    const snapshot = await query.get();
    const pokemon = snapshot.docs.map(doc => doc.data());

    // Assuming you have a field to order by (e.g., 'id'), and you send the last 'id' as 'startAfter' for the next page
    const lastVisible = snapshot.docs[snapshot.docs.length-1];
    const nextPageToken = lastVisible ? lastVisible.id : null; // Send this back for the next page query

    res.status(200).json({
      pokemon,
      nextPageToken
    });
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
    const { type, startAfter } = req.query;
    const db = admin.firestore();
    let query = db.collection('PokemonList').where('typing', 'array-contains', type).orderBy('id');

    const limit = 15;
    if (startAfter) {
      const startAfterDoc = await db.collection('PokemonList').doc(startAfter).get();
      if (startAfterDoc.exists) {
        query = query.startAfter(startAfterDoc);
      }
    }
    query = query.limit(limit);

    try {
      const snapshot = await query.get();
      if (snapshot.empty) {
        return res.status(404).send({message: 'No Pokémon found for the given type'});
      }
      const pokemon = snapshot.docs.map(doc => doc.data());

      const lastVisible = snapshot.docs[snapshot.docs.length-1];
      const nextPageToken = lastVisible ? lastVisible.id : null;

      return res.status(200).json({
        pokemon,
        nextPageToken
      });
    } catch (error) {
      console.error('Error fetching Pokemon by type:', error);
      return res.status(500).send({message: 'Error fetching Pokemon by type'});
    }
  });
});

// Get a Pokemon by generation
exports.getPokemonByGeneration = functions.https.onRequest((req, res) => {
  runCorsAndMethod(req, res, 'GET', async () => {
    const { generation, startAfter } = req.query;
    const db = admin.firestore();
    let query = db.collection('PokemonList').where('generation', '==', generation).orderBy('id');

    const limit = 15;
    if (startAfter) {
      const startAfterDoc = await db.collection('PokemonList').doc(startAfter).get();
      if (startAfterDoc.exists) {
        query = query.startAfter(startAfterDoc);
      }
    }
    query = query.limit(limit);

    try {
      const snapshot = await query.get();
      if (snapshot.empty) {
        return res.status(404).send({ message: 'No Pokémon found for the given generation' });
      }
      const pokemon = snapshot.docs.map(doc => doc.data());

      const lastVisible = snapshot.docs[snapshot.docs.length-1];
      const nextPageToken = lastVisible ? lastVisible.id : null;

      return res.status(200).json({
        pokemon,
        nextPageToken
      });
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
    const { region, startAfter } = req.query;
    const db = admin.firestore();
    let query = db.collection('PokemonList').where('region', '==', region).orderBy('id');

    const limit = 15;
    if (startAfter) {
      const startAfterDoc = await db.collection('PokemonList').doc(startAfter).get();
      if (startAfterDoc.exists) {
        query = query.startAfter(startAfterDoc);
      }
    }
    query = query.limit(limit);

    try {
      const snapshot = await query.get();
      if (snapshot.empty) {
        return res.status(404).send({ message: 'No Pokémon found for the given region' });
      }
      const pokemon = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const lastVisible = snapshot.docs[snapshot.docs.length-1];
      const nextPageToken = lastVisible ? lastVisible.id : null;

      return res.status(200).json({
        pokemon,
        nextPageToken
      });
    } catch (error) {
      console.error('Error fetching Pokémon by region:', error);
      return res.status(500).send({ message: 'Error fetching Pokémon by region' });
    }
  });
});

// Get a Pokemon by moves
exports.getPokemonByMoves = functions.https.onRequest((req, res) => {
  runCorsAndMethod(req, res, 'GET', async () => {
    const { moves, startAfter } = req.query; // Assuming moves are passed as a comma-separated list
    const db = admin.firestore();
    
    // Convert moves to an array, assuming it's passed as a comma-separated string
    const movesArray = moves ? moves.split(',') : [];
    
    // Starting the query
    // Note: This assumes you are looking for Pokémon that have any of the moves listed in movesArray.
    // If you need Pokémon that have all the moves, this query would be more complex and might require a different approach.
    let query = db.collection('PokemonList').where('moves', 'array-contains-any', movesArray).orderBy('id');

    const limit = 15; // Define how many documents to return in one page
    
    // Implementing pagination
    if (startAfter) {
      // Fetch the document to start after
      const startAfterDoc = await db.collection('PokemonList').doc(startAfter).get();
      if (startAfterDoc.exists) {
        query = query.startAfter(startAfterDoc);
      }
    }
    
    query = query.limit(limit);
    
    try {
      const snapshot = await query.get();
      if (snapshot.empty) {
        return res.status(404).send({ message: 'No Pokémon found with the specified moves' });
      }
      
      const pokemon = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Determine the next page token
      const lastVisible = snapshot.docs[snapshot.docs.length-1];
      const nextPageToken = lastVisible ? lastVisible.id : null;
      
      return res.status(200).json({
        pokemon,
        nextPageToken
      });
    } catch (error) {
      console.error('Error fetching Pokémon by moves:', error);
      return res.status(500).send({ message: 'Error fetching Pokémon by moves' });
    }
  });
});

// Get a Pokemon by abilities
exports.getPokemonByAbilities = functions.https.onRequest((req, res) => {
  runCorsAndMethod(req, res, 'GET', async () => {
    const { abilities, startAfter } = req.query; // Assuming abilities are passed as a comma-separated list
    const db = admin.firestore();
    
    // Convert abilities to an array if it's passed as a comma-separated string
    const abilitiesArray = abilities ? abilities.split(',') : [];
    
    // Start the query
    // This assumes you're looking for Pokémon that have any of the abilities listed in abilitiesArray
    let query = db.collection('PokemonList').where('abilities', 'array-contains-any', abilitiesArray).orderBy('id');

    const limit = 15; // Define the number of documents to return in one page
    
    // Implementing pagination
    if (startAfter) {
      // Fetch the document specified by startAfter
      const startAfterDoc = await db.collection('PokemonList').doc(startAfter).get();
      if (startAfterDoc.exists) {
        query = query.startAfter(startAfterDoc);
      }
    }
    
    query = query.limit(limit);
    
    try {
      const snapshot = await query.get();
      if (snapshot.empty) {
        return res.status(404).send({ message: 'No Pokémon found with the specified abilities' });
      }
      
      const pokemon = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Determine the nextPageToken for pagination
      const lastVisible = snapshot.docs[snapshot.docs.length-1];
      const nextPageToken = lastVisible ? lastVisible.id : null;
      
      return res.status(200).json({
        pokemon,
        nextPageToken
      });
    } catch (error) {
      console.error('Error fetching Pokémon by abilities:', error);
      return res.status(500).send({ message: 'Error fetching Pokémon by abilities' });
    }
  });
});
