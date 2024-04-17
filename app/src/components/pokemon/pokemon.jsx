import React, { useState, useEffect } from 'react';
import { Pokemon_filter } from './filter_pokemon';
import { Pokemon_cards } from './pokemon_card';

export function Pokemon({spriteUrl}) {
  const [filters, setFilters] = useState([]);

  return (
    <>
      <Pokemon_filter setFilters={setFilters}/>
      <Pokemon_cards filters={filters}/>
    </>
  );
}