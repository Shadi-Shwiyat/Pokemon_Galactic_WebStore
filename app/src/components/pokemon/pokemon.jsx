import React, { useState, useEffect } from 'react';
import { Pokemon_filter } from './filter_pokemon';
import { Pokemon_cards } from './pokemon_card';

export function Pokemon() {
  const [filters, setFilters] = useState({});
  const [clear, setClear] = useState(false);

  // useEffect(() => {
  //   console.log(filters.total_filters);
  // }, [filters])

  return (
    <>
      <Pokemon_filter filters={filters} setFilters={setFilters} clear={clear} setClear={setClear} />
      <Pokemon_cards filters={filters} clear={clear} setClear={setClear} />
    </>
  );
}