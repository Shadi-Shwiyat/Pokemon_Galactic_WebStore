/** Items routes */
const express = require('express');
const router = express.Router();
const { admin, bucket } = require('../firebaseAdminConfig'); // Import the Firebase Admin SDK

/** Item Routes */////////////////////////////////////////////////////////////////////////////////
/** Post Requests (Create) *////////////////////////////////////////////////////////////////////////////////
// Create a new Item


/** Get Requests (Read) *////////////////////////////////////////////////////////////////////////////////

/** Search by multiple attributes of Items ( Examples are name, id, cost etc)
Case Sensitivity is important during search based off Firebase Firestore
Wil need to update the search when adding other attributes to the ItemList */
router.get('/item/search', async (req, res) => {
  let query = admin.firestore().collection('ItemList');

  // Dynamically add filters based on query parameters
  if (req.query.id) {
    // Assuming id is unique, this could directly return one item, but kept flexible for consistency
    query = query.where('id', '==', parseInt(req.query.id));
  }
  if (req.query.name) {
    query = query.where('name', '==', req.query.name);
  }
  if (req.query.cost) {
    query = query.where('cost', '==', parseInt(req.query.cost));
  }
  // Add more attributes here as needed

  try {
    const snapshot = await query.get();
    if (snapshot.empty) {
      return res.status(404).json({ message: 'No items found matching the criteria' });
    }

    const items = snapshot.docs.map(doc => doc.data());
    res.status(200).json(items);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Error processing search', error: error.message });
  }
});

/** Get a single Item by ID */
router.get('/item/:id', async (req, res) => {
  const { id } = req.params;
  const itemRef = admin.firestore().collection('ItemList').doc(id);
  const doc = await itemRef.get();
  if (!doc.exists) {
    return res.status(404).json({ message: 'Item not found' });
  }
  res.json(doc.data());
});

/** Get all Items */
router.get('/item', async (req, res) => {
  const items = [];
  const snapshot = await admin.firestore().collection('ItemList').get();
  snapshot.forEach((doc) => {
    items.push(doc.data());
  });
  res.json(items);
});

/** Get Items by Name */
router.get('/item/name/:name', async (req, res) => {
  const { name } = req.params;
  const items = [];
  const snapshot = await admin.firestore().collection('ItemList').where('name', '==', name).get();
  snapshot.forEach((doc) => {
    items.push(doc.data());
  });
  res.json(items);
});

/** Get Items by Cost which is a number */
router.get('/item/cost/:cost', async (req, res) => {
  const { cost } = req.params;
  const items = [];
  const snapshot = await admin.firestore().collection('ItemList').where('cost', '==', parseInt(cost)).get();
  snapshot.forEach((doc) => {
    items.push(doc.data());
  });
  res.json(items);
});

/** Get Item Sprite gif */
router.get('/items-png/:name', (req, res) => {
  const fileName = req.params.name;
  const file = bucket.file(`sprites/items/${fileName}.png`);

  file.getSignedUrl({
    action: 'read',
    expires: '03-09-2491' // Far future date
  }).then(signedUrls => {
    // signedUrls[0] contains the file's URL
    res.redirect(signedUrls[0]);
  }).catch(err => {
    console.error('Error fetching signed URL:', err);
    res.status(500).send('Could not get file.');
  });
});
/** Put Requests (Update) *////////////////////////////////////////////////////////////////////////////////

/** Delete Requests (Delete) *////////////////////////////////////////////////////////////////////////////////


/** Export to server/index.js */
module.exports = router;
