var app = angular.module('appDomogeek', ['ngRoute', 'wu.masonry'])

app.config(['$locationProvider','$routeProvider', 
  function($location, $routeProvider) {
    $routeProvider
			.when('/', {
		 		templateUrl: 'vues/accueil.html',
				controller: 'accueilCtrl'
	 		})
      .when('/controle', {
		 		templateUrl: 'vues/controle.html',
		 		controller: 'controleCtrl'
	 		})
      .when('/controle/:id', {
		 		templateUrl: function(params){ 
					return 'vues/controle.html/' + params.id; 
				},
		 		controller: 'controleCtrl'
			})
      .when('/gestion', {
		 		templateUrl: 'vues/gestion.html'
			})
      .when('/actualites', {
		 		templateUrl: 'vues/actualites.html',
		 		controller: 'actualitesCtrl'
	 		})
			.otherwise({redirectTo: '/'});
	}
]);

app.constant('appConfig', {
    accessIP: 'http://192.168.0.16:1680'
});