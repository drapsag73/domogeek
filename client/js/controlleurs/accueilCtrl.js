app.controller('accueilCtrl', function($scope, $rootScope, $route, $window, Accueil){
	$rootScope.loading = true
	$scope.details = []
	
	$scope.devices = Accueil.getDevices().then(function(devices){
	   	$rootScope.loading = false;
		$scope.devices = devices;
	})
	
	$scope.assign = function(valeur){
		$scope.query=valeur;
	}

  $scope.afficheDetails = function(idx, longueur){
		var tempDetail = [];
		tempDetail[idx] = !$scope.details[idx]
		for(x=0; x < longueur; x++){
			$scope.details[x] = false
		}
  	$scope.details[idx] = tempDetail[idx];
  }

	$scope.testType = function(type, valeur){
		var typesDevices = ['binary_light', 'door_sensor', 'smoke_sensor', 'prise', 'fenetre'];
		var trouve = false;
		var retour = "";
		for(x in typesDevices){
			if(typesDevices[x] == type){
				//		alert("TROUVE : x = " + x + "------typesDevices[x] = " + typesDevices[x] + "--------type = " + type + "--------valeur = " + valeur);
				trouve = true;
				retour="images/" + type + "-" + valeur + ".png";
			}
		}
		
		if(!trouve){
			//		alert("Pas trouve : x = " + x + "------typesDevices[x] = " + typesDevices[x] + "--------type = " + type + "--------valeur = " + valeur);
			if(parseInt(valeur) <= 95 && parseInt(valeur) >= 5){
				retour="images/" + type + "-" + "mi.png";
			}else{
				if(valeur <= 5){
					var val = 0;
				}else if(val >= 95){
					var val = 100
					}
				retour="images/" + type + "-" + val + ".png";
			}
		}
		return retour;
	}

}) // .FIN AccueilCtrl




