import React, { useState, useEffect } from 'react';
import { Pokemon_filter } from './filter_pokemon';
import { Pokemon_cards } from './pokemon_card';

export function Pokemon({spriteUrl}) {

  return (
    <>
      <Pokemon_filter />
      <Pokemon_cards />
    </>
  );
}