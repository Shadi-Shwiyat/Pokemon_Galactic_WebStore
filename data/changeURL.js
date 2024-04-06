const admin = require('firebase-admin');
const serviceAccount = require('../credentials.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Function to update Firestore documents with sprite URLs
async function updateSpriteUrls() {
  const pokemonListRef = db.collection('PokemonList');
  const snapshot = await pokemonListRef.get();

  if (snapshot.empty) {
    console.log('No Pokémon found in the collection.');
    return;
  }

  let batch = db.batch();
  let counter = 0;

  snapshot.docs.forEach((doc, index) => {
    const pokemonData = doc.data();
    // URL format where the sprite lives in the Firebase DB !
    const newDefaultUrl = `gs://pokemon-galactic-webstore.appspot.com/sprites/pokemon_${pokemonData.id}.gif`;
    const newShinyUrl = `gs://pokemon-galactic-webstore.appspot.com/sprites/pokemon_shiny_${pokemonData.id}.gif`;

    // Prepare the update for batch commit
    const docRef = pokemonListRef.doc(doc.id);
    batch.update(docRef, { 'sprites.default': newDefaultUrl, 'sprites.shiny': newShinyUrl });

    counter++;

    // Firestore limits batches to 500 operations at a time
    if (counter % 500 === 0 || index === snapshot.docs.length - 1) {
      // Commit the batch
      batch.commit().then(() => {
        console.log(`Successfully updated ${counter} Pokémon sprite URLs.`);
      }).catch(error => {
        console.error("Error updating documents: ", error);
      });
      // Start a new batch
      batch = db.batch();
    }
  });
}

updateSpriteUrls().catch(console.error);
