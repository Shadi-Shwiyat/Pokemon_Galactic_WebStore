
## Item Management Functions

1. **Create Item**
   - **Endpoint:** `/createItem`
   - **Method:** POST
   - **Description:** Adds a new item to the item list.
   - **Body:**
     ```json
     {
       "cost": 200,
       "flavor_text": "Heals 20 HP",
       "id": 101,
       "name": "Potion",
       "sprite": "http://example.com/sprite.png",
       "type": "Healing"
     }
     ```
   - **Response:**
     ```json
     {
       "message": "Item created successfully",
       "id": "uniqueItemId"
     }
     ```
   - **Postman Test:**
     - URL: `https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/createItem`
     - Method: POST
     - Body: `{"cost": 200, "flavor_text": "Heals 20 HP", "id": 101, "name": "Potion", "sprite": "http://example.com/sprite.png", "type": "Healing"}`
     - Expected Response: `{"message": "Item created successfully", "id": "uniqueItemId"}`

2. **Get Item By ID**
   - **Endpoint:** `/getItemById`
   - **Method:** GET
   - **Description:** Retrieves an item by its unique ID.
   - **Query Parameters:**
     - `id`: Integer
   - **Response:**
     ```json
     {
       "id": 101,
       "name": "Potion",
       "cost": 200,
       "type": "Healing",
       "flavor_text": "Heals 20 HP",
       "sprite": "http://example.com/sprite.png"
     }
     ```
   - **Postman Test:**
     - URL: `https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/getItemById?id=101`
     - Method: GET
     - Expected Response: `{"id": 101, "name": "Potion", "cost": 200, "type": "Healing", "flavor_text": "Heals 20 HP", "sprite": "http://example.com/sprite.png"}`

3. **Update Item**
   - **Endpoint:** `/updateItem`
   - **Method:** PUT
   - **Description:** Updates details for an existing item.
   - **Body:**
     ```json
     {
       "id": 101,
       "cost": 250,
       "flavor_text": "Heals 50 HP",
       "name": "Super Potion",
       "sprite": "http://example.com/super_potion.png",
       "type": "Healing"
     }
     ```
   - **Response:**
     ```json
     {
       "message": "Item updated successfully"
     }
     ```
   - **Postman Test:**
     - URL: `https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/updateItem`
     - Method: PUT
     - Body: `{"id": 101, "cost": 250, "flavor_text": "Heals 50 HP", "name": "Super Potion", "sprite": "http://example.com/super_potion.png", "type": "Healing"}`
     - Expected Response: `{"message": "Item updated successfully"}`
     
4. **Delete Item**
    - **Endpoint:** `/deleteItem`
    - **Method:** DELETE
    - **Description:** Removes an item from the item list.
    - **Body:**
      ```json
      {
        "id": 101
      }
      ```
    - **Response:**
      ```json
      {
        "message": "Item deleted successfully"
      }
      ```
    - **Postman Test:**
      - URL: `https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/deleteItem`
      - Method: DELETE
      - Body: `{"id": 101}`
      - Expected Response: `{"message": "Item deleted successfully"}`
      
      5. **Search Items**
    - **Endpoint:** `/searchItems`
    - **Method:** GET
    - **Description:** Retrieves a list of items that match the search query.
    - **Query Parameters:**
      - `query`: String
