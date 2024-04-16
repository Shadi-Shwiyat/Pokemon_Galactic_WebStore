const firebaseFunctionsTest = require('firebase-functions-test')();

// Initialize Firebase functions test
firebaseFunctionsTest.mockConfig({
  firebase: { // Add your project-specific config here
    databaseURL: "https://pokemon-galactic-webstore.firebaseio.com",
    storageBucket: "pokemon-galactic-webstore.appspot.com",
    projectId: 'pokemon-galactic-webstore',
  }
});

module.exports = firebaseFunctionsTest;
