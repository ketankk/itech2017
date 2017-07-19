var openrunStatus;
var dashboardCtrl = function($scope, $rootScope, $location, $http,$interval) {
//	console.log("In dashboardCtrl");
	
	$scope.ingestionGraphDataEmpty=false;
	$scope.projectGraphDataEmpty=false;
	$scope.ingestionGraphrunStatusEmpty=false;
	$scope.projectGraphrunStatusEmpty=false;
	getHeader($scope,$location);
	$scope.ingestionGraph = function() {
		//console.log("In ingestionGraph fn");
		var searchType= "ingestion";
		var graphType = "profileStatus";
		$scope.method = 'GET';
		$scope.url = 'rest/service/dashboard/getDashboardDetails/' + searchType+'/'+graphType;
		//http://localhost:8080/ZDP-Web/rest/service/dashboard/CallGraylogRestApi/admin
		$http({
			method : $scope.method,
			url : $scope.url,
			headers : headerObj
		}).success(function(data, status) { 
			//console.log("success");
		//	console.log(data);
			$('#dashLoader').hide();
			$('#dashboardPage').show();
			
			if(! jQuery.isEmptyObject(data)){
					var xdata = new Array();
					var ydata = new Array();
					var profileCreated=0;
					var ingestionUpdated=0;
					var ingestionDeleted=0;
                    var arrmaxVal=0;
					angular.forEach(data,function(y,x){
						xdata.push(x);
						profileCreated=0;
						ingestionUpdated=0;
						ingestionDeleted=0;
						angular.forEach(y,function(y2,x2){
							if (x2 == "CREATE"){
								profileCreated=y2;
							}
							else if(x2 == "UPDATE"){
								ingestionUpdated=y2;				
							}
							else if(x2 == "DELETE"){
								ingestionDeleted=y2;				
							}
                            arrmaxVal=y2>arrmaxVal?y2:arrmaxVal;
						//	console.log(x2);
						});
						xdata.push(profileCreated);
						xdata.push(ingestionUpdated);
						xdata.push(ingestionDeleted);
					});
					 
					//  console.log(xdata);
					  var data = new google.visualization.DataTable();
					  data.addColumn('string', 'Year');
					  data.addColumn('number', 'Created');
					  data.addColumn('number', 'Updated');
					  data.addColumn('number', 'Deleted');
					
					  for(i = 0; i < xdata.length; i=i+4)
					    data.addRow([xdata[i], xdata[i+1], xdata[i+2], xdata[i+3]]);
					  // Create and draw the visualization.
				 	  /*  new google.visualization.BarChart(document.getElementById('chart_div1')).
					    draw(data, {});*/
					  var tempArr = xdata;
					  tempArr.shift();
					//  console.log('tempArr');
					//  console.log(tempArr);
					 /* var arrmaxVal = tempArr.reduce(function(previous,current){ 
	                      return previous > current ? previous:current
	                   });*/
					//  alert(arrmaxVal);
					  var maxVal =  5*(Math.ceil(Math.abs(arrmaxVal/5)));
					  maxVal=maxVal==0?5:maxVal;
				//	  alert(maxVal);
					  var ingestionOptions1 = {
							  title : 'Ingestion Profile Statistics',
							  vAxis: {title: 'Count'},
							  hAxis: {title: 'Date'},
							  seriesType: 'bars',
							  bar: {
								    groupWidth: 20
								},
							  series: {5: {type: 'line' ,lineWidth:2}},
							  colors:['#008000', '#0000FF', '#FF0000'],
							  vAxis: {'gridlines': {count: 6},'viewWindow': {'max': maxVal}}
							};
					 
					  var ingestionChart = new google.visualization.ComboChart(document.getElementById('ingestion_chart_div'));
					  ingestionChart.draw(data, ingestionOptions1);
			}
			else {
				$scope.ingestionGraphDataEmpty=true;
			}
			//console.log("$scope.ingestionGraphDataEmpty")
			//console.log($scope.ingestionGraphDataEmpty)
			}).error(function(data, status) {
				if (status == 401) {
					$location.path('/');
				}
				$('#dashLoader').hide();
				$('#dashboardPage').show();
				
				$scope.data = data || "Request failed";
				$scope.status = status;
				//console.log("Failed");
			});
		var graphType = "runStatus";
		$scope.method = 'GET';
		$scope.url = 'rest/service/dashboard/getDashboardDetails/' + searchType+'/'+graphType;
		//http://localhost:8080/ZDP-Web/rest/service/dashboard/CallGraylogRestApi/admin
		$http({
			method : $scope.method,
			url : $scope.url,
			headers : headerObj
		}).success(function(data, status) { 
			//console.log("success");
			//console.log(data);
			$('#dashLoader').hide();
			$('#dashboardPage').show();
			
			if(! jQuery.isEmptyObject(data)){
					var xdata = new Array();
					var ydata = new Array();
					var ingestionSuccess=0;
					var ingestionTerminated=0;
					var ingestionFailed=0;
                    var arrmaxVal=0;
					angular.forEach(data,function(y,x){
						xdata.push(x);
						ingestionSuccess=0;
						ingestionTerminated=0;
						ingestionFailed=0;
						angular.forEach(y,function(y2,x2){
							if(x2 == "SUCCESS"){
								ingestionSuccess=y2;				
							}
							else if(x2 == "FAIL"){
								ingestionFailed=y2;				
							}
							else if(x2 == "TERMINATE"){
								ingestionTerminated=y2;				
							}
                            arrmaxVal=y2>arrmaxVal?y2:arrmaxVal;
							//console.log(x2);
							
						});
						xdata.push(ingestionSuccess);
						xdata.push(ingestionFailed);
						xdata.push(ingestionTerminated);
					});
					 
					//  console.log(xdata);
					  var data = new google.visualization.DataTable();
					  data.addColumn('string', 'Year');
					  data.addColumn('number', 'Succeed');
					  data.addColumn('number', 'Failed');
					  data.addColumn('number', 'Terminated');
					 
					  for(i = 0; i < xdata.length; i=i+4)
					    data.addRow([xdata[i], xdata[i+1], xdata[i+2], xdata[i+3]]);
					  // Create and draw the visualization.
				 	  /*  new google.visualization.BarChart(document.getElementById('chart_div1')).
					    draw(data, {});*/
					 
					  var tempArr = xdata;
					  tempArr.shift();
					//  console.log('tempArr');
					/*//  console.log(tempArr);
					  var arrmaxVal = tempArr.reduce(function(previous,current){ 
	                      return previous > current ? previous:current
	                   });*/
					//  alert(arrmaxVal);
					  var maxVal =  5*(Math.ceil(Math.abs(arrmaxVal/5)));
					// alert(maxVal);
					//  alert(maxVal)
					  maxVal=maxVal==0?5:maxVal;
					  var ingestionOptions2 = {
							  title : 'Ingestion Run Statistics',
							  vAxis: {title: 'Count'},
							  hAxis: {title: 'Date'},
							  seriesType: 'bars',
							  bar: {
								    groupWidth: 20
								},
							  series: {5: {type: 'line'}},
							  colors:[ '#008000', '#FF0000', '#FFA500'],
							  vAxis: {'gridlines': {count: 6},'viewWindow': {'max': maxVal}}
							};
					 
					  var ingestionChart = new google.visualization.ComboChart(document.getElementById('ingestion_runStatus_div'));
					  ingestionChart.draw(data, ingestionOptions2);
			}
			else {
				$scope.ingestionGraphrunStatusEmpty=true;
			}
			//console.log("$scope.ingestionGraphrunStatusEmpty")
			//console.log($scope.ingestionGraphDataEmpty)
			}).error(function(data, status) {
				if (status == 401) {
					$location.path('/');
				}
				$('#dashLoader').hide();
				$('#dashboardPage').show();
				
				$scope.data = data || "Request failed";
				$scope.status = status;
				//console.log("Failed");
			});
	}
	$scope.projectGraph = function() {
		//console.log("In projectGraph fn");
		var searchType="project";
		var graphType = "profileStatus";
		$scope.method = 'GET';
		$scope.url = 'rest/service/dashboard/getDashboardDetails/' + searchType+'/'+graphType;
		$http({
			method : $scope.method,
			url : $scope.url,
			headers : headerObj
		}).success(function(data, status) { 
		//	console.log("success");
			$('#dashLoader').hide();
			$('#dashboardPage').show();
			
		//	console.log(data);
			if(! jQuery.isEmptyObject(data)){
				//	console.log("proj not empty");
					var xdata = new Array();
					var ydata = new Array();
					var projectCreated=0;
					var projectUpdated=0;
					var projectDeleted=0;
                    var arrmaxVal=0;
					angular.forEach(data,function(y,x){
						xdata.push(x);
						projectCreated=0;
						projectUpdated=0;
						projectDeleted=0;
						angular.forEach(y,function(y2,x2){
							if (x2 == "CREATE"){
								projectCreated=y2;
							//	console.log("proj cre");
							//	console.log(y2)
							}
							else if(x2 == "UPDATE"){
								projectUpdated=y2;				
							}
							else if(x2 == "DELETE"){
								projectDeleted=y2;				
							}
                            arrmaxVal=y2>arrmaxVal?y2:arrmaxVal;
							//console.log(x2);
						});
						xdata.push(projectCreated);
						xdata.push(projectUpdated);
						xdata.push(projectDeleted);
					}); 
					 
					//  console.log(xdata);
					  var projData = new google.visualization.DataTable();
					  projData.addColumn('string', 'Year');
					  projData.addColumn('number', 'Created');
					  projData.addColumn('number', 'Updated');
					  projData.addColumn('number', 'Deleted');
					  for(i = 0; i < xdata.length; i=i+4)
						  projData.addRow([xdata[i], xdata[i+1], xdata[i+2], xdata[i+3]]);
					  // Create and draw the visualization.
				 	  /*  new google.visualization.BarChart(document.getElementById('chart_div1')).
					    draw(data, {});*/
					  var tempArr = xdata;
					  tempArr.shift();
					//  console.log('tempArr');
					//  console.log(tempArr);
					  /*var arrmaxVal = tempArr.reduce(function(previous,current){ 
	                      return previous > current ? previous:current
	                   });*/
					//  alert(arrmaxVal);
					  var maxVal =  5*(Math.ceil(Math.abs(arrmaxVal/5)));
					  maxVal=maxVal==0?5:maxVal;
					//  alert(maxVal);
					  var projectOptions = {
							  title : 'Project Statistics',
							  vAxis: {title: 'Count'},
							  hAxis: {title: 'Date'},
							  seriesType: 'bars',
							  bar: {
								    groupWidth: 20
								},
							  series: {5: {type: 'line'}},
							  colors:['#008000', '#0000FF', '#FF0000'],
							  vAxis: {'gridlines': {count: 6},'viewWindow': {'max': maxVal}}
							};
					  $('#profileLoader').hide();
					  var projectChart = new google.visualization.ComboChart(document.getElementById('project_chart_div'));
					  projectChart.draw(projData, projectOptions);
			}
			else {
				$scope.projectGraphDataEmpty=true;
			}
			//console.log("$scope.projectGraphDataEmpty")
		//	console.log($scope.projectGraphDataEmpty)
			}).error(function(data, status) {
				if (status == 401) {
					$location.path('/');
				}
				$('#dashLoader').hide();
				$('#dashboardPage').show();
				
				$scope.data = data || "Request failed";
				$scope.status = status;
			//	console.log("Failed");
			});
		var graphType = "runStatus";
		$scope.method = 'GET';
		$scope.url = 'rest/service/dashboard/getDashboardDetails/' + searchType+'/'+graphType;
		//http://localhost:8080/ZDP-Web/rest/service/dashboard/CallGraylogRestApi/admin
		$http({
			method : $scope.method,
			url : $scope.url,
			headers : headerObj
		}).success(function(data, status) { 
			//console.log("success");
		//	console.log(data);
			$('#dashLoader').hide();
			$('#dashboardPage').show();
			
			if(! jQuery.isEmptyObject(data)){
					var xdata = new Array();
					var ydata = new Array();
					var profileSuccess=0;
					var ingestionTerminated=0;
					var ingestionFailed=0;
                    var arrmaxVal=0;
					angular.forEach(data,function(y,x){
						xdata.push(x);
						profileSuccess=0;
						ingestionTerminated=0;
						ingestionFailed=0;
						angular.forEach(y,function(y2,x2){
							 if(x2 == "FAIL"){
								 ingestionFailed=y2;				
							}
							else if(x2 == "SUCCESS"){
								profileSuccess=y2;				
							}
							else if(x2 == "TERMINATE"){
								ingestionTerminated=y2;				
							}
                             arrmaxVal=y2>arrmaxVal?y2:arrmaxVal;
						//	console.log(x2);
						});
						xdata.push(profileSuccess);
						xdata.push(ingestionFailed);
						xdata.push(ingestionTerminated);
					});
					 
					//  console.log(xdata);
					  var data = new google.visualization.DataTable();
					  data.addColumn('string', 'Year');
					  data.addColumn('number', 'Succeed');
					  data.addColumn('number', 'Failed');
					  data.addColumn('number', 'Terminated');
					  for(i = 0; i < xdata.length; i=i+4)
					    data.addRow([xdata[i], xdata[i+1], xdata[i+2], xdata[i+3]]);
					  // Create and draw the visualization.-
				 	  /*  new google.visualization.BarChart(document.getElementById('chart_div1')).
					    draw(data, {});*/
					  var tempArr = xdata;
					  tempArr.shift();
					//  console.log('tempArr');
					//  console.log(tempArr);
					  /*var arrmaxVal = tempArr.reduce(function(previous,current){ 
	                      return previous > current ? previous:current
	                   });*/
					//  alert(arrmaxVal);
					  var maxVal =  5*(Math.ceil(Math.abs(arrmaxVal/5)));
					  maxVal=maxVal==0?5:maxVal;
					  var ingestionOptions = {
							  title : 'Project Run Statistics',
							  vAxis: {title: 'Count'},
							  hAxis: {title: 'Date'},
							  seriesType: 'bars',
							  vAxis: {'gridlines': {count: 6},'viewWindow': {'max': maxVal}},
							  bar: {
								    groupWidth: 20
								},
							  series: {5: {type: 'line'}},
							  colors:[ '#008000', '#FF0000', '#FFA500']
							  
							};
					 
					  var ingestionChart = new google.visualization.ComboChart(document.getElementById('project_runStatus_div'));
					  ingestionChart.draw(data, ingestionOptions);
			}
			else {
				$scope.projectGraphrunStatusEmpty=true;
			}
		//	console.log("$scope.ingestionGraphrunStatusEmpty")
		//	console.log($scope.ingestionGraphDataEmpty)
			}).error(function(data, status) {
				if (status == 401) {
					$location.path('/');
				}
				$('#dashLoader').hide();
				$('#dashboardPage').show();
				
				$scope.data = data || "Request failed";
				$scope.status = status;
			//	console.log("Failed");
			});
	}
	
	
	var stoprunStatus = $interval(function() {
		$scope.runningProcess();
		}, 10000);
	$scope.$on('$destroy', function() {
		// console.log('STOP');
		//$interval.cancel(stopTime);
		$interval.cancel(stoprunStatus);
		$interval.cancel(openrunStatus);
		
	});
	$scope.openRunDetails = function(type) {
		//alert(type);
		$scope.runType = type;
		$scope.method = 'GET';
		$scope.url = 'rest/service/dashboard/getRunningProcesses/'+$scope.runType;

		$http({
			method : $scope.method,
			url : $scope.url,
			headers : headerObj
		}).success(function(data, status) {
			$scope.status = status;
			//console.log(data);
			$scope.runningStatusData = data;
			if(openrunStatus)
				$interval.cancel(openrunStatus);
				openrunStatus = $interval(function() {
					$scope.openRunDetails($scope.runType);
			}, 10000);
			$('#runDetailmodal').modal('show');
			//console.log($scope.projectRun);
		}).error(function(data, status) {
			if (status == 401) {
				$location.path('/');
			}
			$scope.data = data || "Request failed";
			$scope.status = status;
		});
		
	}
	$scope.cancelStatusChk = function(){
		$interval.cancel(openrunStatus);
	}
	$scope.stopTheRun = function(runType,jobID){
		$('#' + jobID + 'loader').show();
		$scope.method = 'GET';
		$scope.url = 'rest/service/dashboard/stopRunningProcesses/'+runType+'/'+jobID;

		$http({
			method : $scope.method,
			url : $scope.url,
			headers : headerObj
		}).success(function(data, status) {
			setTimeout(function() { $('#' + jobID + 'loader').hide(); }, 8000);
			$scope.status = status;
			console.log(data);
			if(data == 'true'){
				$scope.runningProcess();
			}
			else{
				alert('Couldn\'t able to stop the run.');
			}
		}).error(function(data, status) {
			$('#' + jobID + 'loader').hide();
			if (status == 401) {
				$location.path('/');
			}
			$scope.data = data || "Request failed";
			$scope.status = status;
		});
		
	}
}