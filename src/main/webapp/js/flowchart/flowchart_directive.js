//
// Flowchart module.
//
angular.module('flowChart', ['dragging'] )

.service('authService',function($rootScope){
	
	this.rootscope=localStorage.getItem('itc.authToken');
	
})
//
// Directive that generates the rendered chart from the data model.
//
.directive('flowChart', function() {
  return {
  	restrict: 'E',
  	templateUrl: "views/flowchart_template.html",
  	replace: true,
  	scope: {
  		chart: "=chart",
  	},

  	//
  	// Controller for the flowchart directive.
  	// Having a separate controller is better for unit testing, otherwise
  	// it is painful to unit test a directive without instantiating the DOM 
  	// (which is possible, just not ideal).
  	//
  	controller: 'FlowChartController',
  };
})

//
// Directive that allows the chart to be edited as json in a textarea.
//
.directive('chartJsonEdit', function ($http, authService) {
	
	return {
		restrict: 'A',
		
		scope: {
			viewModel: "="
		},
		link: function (scope, elem, attr) {
			
			//
			// Serialize the data model as json and update the textarea.
			//
			var drawGraph=function (newJson){
				
				scope.data = {};
			//	scope.data.name = editDatastage.stagename;
				scope.data.type = 'DatapipeWorkbench';
			//	scope.data.jsonblob = angular.toJson(editDatastage);
				scope.method = 'GET';
				//console.log(authService.rootscope);
				/*console.log(newJson);*/
				scope.url = 'rest/service/' + scope.data.type+'/'+ selectedPipeId ;
				//console.log(scope.url);
				$http({
					method : scope.method,
					url : scope.url,
					//data : scope.data,
					headers : {
						'X-Auth-Token' : authService.rootscope
					}
				}).success(
						function(data, status) {
							scope.status = status;
							scope.data=data;
							var jsonData=angular.fromJson(scope.data.jsonblob);
					//	console.log("jsonData = "+ jsonData + " jsonData Execution Frequency =" +jsonData.ExecutionGraph);
						newJson = newJson.replace(/\n/g, "");
								console.log(newJson);	
						jsonData.ExecutionGraph= JSON.parse(newJson);;
						scope.data.type='DatapipeWorkbench';
						scope.data.jsonblob = angular.toJson(jsonData);
						scope.data.updatedBy = localStorage.getItem('itc.username');
						scope.data.updatedDate = new Date();
						scope.data.id = selectedPipeId;
						scope.method="POST";
						scope.url = 'rest/service/' + scope.data.type + '/' + selectedPipeId;
						

						$http({
							method : scope.method,
							url : scope.url,
							data : scope.data,
							headers : {
								'X-Auth-Token' : authService.rootscope
							}
						}).success(
								function(data, status) {
									scope.status = status;
//console.log("Success on POST, New JOSN = "+jsonData.ExecutionGraph);
								}).error(function(data, status) {
							scope.data = data || "Request failed";
							scope.status = status;

						});

						
						
						}).error(function(data, status) {
					scope.data = data || "Request failed";
					scope.status = status;

				});


				
				}
			
			var updateJson = function () {
				if (scope.viewModel) {
					var json = JSON.stringify(scope.viewModel.data, null, 4);
					$(elem).val(json);
					
					//drawGraph(json);
				}
			};
			
			//
			// First up, set the initial value of the textarea.
			//
			updateJson();

			//
			// Watch for changes in the data model and update the textarea whenever necessary.
			//
			scope.$watch("viewModel.data", updateJson, true);

			//
			// Handle the change event from the textarea and update the data model
			// from the modified json.
			//
			$(elem).bind("input propertychange", function () {
				var json = $(elem).val();
				var dataModel = JSON.parse(json);
				scope.viewModel = new flowchart.ChartViewModel(dataModel);
				
				scope.$digest();
				
			});
		}
	}

})

//
// Controller for the flowchart directive.
// Having a separate controller is better for unit testing, otherwise
// it is painful to unit test a directive without instantiating the DOM 
// (which is possible, just not ideal).
//
.controller('FlowChartController', ['$scope', 'dragging','$element','$http','$rootScope', function FlowChartController ($scope, dragging, $element,$http,$rootScope) {

	var controller = this;

	//
	// Reference to the document and jQuery, can be overridden for testting.
	//
	this.document = document;

	//
	// Wrap jQuery so it can easily be  mocked for testing.
	//
	this.jQuery = function (element) {
		return $(element);
	}

	//
	// Init data-model variables.
	//
	$scope.draggingConnection = false;
	$scope.connectorSize = 5;
	$scope.dragSelecting = false;
	/* Can use this to test the drag selection rect.
	$scope.dragSelectionRect = {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
	};
	*/

	//
	// Reference to the connection, connector or node that the mouse is currently over.
	//
	$scope.mouseOverConnector = null;
	$scope.mouseOverConnection = null;
	$scope.mouseOverNode = null;

	//
	// The class for connections and connectors.
	//
	this.connectionClass = 'connection';
	this.connectorClass = 'connector';
	this.nodeClass = 'node';

	//
	// Search up the HTML element tree for an element the requested class.
	//
	this.searchUp = function (element, parentClass) {

		//
		// Reached the root.
		//
		if (element == null || element.length == 0) {
			return null;
		}

		// 
		// Check if the element has the class that identifies it as a connector.
		//
		if (hasClassSVG(element, parentClass)) {
			//
			// Found the connector element.
			//
			return element;
		}

		//
		// Recursively search parent elements.
		//
		return this.searchUp(element.parent(), parentClass);
	};

	//
	// Hit test and retreive node and connector that was hit at the specified coordinates.
	//
	this.hitTest = function (clientX, clientY) {

		//
		// Retreive the element the mouse is currently over.
		//
		
		return this.document.elementFromPoint(clientX, clientY);
	};

	//
	// Hit test and retreive node and connector that was hit at the specified coordinates.
	//
	this.checkForHit = function (mouseOverElement, whichClass) {

		//
		// Find the parent element, if any, that is a connector.
		//
		var hoverElement = this.searchUp(this.jQuery(mouseOverElement), whichClass);
		if (!hoverElement) {
			return null;
		}

		return hoverElement.scope();
	};

	//
	// Translate the coordinates so they are relative to the svg element.
	//
	this.translateCoordinates = function(x, y) {
		var svg_elem =  $element.get(0);
		var matrix = svg_elem.getScreenCTM();
		var point = svg_elem.createSVGPoint();
		point.x = x;
		point.y = y;
		return point.matrixTransform(matrix.inverse());
		
	};

	
	$scope.drawGraph=function (){
		
		$scope.data = {};
	//	$scope.data.name = editDatastage.stagename;
		$scope.data.type = 'DatapipeWorkbench';
	//	$scope.data.jsonblob = angular.toJson(editDatastage);
		$scope.method = 'GET';
		//console.log(authService.root$scope);
		/*console.log(newJson);*/
		$scope.url = 'rest/service/' + $scope.data.type+'/'+ selectedPipeId ;
		//console.log($scope.url);
		$http({
			method : $scope.method,
			url : $scope.url,
			//data : $scope.data,
			headers : {
				'X-Auth-Token' : localStorage.getItem('itc.authToken')
			}
		}).success(
				function(data, status) {
					$scope.status = status;
					$scope.data=data;
					var jsonData=angular.fromJson($scope.data.jsonblob);
					var newJson = $('#textareaGraph').val();
					newJson = newJson.replace(/\n/g, "");
						//console.log(newJson);	
				jsonData.ExecutionGraph= JSON.parse(newJson);;
				var connectionDetails = jsonData.ExecutionGraph.connections;
			//	console.log(connectionDetails);
				var sourcedestDetails   = new Object();
				sourcedestDetails['stages'] = new Object();
				
				//connectionDetails = angular.fromJson(connectionDetails);
				//console.log(connectionDetails.length);
				var prevInput = '';
				if(connectionDetails.length > 0){
					for(i = 0;i<connectionDetails.length;i++){
						//console.log(connectionDetails[i]);
						sourcedestDetails['stages'][i] = new Object();
						if(connectionDetails[i].source.sourceNodeSchema != 'dataSet'){
							sourcedestDetails['stages'][i]["stageName"] = connectionDetails[i].source.nodeName;
							if(connectionDetails[i].source.destNodeSchema != 'dataSet'){
							sourcedestDetails['stages'][i]["output"] = connectionDetails[i].source.desnodeName
							}
							if(i > 0){
								if(sourcedestDetails['stages'][i]['input'] == undefined){
									sourcedestDetails['stages'][i]['input'] = '';
								}
								
								for(j=i;j>=0;j--){
									if(sourcedestDetails['stages'][j]["output"] == connectionDetails[i].source.nodeName){
										if(sourcedestDetails['stages'][i]['input'] != ''){
											if(connectionDetails[j].source.sourceNodeSchema != 'dataSet')
											sourcedestDetails['stages'][i]['input'] +=',' +connectionDetails[j].source.nodeName;
										}
										else{
											if(connectionDetails[j].source.sourceNodeSchema != 'dataSet')
											sourcedestDetails['stages'][i]['input'] = connectionDetails[j].source.nodeName;
										}
										
										//delete sourcedestDetails['stages'][i];
									}
									 
									
								}
								
							}
							else{
								sourcedestDetails['stages'][i]['input'] = "";
							}
							
							if(i == connectionDetails.length-1){
								sourcedestDetails['stages'][connectionDetails.length] = new Object();
								sourcedestDetails['stages'][connectionDetails.length]["output"] = ''
								sourcedestDetails['stages'][connectionDetails.length]["input"] = sourcedestDetails['stages'][connectionDetails.length - 1]["stageName"];
								sourcedestDetails['stages'][connectionDetails.length]["stageName"] = sourcedestDetails['stages'][connectionDetails.length - 1]["output"]
							}
						}
						
					}
					for(i = 1;i<connectionDetails.length;i++){
						for(j=i;j>=0;j--){
							if(sourcedestDetails['stages'][j]["stageName"] == sourcedestDetails['stages'][i]['stageName']){
								if(sourcedestDetails['stages'][j]['output'] != sourcedestDetails['stages'][i]['output']){
									if(sourcedestDetails['stages'][j]['output'] != ''){
										sourcedestDetails['stages'][j]['output'] += ','+sourcedestDetails['stages'][i]['output'];
									}
									else{
											ourcedestDetails['stages'][j]['output'] = sourcedestDetails['stages'][i]['output'];
										}
									if(sourcedestDetails['stages'][j]['input'] != ''){
									sourcedestDetails['stages'][j]['input'] += ','+sourcedestDetails['stages'][i]['input'];
									}
									else{
										sourcedestDetails['stages'][j]['input'] = sourcedestDetails['stages'][i]['input'];
										
									}
									delete sourcedestDetails['stages'][i]['input'];
									delete sourcedestDetails['stages'][i]['output'];
									delete sourcedestDetails['stages'][i]['stageName'];
									
								} 
								
							}
							
							/*if(sourcedestDetails['stages'][j]["output"] == sourcedestDetails['stages'][i]['output']){
								if(sourcedestDetails['stages'][j]['stageName'] != sourcedestDetails['stages'][i]['stageName']){
									sourcedestDetails['stages'][connectionDetails.length] = new Object();
									sourcedestDetails['stages'][connectionDetails.length]['input'] = sourcedestDetails['stages'][i]['input']+', '+sourcedestDetails['stages'][j]["input"];
									sourcedestDetails['stages'][j]['input'] += ','+sourcedestDetails['stages'][i]['input'];
								} 
								
							}*/
						}
						
					}
					for(j=i;j>=0;j--){
						if(sourcedestDetails['stages'][j] != undefined && sourcedestDetails['stages'][connectionDetails.length] != undefined){
							if(sourcedestDetails['stages'][j]["output"] == sourcedestDetails['stages'][connectionDetails.length]["stageName"]){
								if(sourcedestDetails['stages'][connectionDetails.length]["input"]!= ''){
									if(sourcedestDetails['stages'][connectionDetails.length]["input"] != sourcedestDetails['stages'][j]["stageName"])
									sourcedestDetails['stages'][connectionDetails.length]["input"] +=', ' +sourcedestDetails['stages'][j]["stageName"];
								}
								else{
									sourcedestDetails['stages'][connectionDetails.length]["input"] = sourcedestDetails['stages'][j]["stageName"];
								}
								
								//delete sourcedestDetails['stages'][i];
							}
							
						}
						
						 
						
					}
					$scope.newsourcedestDetails = new Array;
					$scope.newsourcedestDetails.stages = new Array;;
					i=0;	
					
					angular.forEach(sourcedestDetails['stages'], function(gattr) {
						if(gattr['stageName'] != undefined){
							
							//newsourcedestDetails.stages = gattr;
								$scope.newsourcedestDetails.stages.push(gattr);
						i++
						}
							
					});
				//	console.log($scope.newsourcedestDetails.stages);
					//newsourcedestDetails = angular.toJson(newsourcedestDetails)
					jsonData.stageList = new Object;
					jsonData.stageList.stages= $scope.newsourcedestDetails.stages;
				}
				/*console.log(sourcedestDetails.length);
				i=0;
				angular.forEach(sourcedestDetails['stages'], function(gattr) {
					console.log(gattr['stageName'])
					if(gattr['stageName'] == undefined){
						if(i > 0){
							delete sourcedestDetails['stages'][i];
						}
						
					i++
					}
				});*/
				/*for(i = 0;i<sourcedestDetails.length;i++){
					console.log('stage'+sourcedestDetails['stages'][i]['stageName']);  
					
				if(sourcedestDetails['stages'][i]['stageName'] == undefined){
					delete sourcedestDetails['stages'][i]
				}
				}*/
				//console.log(sourcedestDetails['stages'])
				
				
				//console.log(jsonData);
				$scope.data.type='DatapipeWorkbench';
				$scope.data.jsonblob = angular.toJson(jsonData);
				$scope.data.updatedBy = localStorage.getItem('itc.username');
				$scope.data.updatedDate = new Date();
				$scope.data.id = selectedPipeId;
				$scope.method="POST";
				$scope.url = 'rest/service/' + $scope.data.type + '/' + selectedPipeId;
				

				$http({
					method : $scope.method,
					url : $scope.url,
					data : $scope.data,
					headers : {
						'X-Auth-Token' : localStorage.getItem('itc.authToken')
					}
				}).success(
						function(data, status) {
							$scope.status = status;
//console.log("Success on POST, New JOSN = "+jsonData.ExecutionGraph);
						}).error(function(data, status) {
					$scope.data = data || "Request failed";
					scope.status = status;

				});

				
				
				}).error(function(data, status) {
			scope.data = data || "Request failed";
			scope.status = status;

		});


		
		}
	$scope.startPipeLine = function (){
		$scope.data = {};
		var errorC = 0;
		//	scope.data.name = editDatastage.stagename;
		$scope.data.type = 'DatapipeWorkbench';
		//	scope.data.jsonblob = angular.toJson(editDatastage);
		$scope.method = 'GET';
			//console.log(authService.rootscope);
			/*console.log(newJson);*/
		$scope.url = 'rest/service/' + $scope.data.type+'/'+ selectedPipeId ;
			//console.log(scope.url);
			$http({
				method : $scope.method,
				url : $scope.url,
				//data : scope.data,
				headers : {
					'X-Auth-Token' : localStorage.getItem('itc.authToken')
				}
			}).success(
					function(data, status) {
						$scope.status = status;
						$scope.data=data;
					//	alert(data);
						var jsonData=angular.fromJson($scope.data.jsonblob);
						var datasetC = 0;
						angular.forEach(jsonData.ExecutionGraph.nodes, function(gattr) {
							if(gattr.nodeSchema == 'dataSet'){
								datasetC++;
							}
						});
						if(datasetC == 0){
							alert('please add dataset');	
						//	errorC++;
							return false;
						}
						else if(jsonData.ExecutionGraph.connections == ''){
							alert('please add one connection');
						//	errorC++;
							return false;
						}
						//alert(errorC);
						//if(errorC == 0){
							$scope.data = {};
							$scope.data.type = 'pipeline';
							$scope.method = 'GET';
							$scope.url = 'rest/service/' + $scope.data.type+'/DatapipeWorkbench/'+ selectedPipeId ;
								//console.log(scope.url);
								$http({
									method : $scope.method,
									url : $scope.url,
									//data : scope.data,
									headers : {
										'X-Auth-Token' : localStorage.getItem('itc.authToken')
									}
								}).success(
										function(data, status) {
											$scope.status = status;
											$scope.data=data;
											$scope.runstatus = data;
										//	alert($scope.runstatus);
											$('#runStatus').html($scope.runstatus);
										}).error(function(data, status) {
											$scope.data = data || "Request failed";
											$scope.status = status;

								});
						//}

					
											
					}).error(function(data, status) {
						$scope.data = data || "Request failed";
						$scope.status = status;

			});
					

	}
	//
	// Called on mouse down in the chart.
	//
	$scope.mouseDown = function (evt) {

		$scope.chart.deselectAll();

		dragging.startDrag(evt, {

			//
			// Commence dragging... setup variables to display the drag selection rect.
			//
			dragStarted: function (x, y) {
				$scope.dragSelecting = true;
				var startPoint = controller.translateCoordinates(x, y);
				$scope.dragSelectionStartPoint = startPoint;
				$scope.dragSelectionRect = {
					x: startPoint.x,
					y: startPoint.y,
					width: 0,
					height: 0,
				};
				
			},

			//
			// Update the drag selection rect while dragging continues.
			//
			dragging: function (x, y) {
				var startPoint = $scope.dragSelectionStartPoint;
				var curPoint = controller.translateCoordinates(x, y);

				$scope.dragSelectionRect = {
					x: curPoint.x > startPoint.x ? startPoint.x : curPoint.x,
					y: curPoint.y > startPoint.y ? startPoint.y : curPoint.y,
					width: curPoint.x > startPoint.x ? curPoint.x - startPoint.x : startPoint.x - curPoint.x,
					height: curPoint.y > startPoint.y ? curPoint.y - startPoint.y : startPoint.y - curPoint.y,
				};
				
			},

			//
			// Dragging has ended... select all that are within the drag selection rect.
			//
			dragEnded: function () {
				$scope.dragSelecting = false;
				$scope.chart.applySelectionRect($scope.dragSelectionRect);
				delete $scope.dragSelectionStartPoint;
				delete $scope.dragSelectionRect;
			},
		});
		$scope.drawGraph();
	};

	//
	// Called for each mouse move on the svg element.
	//
	$scope.mouseMove = function (evt) {

		//
		// Clear out all cached mouse over elements.
		//
		$scope.mouseOverConnection = null;
		$scope.mouseOverConnector = null;
		$scope.mouseOverNode = null;

		var mouseOverElement = controller.hitTest(evt.clientX, evt.clientY);
		if (mouseOverElement == null) {
			// Mouse isn't over anything, just clear all.
			return;
		}

		if (!$scope.draggingConnection) { // Only allow 'connection mouse over' when not dragging out a connection.

			// Figure out if the mouse is over a connection.
			
			var scope = controller.checkForHit(mouseOverElement, controller.connectionClass);
			$scope.mouseOverConnection = (scope && scope.connection) ? scope.connection : null;
			if ($scope.mouseOverConnection) {
				// Don't attempt to mouse over anything else.
				return;
			}
		}

		// Figure out if the mouse is over a connector.
		var scope = controller.checkForHit(mouseOverElement, controller.connectorClass);
		$scope.mouseOverConnector = (scope && scope.connector) ? scope.connector : null;
		if ($scope.mouseOverConnector) {
			// Don't attempt to mouse over anything else.
			return;
		}

		// Figure out if the mouse is over a node.
		var scope = controller.checkForHit(mouseOverElement, controller.nodeClass);
		$scope.mouseOverNode = (scope && scope.node) ? scope.node : null;		
	};

	//
	// Handle mousedown on a node.
	//
	$scope.nodeMouseDown = function (evt, node) {

		var chart = $scope.chart;
		var lastMouseCoords;

		dragging.startDrag(evt, {

			//
			// Node dragging has commenced.
			//
			dragStarted: function (x, y) {

				lastMouseCoords = controller.translateCoordinates(x, y);

				//
				// If nothing is selected when dragging starts, 
				// at least select the node we are dragging.
				//
				if (!node.selected()) {
					chart.deselectAll();
					node.select();
				}
			},
			
			//
			// Dragging selected nodes... update their x,y coordinates.
			//
			dragging: function (x, y) {

				var curCoords = controller.translateCoordinates(x, y);
				var deltaX = curCoords.x - lastMouseCoords.x;
				var deltaY = curCoords.y - lastMouseCoords.y;

				chart.updateSelectedNodesLocation(deltaX, deltaY);

				lastMouseCoords = curCoords;
			},

			//
			// The node wasn't dragged... it was clicked.
			//
			clicked: function () {
				chart.handleNodeClicked(node, evt.ctrlKey);
			},
			dragEnded: function () {
				$scope.drawGraph();
			},

		});
		

	
	};

	//
	// Handle mousedown on a connection.
	//
	$scope.connectionMouseDown = function (evt, connection) {
		var chart = $scope.chart;
		chart.handleConnectionMouseDown(connection, evt.ctrlKey);

		// Don't let the chart handle the mouse down.
		evt.stopPropagation();
		evt.preventDefault();
	};

	//
	// Handle mousedown on an input connector.
	//
	$scope.connectorMouseDown = function (evt, node, connector, connectorIndex, isInputConnector) {

		//
		// Initiate dragging out of a connection.
		//
		dragging.startDrag(evt, {

			//
			// Called when the mouse has moved greater than the threshold distance
			// and dragging has commenced.
			//
			dragStarted: function (x, y) {

				var curCoords = controller.translateCoordinates(x, y);				

				$scope.draggingConnection = true;
				$scope.dragPoint1 = flowchart.computeConnectorPos(node, connectorIndex, isInputConnector);
				$scope.dragPoint2 = {
					x: curCoords.x,
					y: curCoords.y
				};
				$scope.dragTangent1 = flowchart.computeConnectionSourceTangent($scope.dragPoint1, $scope.dragPoint2);
				$scope.dragTangent2 = flowchart.computeConnectionDestTangent($scope.dragPoint1, $scope.dragPoint2);
			},

			//
			// Called on mousemove while dragging out a connection.
			//
			dragging: function (x, y, evt) {
				var startCoords = controller.translateCoordinates(x, y);				
				$scope.dragPoint1 = flowchart.computeConnectorPos(node, connectorIndex, isInputConnector);
				$scope.dragPoint2 = {
					x: startCoords.x,
					y: startCoords.y
				};
				$scope.dragTangent1 = flowchart.computeConnectionSourceTangent($scope.dragPoint1, $scope.dragPoint2);
				$scope.dragTangent2 = flowchart.computeConnectionDestTangent($scope.dragPoint1, $scope.dragPoint2);
			},

			//
			// Clean up when dragging has finished.
			//
			dragEnded: function () {
				$scope.drawGraph();
				if ($scope.mouseOverConnector && 
					$scope.mouseOverConnector !== connector) {

					//
					// Dragging has ended...
					// The mouse is over a valid connector...
					// Create a new connection.
					//
					
					$scope.chart.createNewConnection(connector, $scope.mouseOverConnector);
				}

				$scope.draggingConnection = false;
				delete $scope.dragPoint1;
				delete $scope.dragTangent1;
				delete $scope.dragPoint2;
				delete $scope.dragTangent2;
			},
			


		});
	};
}])
;
