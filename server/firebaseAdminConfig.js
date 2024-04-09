/** File is used to initialize the firebase admin SDK */
const admin = require('firebase-admin');
const credentials = require('../credentials.json');

admin.initializeApp({
  credential: admin.credential.cert(credentials),
  storageBucket: "pokemon-galactic-webstore.appspot.com"
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { admin, db, bucket};
