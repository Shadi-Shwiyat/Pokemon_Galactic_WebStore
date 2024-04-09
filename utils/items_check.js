const fs = require('fs');
const { it } = require('node:test');

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

let itemList = [];

try {
    // Load existing data from pokemon.json
    itemList = JSON.parse(fs.readFileSync('data/items.json'));
} catch (error) {
    console.error('Error reading items.json:', error);
}

for (let i = 0; i < items_to_fetch.length; i++) {
    if (!itemList.some(item => item.name === items_to_fetch[i])) {
        console.log(`${items_to_fetch[i]} is not in the itemList.`);
    }
}

console.log(items_to_fetch.length);
