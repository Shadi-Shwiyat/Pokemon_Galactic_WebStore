const { admin } = require('./firebaseAdminConfig');
const functions = require('firebase-functions');
const cors = require('cors')({origin: true});

// Create a new user with email and password
exports.signup = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send('Email and password are required');
    }
    try {
      const userRecord = await admin.auth().createUser({
        email,
        password,
        emailVerified: false,
        disabled: false
      });
      
      // Initialize PokeDollars for the new user
      const db = admin.firestore();
      await db.collection('users').doc(userRecord.uid).set({
        pokeDollars: 100000,
        lastLogin: admin.firestore.FieldValue.serverTimestamp() // Track last login for daily bonus
      });

      res.status(201).send({ userId: userRecord.uid });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
});


// Sign in a user with email and password
exports.signin = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send('Email and password are required');
    }
    try {
      const user = await admin.auth().getUserByEmail(email);
      const token = await admin.auth().createCustomToken(user.uid);
      
      const db = admin.firestore();
      const userDoc = db.collection('users').doc(user.uid);
      const doc = await userDoc.get();
      if (doc.exists) {
        const lastLogin = doc.data().lastLogin.toDate();
        const now = new Date();
        const diff = now - lastLogin;
        if (diff >= 86400000) { // 24 hours in milliseconds
          await userDoc.update({
            pokeDollars: admin.firestore.FieldValue.increment(25000),
            lastLogin: admin.firestore.FieldValue.serverTimestamp()
          });
        }
      }

      res.status(200).send({ token });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
});

// Send email verification link
exports.verifyEmail = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }
    const { email } = req.body;
    if (!email) {
      return res.status(400).send('Email is required');
    }
    try {
      const link = await admin.auth().generateEmailVerificationLink(email);
      // Implement sending the email with the link
      res.status(200).send({ link });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
});

// Send password reset link
exports.resetPassword = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }
    const { email } = req.body;
    if (!email) {
      return res.status(400).send('Email is required');
    }
    try {
      const link = await admin.auth().generatePasswordResetLink(email);
      // Implement sending the email with the link
      res.status(200).send({ link });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
});

// Update user password
exports.updatePassword = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).send('Email and new password are required');
    }
    try {
      const user = await admin.auth().getUserByEmail(email);
      await admin.auth().updateUser(user.uid, {
        password: newPassword
      });
      res.status(200).send('Password updated successfully');
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
});

// Sign out user (revoke tokens)
exports.signout = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }
    const { uid } = req.body;
    if (!uid) {
      return res.status(400).send('User ID is required');
    }
    try {
      await admin.auth().revokeRefreshTokens(uid);
      res.status(200).send('Successfully signed out user');
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
});

// Allow users to see all Pokemon they have purchased
exports.getUserPokemons = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'GET') {
      return res.status(405).send('Method Not Allowed');
    }
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).send('User ID is required');
    }

    const db = admin.firestore();
    const userPokemonsRef = db.collection('users').doc(userId).collection('pokemons');

    try {
      const snapshot = await userPokemonsRef.get();
      if (snapshot.empty) {
        return res.status(404).send('No Pokémon found');
      }

      const pokemons = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      res.status(200).json(pokemons);
    } catch (error) {
      console.error('Error fetching user Pokémon:', error);
      res.status(500).send('Internal Server Error');
    }
  });
});
