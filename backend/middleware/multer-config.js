const multer = require('multer');
const path = require('path');

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'uploads'); 
  },
  filename: (req, file, callback) => {
    // On nettoie le nom du fichier (enlève les espaces)
    const name = file.originalname.split(' ').join('_').split('.')[0];
    const extension = path.extname(file.originalname);
    callback(null, name + Date.now() + extension);
  }
});

module.exports = multer({ storage: storage });