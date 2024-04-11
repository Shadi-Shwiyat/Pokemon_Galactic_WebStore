const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});


// Utility to handle CORS and method checking
const runCorsAndMethod = (req, res, method, callback) => {
  cors(req, res, () => {
    if (req.method !== method) {
      return res.status(405).send({ message: `Only ${method} method is allowed` });
    }
    callback();
  });
};

// Search for Items based on various criteria
exports.searchItems = functions.https.onRequest((req, res) => {
  runCorsAndMethod(req, res, 'GET', async () => {
    const { id, name, cost } = req.query;
    const db = admin.firestore();
    let query = db.collection('ItemList');

    if (id) query = query.where('id', '==', parseInt(id));
    if (name) query = query.where('name', '==', name);
    if (cost) query = query.where('cost', '==', parseInt(cost));

    try {
      const snapshot = await query.get();
      if (snapshot.empty) {
        return res.status(404).send({ message: 'No items found matching the criteria' });
      }

      const items = snapshot.docs.map(doc => doc.data());
      return res.status(200).json(items);
    } catch (error) {
      console.error('Search error:', error);
      return res.status(500).send({ message: 'Error processing search', error: error.message });
    }
  });
});

// Get a single Item by ID
exports.getItemById = functions.https.onRequest((req, res) => {
  runCorsAndMethod(req, res, 'GET', async () => {
    const { id } = req.query; // Adjust parameter retrieval as needed
    const db = admin.firestore();

    try {
      const doc = await db.collection('ItemList').doc(id).get();
      if (!doc.exists) {
        return res.status(404).send({ message: 'Item not found' });
      }
      return res.status(200).json(doc.data());
    } catch (error) {
      console.error('Error fetching item:', error);
      return res.status(500).send({ message: 'Error fetching item' });
    }
  });
});

// Get Item Sprite PNG
exports.getItemSprite = functions.https.onRequest((req, res) => {
  runCorsAndMethod(req, res, 'GET', async () => {
    const { name } = req.query;
    const bucket = admin.storage().bucket();

    try {
      const file = bucket.file(`sprites/items/${name}.png`);
      const signedUrls = await file.getSignedUrl({
        action: 'read',
        expires: '03-09-2491'
      });
      res.redirect(signedUrls[0]);
    } catch (error) {
      console.error('Error fetching signed URL:', error);
      res.status(500).send('Could not get file.');
    }
  });
});

// Function to create a new item
exports.createItem = functions.https.onRequest(async (req, res) => {
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
    const { cost, flavor_text, id, name, sprite, type } = req.body;

    // Validate all fields are present and correctly formed
    if (
      typeof cost !== 'number' ||
      typeof flavor_text !== 'string' || flavor_text.trim() === '' ||
      typeof id !== 'number' ||
      typeof name !== 'string' || name.trim() === '' ||
      typeof sprite !== 'string' || sprite.trim() === '' ||
      typeof type !== 'string' || type.trim() === ''
    ) {
      return res.status(400).send({message: 'Missing or invalid fields'});
    }

    const db = admin.firestore();

    // Check if the item ID already exists
    const itemRefById = db.collection('ItemList').doc(String(id));
    const docById = await itemRefById.get();
    if (docById.exists) {
      return res.status(409).send({message: 'An item with this ID already exists'});
    }

    // Check if the item name already exists
    const querySnapshot = await db.collection('ItemList').where('name', '==', name).get();
    if (!querySnapshot.empty) {
      return res.status(409).send({message: 'An item with this name already exists'});
    }

    // If validation passes, and both checks are unique, set the document
    await itemRefById.set({
      cost, flavor_text, id, name, sprite, type
    });

    return res.status(201).send({message: 'Item created successfully', id: itemRefById.id});
  } catch (error) {
    console.error('Error creating item:', error);
    return res.status(500).send({message: 'Internal Server Error'});
  }
});


// Function to update an existing item
exports.updateItem = functions.https.onRequest((req, res) => {
  runCorsAndMethod(req, res, 'PUT', async () => {
    const { id } = req.query; // Adjust as needed based on how you're passing the ID
    const itemData = req.body;
    const db = admin.firestore();

    try {
      await db.collection('ItemList').doc(id).set(itemData, { merge: true });
      return res.status(200).send({ message: 'Item updated successfully' });
    } catch (error) {
      console.error('Error updating item:', error);
      return res.status(500).send({ message: 'Error updating item' });
    }
  });
});

// Function to delete an item
exports.deleteItem = functions.https.onRequest((req, res) => {
  runCorsAndMethod(req, res, 'DELETE', async () => {
    const { id } = req.query; // Adjust as needed based on how you're passing the ID
    const db = admin.firestore();

    try {
      await db.collection('ItemList').doc(id).delete();
      return res.status(200).send({ message: 'Item deleted successfully' });
    } catch (error) {
      console.error('Error deleting item:', error);
      return res.status(500).send({ message: 'Error deleting item' });
    }
  });
});
