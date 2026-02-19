const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
   try {
       // 1. Récupération du token
       const token = req.headers.authorization.split(' ')[1];
       
       // 2. Décryptage (On définit d'abord la variable !)
       const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'monsecret');

       // 3. On transmet les infos (On utilise 'userId' pour correspondre au login)
       req.auth = {
           userId: decodedToken.userId, 
           role: decodedToken.role
       };
       
       next(); 
   } catch(error) {
       console.log("❌ Erreur Auth Middleware :", error.message);
       res.status(401).json({ error: 'Requete non authentifiée !' });
   }
};