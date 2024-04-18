import React, { useEffect, useState } from 'react';
// import x_icon from '../../assets/icons/x.png';
import shiny_icon from '../../assets/icons/shiny.png'
import cart_icon from '../../assets/icons/cart.png';
import * as types from '../../assets/types/types.js';

export function Market_cards({ mfilters, mclear, setmClear }) {
  const [pokemonData, setPokemonData] = useState([]);
  const [cart, setCart] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(1);
  const [failed, setFailed] = useState(false);

  // Fetch all pokemon data for market on page load
  useEffect(() => {
    setFailed(false);
    setPokemonData(null);
    fetch("https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/getAllPokemonMarketplace")
      .then(res => res.json())
      .then((data) => {
        setDisplayIndex(1);
        setPageIndex(0);
        console.log(data[0]);
        setPokemonData(data);
      });

    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Refresh pokemon when clear is toggled
  useEffect(() => {
    setFailed(false);
    setPokemonData(null);
    // console.log('clearing filters')
    fetch("https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/getAllPokemonMarketplace")
      .then(res => res.json())
      .then((data) => {
        setDisplayIndex(1);
        setPageIndex(0);
        setPokemonData(data);
      });
  }, [mclear]);

  // Fetch pokemon based on filters
  useEffect(() => {
    setFailed(false);
    // console.log('filters changed');
    if (mfilters.total_filters > 0) {
      setPokemonData(null);
      // console.log('filters are: greater than zero', filters);
      let queryString = 'https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/searchPokemonMarketplace?'
      if (mfilters.name != '') {
        queryString = queryString + `name=${mfilters.name.toLowerCase()}&`;
      }
      if (mfilters.isShiny != false) {
        queryString = queryString + `isShiny=${mfilters.isShiny}&`;
      }
      if (mfilters.id != 0) {
        queryString = queryString + `id=${mfilters.id}&`;
      }
      if (mfilters.type.length != 0) {
        queryString = queryString + `type=${mfilters.type}&`;
      }
      if (mfilters.moves != '') {
        queryString = queryString + `moves=${formatString(mfilters.moves)}&`;
      }
      if (mfilters.ability != '') {
        queryString = queryString + `ability=${formatString(mfilters.ability)}&`;
      }
      if (mfilters.region != '') {
        queryString = queryString + `region=${mfilters.region}&`;
      }
      if (mfilters.generation != '') {
        queryString = queryString + `generation=${mfilters.generation}&`;
      }
      if (mfilters.minCost != '') {
        queryString = queryString + `minCost=${mfilters.minCost}&`;
      }
      if (mfilters.maxCost != '') {
        queryString = queryString + `maxCost=${mfilters.maxCost}&`;
      }
      queryString = queryString + `strictMatch=${mfilters.strictMatch}`;
      console.log(queryString);
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
          data.sort((a, b) => a.id - b.id);
          setDisplayIndex(1);
          setPageIndex(0);
          setPokemonData(data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setFailed(true)
          setTimeout(() => {
            setmClear(!mclear);
            setFailed(false);
          }, 3000)
        });
      } catch(error) {
        console.log(error);
      }
    }
  }, [mfilters]);

  function addToCart(pokemon) {
    // Check if the Pokémon is already in the cart
    const isAlreadyAdded = cart.some(item => item.id === pokemon.id);

    if (!isAlreadyAdded) {
        const updatedCart = [...cart, pokemon];
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        alert(`Added ${pokemon.name} to the cart. Total items: ${updatedCart.length}`);
    } else {
        alert(`${pokemon.name} is already in the cart.`);
    }
  }

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

  function formatCost(costString) {
    // Reverse the string to make it easier to insert commas from right to left
    const reversedString = costString.toString().split('').reverse().join('');
    
    // Use a regular expression to insert commas after every three digits
    const formattedString = reversedString.replace(/\d{3}(?=\d)/g, (match) => match + ',');
    
    // Reverse the string back to its original order and return it
    return formattedString.split('').reverse().join('');
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

  function handleNextPage() {
    setPageIndex(prevIndex => prevIndex + 2);
  }

  function handlePreviousPage() {
    setPageIndex(prevIndex => Math.max(prevIndex - 2, 0));
  }

  return (
    <>
      {failed && !pokemonData && <div className="failed">
            <h1 className="failed-text">No Pokémon found matching the criteria</h1>
        </div>}
      {!failed && !pokemonData && <div className="ring">Loading<span className='ring-span'></span></div>}
      {!failed && pokemonData && <p className='page-index'>{`${displayIndex}`}</p>}
      <div className='top-card-row'>
        {pokemonData && pokemonData.slice(pageIndex * 5, (pageIndex * 5) + 5).map((pokemon, index) => (
          <div className='card' key={index}>
            <h3 className='card-title'>{`#${pokemon.id} ${pokemon.name === 'bidoof' && pokemon.is_shiny ? 'God' : capitalizeFirstLetter(pokemon.name)}`}</h3>
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
              {pokemon.moves[1] && `${capitalizeEachWord(pokemon.moves[0])} | ${capitalizeEachWord(pokemon.moves[1])}`}
              {!pokemon.moves[1] && `${capitalizeEachWord(pokemon.moves[0])}`}
            </p>
            <h3 className='card-level'>{`Lv. ${pokemon.level}`}</h3>
            <div className='card-price'>
              <h3 className='price'>{`₽ ${pokemon.name === 'bidoof' && pokemon.is_shiny === true ? formatCost('9999999999') : formatCost(pokemon.marketplace_cost)}`}</h3>
              <img className="cart-icon" src={cart_icon} alt="cart.png" onClick={() => addToCart(pokemon)} />
            </div>
          </div>
        ))}
      </div>
      <div className='bottom-card-row'>
        {pokemonData && pokemonData.slice((pageIndex * 5) + 5, (pageIndex * 5) + 10).map((pokemon, index) => (
          <div className='card' key={index}>
            <h3 className='card-title'>{`#${pokemon.id} ${pokemon.name === 'bidoof' && pokemon.is_shiny ? 'God' : capitalizeFirstLetter(pokemon.name)}`}</h3>
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
              {pokemon.moves[1] && `${capitalizeEachWord(pokemon.moves[0])} | ${capitalizeEachWord(pokemon.moves[1])}`}
              {!pokemon.moves[1] && `${capitalizeEachWord(pokemon.moves[0])}`}
            </p>
            <h3 className='card-level'>{`Lv. ${pokemon.level}`}</h3>
            <div className='card-price'>
              <h3 className='price'>{`₽ ${pokemon.name === 'bidoof' && pokemon.is_shiny === true ? '' : formatCost(pokemon.marketplace_cost)}`}</h3>
              <img className="cart-icon" src={cart_icon} alt="cart.png" />
            </div>
          </div>
        ))}
      </div>
      {pokemonData && <div className='pagination-buttons'>
        <button onClick={() => { handlePreviousPage(); setDisplayIndex(displayIndex - 1); }} disabled={pageIndex === 0} className='prevm'>Previous</button>
        <button onClick={() => { handleNextPage(); setDisplayIndex(displayIndex + 1); }} disabled={(pageIndex + 2) * 5 >= pokemonData.length} className='nextm'>Next</button>
      </div>}
    </>
  );
}
