const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK
const serviceAccount = require('../credentials.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'pokemon-galactic-webstore.appspot.com', // Replace with your Firebase Storage bucket
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

// Function to upload a single sprite and return its public URL
const uploadSpriteAndGetURL = async (filePath) => {
  const fileName = path.basename(filePath);
  const destination = `sprites/items/${fileName}`;
  await bucket.upload(filePath, {destination});
  
  // Assuming public access is set up for your Firebase Storage bucket,
  // you can construct the URL directly.
  return `https://storage.googleapis.com/${bucket.name}/${destination}`;
};

// Function to update Firestore documents with sprite URLs
const updateDocumentWithSpriteURL = async (docId, spriteURL) => {
  const docRef = db.collection('ItemSprites').doc(docId.toString());
  await docRef.set({
    spriteURL // You might want to adjust this depending on your data structure
  }, { merge: true });
  console.log(`Document ${docId} updated or created with sprite URL: ${spriteURL}`);
};

// Function to upload all sprites in a directory and update Firestore
const uploadSpritesAndUpdateDatabase = async (dirPath) => {
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const spriteURL = await uploadSpriteAndGetURL(filePath);

    // Extract ID or filename to use as a reference for the Firestore document
    const docId = path.parse(file).name; // Assuming the file name corresponds to the document ID or some identifiable property

    await updateDocumentWithSpriteURL(docId, spriteURL);
    console.log(`Updated document ${docId} with sprite URL: ${spriteURL}`);
  }
};

// Sprites directory and ensure your Firestore collection name is correct
uploadSpritesAndUpdateDatabase('../data/sprites/items').catch(console.error);
