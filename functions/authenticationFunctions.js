const { admin } = require('./firebaseAdminConfig');
const functions = require('firebase-functions');
const cors = require('cors')({origin: true});

// Create a new user with email, password, and username
exports.signup = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.status(400).send('Email, password, and username are required');
    }

    const db = admin.firestore();
    // Check if username is already taken
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('username', '==', username).get();
    if (!snapshot.empty) {
      return res.status(400).send('Username already taken');
    }

    try {
      const userRecord = await admin.auth().createUser({
        email,
        password,
        emailVerified: false,
        disabled: false
      });

      // Initialize user data with username
      await db.collection('users').doc(userRecord.uid).set({
        username,
        pokeDollars: 100000,
        lastLogin: admin.firestore.FieldValue.serverTimestamp()
      });

      res.status(201).send({ userId: userRecord.uid });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
});



// Sign in a user with username and password
exports.signin = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }

    const { username, password } = req.body;
    const db = admin.firestore();
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('username', '==', username).get();
    if (snapshot.empty) {
      return res.status(404).send('User not found');
    }

    const userDoc = snapshot.docs[0];
    const email = userDoc.data().email;

    try {
      // Authenticate the user with email and password retrieved from username
      const userCredential = await admin.auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      const token = await admin.auth().createCustomToken(user.uid);

      const doc = await usersRef.doc(user.uid).get();
      if (doc.exists) {
        const lastLogin = doc.data().lastLogin.toDate();
        const now = new Date();
        const diff = now - lastLogin;

        if (diff >= 86400000) {
          await usersRef.doc(user.uid).update({
            pokeDollars: admin.firestore.FieldValue.increment(25000),
            lastLogin: admin.firestore.FieldValue.serverTimestamp()
          });
        }
      }

      res.status(200).send({ token, uuid: user.uid });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
});


// Verify Token for user sign in
exports.verifyToken = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }

    const token = req.body.token;
    if (!token) {
      return res.status(400).send('Token is required');
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const uid = decodedToken.uid;

      // Now that the user is verified, perform any further server-side logic here
      res.status(200).send({ uid, message: 'Authentication successful' });
    } catch (error) {
      res.status(401).send('Unauthorized: ' + error.message);
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

// Update user password using username
exports.updatePassword = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }

    // Expect a session token in the Authorization header
    const sessionToken = req.headers.authorization;
    if (!sessionToken) {
      return res.status(401).send('No session token provided');
    }

    const { username, newPassword } = req.body;
    if (!username || !newPassword) {
      return res.status(400).send('Username and new password are required');
    }

    try {
      // Verify the session token and retrieve user information
      const decodedToken = await admin.auth().verifyIdToken(sessionToken);
      if (!decodedToken) {
        return res.status(403).send('Invalid session token');
      }

      const db = admin.firestore();
      const usersRef = db.collection('users');
      const snapshot = await usersRef.where('username', '==', username).get();
      if (snapshot.empty) {
        return res.status(404).send('User not found');
      }

      const userDoc = snapshot.docs[0];
      const email = userDoc.data().email;
      if (!email) {
        return res.status(400).send('Email not found for username');
      }

      // Check if the logged-in user matches the user whose password is being changed
      const user = await admin.auth().getUserByEmail(email);
      if (user.uid !== decodedToken.uid) {
        return res.status(403).send('Unauthorized to change password for this user');
      }

      // Update the password
      await admin.auth().updateUser(user.uid, {
        password: newPassword
      });
      res.status(200).send('Password updated successfully');
    } catch (error) {
      res.status(500).send('Error updating password: ' + error.message);
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
      res.status(500).send('Internal Server Error');
    }
  });
});
