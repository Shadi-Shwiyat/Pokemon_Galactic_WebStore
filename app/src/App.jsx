import React, { useEffect, useState } from 'react';
import './styles/App.css';
import logo from './assets/logo_test.png'
import { Pokemon } from './components/pokemon_page.jsx'
import { SignUp } from './components/sign_up.jsx'
import { Login } from './components/login.jsx'

function App() {
  const [spriteUrl, setSpriteUrl] = useState('');

  const isLoggedIn = false;

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

  let content;
  if (isLoggedIn) {
    content = <Pokemon spriteUrl={spriteUrl}/>;
  } else {
    content = <Login />;
  }

  return (
    <>
      <img src={logo} alt="logo.png" className='logo' />
      <div>
        {content}
      </div>
    </>
  );
}

export default App;
