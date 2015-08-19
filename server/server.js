// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express         	= require('express')        // call express
    ,app            	= express()                 // define our app using express
		,server						= require('http').Server(app)
		,io								= require('socket.io')(server)
    ,bodyParser     	= require('body-parser')
		,moment						= require('moment')
		,routeCallAction 	= require('./routes/callAction')
		,routeAccueil 	= require('./routes/routeAccueil')
  	,fs 							= require('fs')
		,RecupDonnees 		= require('./js/RecupDonnees.js')

// configure app to use bodyParser()
// this will let us get the data from a POST

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

global.arr = [];

moment.locale('fr');

global.fs = fs;
//global.config = {};

// Récupère les différentes pièces et modules
RecupDonnees.listeModules(function(configJSON){
//  stringData = JSON.stringify(configJSON, null, 2);
  global.config = configJSON;
//  global.config = global.config.devices.sort(sortByPieceAndPosition);
});

var port = process.env.PORT || 1680;        // set our port

// REGISTER OUR ROUTES -------------------------------
// 

app.use('/', routeAccueil);
app.use('/api/callAction', routeCallAction);

// START THE SERVER
// =============================================================================
app.listen(port, function(){
  var date = moment();
  var jour = date.format('DD-MM-YYYY');
  var heure = date.format('HH:mm:ss');
  console.log("Le " + jour + " à " + heure + " : Domogeek s'est mis à l'écoute du port " + port)
});

//io = io.listen(httpServer,{ log: false });
io.sockets.on('connection', function(socket){
  var date = moment();
  var jour = date.format('DD-MM-YYYY');
  var heure = date.format('HH:mm:ss');
  var ipadresse = socket.request.connection.remoteAddress;
	console.log(ipadresse + " s'est connecté le " + jour + " à " + heure);
});

