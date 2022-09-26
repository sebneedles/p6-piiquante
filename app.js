// Import de Express
const express = require('express');
const app = express();

// Import de DotEnv
const dotenv = require('dotenv');

// Import de Mongoose
const mongoose = require('mongoose');

// importation pour accéder au path du serveur
const path = require('path');

const result = dotenv.config();

// Enregistrement des routeurs Sauce et User
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// Connection à MongoDB
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_NAME}.qtzn2gc.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// ERREURS CORS (Cross Origin Resource Sharing).
app.use((req, res, next) => {
    // Accès à l'API depuis n'importe quelle origine ( '*' ).
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Ajoute les headers mentionnés aux requêtes envoyées vers l'API.
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');

    // Envoi les requêtes avec les méthodes mentionnées ( GET ,POST , etc.).
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// Utilisation de Express
app.use(express.json());

// Utilisation des routeurs sauceRoutes et userRoutes
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

// Utilisation du routage path
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;