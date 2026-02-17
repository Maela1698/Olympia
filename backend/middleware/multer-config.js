const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'uploads'); // Enregistrer dans le dossier "uploads"
  },
  filename: (req, file, callback) => {
    // On nettoie le nom du fichier (enlève les espaces)
    const name = file.originalname.split(' ').join('_').split('.')[0];
    const extension = MIME_TYPES[file.mimetype];
    // On génère un nom unique : nom + date + extension
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({ storage: storage }).single('image'); // Pour une seule image
module.exports.array = multer({ storage: storage }).array('images', 5); // Pour plusieurs images (max 5)