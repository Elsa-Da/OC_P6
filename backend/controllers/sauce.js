// Import du modèle "Sauce" et du module nodejs file system
const Sauce = require('../models/Sauce');
const fs = require('fs');

// CREATION D'UNE NOUVELLE SAUCE
exports.createSauce = (req, res) => {
    //on parse l'objet requête, puisque l'objet est envoyé sous forme json mais en chaine de caractère
    const sauceObject = JSON.parse(req.body.sauce);
    //on supprime l'id de la sauce puisqu'il sera généré automatiquement par BDD
    delete sauceObject._id;
    //on supprime l'userID pour pouvoir utiliser l'userID qui vient du token d'identification
    delete sauceObject._userId;
    //on crée la nouvelle sauce
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    let error = sauce.validateSync();
    if ( error) {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, (err) => { if (err) throw err; console.log('Fichier supprimé !'); })
    }
    // on sauvegarde la sauce
    sauce.save()
        .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
        .catch(error => { res.status(400).json({ error }) })
};

// AFFICHAGE D'UNE SAUCE UNIQUE
exports.getOneSauce = (req, res) => {
    //on trouve la sauce qui correspond à l'id que l'on recherche
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

// MODIFICATION D'UNE SAUCE
exports.modifySauce = (req, res) => {

    //on récupère la sauce dans notre BDD
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            //on verifie si l'user ajoute une nouvelle image & si oui, on supprime l'ancienne
            if (req.file) {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, (err) => { if (err) throw err; console.log('Fichier supprimé !'); })
            }
            //si l'utilisateur à transmis un fichier on récupère notre objet en parsant la chaine de caractère + recrée url img
            const sauceObject = req.file ? {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                //si non, on récupère l'objet directement dans le corps de la requête
            } : { ...req.body };

            //on supprime l'userID pour pouvoir utiliser l'userID qui vient du token d'identification
            delete sauceObject._userId;
            //on vérifie si l'user qui modifie est bien celui qui a crée la sauce
            if (sauce.userId != req.auth.userId) {
                return res.status(403).json({ message: 'Unauthorized request' });
            }
            //si c'est bien le cas, on update la sauce
            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Objet modifié!' }))
                .catch(error => res.status(401).json({ error }));
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

// SUPRESSION D'UNE SAUCE
exports.deleteSauce = (req, res) => {
    //on trouve la sauce qui correspond à l'id que l'on recherche
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            //on vérifie si l'user qui modifie est bien celui qui a crée la sauce
            if (sauce.userId != req.auth.userId) {
                return res.status(401).json({ message: 'Not authorized' });
            }
            //si c'est bien le cas, on supprime l'image en récupérant le nom de fichier avec un split
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                //puis on supprime la sauce
                sauce.deleteOne({ _id: req.params.id })
                    .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                    .catch(error => res.status(401).json({ error }));
            });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

// AFFICHAGE DE TOUTES LES SAUCES
exports.getAllSauces = (req, res) => {
    //on trouve toutes les sauces crées
    Sauce.find()
        .then(
            (sauces) => {
                res.status(200).json(sauces);
            }
        ).catch(
            (error) => {
                res.status(400).json({
                    error: error
                });
            }
        );
};

// FONCTION LIKE DES SAUCES
exports.likeSauce = (req, res) => {

    let userVoting = req.body.userId;
    let vote = req.body.like;

    switch (vote) {

        case 0:
            //on vient récupérer la sauce que l'on like ou dislike
            Sauce.findOne({ _id: req.params.id })
                .then((sauce) => {
                    let likeArray = sauce.usersLiked;
                    let dislikeArray = sauce.usersDisliked;

                    //Si l'utilisateur a déjà liké, il revient à 0 et on retire son like + son ID du tableau usersLiked
                    if (likeArray.includes(userVoting)) {
                        Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: userVoting }, $inc: { likes: -1 } })
                            .then(() => res.status(200).json({ message: "Unvoted" }))
                            .catch(error => { res.status(400).json({ error }) })

                        //Si l'utilisateur a déjà disliké, il revient à 0 et on retire son dislike + son ID du tableau usersDisliked
                    } else if (dislikeArray.includes(userVoting)) {
                        Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: userVoting }, $inc: { dislikes: -1 } })
                            .then(() => res.status(200).json({ message: "Unvoted" }))
                            .catch(error => { res.status(400).json({ error }) })
                    }
                })
                .catch(error => { res.status(400).json({ error }) })
            break;

        case 1:
            //Si l'utilisateur like, on push son ID dans le tableau usersLiked et on rajoute un like à la sauce
            Sauce.updateOne({ _id: req.params.id }, { $push: { usersLiked: userVoting }, $inc: { likes: +1 } })
                .then(() => res.status(200).json({ message: "Liked" }))
                .catch(error => { res.status(400).json({ error }) })
            break;


        case -1:
            //Si l'utilisateur dislike, on push son ID dans le tableau usersDisliked et on rajoute un dislike à la sauce
            Sauce.updateOne({ _id: req.params.id }, { $push: { usersDisliked: userVoting }, $inc: { dislikes: +1 } })
                .then(() => res.status(200).json({ message: "Disliked" }))
                .catch(error => { res.status(400).json({ error }) })
            break;
    }

};
