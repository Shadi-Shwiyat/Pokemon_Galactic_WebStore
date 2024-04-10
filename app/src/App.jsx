import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [spriteUrl, setSpriteUrl] = useState('');

  useEffect(() => {
    // Generate a random Pokémon ID within the range of existing Pokémon
    const pokemonId = Math.floor(Math.random() * 893) + 1; // Assuming there are 893 Pokémon
    const pokemonName = `pokemon_${pokemonId}`; // Construct the name for the Pokémon GIF

    const fetchPokemonSprite = async () => {
      try {
        // Fetch the signed URL for the Pokémon GIF from your Express backend
        const response = await fetch(`https://pokemon-galactic-webstore.web.app/pokemon-gif/${pokemonName}`);
        if (response.ok) {
          const spriteUrl = await response.url; // The final URL after redirection
          setSpriteUrl(spriteUrl); // Set the sprite URL for rendering the image
        } else {
          // Log the error status if the request was not successful
          console.error("Failed to load sprite. Response status:", response.status);
        }
      } catch (error) {
        // Log any errors that occur during the fetch operation
        console.error("Failed to fetch Pokémon sprite:", error);
      }
    };

    // Invoke the function to fetch the Pokémon sprite when the component mounts
    fetchPokemonSprite();
  }, []); // The empty dependency array ensures this effect runs only once after the initial render

  return (
    <>
      <div className="App">
        <header className="App-header">
          <p>Random Pokemon</p>
          {/* Display the fetched Pokémon sprite if the URL has been set */}
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
      </div>
    </>
  );
}

export default App;
