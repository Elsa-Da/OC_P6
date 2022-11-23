// Importation du modèle "User" et des packages bcrypt et jsonwebtoken
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// INSCRIPTION NOUVEL UTILISATEUR
exports.signup = (req, res) => {
    //on vient hasher le mdp + sel
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            //on crée un nouvel utilisateur avec le hash en mdp
            const user = new User({
                email: req.body.email,
                password: hash
            });
            //on sauvegarde l'utilisateur
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

// CONNEXION UTILISATEUR
exports.login = (req, res) => {
    //on récupère notre utilisateur grâce à son email
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Mot de passe ou email incorrect' });
            }
            //si l'utilisateur existe bien on compare le hash de son mdp enregistré et le hash du mdp qu'il vient de mettre
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe ou email incorrect' });
                    }
                    res.status(200).json({
                        //si c'est bon on lui attribue un token d'authentification qui dure 24h
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            `${process.env.TOKEN_SECRET}`,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};