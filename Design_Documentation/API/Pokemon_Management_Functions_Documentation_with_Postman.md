## Pokemon Marketplace Management Functions

1. **Create Pokemon in Marketplace**
   - **Endpoint:** `/createPokemonMarketplace`
   - **Method:** POST
   - **Description:** Adds a new Pokemon to the marketplace.
   - **Body:**
     ```json
     {
       "id": 1,
       "name": "Bulbasaur",
       "abilities": ["Overgrow"],
       "marketplace_cost": 500,
       "base_stat_total": 318,
       "cry": "http://example.com/cry.mp3",
       "flavor_text": "A strange seed was planted on its back at birth.",
       "generation": "I",
       "height": 7,
       "moves": ["Tackle", "Growl"],
       "region": "Kanto",
       "sprite": "http://example.com/sprite.png",
       "stats": {
         "hp": 45,
         "attack": 49,
         "defense": 49,
         "special-attack": 65,
         "special-defense": 65,
         "speed": 45
       },
       "typing": ["Grass", "Poison"],
       "weight": 69,
       "is_shiny": false,
       "level": 5
     }
     ```
   - **Response:**
     ```json
     {
       "message": "Pokemon created successfully",
       "id": "documentId"
     }
     ```
   - **Postman Test:**
     - URL: `https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/createPokemonMarketplace`
     - Method: POST
     - Body: `{"id": 1, "name": "Bulbasaur", ...}`
     - Expected Response: `{"message": "Pokemon created successfully", "id": "documentId"}`

2. **Search Pokemon in Marketplace**
   - **Endpoint:** `/searchPokemonMarketplace`
   - **Method:** GET
   - **Description:** Searches for Pokemon in the marketplace based on various criteria.
   - **Query Parameters:**
     - `type`: String
     - `generation`: String
     - `name`: String
     - `region`: String
     - `moves`: String (comma-separated list)
     - `abilities`: String (comma-separated list)
     - `id`: Integer
     - `sprite`: String
     - `min_marketplace_cost`: Integer
     - `max_marketplace_cost`: Integer
     - `match_all_filters`: Boolean (true or false)
   - **Response:** Array of Pokemon objects
   - **Postman Test:** (Example for searching by name)
     - URL: `https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/searchPokemonMarketplace?name=Bulbasaur`
     - Method: GET
     - Expected Response: `[{"id": 1, "name": "Bulbasaur", ...}]`

3. **Get All Pokemon in Marketplace**
   - **Endpoint:** `/getAllPokemonMarketplace`
   - **Method:** GET
   - **Description:** Retrieves all Pokemon available in the marketplace.
   - **Response:** Array of Pokemon objects
   - **Postman Test:**
     - URL: `https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/getAllPokemonMarketplace`
     - Method: GET
     - Expected Response: `[{"id": 1, "name": "Bulbasaur", ...}]`

4. **Get Pokemon Sprite By ID from Marketplace**
   - **Endpoint:** `/getPokemonSpriteByIdMarketplace`
   - **Method:** GET
   - **Description:** Retrieves the sprite of a Pokemon in the marketplace by its ID.
   - **Query Parameters:**
     - `id`: Integer (Pokemon ID)
   - **Response:**
     ```json
     [
       {
         "id": "documentId",
         "sprite": "http://example.com/sprite.png"
       }
     ]
     ```
   - **Postman Test:**
     - URL: `https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/getPokemonSpriteByIdMarketplace?id=1`
     - Method: GET
     - Expected Response: `[{ "id": "documentId", "sprite": "http://example.com/sprite.png" }]`

5. **Get Pokemon GIF Sprite By Name from Marketplace**
   - **Endpoint:** `/getPokemonGifByNameMarketplace`
   - **Method:** GET
   - **Description:** Retrieves the GIF sprite of a Pokemon in the marketplace by its name.
   - **Query Parameters:**
     - `name`: String (Pokemon name)
   - **Response:** Redirects to the signed URL of the Pokemon GIF sprite
   - **Postman Test:**
     - URL: `https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/getPokemonGifByNameMarketplace?name=Bulbasaur`
     - Method: GET

6. **Get Pokemon By Type from Marketplace**
   - **Endpoint:** `/getPokemonByTypeMarketplace`
   - **Method:** GET
   - **Description:** Retrieves Pokemon from the marketplace by their type.
   - **Query Parameters:**
     - `type`: String
   - **Response:** Array of Pokemon objects
   - **Postman Test:**
     - URL: `https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/getPokemonByTypeMarketplace?type=Grass`
     - Method: GET
     - Expected Response: `[{"id": 1, "name": "Bulbasaur", ...}]`

7. **Get Pokemon By Generation from Marketplace**
   - **Endpoint:** `/getPokemonByGenerationMarketplace`
   - **Method:** GET
   - **Description:** Retrieves Pokemon from the marketplace by their generation.
   - **Query Parameters:**
     - `generation`: String
   - **Response:** Array of Pokemon objects
   - **Postman Test:**
     - URL: `https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/getPokemonByGenerationMarketplace?generation=I`
     - Method: GET
     - Expected Response: `[{"id": 1, "name": "Bulbasaur", ...}]`

8. **Get Pokemon By Name from Marketplace**
   - **Endpoint:** `/getPokemonByNameMarketplace`
   - **Method:** GET
   - **Description:** Retrieves Pokemon from the marketplace by their name.
   - **Query Parameters:**
     - `name`: String
   - **Response:** Array of Pokemon objects
   - **Postman Test:**
     - URL: `https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/getPokemonByNameMarketplace?name=Bulbasaur`
     - Method: GET
     - Expected Response: `[{"id": 1, "name": "Bulbasaur", ...}]`

9. **Get Pokemon By Region from Marketplace**
   - **Endpoint:** `/getPokemonByRegionMarketplace`
   - **Method:** GET
   - **Description:** Retrieves Pokemon from the marketplace by their region.
   - **Query Parameters:**
     - `region`: String
   - **Response:** Array of Pokemon objects
   - **Postman Test:**
     - URL: `https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/getPokemonByRegionMarketplace?region=Kanto`
     - Method: GET
     - Expected Response: `[{"id": 1, "name": "Bulbasaur", ...}]`

10. **Get Pokemon By Moves from Marketplace**
    - **Endpoint:** `/getPokemonByMovesMarketplace`
    - **Method:** GET
    - **Description:** Retrieves Pokemon from the marketplace by their moves.
    - **Query Parameters:**
      - `moves`: String (comma-separated list)
    - **Response:** Array of Pokemon objects
    - **Postman Test:**
      - URL: `https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/getPokemonByMovesMarketplace?moves=Tackle,Growl`
      - Method: GET
      - Expected Response: `[{"id": 1, "name": "Bulbasaur", ...}]`

11. **Get Pokemon By Abilities from Marketplace**
    - **Endpoint:** `/getPokemonByAbilitiesMarketplace`
    - **Method:** GET
    - **Description:** Retrieves Pokemon from the marketplace by their abilities.
    - **Query Parameters:**
      - `abilities`: String (comma-separated list)
    - **Response:** Array of Pokemon objects
    - **Postman Test:**
      - URL: `https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/getPokemonByAbilitiesMarketplace?abilities=Overgrow`
      - Method: GET
      - Expected Response: `[{"id": 1, "name": "Bulbasaur", ...}]`

12. **Update Pokemon in Marketplace**
    - **Endpoint:** `/updatePokemonMarketplace`
    - **Method:** PUT
    - **Description:** Updates an existing Pokemon in the marketplace.
    - **Body:**
      ```json
      {
        "id": "documentId",
        "name": "Bulbasaur",
        "abilities": ["Overgrow", "Chlorophyll"],
        "marketplace_cost": 600,
        "base_stat_total": 318,
        "cry": "http://example.com/cry.mp3",
        "flavor_text": "A strange seed was planted on its back at birth.",
        "generation": "I",
        "height": 7,
        "moves": ["Tackle", "Growl", "Vine Whip"],
        "region": "Kanto",
        "sprite": "http://example.com/sprite.png",
        "stats": {
          "hp": 45,
          "attack": 49,
          "defense": 49,
          "special-attack": 65,
          "special-defense": 65,
          "speed": 45
        },
        "typing": ["Grass", "Poison"],
        "weight": 69,
        "is_shiny": false,
        "level": 5
      }
      ```
    - **Response:**
      ```json
      {
        "message": "Pokemon updated successfully"
      }
      ```
    - **Postman Test:**
      - URL: `https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/updatePokemonMarketplace`
      - Method: PUT
      - Body: `{"id": "documentId", "name": "Bulbasaur", ...}`
      - Expected Response: `{"message": "Pokemon updated successfully"}`

13. **Delete Pokemon from Marketplace**
    - **Endpoint:** `/deletePokemonMarketplace`
    - **Method:** DELETE
    - **Description:** Deletes a Pokemon from the marketplace.
    - **Query Parameters:**
      - `id`: String (Pokemon document ID)
    - **Response:**
      ```json
      {
        "message": "Pokemon deleted successfully"
      }
      ```
    - **Postman Test:**
      - URL: `https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/deletePokemonMarketplace?id=documentId`
      - Method: DELETE
      - Expected Response: `{"message": "Pokemon deleted successfully"}`

14. **Purchase Pokemon from Marketplace**
    - **Endpoint:** `/purchasePokemon`
    - **Method:** POST
    - **Description:** Allows a user to purchase a Pokemon from the marketplace.
    - **Body:**
      ```json
      {
        "pokemonId": "documentId",
        "buyerId": "userId"
      }
      ```
    - **Response:**
      ```json
      {
        "message": "Pokemon purchased successfully"
      }
      ```
    - **Postman Test:**
      - URL: `https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/purchasePokemon`
      - Method: POST
      - Body: `{"pokemonId": "documentId", "buyerId": "userId"}`
      - Expected Response: `{"message": "Pokemon purchased successfully"}`

15. **List Purchased Pokemon for User**
    - **Endpoint:** `/listPurchasedPokemon`
    - **Method:** GET
    - **Description:** Retrieves a list of Pokemon purchased by a specific user.
    - **Query Parameters:**
      - `userId`: String (User ID)
    - **Response:**
      ```json
      {
        "purchasedPokemon": [
          {
            "id": "documentId",
            "name": "Charmander",
            "level": 5,
            "is_shiny": false,
            "abilities": ["Blaze"],
            "moves": ["Scratch", "Growl"],
            "stats": {
              "hp": 39,
              "attack": 52,
              "defense": 43,
              "special-attack": 60,
              "special-defense": 50,
              "speed": 65
            }
          },
          {
            "id": "documentId",
            "name": "Squirtle",
            "level": 5,
            "is_shiny": false,
            "abilities": ["Torrent"],
            "moves": ["Tackle", "Tail Whip"],
            "stats": {
              "hp": 44,
              "attack": 48,
              "defense": 65,
              "special-attack": 50,
              "special-defense": 64,
              "speed": 43
            }
          }
        ]
      }
      ```
    - **Postman Test:**
      - URL: `https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/listPurchasedPokemon?userId=userId`
      - Method: GET
      - Expected Response: List of purchased Pokemon JSON
      
      