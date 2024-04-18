const { admin } = require('./firebaseAdminConfig');
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });

// Helper function to randomly select documents, assign a random level, and determine if shiny
async function getRandomPokemon() {
    const db = admin.firestore();
    const snapshot = await db.collection('PokemonList').get();
    const pokemonList = [];
    snapshot.forEach(doc => {
        const pokemon = doc.data();
        pokemon.level = Math.floor(Math.random() * 100) + 1; // Assign random level from 1 to 100

        // Select one random ability and replace the array
        if (pokemon.abilities && pokemon.abilities.length > 0) {
            pokemon.abilities = [pokemon.abilities[Math.floor(Math.random() * pokemon.abilities.length)]];
        }

        // Select two random moves
        if (pokemon.moves && pokemon.moves.length > 0) {
            let shuffledMoves = pokemon.moves.sort(() => 0.5 - Math.random());
            pokemon.moves = shuffledMoves.slice(0, 2);
        }

        // Determine sprite and cost
        const isShiny = Math.random() < 0.1; // 10% chance to be shiny
        pokemon.is_shiny = isShiny; // Save shiny attribute as true or false
        pokemon.sprite = isShiny ? pokemon.sprites.shiny : pokemon.sprites.default;
        const costFactor = isShiny ? pokemon.shiny_cost : pokemon.base_cost;
        pokemon.marketplace_cost = calculateMarketPrice(pokemon.level, costFactor);

        // Remove unused properties
        delete pokemon.sprites;
        delete pokemon.base_cost;
        delete pokemon.shiny_cost;

        pokemonList.push(pokemon);
    });

    // Shuffle array
    for (let i = pokemonList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pokemonList[i], pokemonList[j]] = [pokemonList[j], pokemonList[i]];
    }
    return pokemonList.slice(0, 100);
}

// Function to calculate market price based on level
function calculateMarketPrice(level, cost) {
    let price;
    if (level === 100) {
        price = cost * 2;
    } else if (level === 1) {
        price = cost * 0.5;
    } else {
        price = cost * (0.5 + (1.5 * (level - 1) / 99));
    }
    return Math.round(price); // Round to the nearest whole number
}

// Cloud function to update the Marketplace every 6 hours starting at 04:00 CST
exports.updateMarketplace = functions.pubsub.schedule('0 10,16,22,4 * * *')
    .timeZone('America/Chicago') // Set the timezone to your desired timezone
    .onRun(async () => {
        const randomPokemon = await getRandomPokemon();
        const db = admin.firestore();
        const marketplaceRef = db.collection('Marketplace');

        await db.runTransaction(async (transaction) => {
            const marketSnapshot = await marketplaceRef.get();
            // Delete existing documents
            marketSnapshot.forEach(doc => {
                transaction.delete(marketplaceRef.doc(doc.id));
            });

            // Add new random pokemon with calculated marketplace costs
            randomPokemon.forEach(pokemon => {
                const newDocRef = marketplaceRef.doc(); // Create a new document reference
                transaction.set(newDocRef, pokemon);
            });
        });

        console.log('Marketplace updated with new random Pokemon set.');
    });

// Purchase a Pokemon from the Marketplace
exports.purchasePokemon = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
      if (req.method !== 'POST') {
          return res.status(405).send({ message: 'Method not allowed' });
      }

      const { userId, pokemonId } = req.body;

      if (!userId || !pokemonId) {
          return res.status(400).send({ message: 'Missing userId or pokemonId' });
      }

      const db = admin.firestore();
      const userRef = db.collection('users').doc(userId);
      // Query the Marketplace for the Pokemon with the specified ID
      const pokemonQuery = db.collection('Marketplace').where('id', '==', pokemonId);

      try {
          await db.runTransaction(async (transaction) => {
              const userDoc = await transaction.get(userRef);
              if (!userDoc.exists) {
                  throw new Error('User not found');
              }

              const pokemonQuerySnapshot = await transaction.get(pokemonQuery);
              if (pokemonQuerySnapshot.empty) {
                  throw new Error('Pokemon not found in Marketplace');
              }

              // Assuming there's only one match for each unique Pokémon ID
              const pokemonDoc = pokemonQuerySnapshot.docs[0];
              const pokemonData = pokemonDoc.data();
              const totalCost = pokemonData.marketplace_cost;

              if (userDoc.data().pokeDollars < totalCost) {
                  throw new Error('Insufficient funds');
              }

              // Deduct pokeDollars from the user's balance
              transaction.update(userRef, {
                  pokeDollars: admin.firestore.FieldValue.increment(-totalCost)
              });

              // Add the purchased Pokemon data to the user's collection
              const userPokemonRef = db.collection('user_pokemon').doc();
              transaction.set(userPokemonRef, pokemonData);

              // Optionally, remove the Pokémon from the marketplace
              transaction.delete(pokemonDoc.ref);

              return res.status(200).send({
                  success: true,
                  message: 'Checkout successful!',
                  userData: {
                      username: userDoc.data().username,
                      pokeDollars: userDoc.data().pokeDollars - totalCost
                  }
              });
          });
      } catch (error) {
          console.error('Error during purchase:', error);
          return res.status(500).send({ error: error.message });
      }
  });
});




// Get UserData for the user
exports.getUserData = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        // Only allow GET requests
        if (req.method !== 'GET') {
            return res.status(405).send({ error: 'Method Not Allowed' });
        }

        // Get user ID from the query string
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).send({ error: 'User ID is required' });
        }

        try {
            const userRef = admin.firestore().collection('users').doc(userId);
            const doc = await userRef.get();

            if (!doc.exists) {
                return res.status(404).send({ error: 'User not found' });
            }

            const userData = doc.data();
            return res.status(200).send(userData);
        } catch (error) {
            console.error('Error fetching user data:', error);
            res.status(500).send({ error: 'Internal Server Error' });
        }
    });
});
