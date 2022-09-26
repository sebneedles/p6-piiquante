// Import de Json web Token
const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
   try {
        // Extraction du token du header Authorization
        const token = req.headers.authorization.split(' ')[1]; // Split le token après le mot Bearer
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // On décode le TOKEN avec verify
        const userId = decodedToken.userId; // Extraction de l'ID user
        // Ajout de l'ID user à l'objet request
        req.auth = {
            userId: userId
        };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};