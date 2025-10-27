const dotenv = require('dotenv')
const express = require('express');
const cors = require('cors');

// Charger les variables d'environnement AVANT d'importer les modules qui les utilisent
dotenv.config();

const {connectMongooseToDatabase} = require('./db')

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());

void connectMongooseToDatabase()

app.get('/health', (req, res) => {
  res.status(200).send('Hello, World!');
})

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
})
