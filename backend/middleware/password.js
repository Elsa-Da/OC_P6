//on importe le package password validator
const passwordValidator = require('password-validator');

// On crée un schéma de validation
var passwordSchema = new passwordValidator();

// On paramètre les propriétés de la validation
passwordSchema
    .is().min(8)                                    // Minimum length 8
    .is().max(50)                                  // Maximum length 50
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits(1)                                // Must have at least 1 digit
    .has().not().spaces()                           // Should not have spaces

// On teste le mot de passe rentré par l'usager
module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        return res.status(400).json({ error: "Password not strong enough. Misses " + passwordSchema.validate(req.body.password, { list: true }) });
    }
    next();

}
