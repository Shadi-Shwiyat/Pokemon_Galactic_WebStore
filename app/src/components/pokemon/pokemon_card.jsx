import React, { useEffect, useState } from 'react';
import poke_shiny_icon from '../../assets/icons/shiny.png'
import cart_icon from '../../assets/icons/cart.png';
import * as types from '../../assets/types/types.js';

export function Pokemon_cards({ filters, clear, setClear }) {
  const [pokemonData, setPokemonData] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(1);
  const [isShiny, setIsShiny] = useState(false);
  const [failed, setFailed] = useState(false);

  // Fetch all pokemon data for market on page load
  useEffect(() => {
    setFailed(false);
    setPokemonData(null);
    fetch("https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/getAllPokemon")
      .then(res => res.json())
      .then((data) => {
        setDisplayIndex(1);
        setPageIndex(0);
        setPokemonData(data);
      });
  }, []);

  // Refresh pokemon when clear is toggled
  useEffect(() => {
    setFailed(false);
    setPokemonData(null);
    // console.log('clearing filters')
    fetch("https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/getAllPokemon")
      .then(res => res.json())
      .then((data) => {
        setDisplayIndex(1);
        setPageIndex(0);
        setPokemonData(data);
      });
  }, [clear]);

  // Fetch pokemon based on filters
  useEffect(() => {
    setFailed(false);
    // console.log('filters changed');
    if (filters.total_filters > 0) {
      setPokemonData(null);
      // console.log('filters are: greater than zero', filters);
      let queryString = 'https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/searchPokemon?'
      if (filters.name != '') {
        queryString = queryString + `name=${filters.name.toLowerCase()}`;
      }
      if (filters.id != 0) {
        queryString = queryString + `id=${filters.id}`;
      }
      if (filters.isShiny != false) {
        queryString = queryString + `isShiny=${filters.isShiny}`;
      }
      if (filters.type.length != 0) {
        queryString = queryString + `type=${filters.type}`;
      }
      if (filters.moves != '') {
        queryString = queryString + `moves=${formatString(filters.moves)}`;
      }
      if (filters.ability != '') {
        queryString = queryString + `ability=${formatString(filters.ability)}`;
      }
      if (filters.region != '') {
        queryString = queryString + `region=${filters.region}`;
      }
      if (filters.generation != '') {
        queryString = queryString + `generation=${filters.generation}`;
      }
      try {
        fetch(queryString)
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            throw new Error("Failed to fetch data");
          }
        })
        .then((data) => {
          setDisplayIndex(1);
          setPageIndex(0);
          setPokemonData(data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setFailed(true)
          setTimeout(() => {
            setClear(!clear);
            setFailed(false);
          }, 3000)
        });
      } catch(error) {
        console.log(error);
      }
    }
  }, [filters]);

  function capitalizeFirstLetter(string) {
    // console.log('capitalizefirstletter')
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function capitalizeGeneration(str) {
    // console.log('capitalizegeneration')
    // Split the string into an array of words separated by hyphen
    const words = str.split('-');
    // Capitalize the first letter of the first word
    const firstWord = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    // Join the remaining words back into a single string
    const restOfWords = words.slice(1).join(' ');
    // Concatenate the first word with the rest of the words
    return firstWord + (restOfWords ? ' ' + restOfWords : '');
  }

  function formatString(inputString) {
    // Split the input string into an array of words
    let words = inputString.split(" ");
  
    // Iterate through each word in the array
    for (let i = 0; i < words.length; i++) {
      // Remove capital letters from the word
      words[i] = words[i].replace(/[A-Z]/g, "");
  
      // Convert the word to lowercase
      words[i] = words[i].toLowerCase();
    }
  
    // Join the words with '-' between them
    let result = words.join("-");
  
    return result;
  }

  function handleNextPage(bool) {
    // console.log('handlenexpage')
    if(bool) {
      setPageIndex(prevIndex => prevIndex + 20);
    } else {
      setPageIndex(prevIndex => prevIndex + 2);
    }
    // console.log(pageIndex)
  }

  function handlePreviousPage(bool) {
    // console.log('handleprevpage')
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
      {failed && !pokemonData && <div className="failed">
                <h1 className="failed-text">Invalid Search Parameters</h1>
            </div>}
      {!failed && !pokemonData && <div className="ring">Loading<span className='ring-span'></span></div>}
      {!failed && pokemonData && <p className='page-index'>{`${displayIndex}`}</p>}
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
        <button onClick={() => { handleNextPage(true); setDisplayIndex(displayIndex + 10); }} disabled={(pageIndex + 20) * 5 >= pokemonData.length} className='nextx'>10x</button>
        <button onClick={() => { handlePreviousPage(); setDisplayIndex(displayIndex - 1); }} disabled={pageIndex === 0} className='prev'>Previous</button>
        <button onClick={() => { handleNextPage(); setDisplayIndex(displayIndex + 1); }} disabled={(pageIndex + 2) * 5 >= pokemonData.length} className='next'>Next</button>
      </div>}
    </>
  );
}
