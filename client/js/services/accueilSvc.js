app.factory('Accueil', function($http, $q, appConfig) {
	var factory = {
		devices: false,
		getDevices : function(){
			var deferred = $q.defer();
			if(factory.devices !== false){
				deferred.resolve(factory.devices);
			}else{
				$http.get(appConfig.accessIP + '/')
					.success(function(data, status){
						factory.devices = data;
						deferred.resolve(factory.devices);
					})
					.error(function(data, status){
						deferred.reject('Impossible de récupérer les données');
					});
			}
			return deferred.promise;
		}
	}
	return factory;
});