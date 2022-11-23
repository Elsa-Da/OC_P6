// Importation du framework Express et de sa fonctionnalité router
const express = require('express');
const router = express.Router();

// Importation de l'authentification & de multer
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Importation des controllers "Sauce"
const sauceCtrl = require('../controllers/sauce');

// Différentes routes de "Sauce"
router.post('/', auth, multer, sauceCtrl.createSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);

// Exportation des routes
module.exports = router;