import React, { useEffect, useState, useRef } from 'react';
import '../styles/App.css';
import x_icon from '../assets/icons/x.png'
import cart_icon from '../assets/icons/cart.png'
import * as types from '../assets/types/types.js'

export function Market_cards() {
  const [pokemonData, setPokemonData] = useState(null);
  const imageRef = useRef(null);

  // Fetch all pokemon data for market on page load
  useEffect (() => {
    fetch("https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/getAllPokemonMarketplace")
        .then(res => {
            return res.json();
        })
        .then((data) => {
            console.log(data[0]);
            setPokemonData(data);
        })
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

  // Function to adjust image size based on aspect ratio
  function adjustImageSize(img, data) {
    if (img && data) {
      const aspectRatio = img.width / img.height;
      const maxWidth = 93; // Define your maximum width here
      const maxHeight = 93; // Define your maximum height here
      const minWidth = 90; // Define your minimum width here
      const minHeight = 90; // Define your minimum height here
  
      // Calculate new dimensions while keeping aspect ratio
      let newWidth = img.width;
      let newHeight = img.height;
  
      // Adjust width and height to fit within maximum dimensions
      if (newWidth > maxWidth) {
        newWidth = maxWidth;
        newHeight = newWidth / aspectRatio;
      }
      if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = newHeight * aspectRatio;
      }
  
      // Adjust width and height to meet minimum dimensions
      if (newWidth < minWidth) {
        newWidth = minWidth;
        newHeight = newWidth / aspectRatio;
      }
      if (newHeight < minHeight) {
        newHeight = minHeight;
        newWidth = newHeight * aspectRatio;
      }
  
      // Set new dimensions to the image
      img.width = newWidth;
      img.height = newHeight;
    }
  }

  return (
    <>
      <div className='top-card-row'>
        <div className='card'>
            {pokemonData && <h3 className='card-title'>{`#${pokemonData[0].id} ${capitalizeFirstLetter(pokemonData[0].name)}`}</h3>}
            {pokemonData && <img className='card-sprite' ref={imageRef} src={pokemonData[0].sprite} alt="pokeImg" onLoad={() => adjustImageSize(imageRef.current, pokemonData[0])} />}
            <div className='card-typing'>
                <img className='type' src={types.fire} alt="fire" />
                <img className='type' src={types.flying} alt="flying" />
            </div>
            <div className='card-wh'>
                {pokemonData && <p className='weight'>{`${pokemonData[0].weight} kg`}</p>}
                {pokemonData && <p className='height'>{`${pokemonData[0].height} m`}</p>}
            </div>
            {pokemonData && <p className='card-moves'>
                Moves:<br />
                {`${capitalizeEachWord(pokemonData[0].moves[0])} | ${capitalizeEachWord(pokemonData[0].moves[1])}`}
            </p>}
            {pokemonData && <h3 className='card-level'>{`Lv. ${pokemonData[0].level}`}</h3>}
            <div className='card-price'>
                {pokemonData && <h3 className='price'>{`₽${pokemonData[0].marketplace_cost}`}</h3>}
                <img className="cart-icon" src={cart_icon} alt="cart.png" />
            </div>
        </div>
        <div className='card'>
            {pokemonData && <h3 className='card-title'>{`#${pokemonData[1].id} ${capitalizeFirstLetter(pokemonData[1].name)}`}</h3>}
            {pokemonData && <img className='card-sprite' ref={imageRef} src={pokemonData[1].sprite} alt="pokeImg" onLoad={() => adjustImageSize(imageRef.current, pokemonData[1])} />}
            <div className='card-typing'>
                <img className='type' src={types.fire} alt="fire" />
                <img className='type' src={types.flying} alt="flying" />
            </div>
            <div className='card-wh'>
                {pokemonData && <p className='weight'>{`${pokemonData[1].weight} kg`}</p>}
                {pokemonData && <p className='height'>{`${pokemonData[1].height} m`}</p>}
            </div>
            {pokemonData && <p className='card-moves'>
                Moves:<br />
                {`${capitalizeEachWord(pokemonData[1].moves[0])} | ${capitalizeEachWord(pokemonData[1].moves[1])}`}
            </p>}
            {pokemonData && <h3 className='card-level'>{`Lv. ${pokemonData[1].level}`}</h3>}
            <div className='card-price'>
                {pokemonData && <h3 className='price'>{`₽${pokemonData[1].marketplace_cost}`}</h3>}
                <img className="cart-icon" src={cart_icon} alt="cart.png" />
            </div>
        </div>
        <div className='card'>
            {pokemonData && <h3 className='card-title'>{`#${pokemonData[2].id} ${capitalizeFirstLetter(pokemonData[2].name)}`}</h3>}
            {pokemonData && <img className='card-sprite' ref={imageRef} src={pokemonData[2].sprite} alt="pokeImg" onLoad={() => adjustImageSize(imageRef.current, pokemonData[2])} />}
            <div className='card-typing'>
                <img className='type' src={types.fire} alt="fire" />
                <img className='type' src={types.flying} alt="flying" />
            </div>
            <div className='card-wh'>
                {pokemonData && <p className='weight'>{`${pokemonData[2].weight} kg`}</p>}
                {pokemonData && <p className='height'>{`${pokemonData[2].height} m`}</p>}
            </div>
            {pokemonData && <p className='card-moves'>
                Moves:<br />
                {`${capitalizeEachWord(pokemonData[2].moves[0])} | ${capitalizeEachWord(pokemonData[2].moves[1])}`}
            </p>}
            {pokemonData && <h3 className='card-level'>{`Lv. ${pokemonData[2].level}`}</h3>}
            <div className='card-price'>
                {pokemonData && <h3 className='price'>{`₽${pokemonData[2].marketplace_cost}`}</h3>}
                <img className="cart-icon" src={cart_icon} alt="cart.png" />
            </div>
        </div>
        <div className='card'>
            {pokemonData && <h3 className='card-title'>{`#${pokemonData[3].id} ${capitalizeFirstLetter(pokemonData[3].name)}`}</h3>}
            {pokemonData && <img className='card-sprite' ref={imageRef} src={pokemonData[3].sprite} alt="pokeImg" onLoad={() => adjustImageSize(imageRef.current, pokemonData[3])} />}
            <div className='card-typing'>
                <img className='type' src={types.fire} alt="fire" />
                <img className='type' src={types.flying} alt="flying" />
            </div>
            <div className='card-wh'>
                {pokemonData && <p className='weight'>{`${pokemonData[3].weight} kg`}</p>}
                {pokemonData && <p className='height'>{`${pokemonData[3].height} m`}</p>}
            </div>
            {pokemonData && <p className='card-moves'>
                Moves:<br />
                {`${capitalizeEachWord(pokemonData[3].moves[0])} | ${capitalizeEachWord(pokemonData[3].moves[1])}`}
            </p>}
            {pokemonData && <h3 className='card-level'>{`Lv. ${pokemonData[3].level}`}</h3>}
            <div className='card-price'>
                {pokemonData && <h3 className='price'>{`₽${pokemonData[3].marketplace_cost}`}</h3>}
                <img className="cart-icon" src={cart_icon} alt="cart.png" />
            </div>
        </div>
        <div className='card'>
            {pokemonData && <h3 className='card-title'>{`#${pokemonData[4].id} ${capitalizeFirstLetter(pokemonData[4].name)}`}</h3>}
            {pokemonData && <img className='card-sprite' ref={imageRef} src={pokemonData[4].sprite} alt="pokeImg" onLoad={() => adjustImageSize(imageRef.current, pokemonData[4])} />}
            <div className='card-typing'>
                <img className='type' src={types.fire} alt="fire" />
                <img className='type' src={types.flying} alt="flying" />
            </div>
            <div className='card-wh'>
                {pokemonData && <p className='weight'>{`${pokemonData[4].weight} kg`}</p>}
                {pokemonData && <p className='height'>{`${pokemonData[4].height} m`}</p>}
            </div>
            {pokemonData && <p className='card-moves'>
                Moves:<br />
                {`${capitalizeEachWord(pokemonData[4].moves[0])} | ${capitalizeEachWord(pokemonData[4].moves[1])}`}
            </p>}
            {pokemonData && <h3 className='card-level'>{`Lv. ${pokemonData[4].level}`}</h3>}
            <div className='card-price'>
                {pokemonData && <h3 className='price'>{`₽${pokemonData[4].marketplace_cost}`}</h3>}
                <img className="cart-icon" src={cart_icon} alt="cart.png" />
            </div>
        </div>
      </div>
      <div className='bottom-card-row'>
        <div className='card'>
            {pokemonData && <h3 className='card-title'>{`#${pokemonData[5].id} ${capitalizeFirstLetter(pokemonData[5].name)}`}</h3>}
            {pokemonData && <img className='card-sprite' ref={imageRef} src={pokemonData[5].sprite} alt="pokeImg" onLoad={() => adjustImageSize(imageRef.current, pokemonData[5])} />}
            <div className='card-typing'>
                <img className='type' src={types.fire} alt="fire" />
                <img className='type' src={types.flying} alt="flying" />
            </div>
            <div className='card-wh'>
                {pokemonData && <p className='weight'>{`${pokemonData[5].weight} kg`}</p>}
                {pokemonData && <p className='height'>{`${pokemonData[5].height} m`}</p>}
            </div>
            {pokemonData && <p className='card-moves'>
                Moves:<br />
                {`${capitalizeEachWord(pokemonData[5].moves[0])} | ${capitalizeEachWord(pokemonData[5].moves[1])}`}
            </p>}
            {pokemonData && <h3 className='card-level'>{`Lv. ${pokemonData[5].level}`}</h3>}
            <div className='card-price'>
                {pokemonData && <h3 className='price'>{`₽${pokemonData[5].marketplace_cost}`}</h3>}
                <img className="cart-icon" src={cart_icon} alt="cart.png" />
            </div>
        </div>
        <div className='card'>
            {pokemonData && <h3 className='card-title'>{`#${pokemonData[6].id} ${capitalizeFirstLetter(pokemonData[6].name)}`}</h3>}
            {pokemonData && <img className='card-sprite' ref={imageRef} src={pokemonData[6].sprite} alt="pokeImg" onLoad={() => adjustImageSize(imageRef.current, pokemonData[6])} />}
            <div className='card-typing'>
                <img className='type' src={types.fire} alt="fire" />
                <img className='type' src={types.flying} alt="flying" />
            </div>
            <div className='card-wh'>
                {pokemonData && <p className='weight'>{`${pokemonData[6].weight} kg`}</p>}
                {pokemonData && <p className='height'>{`${pokemonData[6].height} m`}</p>}
            </div>
            {pokemonData && <p className='card-moves'>
                Moves:<br />
                {`${capitalizeEachWord(pokemonData[6].moves[0])} | ${capitalizeEachWord(pokemonData[6].moves[1])}`}
            </p>}
            {pokemonData && <h3 className='card-level'>{`Lv. ${pokemonData[6].level}`}</h3>}
            <div className='card-price'>
                {pokemonData && <h3 className='price'>{`₽${pokemonData[6].marketplace_cost}`}</h3>}
                <img className="cart-icon" src={cart_icon} alt="cart.png" />
            </div>
        </div>
        <div className='card'>
            {pokemonData && <h3 className='card-title'>{`#${pokemonData[7].id} ${capitalizeFirstLetter(pokemonData[7].name)}`}</h3>}
            {pokemonData && <img className='card-sprite' ref={imageRef} src={pokemonData[7].sprite} alt="pokeImg" onLoad={() => adjustImageSize(imageRef.current, pokemonData[7])} />}
            <div className='card-typing'>
                <img className='type' src={types.fire} alt="fire" />
                <img className='type' src={types.flying} alt="flying" />
            </div>
            <div className='card-wh'>
                {pokemonData && <p className='weight'>{`${pokemonData[7].weight} kg`}</p>}
                {pokemonData && <p className='height'>{`${pokemonData[7].height} m`}</p>}
            </div>
            {pokemonData && <p className='card-moves'>
                Moves:<br />
                {`${capitalizeEachWord(pokemonData[7].moves[0])} | ${capitalizeEachWord(pokemonData[7].moves[1])}`}
            </p>}
            {pokemonData && <h3 className='card-level'>{`Lv. ${pokemonData[7].level}`}</h3>}
            <div className='card-price'>
                {pokemonData && <h3 className='price'>{`₽${pokemonData[7].marketplace_cost}`}</h3>}
                <img className="cart-icon" src={cart_icon} alt="cart.png" />
            </div>
        </div>
        <div className='card'>
            {pokemonData && <h3 className='card-title'>{`#${pokemonData[8].id} ${capitalizeFirstLetter(pokemonData[8].name)}`}</h3>}
            {pokemonData && <img className='card-sprite' ref={imageRef} src={pokemonData[8].sprite} alt="pokeImg" onLoad={() => adjustImageSize(imageRef.current, pokemonData[8])} />}
            <div className='card-typing'>
                <img className='type' src={types.fire} alt="fire" />
                <img className='type' src={types.flying} alt="flying" />
            </div>
            <div className='card-wh'>
                {pokemonData && <p className='weight'>{`${pokemonData[8].weight} kg`}</p>}
                {pokemonData && <p className='height'>{`${pokemonData[8].height} m`}</p>}
            </div>
            {pokemonData && <p className='card-moves'>
                Moves:<br />
                {`${capitalizeEachWord(pokemonData[8].moves[0])} | ${capitalizeEachWord(pokemonData[8].moves[1])}`}
            </p>}
            {pokemonData && <h3 className='card-level'>{`Lv. ${pokemonData[8].level}`}</h3>}
            <div className='card-price'>
                {pokemonData && <h3 className='price'>{`₽${pokemonData[8].marketplace_cost}`}</h3>}
                <img className="cart-icon" src={cart_icon} alt="cart.png" />
            </div>
        </div>
        <div className='card'>
            {pokemonData && <h3 className='card-title'>{`#${pokemonData[9].id} ${capitalizeFirstLetter(pokemonData[9].name)}`}</h3>}
            {pokemonData && <img className='card-sprite' ref={imageRef} src={pokemonData[9].sprite} alt="pokeImg" onLoad={() => adjustImageSize(imageRef.current, pokemonData[8])} />}
            <div className='card-typing'>
                <img className='type' src={types.fire} alt="fire" />
                <img className='type' src={types.flying} alt="flying" />
            </div>
            <div className='card-wh'>
                {pokemonData && <p className='weight'>{`${pokemonData[9].weight} kg`}</p>}
                {pokemonData && <p className='height'>{`${pokemonData[9].height} m`}</p>}
            </div>
            {pokemonData && <p className='card-moves'>
                Moves:<br />
                {`${capitalizeEachWord(pokemonData[9].moves[0])} | ${capitalizeEachWord(pokemonData[9].moves[1])}`}
            </p>}
            {pokemonData && <h3 className='card-level'>{`Lv. ${pokemonData[9].level}`}</h3>}
            <div className='card-price'>
                {pokemonData && <h3 className='price'>{`₽${pokemonData[9].marketplace_cost}`}</h3>}
                <img className="cart-icon" src={cart_icon} alt="cart.png" />
            </div>
        </div>
      </div>
    </>
  );
}
