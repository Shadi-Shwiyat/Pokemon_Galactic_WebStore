const { admin } = require('./firebaseAdminConfig');
const functions = require('firebase-functions');
const cors = require('cors')({origin: true});

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

// Cloud function to update the Marketplace every 6 hours starting at 06:00 CST
exports.updateMarketplace = functions.pubsub.schedule('0 12,18,0,6 * * *')
    .timeZone('UTC') // Keep the timezone as UTC
    .onRun(async (context) => {
        const randomPokemon = await getRandomPokemon();
        const db = admin.firestore();
        const marketplaceRef = db.collection('Marketplace');

        await db.runTransaction(async (transaction) => {
            const marketSnapshot = await marketplaceRef.get();
            // Delete existing documents
            marketSnapshot.forEach(doc => {
                transaction.delete(marketplaceRef.doc(doc.id));
            });

            // Add new random Pokemon with calculated marketplace costs
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
        return res.status(405).send('Method Not Allowed');
      }
      const { userId, pokemonId } = req.body;
  
      if (!userId || !pokemonId) {
        return res.status(400).send('User ID and Pokemon ID are required');
      }
  
      const db = admin.firestore();
      const userRef = db.collection('users').doc(userId);
      const pokemonRef = db.collection('Marketplace').doc(pokemonId);
  
      try {
        await db.runTransaction(async (transaction) => {
          const userDoc = await transaction.get(userRef);
          const pokemonDoc = await transaction.get(pokemonRef);
  
          if (!pokemonDoc.exists) {
            throw new Error('Pokemon not found in marketplace');
          }
  
          if (!userDoc.exists) {
            throw new Error('User not found');
          }
  
          const user = userDoc.data();
          const pokemon = pokemonDoc.data();
          const price = pokemon.marketplace_cost;
  
          if (user.pokeDollars < price) {
            throw new Error('Insufficient PokeDollars');
          }
  
          // Deduct the price from user's PokeDollars
          transaction.update(userRef, {
            pokeDollars: admin.firestore.FieldValue.increment(-price)
          });
  
          // Add Pokemon to user's collection
          const userPokemonRef = userRef.collection('pokemons').doc(pokemonId);
          transaction.set(userPokemonRef, pokemon);
  
          // Optional: Remove Pokemon from marketplace
          transaction.delete(pokemonRef);
        });
  
        res.status(200).send('Purchase successful');
      } catch (error) {
        res.status(500).send(error.message);
      }
    });
  });
