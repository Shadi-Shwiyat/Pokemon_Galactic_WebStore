import React, { useEffect, useState } from 'react';
import '../styles/App.css';
import x_icon from '../assets/icons/x.png';
import shiny_icon from '../assets/icons/shiny.png'
import cart_icon from '../assets/icons/cart.png';
import * as types from '../assets/types/types.js';

export function Market_cards() {
  const [pokemonData, setPokemonData] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(1);

  // Fetch all pokemon data for market on page load
  useEffect(() => {
    fetch("https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/getAllPokemonMarketplace")
      .then(res => res.json())
      .then((data) => {
        console.log(data[0]);
        setPokemonData(data);
      });
  }, []);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function capitalizeEachWord(str) {
    // Split the string into an array of words separated by hyphen
    const words = str.split('-');
    // Capitalize the first letter of each word
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    // Join the words back into a single string
    return capitalizedWords.join(' ');
  }

  function handleNextPage() {
    setPageIndex(prevIndex => prevIndex + 2);
  }

  function handlePreviousPage() {
    setPageIndex(prevIndex => Math.max(prevIndex - 2, 0));
  }

  return (
    <>
      {!pokemonData && <div className="ring">Loading<span className='ring-span'></span></div>}
      {pokemonData && <p className='page-index'>{`${displayIndex}`}</p>}
      <div className='top-card-row'>
        {pokemonData && pokemonData.slice(pageIndex * 5, (pageIndex * 5) + 5).map((pokemon, index) => (
          <div className='card' key={index}>
            <h3 className='card-title'>{`#${pokemon.id} ${capitalizeFirstLetter(pokemon.name)}`}</h3>
            <div className='sprite-div'>
              <img className={`sprite ${pokemon.name === 'stunfisk' ? 'stunfisk' : ''}`} src={pokemon.sprite} alt="pokeImg" />
              {pokemon.is_shiny && <img className='shiny-icon' src={shiny_icon} alt='shiny.png' />}
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
            <p className='card-moves'>
              Moves:<br />
              {`${capitalizeEachWord(pokemon.moves[0])} | ${capitalizeEachWord(pokemon.moves[1])}`}
            </p>
            <h3 className='card-level'>{`Lv. ${pokemon.level}`}</h3>
            <div className='card-price'>
              <h3 className='price'>{`₽${pokemon.marketplace_cost}`}</h3>
              <img className="cart-icon" src={cart_icon} alt="cart.png" />
            </div>
          </div>
        ))}
      </div>
      <div className='bottom-card-row'>
        {pokemonData && pokemonData.slice((pageIndex * 5) + 5, (pageIndex * 5) + 10).map((pokemon, index) => (
          <div className='card' key={index}>
            <h3 className='card-title'>{`#${pokemon.id} ${capitalizeFirstLetter(pokemon.name)}`}</h3>
            <div className='sprite-div'>
              <img className={`sprite ${pokemon.name === 'stunfisk' ? 'stunfisk' : ''}`} src={pokemon.sprite} alt="pokeImg" />
              {pokemon.is_shiny && <img className='shiny-icon' src={shiny_icon} alt='shiny.png' />}
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
            <p className='card-moves'>
              Moves:<br />
              {`${capitalizeEachWord(pokemon.moves[0])} | ${capitalizeEachWord(pokemon.moves[1])}`}
            </p>
            <h3 className='card-level'>{`Lv. ${pokemon.level}`}</h3>
            <div className='card-price'>
              <h3 className='price'>{`₽${pokemon.marketplace_cost}`}</h3>
              <img className="cart-icon" src={cart_icon} alt="cart.png" />
            </div>
          </div>
        ))}
      </div>
      {pokemonData && <div className='pagination-buttons'>
        <button onClick={() => { handlePreviousPage(); setDisplayIndex(displayIndex - 1); }} disabled={pageIndex === 0} className='prev'>Previous</button>
        <button onClick={() => { handleNextPage(); setDisplayIndex(displayIndex + 1); }} disabled={(pageIndex + 2) * 5 >= pokemonData.length} className='next'>Next</button>
      </div>}
    </>
  );
}
