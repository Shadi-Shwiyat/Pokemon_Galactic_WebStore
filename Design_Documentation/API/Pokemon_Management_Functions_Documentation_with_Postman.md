
## Pokemon Management Functions

1. **Create Pokemon**
   - **Endpoint:** `/createPokemon`
   - **Method:** POST
   - **Description:** Adds a new Pokemon to the database.
   - **Body:**
     ```json
     {
       "id": 1,
       "name": "Bulbasaur",
       "abilities": ["Overgrow"],
       "base_cost": 300,
       "base_stat_total": 318,
       "cry": "http://example.com/cry.mp3",
       "flavor_text": "A strange seed was planted on its back at birth.",
       "generation": "I",
       "height": 7,
       "moves": ["Tackle", "Growl"],
       "region": "Kanto",
       "shiny_cost": 800,
       "sprites": {
         "default": "http://example.com/sprite.png",
         "shiny": "http://example.com/shiny.png"
       },
       "stats": {
         "hp": 45,
         "attack": 49,
         "defense": 49,
         "special-attack": 65,
         "special-defense": 65,
         "speed": 45
       },
       "typing": ["Grass", "Poison"],
       "weight": 69
     }
     ```
   - **Response:**
     ```json
     {
       "message": "Pokemon created successfully"
     }
     ```
   - **Postman Test:**
     - URL: `https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/createPokemon`
     - Method: POST
     - Body: `{"id": 1, "name": "Bulbasaur", ...}`
     - Expected Response: `{"message": "Pokemon created successfully"}`

2. **Get Pokemon By ID**
   - **Endpoint:** `/getPokemonById`
   - **Method:** GET
   - **Description:** Retrieves a Pokemon by its unique ID.
   - **Query Parameters:**
     - `id`: Integer
   - **Response:**
     ```json
     {
       "id": 1,
       "name": "Bulbasaur",
       "type": "Grass",
       "level": 5
     }
     ```
   - **Postman Test:**
     - URL: `https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/getPokemonById?id=1`
     - Method: GET
     - Expected Response: `{"id": 1, "name": "Bulbasaur", "type": "Grass", "level": 5}`

3. **Update Pokemon**
   - **Endpoint:** `/updatePokemon`
   - **Method:** PUT
   - **Description:** Updates details for an existing Pokemon.
   - **Body:**
     ```json
     {
       "id": 1,
       "name": "Ivysaur",
       "type": "Grass",
       "level": 16
     }
     ```
   - **Response:**
     ```json
     {
       "message": "Pokemon updated successfully"
     }
     ```
   - **Postman Test:**
     - URL: `https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/updatePokemon`
     - Method: PUT
     - Body: `{"id": 1, "name": "Ivysaur", "type": "Grass", "level": 16}`
     - Expected Response: `{"message": "Pokemon updated successfully"}`
