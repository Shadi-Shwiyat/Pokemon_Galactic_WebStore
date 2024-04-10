/** UserAuth Endpoints */

const express = require('express');
const router = express.Router();
const { admin } = require('../functions/firebaseAdminConfig'); // Import the Firebase Admin SDK


/** User Auth Endpionts *////////////////////////////////////////////////////////////////////////////////
/** Post Requests (Create) *////////////////////////////////////////////////////////////////////////////////
/** Create a new user */
router.post('/signup', async (req, res) => {
  console.log('Creating user:', req.body.email);
  const user = {
    email: req.body.email,
    password: req.body.password,
  };
  const userResponse = await admin.auth().createUser({
    email: user.email,
    password: user.password,
    emailVerified: false,
    disabled: false,
  });
  res.json(userResponse);
  console.log('User created successfully:', user.email);
});

/** Email Verification initiated by user */
router.post('/verifyemail', async (req, res) => {
  console.log('Verifying email for user:', req.body.email);
  const user = {
    email: req.body.email,
  };
  const userResponse = await admin.auth().generateEmailVerificationLink(user.email);
  res.json(userResponse);
  console.log('Email verification initiated successfully:', user.email);
});

/** Password reset initiated by user */
router.post('/resetpassword', async (req, res) => {
  console.log('Resetting password for user:', req.body.email);
  const user = {
    email: req.body.email,
  };
  const userResponse = await admin.auth().generatePasswordResetLink(user.email);
  res.json(userResponse);
  console.log('Password reset initiated successfully:', user.email);
});

/** Password Reset Confirmed */
router.post('/resetpasswordconfirm', async (req, res) => {
  console.log('Resetting password for user:', req.body.email);
  const user = {
    email: req.body.email,
    password: req.body.password,
  };
  const userResponse = await admin.auth().updateUser(user.email, {
    password: user.password,
  });
  res.json(userResponse);
  console.log('Password reset confirmed successfully:', user.email);
});

/** Sign in an existing user */
router.post('/signin', async (req, res) => {
  console.log('Signing in user:', req.body.email);
  const user = {
    email: req.body.email,
    password: req.body.password,
  };
  const userResponse = await admin.auth().getUserByEmail(user.email);
  res.json(userResponse);
  console.log('User signed in successfully:', user.email);
});

/** Refresh Login Token */
router.post('/refreshtoken', async (req, res) => {
  console.log('Refreshing token for user:', req.body.email);
  const user = {
    email: req.body.email,
  };
  const userResponse = await admin.auth().revokeRefreshTokens(user.email);
  res.json(userResponse);
  console.log('Token refreshed successfully:', user.email);
});

/** Log out a user */
router.post('/signout', async (req, res) => {
  console.log('Signing out user:', req.body.email);
  const user = {
    email: req.body.email,
  };
  const userResponse = await admin.auth().revokeRefreshTokens(user.email);
  res.json(userResponse);
  console.log('User signed out successfully:', user.email);
});

/** Get Requests (Read) *////////////////////////////////////////////////////////////////////////////////
/** Profile information */
router.get('/profile/:id', async (req, res) => {
  const user = await admin.auth().getUser(req.params.id);
  res.json(user);
});

/** Put Requests (Update) *////////////////////////////////////////////////////////////////////////////////
/** Update user information */
router.put('/profile/:id', async (req, res) => {
  const user = {
    id: req.params.id,
    email: req.body.email,
    password: req.body.password,
  };
  const userResponse = await admin.auth().updateUser(user.id, {
    email: user.email,
    password: user.password,
  });
  res.json(userResponse);
});

/** Delete Requests (Delete) *////////////////////////////////////////////////////////////////////////////////
/**Delete Account */
router.delete('/profile/:id', async (req, res) => {
  const user = {
    id: req.params.id,
  };
  const userResponse = await admin.auth().deleteUser(user.id);
  res.json(userResponse);
});

/** Export to server/index.js */
module.exports = router;
