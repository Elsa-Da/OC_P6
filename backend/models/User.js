// Importation de mongoose & du plugin uniqueValidator
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Vérification de l'email utilisateur
const validateEmail = function (email) {
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email)
};

// Création du modèle "User"
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true, validate: [validateEmail, 'Please fill a valid email address'] },
    password: { type: String, required: true }
});

// Ajout du plugin uniqueValidator
userSchema.plugin(uniqueValidator);

// Exportation du modèle User
module.exports = mongoose.model('User', userSchema);