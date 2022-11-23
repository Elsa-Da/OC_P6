// Importation de mongoose
const mongoose = require('mongoose');

// Création du modèle "Sauce"
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },

    name: { type: String, required: true, validate: {
      validator: function(v) { return /^[A-Za-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ' -.]{2,30}$/.test(v)  },
        message: props => `${props.value} is not a valid name`
    },
    },
    
    manufacturer: { type: String, required: true, validate: {
      validator: function(v) { return /^[A-Za-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ' -.]{2,30}$/.test(v); },
        message: props => `${props.value} is not a valid manufacturer name`
    },
    },
    
    description: { type: String, required: true, validate: {
      validator: function(v) { return /^[a-zA-Z_0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ' -.!()?]+$/.test(v)  },
        message: props => `${props.value} is not a valid description`
    },
    },

    mainPepper: { type: String, required: true, validate: {
      validator: function(v) {  return /^[A-Za-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ' -.]{2,30}$/.test(v); },
        message: props => `${props.value} is not a valid main pepper name`
    },
    },
    
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    usersLiked: { type: Array, default: [] },
    usersDisliked: { type: Array, default: [] }
});
  
// Exportation du modèle "Sauce"
module.exports = mongoose.model('Sauce', sauceSchema);