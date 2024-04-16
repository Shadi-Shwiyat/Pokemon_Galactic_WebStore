
# Authentication Functions Documentation with Postman Examples

## Base URL
`https://us-central1-pokemon-galactic-webstore.cloudfunctions.net`

1. **Sign Up**
   - **Endpoint:** `/signup`
   - **Method:** POST
   - **Description:** Registers a new user with email and password.
   - **Body:**
     ```json
     {
       "email": "user@example.com",
       "password": "securepassword123"
     }
     ```
   - **Response:**
     ```json
     {
       "userId": "uniqueUserId"
     }
     ```
   - **Postman Test:**
     - URL: `https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/signup`
     - Method: POST
     - Body: `{"email": "user@example.com", "password": "securepassword123"}`
     - Expected Response: `{"userId": "uniqueUserId"}`

2. **Sign In**
   - **Endpoint:** `/signin`
   - **Method:** POST
   - **Description:** Authenticates user and returns a custom token for session management.
   - **Body:**
     ```json
     {
       "email": "user@example.com",
       "password": "securepassword123"
     }
     ```
   - **Response:**
     ```json
     {
       "token": "customToken",
       "uuid": "uniqueUserId"
     }
     ```
   - **Postman Test:**
     - URL: `https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/signin`
     - Method: POST
     - Body: `{"email": "user@example.com", "password": "securepassword123"}`
     - Expected Response: `{"token": "customToken", "uuid": "uniqueUserId"}`

3. **Verify Token**
   - **Endpoint:** `/verifyToken`
   - **Method:** POST
   - **Description:** Verifies the provided Firebase token for user authentication.
   - **Body:**
     ```json
     {
       "token": "customToken"
     }
     ```
   - **Response:**
     ```json
     {
       "uid": "uniqueUserId",
       "message": "Authentication successful"
     }
     ```
   - **Postman Test:**
     - URL: `https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/verifyToken`
     - Method: POST
     - Body: `{"token": "customToken"}`
     - Expected Response: `{"uid": "uniqueUserId", "message": "Authentication successful"}`

4. **Verify Email**
   - **Endpoint:** `/verifyEmail`
   - **Method:** POST
   - **Description:** Sends a verification link to the user's email.
   - **Body:**
     ```json
     {
       "email": "user@example.com"
     }
     ```
   - **Response:**
     ```json
     {
       "link": "verificationLink"
     }
     ```
   - **Postman Test:**
     - URL: `https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/verifyEmail`
     - Method: POST
     - Body: `{"email": "user@example.com"}`
     - Expected Response: `{"link": "verificationLink"}`

5. **Reset Password**
   - **Endpoint:** `/resetPassword`
   - **Method:** POST
   - **Description:** Sends a password reset link to the user's email.
   - **Body:**
     ```json
     {
       "email": "user@example.com"
      }
      ```
    - **Response:** 
      ```json
      {
        "message": "Password reset email sent"
      }
      ```
    - **Postman Test:**
      - URL: `https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/resetPassword`
      - Method: POST
      - Body: `{"email": "user@example.com"}`
      - Expected Response: `{"message": "Password reset email sent"}`
      
6. **Update Password**
   - **Endpoint:** `/updatePassword`
   - **Method:** POST
   - **Description:** Updates the user's password.
   - **Body:**
     ```json
     {
       "email": "user@example.com",
        "password": "newpassword123"
      }
      ```
    - **Response:** 
      ```json
      {
        "message": "Password updated successfully"
      }
      ```
    - **Postman Test:**
      - URL: `https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/updatePassword`
      - Method: POST
      - Body: `{"email": "user@example.com", "password": "newpassword123"}`
      - Expected Response: `{"message": "Password updated successfully"}`
      
7. **Sign Out**
   - **Endpoint:** `/signout`
   - **Method:** POST
   - **Description:** Signs the user out of the application.
   - **Body:**
     ```json
     {
       "email": "user@example.com"
      }
      ```
    - **Response:** 
      ```json
      {
        "message": "Sign out successful"
      }
      ```
    - **Postman Test:**
      - URL: `https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/signout`
      - Method: POST
      - Body: `{"email": "user@example.com"}`
      - Expected Response: `{"message": "Sign out successful"}`
      
8. **Get User Pokemon**
   - **Endpoint:** `/getUserPokemon`
   - **Method:** GET
   - **Description:** Retrieves all Pokemon owned by the user.
   - **Query Parameters:**
     - `userId`: String
   - **Response:**
     ```json
     {
       "pokemon": [
         {
           "id": 1,
           "name": "Bulbasaur",
           "type": "Grass",
           "level": 5
         },
         {
           "id": 4,
           "name": "Charmander",
           "type": "Fire",
           "level": 5
         }
       ]
     }
     ```
   - **Postman Test:**
     - URL: `https://us-central1-pokemon-galactic-webstore.cloudfunctions.net/getUserPokemon?userId=uniqueUserId`
     - Method: GET
     - Expected Response: `{"pokemon": [{"id": 1, "name": "Bulbasaur", "type": "Grass", "level": 5}, {"id": 4, "name": "Charmander", "type": "Fire", "level": 5}]}`
