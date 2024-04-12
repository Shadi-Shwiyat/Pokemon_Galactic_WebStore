const { admin } = require('./firebaseAdminConfig');
const functions = require('firebase-functions');

// Helper function to randomly select documents
async function getRandomPokemon() {
    const db = admin.firestore();
    const snapshot = await db.collection('PokemonList').get();
    const pokemonList = [];
    snapshot.forEach(doc => pokemonList.push(doc.data()));

    // Shuffle array and pick first 100
    for (let i = pokemonList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pokemonList[i], pokemonList[j]] = [pokemonList[j], pokemonList[i]];
    }
    return pokemonList.slice(0, 100);
}

// Cloud function to update the Marketplace
exports.updateMarketplace = functions.pubsub.schedule('0 2 * * *').timeZone('America/New_York').onRun(async () => {
    const randomPokemon = await getRandomPokemon();
    const db = admin.firestore();
    const marketplaceRef = db.collection('Marketplace');

    // Transaction to clear and update the collection
    await db.runTransaction(async (transaction) => {
        const marketSnapshot = await marketplaceRef.get();
        // Delete existing documents
        marketSnapshot.forEach(doc => {
            transaction.delete(marketplaceRef.doc(doc.id));
        });

        // Add new random pokemon
        randomPokemon.forEach(pokemon => {
            const newDocRef = marketplaceRef.doc(); // Create a new document reference
            transaction.set(newDocRef, pokemon);
        });
    });

    console.log('Marketplace updated with new random Pokemon set.');
});
