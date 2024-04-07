// Extracts data from pokeAPI about pokemon
// Transforms data into json to be
// Loaded into database
// 893 pokemon total
const fs = require('fs');

const generation_map = {
    "generation-i": "Kanto",
    "generation-ii": "Johto",
    "generation-iii": "Hoenn",
    "generation-iv": "Sinnoh",
    "generation-v": "Unova",
    "generation-vi": "Kalos",
    "generation-vii": "Alola",
    "generation-viii": "Galar",
}

async function fetchWithRetry(url, options = {}, retries = 33) {
    while (retries > 0) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                console.log(`Response not ok, retrying with ${retries} retries left`);
            }
            return response;
        } catch (error) {
            console.log(`Error fetching data: retrying with ${retries} retries left`);
            retries--;
            if (retries === 0) {
                throw new Error('Maximum retries exceeded');
            }
            await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for 3 second before retrying
        }
    }
}

async function fetchPokemonData() {
    for (let i = 1; i <= 893; i++) {
        try {
            // Fetching data -------------------------------------------------------------------------------

            // Fetch data from pokeAPI
            const pokemon_response = await fetchWithRetry(`https://pokeapi.co/api/v2/pokemon/${i}`);
            const pokemon = await pokemon_response.json();

            const pokemon_species_response = await fetchWithRetry(`https://pokeapi.co/api/v2/pokemon-species/${i}`);
            const pokemon_species = await pokemon_species_response.json();

            // Fetch 3d sprite from projectpokemon.org
            let normal_sprite_response;
            let shiny_sprite_response;

            if (i >= 810 ) {
                normal_sprite_response = await fetchWithRetry(`https://projectpokemon.org/images/sprites-models/swsh-normal-sprites/${pokemon.name}.gif`);
                shiny_sprite_response = await fetchWithRetry(`https://projectpokemon.org/images/sprites-models/swsh-shiny-sprites/${pokemon.name}.gif`);
            } else {
                normal_sprite_response = await fetchWithRetry(`https://projectpokemon.org/images/normal-sprite/${pokemon.name}.gif`);
                shiny_sprite_response = await fetchWithRetry(`https://projectpokemon.org/images/shiny-sprite/${pokemon.name}.gif`);
            }

            // Extract image data
            const normal_sprite_data = await normal_sprite_response.arrayBuffer();
            const shiny_sprite_data = await shiny_sprite_response.arrayBuffer();

            // Process the data
            const id = pokemon.id;
            const name = pokemon.name;
            const typing = pokemon.types.map(type => type.type.name);
            const normal_sprite_path = `data/sprites/pokemon_${pokemon.id}.gif`;
            const shiny_sprite_path = `data/sprites/pokemon__shiny_${pokemon.id}.gif`;
            const sprites = {
                "default": normal_sprite_path,
                "shiny": shiny_sprite_path
            }
            const height = pokemon.height / 10;
            const weight = pokemon.weight / 100;
            const cry = pokemon.cries.latest;
            const generation = pokemon_species.generation.name;
            const region = generation_map[generation];
            let flavor_text;
            const total_entries = pokemon_species.flavor_text_entries.length;
            for (let index = 0; index < total_entries; index++) {
                if (pokemon_species.flavor_text_entries[index].language.name == 'en') {
                    // console.log('text is englishhhh');
                    flavor_text = pokemon_species.flavor_text_entries[index].flavor_text.replace(/\\[nft]/g, ' ');
                    console.log(flavor_text);
                    break;
                }
            }
            // const total_abilities = pokemon.abilities.length;
            // const randomIndex = Math.floor(Math.random() * total_abilities);
            // const ability = pokemon.abilities[randomIndex].ability.name;
            const abilities = pokemon.abilities.map(ability => ability.ability.name);
            const moves = pokemon.moves.map(move => move.move.name);

            const pokemon_object = {
                id: id,
                name: name,
                typing: typing,
                sprites: sprites,
                height: height,
                weight: weight,
                cry: cry,
                generation: generation,
                region: region,
                flavor_text: flavor_text,
                abilities: abilities,
                moves: moves
            }
            // console.log(pokemon_object);

            // Write data to files ------------------------------------------------------------------
            
            // Sprites
            fs.writeFileSync(`data/sprites/pokemon_${pokemon.id}.gif`, Buffer.from(normal_sprite_data));
            fs.writeFileSync(`data/sprites/pokemon_shiny_${pokemon.id}.gif`, Buffer.from(shiny_sprite_data));

            // Pokemon object
            let pokemonList = [];
            try {
                // Load existing data from pokemon.json
                pokemonList = JSON.parse(fs.readFileSync('data/pokemon.json'));
            } catch (error) {
                console.error('Error reading pokemon.json:', error);
            }
            pokemonList.push(pokemon_object);

            // Write updated data back to pokemon.json
            fs.writeFileSync('data/pokemon.json', JSON.stringify(pokemonList, null, 2));
            console.log(`Pokemon ${name} has been added to pokemon.json`);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }

        if (i == 893) {
            console.log("Data successfully parsed and loaded into json");
        }
    }
}

fetchPokemonData();