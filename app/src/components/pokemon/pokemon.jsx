import React, { useState, useEffect } from 'react';
import { Pokemon_filter } from './filter_pokemon';
import { Pokemon_cards } from './pokemon_card';

export function Pokemon() {
  const [filters, setFilters] = useState({});

  // useEffect(() => {
  //   console.log(filters.total_filters);
  // }, [filters])

  return (
    <>
      <Pokemon_filter filters={filters} setFilters={setFilters} />
      <Pokemon_cards filters={filters} />
    </>
  );
}