// Import the functions from the other files
const { createPokemon, getPokemonById, searchPokemon, getAllPokemon, getPokemonSpriteById, getPokemonGifByName, getPokemonByType, getPokemonByGeneration, getPokemonByName, getPokemonByRegion, getPokemonByMoves, getPokemonByAbilities, getAllPokemonMarketplace, getPokemonByAbilitiesMarketplace, getPokemonByGenerationMarketplace, getPokemonByIdMarketplace, getPokemonByMovesMarketplace, getPokemonByNameMarketplace, getPokemonByRegionMarketplace, getPokemonByTypeMarketplace, getPokemonGifByNameMarketplace, getPokemonSpriteByIdMarketplace } = require('./pokemonFunctions');
const { searchItems, getItemById, getItemSprite, createItem, updateItem, deleteItem, getAllItems, getMarketplaceItemById, createMarketplaceItem } = require('./itemsFunctions');
const { updateMarketplace } = require('./marketplaceFunctions'); // Import the new scheduled function

// Export the pokemon functions to be used
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

// Export the pokemon functions to be used in marketplace
exports.getAllPokemonMarketplace = getAllPokemonMarketplace;
exports.getPokemonByAbilitiesMarketplace = getPokemonByAbilitiesMarketplace;
exports.getPokemonByGenerationMarketplace = getPokemonByGenerationMarketplace;
exports.getPokemonByIdMarketplace = getPokemonByIdMarketplace;
exports.getPokemonByMovesMarketplace = getPokemonByMovesMarketplace;
exports.getPokemonByNameMarketplace = getPokemonByNameMarketplace;
exports.getPokemonByRegionMarketplace = getPokemonByRegionMarketplace;
exports.getPokemonByTypeMarketplace = getPokemonByTypeMarketplace;
exports.getPokemonGifByNameMarketplace = getPokemonGifByNameMarketplace;
exports.getPokemonSpriteByIdMarketplace = getPokemonSpriteByIdMarketplace;


// Export the items functions to be used
exports.searchItems = searchItems;
exports.getItemById = getItemById;
exports.getItemSprite = getItemSprite;
exports.createItem = createItem;
exports.updateItem = updateItem;
exports.deleteItem = deleteItem;
exports.getAllItems = getAllItems;

// Export the items functions to be used in marketplace
exports.getMarketplaceItemById = getMarketplaceItemById;
exports.createMarketplaceItem = createMarketplaceItem;

// Export the new Marketplace update function
exports.updateMarketplace = updateMarketplace;
