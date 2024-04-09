// Extracts data from pokeAPI about items
// Transforms data into json to be
// Loaded into database
const fs = require('fs');

const items_to_fetch = [
    'master-ball', 'beast-ball', 'poke-ball', 'great-ball', 'ultra-ball',
    'cherish-ball', 'dusk-ball', 'dream-ball', 'heavy-ball', 'luxury-ball',
    'dive-ball', 'net-ball', 'moon-ball', 'timer-ball', 'premier-ball',
    'antidote', 'awakening', 'full-heal', 'moomoo-milk', 'rare-candy',
    'berry-juice', 'calcium', 'carbos', 'full-restore', 'hp-up', 'iron',
    'lemonade', 'pp-max', 'protein', 'soda-pop', 'sacred-ash', 'paralyze-heal',
    'potion', 'super-potion', 'max-potion', 'revive', 'max-revive',
    'elixir', 'max-elixir', 'air-balloon', 'amulet-coin', 'assault-vest',
    'black-belt', 'bright-powder', 'charcoal', 'choice-band', 'choice-scarf',
    'choice-specs', 'cleanse-tag', 'dark-gem', 'destiny-knot', 'dragon-fang',
    'eject-button', 'everstone', 'eviolite', 'exp-share', 'flame-orb',
    'focus-band', 'focus-sash', 'leftovers', 'life-orb', 'light-ball',
    'lucky-egg', 'luck-incense', 'macho-brace', 'metal-coat', 'metagrossite', 'mental-herb',
    'mystic-water', 'never-melt-ice', 'poison-barb', 'power-herb', 'quick-claw',
    'razor-claw', 'razor-fang', 'red-card', 'scope-lens', 'sharp-beak',
    'shell-bell', 'silk-scarf', 'silver-powder', 'soft-sand', 'soothe-bell',
    'spell-tag', 'thick-club','toxic-orb', 'venusaurite', 'wide-lens'
]

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

async function fetchItemData() {
    let id_iterator = 1;
    for (let i = 1; i <= 999; i++) {
        // Set scope for items to check to sprite loading errors
        let item;

        try {
            // Fetching data -------------------------------------------------------------------------------

            // Fetch data from pokeAPI
            const item_response = await fetchWithRetry(`https://pokeapi.co/api/v2/item/${i}`);
            try {
                item = await item_response.json();
            } catch(error) {
                console.log(`Item index ${i} had issue: Not found`);
            }
            // console.log(item);

            // Check if item name is in the items_to_fetch list
            if (!items_to_fetch.includes(item.name)) {
                // console.log(`${item.name} not in list, skipping`);
                continue; // Skip to next iteration
            }

            // Check if cost is 0 and ask for user input on cost if it is
            let cost = item.cost;
            if (cost === 0) {
                // Prompt user for input
                const userInput = await new Promise((resolve) => {
                    const readline = require('readline').createInterface({
                        input: process.stdin,
                        output: process.stdout
                    });
                    readline.question(`Enter the cost for item ${item.name}: `, (input) => {
                        resolve(parseInt(input.trim(), 10));
                        readline.close();
                    });
                });
                // Assign user input to cost variable
                cost = userInput;
            }

            // Process the data
            const id = id_iterator;
            id_iterator = id_iterator + 1;
            const name = item.name;
            const sprite_response = await fetchWithRetry(item.sprites.default);
            const sprite_data = await sprite_response.arrayBuffer();
            const sprite_path = `https://storage.googleapis.com/pokemon-galactic-webstore.appspot.com/sprites/items/${item.name}.png`;
            let flavor_text;
            const total_entries = item.flavor_text_entries.length;
            for (let index = 0; index < total_entries; index++) {
                if (item.flavor_text_entries[index].language.name == 'en') {
                    // console.log('text is englishhhh');
                    flavor_text = item.flavor_text_entries[index].text.replace(/\n|\f|\t/g, ' ').replace(/ +/g, ' ');
                    // console.log(flavor_text);
                    break;
                }
            }

            const item_object = {
                id: id,
                name: name,
                cost: cost,
                sprite: sprite_path,
                flavor_text: flavor_text,
            }
            // console.log(item_object);

            // Write data to files ------------------------------------------------------------------
            
            // Sprites
            fs.writeFileSync(`data/sprites/items/${name}.gif`, Buffer.from(sprite_data));

            // Pokemon object
            let itemList = [];
            try {
                // Load existing data from pokemon.json
                itemList = JSON.parse(fs.readFileSync('data/items.json'));
            } catch (error) {
                console.error('Error reading items.json:', error);
            }
            itemList.push(item_object);

            // Write updated data back to pokemon.json
            fs.writeFileSync('data/items.json', JSON.stringify(itemList, null, 2));
            console.log(`Item ${name} has been added to items.json`);
        } catch (error) {
            if (error.message === 'Sprite not found') {
                console.log(`Item ${item.name} had issue loading sprite: Not Found`);
            } else {
                console.error('There was a problem with the fetch operation:', error);
            }
        }

        if (id_iterator == 88) {
            console.log("Data successfully parsed and loaded into json");
        }
    }
}

// console.log(items_to_fetch.length);

fetchItemData();