// Importation du package multer
const multer = require('multer');

// Différents types d'images autorisés
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/avif': 'avif'
};

// Où et comment sont stockées les images
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const extension = MIME_TYPES[file.mimetype];
        let name = file.originalname.replace(('.' + extension), "").split(' ').join('_')
        callback(null, name + Date.now() + '.' + extension);
    }
});

// Exportation de multer
module.exports = multer({ storage: storage }).single('image');