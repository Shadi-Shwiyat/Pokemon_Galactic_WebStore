const { admin } = require('./firebaseAdminConfig');
const functions = require('firebase-functions');

// Helper function to randomly select documents and assign a random level
async function getRandomPokemon() {
    const db = admin.firestore();
    const snapshot = await db.collection('PokemonList').get();
    const pokemonList = [];
    snapshot.forEach(doc => {
        const pokemon = doc.data();
        pokemon.level = Math.floor(Math.random() * 100) + 1; // Assign random level from 1 to 100

        // Select one random ability
        if (pokemon.abilities && pokemon.abilities.length > 0) {
            pokemon.ability = pokemon.abilities[Math.floor(Math.random() * pokemon.abilities.length)];
        }

        // Select two random moves
        if (pokemon.moves && pokemon.moves.length > 0) {
            let shuffledMoves = pokemon.moves.sort(() => 0.5 - Math.random());
            pokemon.moves = shuffledMoves.slice(0, 2);
        }

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

// Cloud function to update the Marketplace
exports.updateMarketplace = functions.pubsub.schedule('0 2 * * *').timeZone('America/New_York').onRun(async () => {
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
            const base_marketplace = calculateMarketPrice(pokemon.level, pokemon.base_cost);
            const shiny_marketplace = calculateMarketPrice(pokemon.level, pokemon.shiny_cost);
            transaction.set(newDocRef, {
                ...pokemon,
                base_marketplace,
                shiny_marketplace
            });
        });
    });

    console.log('Marketplace updated with new random Pokemon set, including marketplace values.');
});
