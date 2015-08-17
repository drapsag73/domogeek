//

var express         = require('express')       // call express
   ,cors            = require('cors')


// ROUTES POUR callAction
// =============================================================================
var routeCallAction = express.Router();              // Récupère l'instance du router d'Express

// middleware to use for all requests
routeCallAction.use(cors({
    allowedOrigins:[
        '192.168.0.16:1680', '78.233.143.4:1680', 'localhost:1680','apiganza.fr']
}))

routeCallAction.all("*", function(req, res, next) {
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

routeCallAction.use(function(req, res, next) {
    // do logging
    console.log("Une action a été demandée avec les paramètres " + JSON.stringify(req.query));
				res.send("parametres : " + JSON.stringify(req.query));
//	res.send();
});

module.exports = routeCallAction;
