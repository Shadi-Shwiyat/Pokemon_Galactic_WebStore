// This is the entry point of the Cloud Function
const admin = require('firebase-admin');
const serviceAccount = require('./credentials.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Import the functions from the other files
const { createPokemon, getPokemonById, searchPokemon, getAllPokemon, getPokemonSpriteById, getPokemonGifByName, getPokemonByType, getPokemonByGeneration, getPokemonByName, getPokemonByRegion, getPokemonByMoves, getPokemonByAbilities } = require('./pokemonFunctions');
const { searchItems, getItemById, getItemSprite, createItem, updateItem, deleteItem } = require('./itemsFunctions');
// const e = require('express');

// Export the pokemon functions to be used in the Cloud Function
exports.createPokemon = createPokemon;
exports.getPokemonById = getPokemonById;
exports.searchPokemon = searchPokemon;
exports.getAllPokemon = getAllPokemon;
exports.getPokemonSpriteById = getPokemonSpriteById;
exports.getPokemonGifByName = getPokemonGifByName;
exports.getPokemonByType = getPokemonByType;
exports.getPokemonByGeneration = getPokemonByGeneration;
exports.getPokemonByName = getPokemonByName;
exports.getPokemonByRegion = getPokemonByRegion;
exports.getPokemonByMoves = getPokemonByMoves;
exports.getPokemonByAbilities = getPokemonByAbilities;


// Export the items functions to be used in the Cloud Function
exports.searchItems = searchItems;
exports.getItemById = getItemById;
exports.getItemSprite = getItemSprite;
exports.createItem = createItem;
exports.updateItem = updateItem;
exports.deleteItem = deleteItem;
