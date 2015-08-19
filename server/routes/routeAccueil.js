//

var express         = require('express')       // call express
   ,cors            = require('cors')


// ROUTES POUR callAction
// =============================================================================
var routeAccueil = express.Router();              // Récupère l'instance du router d'Express

// middleware to use for all requests
routeAccueil.use(cors({
    allowedOrigins:[
        '192.168.0.16:1680', '78.233.143.4:1680', 'localhost:1680','apiganza.fr', '192.168.1.14:1680']
}))

routeAccueil.all("*", function(req, res, next) {
    // do logging
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', 'origin, content-type, accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    if (req.method == 'OPTIONS') {
        res.status(200).end();
    }

   console.log('Accès autorisé');
    next(); // Pour être sur de continuer sur le route suivant
});

routeAccueil.use(function(req, res, next) {
    // do logging
    console.log("Une action a été demandée à l'accueil");
    next(); // Pour être sur de continuer sur le route suivant
});

routeAccueil.route('/')
    // récupère tous les devices de config.json
    .get(function(req, res) {
					res.json(global.config)
        });


module.exports = routeAccueil;