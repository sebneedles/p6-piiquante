// Import de multer (gestion de fichiers)
const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  // On indique à Multer dans quel dossier enregistrer les images
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  // On indique à Multer d'utiliser le nom d'origine et remplace les espaces par underscore et ajout de la date au fichier
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

// Export de l'élément Multer
module.exports = multer({storage: storage}).single('image');