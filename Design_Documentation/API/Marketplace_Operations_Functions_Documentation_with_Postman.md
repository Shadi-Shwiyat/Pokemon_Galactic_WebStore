
## Marketplace Operations Functions

1. **Update Marketplace**
   - **Endpoint:** `/updateMarketplace`
   - **Method:** POST
   - **Description:** Refreshes the marketplace with new randomly selected Pokemon.
   - **Body:** None (operation is handled server-side)
   - **Response:**
     ```json
     {
       "message": "Marketplace updated successfully"
     }
     ```
   - **Postman Test:**
     - URL: `https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/updateMarketplace`
     - Method: POST
     - Expected Response: `{"message": "Marketplace updated successfully"}`

2. **Purchase Pokemon**
   - **Endpoint:** `/purchasePokemon`
   - **Method:** POST
   - **Description:** Allows a user to purchase a Pokemon from the marketplace using PokeDollars.
   - **Body:**
     ```json
     {
       "userId": "uniqueUserId",
       "pokemonId": "uniquePokemonId"
     }
     ```
   - **Response:**
     ```json
     {
       "message": "Purchase successful"
     }
     ```
   - **Postman Test:**
     - URL: `https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/purchasePokemon`
     - Method: POST
     - Body: `{"userId": "uniqueUserId", "pokemonId": "uniquePokemonId"}`
     - Expected Response: `{"message": "Purchase successful"}`
