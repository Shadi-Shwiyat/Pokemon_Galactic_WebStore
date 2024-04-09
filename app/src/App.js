import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Test from '../src/components/Test/index.js';

function App() {
  const [spriteUrl, setSpriteUrl] = useState('');

  useEffect(() => {
    // Function to fetch a random Pokémon sprite URL
    const fetchPokemonSprite = async () => {
      // Generate a random Pokémon ID
      const pokemonId = Math.floor(Math.random() * 893) + 1; // There are 893 Pokémon
      const pokemonName = `pokemon_${pokemonId}`; // Assuming names are like pokemon_1, pokemon_2, etc.

      try {
        // Fetch the signed URL from your backend using the generated name
        const response = await fetch(`https://pokemon-galactic-webstore.web.app/pokemon-gif/${pokemonName}`);
        console.log(await response.text());
        const spriteUrl = await response.url; // The URL should be a direct link to the image
        
        

        setSpriteUrl(spriteUrl);
      } catch (error) {
        console.error("Failed to fetch Pokémon sprite:", error);
      }
    };

    fetchPokemonSprite();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Edit <code>src/App.js</code> and save to reload.</p>
        {/* Display the fetched Pokémon sprite if available */}
        {spriteUrl && <img src={spriteUrl} alt="Random Pokémon" />}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <footer>
        <Test />
      </footer>
    </div>
  );
}

export default App;
