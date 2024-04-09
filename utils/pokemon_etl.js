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

const name_replace_map = {
    "nidoran-f": "nidoran_f",
    "nidoran_f": "nidoran♀",
    "nidoran-m": "nidoran_m",
    "nidoran_m": "nidoran♂",
    "mr-mime": "mr.mime",
    "deoxys-normal": "deoxys",
    "wormadam-plant": "wormadam",
    "mime-jr": "mime_jr",
    "mime_jr": "mime jr.",
    "giratina-altered": "giratina",
    "shaymin-land": "shaymin-sky",
    "shaymin-sky": "shaymin",
    "basculin-red-striped": "basculin",
    "darmanitan-standard": "darmanitan",
    "tornadus-incarnate": "tornadus",
    "thundurus-incarnate": "thundurus",
    "landorus-incarnate": "landorus",
    "keldeo-ordinary": "keldeo",
    "meloetta-aria": "meloetta",
    "meowstic-male": "meowstic",
    "aegislash-shield": "aegislash",
    "pumpkaboo-average": "pumpkaboo-super",
    "pumpkaboo-super": "pumpkaboo",
    "gourgeist-average": "gourgeist-super",
    "gourgeist-super": "gourgeist",
    "zygarde-50": "zygarde",
    "oricorio-baile": "oricorio-sensu",
    "oricorio-sensu": "oricorio",
    "lycanroc-midday": "lycanroc-midnight",
    "lycanroc-midnight": "lycanroc",
    "wishiwashi-solo": "wishiwashi",
    "type-null": "typenull",
    "typenull": "type-null",
    "minior-red-meteor": "minior-green",
    "minior-green": "minior",
    "mimikyu-disguised": "mimikyu",
    "tapu-koko": "tapukoko",
    "tapukoko": "tapu koko",
    "tapu-lele": "tapulele",
    "tapulele": "tapu lele",
    "tapu-bulu": "tapubulu",
    "tapubulu": "tapu bulu",
    "tapu-fini": "tapufini",
    "tapufini": "tapu fini",
    "toxtricity-amped": "toxtricity",
    "mr-rime": "mr.rime",
    "eiscue-ice": "eiscue",
    "indeedee-male": "indeedee",
    "morpeko-full-belly": "morpeko-hangry-mode",
    "morpeko-hangry-mode": "morpeko",
    "urshifu-single-strike": "urshifu"
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

async function fetchSprite(url) {
    const response = await fetchWithRetry(url);
    const contentType = response.headers.get('content-type');
    
    // Check if response is HTML
    if (contentType && contentType.includes('text/html')) {
        const html = await response.text();
        // Check if HTML contains "Sorry, we could not find that!" in the title
        if (html.includes('<title>Sorry, we could not find that!</title>')) {
            // Handle the case where the sprite is not found
            throw new Error('Sprite not found');
        }
    } else {
        // Return the sprite data
        return await response.arrayBuffer();
    }
}

function calculateCost(baseStatTotal, catchRate) {
    // Define a linear relationship between base stat total and catch rate to determine cost
    if (catchRate == 3){
        baseStatTotal = baseStatTotal / 13;
    }
    if (catchRate >= 155) {
        baseStatTotal = baseStatTotal * 4;
    }
    if (catchRate < 155 && catchRate >= 120) {
        baseStatTotal = baseStatTotal * 3;
    }
    if (catchRate < 120 && catchRate >= 70) {
        baseStatTotal = baseStatTotal * 2;
    }
    if (catchRate < 45 && catchRate > 3) {
        baseStatTotal = baseStatTotal / 2;
    }
    const cost = ((baseStatTotal * 2) / (catchRate / 3)) ** 3;
    return Math.round(cost);
}

async function fetchPokemonData() {
    for (let i = 1; i <= 893; i++) {
        // Set scope for pokemon to check to sprite loading errors
        let pokemon;

        try {
            // Fetching data -------------------------------------------------------------------------------

            // Fetch data from pokeAPI
            const pokemon_response = await fetchWithRetry(`https://pokeapi.co/api/v2/pokemon/${i}`);
            pokemon = await pokemon_response.json();

            const pokemon_species_response = await fetchWithRetry(`https://pokeapi.co/api/v2/pokemon-species/${i}`);
            const pokemon_species = await pokemon_species_response.json();

            // Fetch 3d sprite from projectpokemon.org
            // let normal_sprite_data;
            // let shiny_sprite_data;

            // Check if name is in list of names to replace to avoid sprite error
            if (name_replace_map.hasOwnProperty(pokemon.name)) {
                pokemon.name = name_replace_map[pokemon.name];
                // console.log(pokemon.name);
            }

            // if (i >= 810 ) {
            //     normal_sprite_data = await fetchSprite(`https://projectpokemon.org/images/sprites-models/swsh-normal-sprites/${pokemon.name}.gif`);
            //     shiny_sprite_data = await fetchSprite(`https://projectpokemon.org/images/sprites-models/swsh-shiny-sprites/${pokemon.name}.gif`);
            // } else {
            //     normal_sprite_data = await fetchSprite(`https://projectpokemon.org/images/normal-sprite/${pokemon.name}.gif`);
            //     if(i == 122){
            //         shiny_sprite_data = await fetchSprite(`https://projectpokemon.org/images/shiny-sprite/mr._mime.gif`);
            //     } else {
            //         shiny_sprite_data = await fetchSprite(`https://projectpokemon.org/images/shiny-sprite/${pokemon.name}.gif`);
            //     }
            // }
            // console.log(normal_sprite_data);
            // console.log(shiny_sprite_data);

            // Switch name back to readable name for database on some pokemon
            if (name_replace_map.hasOwnProperty(pokemon.name)) {
                pokemon.name = name_replace_map[pokemon.name];
                // console.log(pokemon.name);
            }

            // Process the data
            const id = pokemon.id;
            const name = pokemon.name;
            const typing = pokemon.types.map(type => type.type.name);
            const normal_sprite_path = `https://storage.googleapis.com/pokemon-galactic-webstore.appspot.com/sprites/pokemon/pokemon_${pokemon.id}.gif`;
            const shiny_sprite_path = `https://storage.googleapis.com/pokemon-galactic-webstore.appspot.com/sprites/pokemon/pokemon_shiny_${pokemon.id}.gif`;
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
                    flavor_text = pokemon_species.flavor_text_entries[index].flavor_text.replace(/\n|\f|\t/g, ' ').replace(/ +/g, ' ');;
                    // console.log(flavor_text);
                    break;
                }
            }

            // const total_abilities = pokemon.abilities.length;
            // const randomIndex = Math.floor(Math.random() * total_abilities);
            // const ability = pokemon.abilities[randomIndex].ability.name;
            const abilities = pokemon.abilities.map(ability => ability.ability.name);
            const moves = pokemon.moves.map(move => move.move.name);

            const stats = {
                "hp": pokemon.stats[0].base_stat,
                "attack": pokemon.stats[1].base_stat,
                "defense": pokemon.stats[2].base_stat,
                "special-attack": pokemon.stats[3].base_stat,
                "special-defense": pokemon.stats[4].base_stat,
                "speed": pokemon.stats[5].base_stat
            }
            let base_stat_total = 0;
            for (const stat in stats) {
                base_stat_total += stats[stat];
            }
            // console.log(`Base stat total: ${base_stat_total}`);
            const catch_rate = pokemon_species.capture_rate;
            // console.log(`Catch rate: ${catch_rate}`);
            const base_cost = calculateCost(base_stat_total, catch_rate);
            // console.log(`Base cost: ${base_cost}`);
            let shiny_cost;
            if (catch_rate == 3) {
                shiny_cost = base_cost * 3;
            } else {
                shiny_cost = base_cost * 2;
            }
            // console.log(`Shiny cost: ${shiny_cost}`);

            const pokemon_object = {
                id: id,
                name: name,
                base_cost: base_cost,
                shiny_cost: shiny_cost,
                typing: typing,
                sprites: sprites,
                height: height,
                weight: weight,
                cry: cry,
                generation: generation,
                region: region,
                flavor_text: flavor_text,
                abilities: abilities,
                stats: stats,
                base_stat_total: base_stat_total,
                moves: moves,
            }
            // console.log(pokemon_object);

            // Write data to files ------------------------------------------------------------------
            
            // Sprites
            // fs.writeFileSync(`data/sprites/pokemon/pokemon_${pokemon.id}.gif`, Buffer.from(normal_sprite_data));
            // fs.writeFileSync(`data/sprites/pokemon/pokemon_shiny_${pokemon.id}.gif`, Buffer.from(shiny_sprite_data));

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
            if (error.message === 'Sprite not found') {
                console.log(`Pokemon ${pokemon.name} had issue loading sprite: Not Found`);
            } else {
                console.error('There was a problem with the fetch operation:', error);
            }
        }

        if (i == 893) {
            console.log("Data successfully parsed and loaded into json");
        }
    }
}

fetchPokemonData();