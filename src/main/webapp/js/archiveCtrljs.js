var archiveCtrl = function($scope, $rootScope, $location, $http) {
	
//	$("#userDName").text(localStorage.getItem('itc.dUsername'));
	$('#schemarunID').html('');
	getHeader($scope,$location);
	$scope.listArchivedSchema = function(){
		$scope.method = 'GET';
		$scope.url = 'rest/service/ListArchiveProfiles/';
		$scope.edituserData = new Object();
		// console.log(userRole);

		$http({
			method : $scope.method,
			url : $scope.url,
			// cache : $templateCache
			headers : {
				'X-Auth-Token' : localStorage.getItem('itc.authToken')
			}
		}).success(function(data, status) {

			$scope.status = status;
			//data = new Object();
			$scope.editArchiveData = data;
			$scope.archivelen = Object.keys($scope.editArchiveData).length
			//console.log(Object.keys($scope.editArchiveData).length);
		}).error(function(data, status) {
			$scope.restoreData = data;
			$('#schemarunID').html($scope.restoreData);
			if (status == 401) {
				$location.path('/');
			}
			$scope.data = data || "Request failed";
			$scope.status = status;
		});
	}
	$scope.listArchivedSchema();
	$scope.listprofile = function(){
		$location.path('/DataSchema/');
	}
	$scope.restoreSchema = function(schemaID){
		$scope.method = 'POST';
		$scope.profileDelete = new Object();
		$scope.schemaID=schemaID;
		$('#'+schemaID+'loader').show();
		$scope.url = 'rest/service/restoreArchive/'+schemaID;
		$http({
			method : $scope.method,
			url : $scope.url,
			//data : schemaID,
			// cache : $templateCache
			headers : {
				'X-Auth-Token' : localStorage.getItem('itc.authToken')
			}
		}).success(function(data, status) {
			//console.log(data);
			$scope.profileDelete.location = data;
			$scope.profileDelete.name = $scope.schemaID;
			console.log($scope.profileDelete);
			$scope.url = 'rest/service/restoreArchivedData/';
			$http({
				method : $scope.method,
				url : $scope.url,
				data : $scope.profileDelete,
				headers : {
					'X-Auth-Token' : localStorage.getItem('itc.authToken')
				}
			}).success(function(data, status) {
				console.log(data);
				$('#'+schemaID+'loader').hide();
				$scope.listArchivedSchema();
				//$scope.listArchivedSchema();
			}).error(function(data, status) {
				$scope.restoreData = data;
				$('#schemarunID').html($scope.restoreData);
				if (status == 401) {
					$location.path('/');
				}
				$scope.data = data || "Request failed";
				$scope.status = status;
			});
		}).error(function(data, status) {
			$scope.restoreData = data;
			$('#schemarunID').html($scope.restoreData);
			if (status == 401) {
				$location.path('/');
			}
			$scope.data = data || "Request failed";
			$scope.status = status;
		});
	}
}