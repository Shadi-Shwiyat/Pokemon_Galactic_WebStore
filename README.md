# Pokemon_Galactic_WebStore

## About
This is a web page that allows users to purchase pokemon and items from a marketplace. This also allows users to view different pokemon from generations from 1-8. 

Pokemon can be viewed that shows there available moves to learn, base stats, abilities, region, name, typing, height, weight, pokedex id, default/shiny .gif, cry, and pokedex text entry.

The marketplace is on a 24 hour cycle and auto assigns pokemon level, shiny chance, and cost(based off an algorithm) to a page where users can purchase these pokemon with pokedollars. The users sign up and receive 100,000 pokedollars to use on the marketplace. Then are allotted another 25,000 pokedollars every 24 hours after this when logged in. The users can view the pokemon they have bought on there profile page.

https://pokemon-galactic-webstore.web.app

# Installation and Setup
[![Tech Stack](https://skillicons.dev/icons?i=js,nodejs,css,express,react,firebase,firestore,vscode,github)](https://skillicons.dev)
## Install Node.js
- Download the installer from the official website: https://nodejs.org/en/download/
We used Node version 20.10.0 for this project.

## Install NVM (Node Version Manager)
- Download the installer from GitHub: https://github.com/nvm-sh/nvm
- Follow the installation instructions on the GitHub page.

# Setup database
## 


# Clone the Repository
```
git clone https://github.com/Shadi-Shwiyat/Pokemon_Galactic_WebStore
```
- Use nvm to switch to the project's Node.js version:
```
nvm use
```
- Install project dependencies that are listed in the package.json file:
```
npm install
```
# Set Up the Database for Firestore:
We are using Firestore compared to Realtime Database from firebase due to the cost of bandwidth and storage. Firestore is more scalable and flexible compared to Realtime Database. Firestore is a NoSQL document database that simplifies storing, syncing, and querying data for our web and mobile applications at scale. It's a flexible, scalable database for mobile, web, and server development from Firebase and Google Cloud Platform.

First you need to create a new project in Firebase and Firestore. You can do this by going to the Firebase Console and clicking on the "Add Project" button. You will need to give your project a name and then click "Create Project". Once your project is created, you will be taken to the project dashboard. Click on the "Firestore Database" tab in the left-hand menu and then click on the "Create Database" button. You will be asked to choose a location for your database. Choose a location that is closest to your users for the best performance. Once you have chosen a location, click "Next" and then click "Done". Your Firestore database is now created.

To execute some of the script you need to have credentials for the service account. You can generate a new private key file for your service account by going to the Firebase Console and clicking on the "Project Settings" button. In the "Service Accounts" tab, click on the "Generate New Private Key" button. This will download a JSON file with your service account credentials. You will need to save this file to your project directory and rename it to "serviceAccountKey.json" which I renamed "credentials.json".
## Step 1: Navigate to the Database Script Directory

# API Documentation
All API requests should be made to: `https://pokemon-galactic-webstore.web.app`

API Endpoint documentation can be found in the `Design_Documentation/API` directory.
As well as Postman tests for each endpoint.

### Troubleshooting

## Resources 
- Pokemon Sprites from https://projectpokemon.org/home/docs/spriteindex_148/

# Contributors
- [Rob Farley](https://github.com/Nomad-Rob)
- [Shadi Shwiyat](https://github.com/Shadi-Shwiyat)
