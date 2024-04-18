import React, { useEffect, useState } from 'react';
import '../styles/About.css';
import creator1Image from '../assets/rob.jpg'; // Ensure path is correct
import creator2Image from '../assets/shadi.jpg'; // Ensure path is correct
import * as types from '../assets/types/types'; // Ensure this module exports correctly
import shiny_icon from '../assets/icons/shiny.png'; // Ensure path is correct
import battle_music from '../assets/battle.mp3'; // Add your audio file in the assets directory

function CreatorCard({ name, role, image, typesInfo, height, weight, moves, level, description, isFirstCard, onShinyClick }) {
  return (
    <div className='about-creator-card'>
      <h2 className="about-card-title">{name}</h2>
      <img
        src={image}
        alt={name}
        className={`about-creator-image ${isFirstCard ? 'about-creator-image-first' : ''}`}
      />
      <div className="about-card-typing">
        {typesInfo.map(type => (
          <img key={type} src={types[type]} alt={type} className="about-type-icon" />
        ))}
      </div>
      <div className='about-card-wh'>
        <p className='about-weight'>{`${weight} kg`}</p>
        <p className='about-height'>{`${height} m`}</p>
      </div>
      <p className='about-card-moves'>Moves: {moves.join(' | ')}</p>
      <h3 className='about-card-level'>{`Lv. ${level}`}</h3>
      <p className='about-description'>{description}</p>
      <h3 className='about-role'>{role}</h3>
      <img
        src={shiny_icon}
        alt="Shiny Icon"
        className="about-shiny-icon"
        onClick={onShinyClick}
        style={{ cursor: 'pointer' }}
      />
    </div>
  );
}

export function About() {
  const [pokemonData, setPokemonData] = useState([]);

  useEffect(() => {
    // Fetch data from your API; change URL if necessary
    fetch("https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/getAllPokemon")
      .then(res => res.json())
      .then(data => {
        setPokemonData(data);
      })
      .catch(err => console.error('Failed to fetch Pokémon', err));
  }, []);

  const [showSprites, setShowSprites] = useState(false);

  const handleShinyClick = () => {
    const audio = new Audio(battle_music);
    // control the volume
    audio.volume = 0.2;
    audio.play(); // This plays the shiny sound
    setShowSprites(true); // This shows sprites on the screen
  };

  return (
    <div className='about-section'>
      <h1>About the Creators</h1>
      <div className='about-creator-cards'>
        <CreatorCard
          name="Rob Farley"
          role="Full-Stack Developer"
          image={creator1Image}
          typesInfo={["steel", "ghost"]}
          height={1.8}
          weight={88}
          moves={["FullStack", "Backend Logic", "Database Logic", "Deployment"]}
          level={34}
          description="Rob is a full-stack developer with a passion for creating user-friendly applications. He specializes in backend development and deployment."
          isFirstCard={true}
          onShinyClick={handleShinyClick}
        />
        <CreatorCard
          name="Shadi Shwiyat"
          role="Full-Stack Developer"
          image={creator2Image}
          typesInfo={["grass", "dark"]}
          height={2.03}
          weight={97.5}
          moves={["Frontend React Logic", "UI/UX Design", "API Integration", "ETL Operations"]}
          level={30}
          description="Shadi is a full-stack developer with a passion for creating user-friendly applications. He specializes in front-end development and connecting the front-end to the back-end."
          onShinyClick={handleShinyClick}
        />
      </div>
      {showSprites && (
        <div className="sprite-overlay">
          {pokemonData.map(pokemon => (
            <img key={pokemon.id} src={pokemon.sprites.default} style={{ position: 'absolute', top: `${Math.random() * 100}vh`, left: `${Math.random() * 100}vw` }} alt={pokemon.name} />
          ))}
        </div>
      )}
    </div>
  );
}
