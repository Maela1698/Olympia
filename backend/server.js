// const express = require('express');
// const app = express();
// const PORT = 3000;

// // Middleware pour parser le JSON
// app.use(express.json());

// // Route de test
// app.get('/', (req, res) => {
//   res.send('Backend MEAN en marche 🚀');
// });

// // Lancer le serveur
// app.listen(PORT, () => {
//   console.log(`Serveur démarré sur http://localhost:${PORT}`);
// });

var http = require("http");

function start() {
  function onRequest(request, response) {
    console.log("Request received.");
    response.writeHead(200, {"Content-Type" : "text/plain"});
    response.write("Hello World");
    response.end();
  }

  // L'hébergeur donne le port dans process.env.PORT. 
  // S'il n'existe pas (en local), on utilise 8888 par défaut.
  const PORT = process.env.PORT || 8888;

  http.createServer(onRequest).listen(PORT, () => {
    console.log("Serveur démarré sur le port : " + PORT);
  });
}

exports.start = start;