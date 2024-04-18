import React, { useState, useEffect } from 'react';
import filter_icon from '../../assets/icons/filter.png';
import x_icon from '../../assets/icons/x.png'
import arrow from '../../assets/icons/arrow_down.png'
import * as types from '../../assets/types/types.js'

export function Market_filter({ mfilters, mclear, setmFilters, setmClear }) {
  const [expanded, setExpanded] = useState(true);
  const [name, setName] = useState('');
  const [id, setId] = useState(0);
  const [isShiny, setIsShiny] = useState(false);
  const [type, setType] = useState([]);
  const [moves, setMoves] = useState([]);
  const [ability, setAbility] = useState('');
  const [region, setRegion] = useState('');
  const [generation, setGeneration] = useState('');
  const [minCost, setMinCost] = useState('');
  const [maxCost, setMaxCost] = useState('');
  const [strictMatch, setStrictMatch] = useState(false);
  const [total_filters, setTotalFilters] = useState(0);
  // Array to store selection state for each typing image
  const [typingSelection, setTypingSelection] = useState({
    normal: false, fire: false, water: false, electric: false,
    grass: false, ice: false, fighting: false, poison: false,
    ground: false, flying: false, psychic: false, bug: false,
    rock: false, ghost: false, dragon: false, dark: false,
    steel: false, fairy: false
  });

  useEffect(() => {
    // console.log('filter use effect')
    const filter_object = {
      name: name,
      id: id,
      isShiny: isShiny,
      type: type,
      moves: moves,
      ability: ability,
      region: region,
      generation: generation,
      minCost: minCost,
      maxCost: maxCost,
      strictMatch: strictMatch,
      total_filters: total_filters
    }
    // console.log(filter_object.total_filters);
    setmFilters(filter_object)
  }, [name, id, isShiny, type, moves, ability, region, generation, minCost, maxCost, strictMatch, total_filters]);

  const toggleExpanded = () => {
    setExpanded(!expanded);
    // console.log(expanded);
  };

  const handleButtonClick = (e) => {
    // Stop event propagation
    e.stopPropagation();
    e.preventDefault();
    toggleExpanded();
    resetFormValues(e);
  };

  const resetFormValues = (e) => {
    e.preventDefault();
    setName('');
    setId(0);
    setIsShiny(false);
    setMoves('');
    setAbility('');
    setRegion('');
    setGeneration('');
    setMinCost('');
    setMaxCost('');
    setStrictMatch(false);
    setTotalFilters(0);
    setTypingSelection({
      normal: false, fire: false, water: false, electric: false,
      grass: false, ice: false, fighting: false, poison: false,
      ground: false, flying: false, psychic: false, bug: false,
      rock: false, ghost: false, dragon: false, dark: false,
      steel: false, fairy: false
    });
    setType([]);
  };

  const submitForm = (e) => {
    // console.log('submitform')
    e.preventDefault();
    let totalCount = 0;
    for (const item in mfilters) {
      if (
        mfilters[item] !== '' &&
        mfilters[item] !== 0 &&
        mfilters[item] !== false &&
        (!Array.isArray(mfilters[item]) || mfilters[item].length > 0)
      ) {
        // Item passes all conditions, add to total filters
        totalCount++;
      }
    }
    // console.log("Total count is", totalCount);
    setTotalFilters(totalCount);
    // console.log("filters.total_filters", total_filters);
    toggleExpanded();
  }

  const handleTypeSelect = (type) => {
    // Toggle selection state for the clicked typing image
    setTypingSelection(prevState => ({
      ...prevState,
      [type]: !prevState[type],
    }));

    // Update the type array based on the selection state of the clicked typing image
    setType(prevTypes => {
      // If the typing image is selected, add its type to the array
      if (!prevTypes.includes(type)) {
        return [...prevTypes, type];
      } else {
        // If the typing image is deselected, remove its type from the array
        return prevTypes.filter(item => item !== type);
      }
    });
  };

  return (
    <>
      <button className={`filter-button ${expanded ? '' : 'hide'}`} onClick={handleButtonClick}>
        <img src={filter_icon} alt="filter_button.png" className='filter-icon' />
      </button>
      <div className={`filter-form ${expanded ? '' : 'display'}`}>
        <form>
            <div className='form-entry name-entry'>
              <label className='form-label name-label'>Name</label>
              <input
                className='form-input name-input'
                type="text"
                placeholder='e.g. Bulbasaur'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <img src={x_icon} alt="x.png"
              className='close-icon'
              onClick={handleButtonClick}
               />
            </div>
            <div className='two-line-entry id-shiny-div'>
                <div className='form-entry id-entry'>
                    <label className='form-label id-label'>ID</label>
                    <input
                        className='form-input id-input'
                        type="number"
                        min='0'
                        max='893'
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                    />
                </div>
                <div className='form-entry'>
                    <label className='form-label shiny-label'>Shiny</label>
                    <select className='form-input shiny-input'
                      value={isShiny}
                      onChange={(e) => setIsShiny(e.target.value)}>
                        <option value={false}>No</option>
                        <option value={true}>Yes</option>
                    </select>
                    {/* <img src={arrow} alt="arrow_down.png" className='arrow-icon' /> */}
                </div>
            </div>
            <div className='typing-entry'>
                <label className='form-label type-label'>Type</label>
                <div className='types'>
                    <div className='type-row'>
                      <img src={types.normal} alt="normal"
                      className={`type-image ${typingSelection.normal ? 'type-selected' : ''}`}
                      onClick={() => handleTypeSelect('normal')}
                       />
                      <img src={types.fire} alt="fire"
                      className={`type-image ${typingSelection.fire ? 'type-selected' : ''}`}
                      onClick={() => handleTypeSelect('fire')}
                       />
                      <img src={types.water} alt="water"
                      className={`type-image ${typingSelection.water ? 'type-selected' : ''}`}
                      onClick={() => handleTypeSelect('water')}
                       />
                      <img src={types.electric} alt="electric"
                      className={`type-image ${typingSelection.electric ? 'type-selected' : ''}`}
                      onClick={() => handleTypeSelect('electric')}
                       />
                    </div>
                    <div className='type-row'>
                    <img src={types.grass} alt="grass"
                      className={`type-image ${typingSelection.grass ? 'type-selected' : ''}`}
                      onClick={() => handleTypeSelect('grass')}
                       />
                      <img src={types.ice} alt="ice"
                      className={`type-image ${typingSelection.ice ? 'type-selected' : ''}`}
                      onClick={() => handleTypeSelect('ice')}
                       />
                      <img src={types.fighting} alt="fighting"
                      className={`type-image ${typingSelection.fighting ? 'type-selected' : ''}`}
                      onClick={() => handleTypeSelect('fighting')}
                       />
                      <img src={types.poison} alt="poison"
                      className={`type-image ${typingSelection.poison ? 'type-selected' : ''}`}
                      onClick={() => handleTypeSelect('poison')}
                       />
                    </div>
                    <div className='type-row'>
                    <img src={types.ground} alt="ground"
                      className={`type-image ${typingSelection.ground ? 'type-selected' : ''}`}
                      onClick={() => handleTypeSelect('ground')}
                       />
                      <img src={types.flying} alt="flying"
                      className={`type-image ${typingSelection.flying ? 'type-selected' : ''}`}
                      onClick={() => handleTypeSelect('flying')}
                       />
                      <img src={types.psychic} alt="psychic"
                      className={`type-image ${typingSelection.psychic ? 'type-selected' : ''}`}
                      onClick={() => handleTypeSelect('psychic')}
                       />
                      <img src={types.bug} alt="bug"
                      className={`type-image ${typingSelection.bug ? 'type-selected' : ''}`}
                      onClick={() => handleTypeSelect('bug')}
                       />
                    </div>
                    <div className='type-row'>
                    <img src={types.rock} alt="rock"
                      className={`type-image ${typingSelection.rock ? 'type-selected' : ''}`}
                      onClick={() => handleTypeSelect('rock')}
                       />
                      <img src={types.ghost} alt="ghost"
                      className={`type-image ${typingSelection.ghost ? 'type-selected' : ''}`}
                      onClick={() => handleTypeSelect('ghost')}
                       />
                      <img src={types.dragon} alt="dragon"
                      className={`type-image ${typingSelection.dragon ? 'type-selected' : ''}`}
                      onClick={() => handleTypeSelect('dragon')}
                       />
                      <img src={types.dark} alt="dark"
                      className={`type-image ${typingSelection.dark ? 'type-selected' : ''}`}
                      onClick={() => handleTypeSelect('dark')}
                       />
                    </div>
                    <div className='type-row'>
                    <img src={types.steel} alt="steel"
                      className={`type-image ${typingSelection.steel ? 'type-selected' : ''}`}
                      onClick={() => handleTypeSelect('steel')}
                       />
                      <img src={types.fairy} alt="fairy"
                      className={`type-image ${typingSelection.fairy ? 'type-selected' : ''}`}
                      onClick={() => handleTypeSelect('fairy')}
                       />
                    </div>
                </div>
            </div>
            <div className='form-entry move-entry'>
              <label className='form-label move-label'>Moves</label>
              <input
                className='form-input move-input'
                type="text"
                placeholder='e.g. Vine whip (Enter one move)'
                value={moves}
                onChange={(e) => setMoves(e.target.value)}
              />
            </div>
            <div className='form-entry ability-entry'>
              <label className='form-label ability-label'>Ability</label>
              <input
                className='form-input ability-input'
                type="text"
                placeholder='e.g. Overgrow (Enter one ability)'
                value={ability}
                onChange={(e) => setAbility(e.target.value)}
              />
            </div>
            <div className='form-entry region-entry'>
              <label className='form-label region-label'>Region</label>
              <select className='form-input region-input'
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                <option value="">None</option>
                <option value="Kanto">Kanto</option>
                <option value="Johto">Johto</option>
                <option value="Hoenn">Hoenn</option>
                <option value="Sinnoh">Sinnoh</option>
                <option value="Unova">Unova</option>
                <option value="Kalos">Kalos</option>
                <option value="Alola">Alola</option>
                <option value="Galar">Galar</option>
              </select>
              {/* <img src={arrow} alt="arrow_down.png" className='arrow-icon' /> */}
            </div>
            <div className='form-entry generation-entry'>
              <label className='form-label generation-label'>Generation</label>
              <select className='form-input generation-input'
                value={generation}
                onChange={(e) => setGeneration(e.target.value)}
              >
                <option value=''>None</option>
                <option value='generation-i'>1</option>
                <option value='generation-ii'>2</option>
                <option value='generation-iii'>3</option>
                <option value='generation-iv'>4</option>
                <option value='generation-v'>5</option>
                <option value='generation-vi'>6</option>
                <option value='generation-vii'>7</option>
                <option value='generation-viii'>8</option>
              </select>
              {/* <img src={arrow} alt="arrow_down.png" className='arrow-icon' /> */}
            </div>
            <div className='two-line-entry-cost'>
                <div className='form-entry cost-entry'>
                    <label className='form-label cost-label'>Cost</label>
                    <input
                        className='form-input cost-input'
                        type="text"
                        placeholder='Min'
                        value={minCost}
                        onChange={(e) => setMinCost(e.target.value)}
                    />
                </div>
                <div className='form-entry'>
                    <label className='form-label max-label'>{"<->"}</label>
                    <input
                        className='form-input cost-input'
                        type="text"
                        placeholder='Max'
                        value={maxCost}
                        onChange={(e) => setMaxCost(e.target.value)}
                    />
                </div>
            </div>
            <div className='form-entry match-entry'>
              <label className='form-label match-label'>Match All Filters</label>
              <select className='form-input match-input'
                value={strictMatch}
                onChange={(e) => setStrictMatch(e.target.value)}
              >
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
              </select>
              {/* <img src={arrow} alt="arrow_down.png" className='arrow-icon' /> */}
            </div>
            {/* <p>{type}</p> */}
            <div className='form-buttons'>
                <button className='form-clear' onClick={(e) => {resetFormValues(e); setmClear(!mclear);}}>Clear</button>
                <button className='form-submit' onClick={submitForm}>Submit</button>
            </div>
        </form>
      </div>
    </>
  );
}