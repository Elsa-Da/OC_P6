// Importation du package jsonwebtoken
const jwt = require('jsonwebtoken');


// Exportation de la fonctionnalité d'authentification grâce au token jsonwebtoken
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, `${process.env.TOKEN_SECRET}`);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};

