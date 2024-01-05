# NOTE_APP

This repository contains a simple RESTful API built using the Node.js Express.js and MongoDB . The API provides endpoints for user authentication, managing notes, and sharing notes with other users. JWT (JSON Web Token) authentication is implemented for user signup and login. The API is tested using Jest and Supertest.

# Getting Started

# 1)Clone the repository:
git clone https://github.com/rhitambanerjee/NOTE_APP.git

cd NOTE_APP

# 2)Install dependencies:
npm install

# 3)Set up the MongoDB database:
Create a MongoDB database and note down the connection string.
Create a .env file in the root directory and add the following:

JWT_SECRET,
DB_PASSWORD,
DB_USERNAME,

# 4)Run the API:
node/nodemon index.js

# Testing
# The API is tested using Jest and Supertest. To run the tests:
npm test
