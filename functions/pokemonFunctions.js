const functions = require('firebase-functions');
const admin = require('firebase-admin');
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
exports.createPokemon = functions.https.onRequest((req, res) => {
  runCorsAndMethod(req, res, 'POST', async () => {
    const { id, name, generation, region } = req.body;
    const db = admin.firestore();

    const pokemonRef = db.collection('PokemonList').doc(String(id));
    const doc = await pokemonRef.get();
    if (doc.exists) {
      return res.status(409).send({message: 'A Pokemon with this ID already exists'});
    }
    
    await pokemonRef.set({id, name, generation, region});
    return res.status(201).send({message: 'Pokemon created successfully'});
  });
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
    const {type, generation, name, region, moves, abilities, id, sprite} = req.query;
    const db = admin.firestore();
    let query = db.collection('PokemonList');

    if (type) query = query.where('type', 'array-contains', type);
    if (generation) query = query.where('generation', '==', generation);
    if (name) query = query.where('name', '==', name);
    if (region) query = query.where('region', '==', region);
    if (moves) query = query.where('moves', 'array-contains', moves);
    if (abilities) query = query.where('abilities', 'array-contains', abilities);
    if (id) query = query.where('id', '==', id);
    if (sprite) query = query.where('sprite', '==', sprite);

    const snapshot = await query.get();
    if (snapshot.empty) {
      return res.status(404).send({message: 'No Pokémon found matching the criteria'});
    }

    const pokemon = snapshot.docs.map(doc => doc.data());
    return res.status(200).json(pokemon);
  });
});

// Get all Pokemon
exports.getAllPokemon = functions.https.onRequest((req, res) => {
  runCorsAndMethod(req, res, 'GET', async () => {
    const db = admin.firestore();
    const snapshot = await db.collection('PokemonList').get();
    const pokemon = snapshot.docs.map(doc => doc.data());
    res.status(200).json(pokemon);
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
    const { type } = req.query;
    const db = admin.firestore();
    
    try {
      const snapshot = await db.collection('PokemonList').where('typing', 'array-contains', type).get();
      if (snapshot.empty) {
        return res.status(404).send({message: 'No Pokémon found for the given type'});
      }
      const pokemon = snapshot.docs.map(doc => doc.data());
      return res.status(200).json(pokemon);
    } catch (error) {
      console.error('Error fetching Pokemon by type:', error);
      return res.status(500).send({message: 'Error fetching Pokemon by type'});
    }
  });
});

// Get a Pokemon by generation
exports.getPokemonByGeneration = functions.https.onRequest((req, res) => {
  runCorsAndMethod(req, res, 'GET', async () => {
    const { generation } = req.query;
    const db = admin.firestore();

    try {
      const snapshot = await db.collection('PokemonList').where('generation', '==', generation).get();
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

    try {
      const snapshot = await db.collection('PokemonList').where('region', '==', region).get();
      if (snapshot.empty) {
        return res.status(404).send({ message: 'No Pokémon found for the given region' });
      }
      const pokemon = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
    const { moves } = req.query; // Assuming moves are passed as a comma-separated list
    const db = admin.firestore();

    try {
      const snapshot = await db.collection('PokemonList').where('moves', 'array-contains', moves).get();
      if (snapshot.empty) {
        return res.status(404).send({ message: 'No Pokémon found with the specified moves' });
      }
      const pokemon = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json(pokemon);
    } catch (error) {
      console.error('Error fetching Pokémon by moves:', error);
      return res.status(500).send({ message: 'Error fetching Pokémon by moves' });
    }
  });
});

// Get a Pokemon by abilities
exports.getPokemonByAbilities = functions.https.onRequest((req, res) => {
  runCorsAndMethod(req, res, 'GET', async () => {
    const { abilities } = req.query;
    const db = admin.firestore();

    try {
      const snapshot = await db.collection('PokemonList').where('abilities', 'array-contains', abilities).get();
      if (snapshot.empty) {
        return res.status(404).send({ message: 'No Pokémon found with the specified abilities' });
      }
      const pokemon = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json(pokemon);
    } catch (error) {
      console.error('Error fetching Pokémon by abilities:', error);
      return res.status(500).send({ message: 'Error fetching Pokémon by abilities' });
    }
  });
});
