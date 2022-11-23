// Importation des différents éléments nécessaires au bon fonctionnement de l'application
require('dotenv').config('/.env');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const app = express();

// Utilisation packages cors/helmet
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

//Paramètrage puis usage du limiteur de requêtes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (per 15 minutes)
    standardHeaders: true, // Return rate limit info in the headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

app.use(express.json());


// Importation des routes
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

// Connexion à la BDD
mongoose.connect(`mongodb+srv://${process.env.BDD_USER}:${process.env.BDD_PASSWORD}@${process.env.BDD_CLUSTER_NAME}.mongodb.net/?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// Exécution des routes
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

// Export du fichier app
module.exports = app;