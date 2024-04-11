import React, { useState, useEffect } from 'react';
import '../styles/App.css';

export function Pokemon({spriteUrl}) {
  const [pokemonGifUrl, setPokemonGifUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRandomPokemonGif = async () => {
      const maxPokemonId = 893;
      const randomPokemonId = Math.floor(Math.random() * maxPokemonId) + 1; // Generate a random ID
      const isShiny = Math.random() < 0.5; // Randomly determine if the Pokémon should be shiny
      
      // Determine the filename based on whether the Pokémon is shiny
      const pokemonGifName = isShiny ? 
        `pokemon_shiny_${randomPokemonId}.gif` : 
        `pokemon_${randomPokemonId}.gif`;
      
      // Construct the URL for Firebase Storage access
      const gifUrl = `https://firebasestorage.googleapis.com/v0/b/pokemon-galactic-webstore.appspot.com/o/sprites%2Fpokemon%2F${encodeURIComponent(pokemonGifName)}?alt=media`;
      
      // Set the URL of the GIF to state and indicate that loading has finished
      setPokemonGifUrl(gifUrl);
      setLoading(false);
    };

    fetchRandomPokemonGif();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='random_poke'>
      <h1>Random Pokémon GIF</h1>
      <img src={pokemonGifUrl} alt="Random Pokémon" className='poke_gif' />
    </div>
  );
}