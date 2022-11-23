// Importation du framework Express et de sa fonctionnalité router
const express = require('express');
const router = express.Router();

// Importation du middleware password pour la validation du mdp
const password = require('../middleware/password');

// Importation des controllers "User"
const userCtrl = require('../controllers/user');

// Différentes routes "User"
router.post('/signup', password, userCtrl.signup);
router.post('/login', userCtrl.login);

// Exportation des routes "User"
module.exports = router;