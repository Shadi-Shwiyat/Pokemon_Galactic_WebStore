import React, { useEffect, useState } from 'react';
import './App.css';
// import Test from '../src/components/Test/index.js';

import firebase from 'firbase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyANXn-wqDdF7yi7-btnT4TkM2zyVfmusdA",
  authDomain: "pokemon-galactic-webstore.firebaseapp.com",
  projectId: "pokemon-galactic-webstore",
  storageBucket: "pokemon-galactic-webstore.appspot.com",
  messagingSenderId: "666118266980",
  appId: "1:666118266980:web:5b7960cd6349fd3c41ff71",
  measurementId: "G-PJ712D0Q2Q"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  // const [spriteUrl, setSpriteUrl] = useState('');

  // useEffect(() => {
  //   // Generate a random Pokémon ID within the range of existing Pokémon
  //   const pokemonId = Math.floor(Math.random() * 893) + 1; // Assuming there are 893 Pokémon
  //   const pokemonName = `pokemon_${pokemonId}`; // Construct the name for the Pokémon GIF

  //   const fetchPokemonSprite = async () => {
  //     try {
  //       // Fetch the signed URL for the Pokémon GIF from your Express backend
  //       const response = await fetch(`https://pokemon-galactic-webstore.web.app/pokemon-gif/${pokemonName}`);
  //       if (response.ok) {
  //         const spriteUrl = await response.url; // The final URL after redirection
  //         setSpriteUrl(spriteUrl); // Set the sprite URL for rendering the image
  //       } else {
  //         // Log the error status if the request was not successful
  //         console.error("Failed to load sprite. Response status:", response.status);
  //       }
  //     } catch (error) {
  //       // Log any errors that occur during the fetch operation
  //       console.error("Failed to fetch Pokémon sprite:", error);
  //     }
  //   };

  //   // Invoke the function to fetch the Pokémon sprite when the component mounts
  //   fetchPokemonSprite();
  // }, []); // The empty dependency array ensures this effect runs only once after the initial render

  return (
    <div className="App">
      <header className="App-header">
        <h1>It loads!</h1>

      </header>
    </div>
  );
}

export default App;
