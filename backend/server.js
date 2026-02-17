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
  http.creqteServert(onRequest).listen(8888);
  console.log("Démarrage du serveur.");
}

exports.start = start;