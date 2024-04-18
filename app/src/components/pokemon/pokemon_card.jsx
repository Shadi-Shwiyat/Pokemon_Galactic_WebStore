import React, { useEffect, useState } from 'react';
import poke_shiny_icon from '../../assets/icons/shiny.png'
import cart_icon from '../../assets/icons/cart.png';
import * as types from '../../assets/types/types.js';

export function Pokemon_cards({ filters }) {
  const [pokemonData, setPokemonData] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(1);
  const [isShiny, setIsShiny] = useState(false);

  // Fetch all pokemon data for market on page load
  useEffect(() => {
    if (filters.total_filters > 0) {
      console.log('filters are: greater than zero', filters.total_filters);
    }
    fetch("https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/getAllPokemon")
      .then(res => res.json())
      .then((data) => {
        setPokemonData(data);
      });
  }, [filters]);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function capitalizeGeneration(str) {
    // Split the string into an array of words separated by hyphen
    const words = str.split('-');
    // Capitalize the first letter of the first word
    const firstWord = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    // Join the remaining words back into a single string
    const restOfWords = words.slice(1).join(' ');
    // Concatenate the first word with the rest of the words
    return firstWord + (restOfWords ? ' ' + restOfWords : '');
}

  function handleNextPage(bool) {
    if(bool) {
      setPageIndex(prevIndex => prevIndex + 20);
    } else {
      setPageIndex(prevIndex => prevIndex + 2);
    }
    // console.log(pageIndex)
  }

  function handlePreviousPage(bool) {
    if(bool) {
      setPageIndex(prevIndex => Math.max(prevIndex - 20, 0));
    } else {
      setPageIndex(prevIndex => Math.max(prevIndex - 2, 0));
    }
    // console.log(pageIndex)
  }

  // useEffect(() => console.log(pageIndex), [pageIndex]);

  // useEffect(() => console.log('effect'), [filters]);

  return (
    <>
      {!pokemonData && <div className="ring">Loading<span className='ring-span'></span></div>}
      {pokemonData && <p className='page-index'>{`${displayIndex}`}</p>}
      <div className='top-card-row'>
        {pokemonData && pokemonData.slice(pageIndex * 5, (pageIndex * 5) + 5).map((pokemon, index) => (
          <div className='poke-card' key={index}>
            <h3 className='card-title'>{`#${pokemon.id} ${capitalizeFirstLetter(pokemon.name)}`}</h3>
            <div className='sprite-div'>
              <img className={`sprite ${pokemon.name === 'stunfisk' ? 'stunfisk' : ''}`} src={isShiny ? pokemon.sprites.shiny : pokemon.sprites.default} alt="pokeImg" />
            </div>
            <div className='card-typing'>
              {pokemon.typing.map((type, index) => (
                <img className='type' key={index} src={types[type]} alt={type} />
              ))}
            </div>
            <div className='card-wh'>
              <p className='weight'>{`${pokemon.weight} kg`}</p>
              <p className='height'>{`${pokemon.height} m`}</p>
            </div>
            <div className='card-text'>
              <p className='flavor-text'>{pokemon.flavor_text}</p>
            </div>
            <div className='card-bottom'>
              <h3 className='card-generation'>{`${capitalizeGeneration(pokemon.generation)}`}</h3>
              <img className="poke_shiny_icon" src={poke_shiny_icon} alt="poke_shiny_icon.png" onClick={() => setIsShiny(prevState => !prevState)} />
            </div>
          </div>
        ))}
      </div>
      <div className='bottom-card-row'>
        {pokemonData && pokemonData.slice((pageIndex * 5) + 5, (pageIndex * 5) + 10).map((pokemon, index) => (
          <div className='poke-card' key={index}>
            <h3 className='card-title'>{`#${pokemon.id} ${pokemon.name === 'bidoof' && pokemon.is_shiny ? 'God' : capitalizeFirstLetter(pokemon.name)}`}</h3>
            <div className='sprite-div'>
            <img className={`sprite ${pokemon.name === 'stunfisk' ? 'stunfisk' : ''}`} src={isShiny ? pokemon.sprites.shiny : pokemon.sprites.default} alt="pokeImg" />
            </div>
            <div className='card-typing'>
              {pokemon.typing.map((type, index) => (
                <img className='type' key={index} src={types[type]} alt={type} />
              ))}
            </div>
            <div className='card-wh'>
              <p className='weight'>{`${pokemon.weight} kg`}</p>
              <p className='height'>{`${pokemon.height} m`}</p>
            </div>
            <div className='card-text'>
              <p className='flavor-text'>{pokemon.flavor_text}</p>
            </div>
            <div className='card-bottom'>
            <h3 className='card-generation'>{`${capitalizeGeneration(pokemon.generation)}`}</h3>
            <img className="poke_shiny_icon" src={poke_shiny_icon} alt="poke_shiny_icon.png" onClick={() => setIsShiny(prevState => !prevState)} />
            </div>
          </div>
        ))}
      </div>
      {pokemonData && <div className='pagination-buttons'>
        <button onClick={() => { handlePreviousPage(true); setDisplayIndex(displayIndex - 10); }} disabled={pageIndex < 20} className='prevx'>10x</button>
        <button onClick={() => { handleNextPage(true); setDisplayIndex(displayIndex + 10); }} disabled={pageIndex >= 160} className='nextx'>10x</button>
        <button onClick={() => { handlePreviousPage(); setDisplayIndex(displayIndex - 1); }} disabled={pageIndex === 0} className='prev'>Previous</button>
        <button onClick={() => { handleNextPage(); setDisplayIndex(displayIndex + 1); }} disabled={(pageIndex + 2) * 5 >= pokemonData.length} className='next'>Next</button>
      </div>}
    </>
  );
}
