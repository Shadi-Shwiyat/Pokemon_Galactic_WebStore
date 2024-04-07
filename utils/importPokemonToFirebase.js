const admin = require('firebase-admin');
const serviceAccount = require('../credentials.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const jsonData = require('../data/pokemon.json'); // Load your JSON data

const importData = async () => {
  const collectionRef = db.collection('PokemonList'); // Specify your collection name

  const batch = db.batch();

  jsonData.forEach((item) => {
    const docRef = collectionRef.doc(`${item.id}`); // Use the ID as the document reference
    batch.set(docRef, item);
  });

  await batch.commit();
  console.log('Data successfully imported to Firestore!');
};

importData().catch(console.error);
