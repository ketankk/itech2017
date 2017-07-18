var liniageCtrl = function(myService, $scope, $http, $templateCache,
		$location, $rootScope, $route, $upload, $filter) {
	
	$scope.liniageData = myService.get();
	$('#liniageLoader').hide();
	$('#liniagePageId').show();
	$scope.goProfile = function(){
		$location.path("/DataSchema/");
	}
	$scope.getGraph = function(){
		//alert('hiiiiiiii');
		$scope.method = 'GET';
		
		$scope.url = 'rest/service/getJsonForGraph/'+$scope.selectedProj+'/'+$scope.liniageData.profileName;
		$http({
			method : $scope.method,
			url : $scope.url,
			data : $scope.data,
			headers : headerObj
		}).success(
				function(data, status) {
					$scope.status = status;
					$scope.data = angular
					.fromJson(data.jsonblob);
					//console.log($scope.data.ExecutionGraph)
					if ($scope.data.ExecutionGraph != '' && $scope.data.ExecutionGraph != undefined) {
					var flowChart = $scope.data.ExecutionGraph;
					var flowChartJson = JSON.stringify(flowChart);
				//	console.log(flowChartJson);
					
					//$("#saveall").trigger("click");
					//jsPlumb.loadFlowchart();
					$('#jsonOutput').val(flowChartJson);
					}
					else{
						$('#jsonOutput').val('');
					}
					$("#loadChat").trigger("click");

				}).error(function(data, status) {
					if (status == 401) {
						$location.path('/');
					}
			$scope.data = data || "Request failed";
			$scope.status = status;

		});
	}
}

