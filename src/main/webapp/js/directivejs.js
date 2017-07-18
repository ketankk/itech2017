userApp.directive('confirmOnExit', function() {
    return {
        link: function($scope, elem, attrs) {
            window.onbeforeunload = function(){
                if ($scope.myFormText.$dirty) {
                    return "The form is dirty, do you want to stay on the page?";
                }
            }
            $scope.$on('$locationChangeStart', function(event, next, current) {
            	//console.log($scope.myFormText.$dirty)
                if ($scope.myFormText.$dirty) {
                    if(!confirm("You have some unsave data.Do you want to save them?")) {
                      // alert('hi');
                       
                    }
                    else{
                    	 $scope.saveGraph();
                    	 event.preventDefault();
                    }
                }
            });
        }
    };
});
userApp.directive('pieChart', function($timeout) {
	return {
		restrict : 'EA',
		scope : {
			title : '@title',
			width : '@width',
			height : '@height',
			data : '=data',
			selectFn : '&select'
		},
		link : function($scope, $elm, $attr) {

			// Create the data table and instantiate the chart
			var data = new google.visualization.DataTable();
			data.addColumn('string', 'Label');
			data.addColumn('number', 'Value');
			var chart = new google.visualization.PieChart($elm[0]);

			draw();

			// Watches, to refresh the chart when its data, title or dimensions
			// change
			$scope.$watch('data', function() {
				draw();
			}, true); // true is for deep object equality checking
			$scope.$watch('title', function() {
				draw();
			});
			$scope.$watch('width', function() {
				draw();
			});
			$scope.$watch('height', function() {
				draw();
			});

			// Chart selection handler
			google.visualization.events.addListener(chart, 'select',
					function() {
						var selectedItem = chart.getSelection()[0];
						// console.log(selectedItem)
						if (selectedItem) {
							$scope.$apply(function() {
								$scope.selectFn({
									selectedRowIndex : selectedItem.row
								});
							});
						}
					});

			function draw() {
				if (!draw.triggered) {
					draw.triggered = true;
					$timeout(function() {
						draw.triggered = false;
						var label, value;
						data.removeRows(0, data.getNumberOfRows());
						angular.forEach($scope.data, function(row) {
							label = row[0];
							value = parseFloat(row[1], 10);
							if (!isNaN(value)) {
								data.addRow([ row[0], value ]);
							}
						});
						var options = {
							'title' : $scope.title,
							'width' : $scope.width,
							'height' : $scope.height,
							// is3D: true,
							// legend: 'none',
							pieSliceText : 'none',
						};
						chart.draw(data, options);
						// No raw selected
						$scope.selectFn({
							selectedRowIndex : undefined
						});
					}, 0, true);
				}
			}
		}
	};
});
userApp.directive("contenteditable", function() {
	return {
		require : "ngModel",
		link : function(scope, element, attrs, ngModel) {

			function read() {
				ngModel.$setViewValue(element.html());
			}

			ngModel.$render = function() {
				element.html(ngModel.$viewValue || "");
			};

			element.bind("blur keyup change", function() {
				scope.$apply(read);
			});
		}
	};
});
userApp.factory('myService', function() {
	var savedData = {}
	function set(data) {
		savedData = data;
	}
	function get() {
		return savedData;
	}

	return {
		set : set,
		get : get
	}

});
userApp.directive("checkboxGroup", function() {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
        	//console.log(scope)
            // Determine initial checked boxes
        	//console.log(elem[0]);
            if (scope.colArray.indexOf(scope.v.name) !== -1) {
                elem[0].checked = true;
            }
            //console.log(scope.colArray1.indexOf(scope.v));
            if (scope.colArray1.indexOf(scope.v.name) !== -1) {
                elem[0].checked = true;
            }
            else{
            	 elem[0].checked = false;
            }
          //  console.log(scope.colArray1.indexOf(scope.v.name));
            // Update array on click
            elem.bind('click', function() {
                var index = scope.colArray.indexOf(scope.v.name);
              //  console.log(index);
                // Add if checked
                if (elem[0].checked) {
                    if (index === -1) scope.colArray.push(scope.v.name);
                    
                }
                // Remove if unchecked
                else {
                    if (index !== -1) scope.colArray.splice(index, 1);
                }
                // Sort and update DOM display
               /* scope.$apply(scope.colArray.sort(function(a, b) {
                    return a - b
                }));*/
             //   console.log('inside');
              //  console.log(scope.colArray1)
             //   console.log(scope.v.name);
                var index1 = -1;
                for (var i=0; i < scope.colArray1.length; i++) {
                    if (scope.colArray1[i].name === scope.v.name) {
                    	index1 = i;
                    }
                }
               // var index1 = scope.colArray1.indexOf(scope.v.name);
             //   console.log(index1);
              //  console.log(index);
                // Add if checked
                if (elem[0].checked) {
                    if (index1 === -1) scope.colArray1.push(scope.v);
                    
                }
                // Remove if unchecked
                else {
                    if (index1 !== -1) scope.colArray1.splice(index1, 1);
                }
                // Sort and update DOM display
               scope.$apply(scope.colArray1.sort(function(a, b) {
                    return a - b
                }));
            });
        }
    }
});
userApp.directive('focusMe', function($timeout, $parse) {
	return {
		link : function(scope, element, attrs) {
			var model = $parse(attrs.focusMe);
			// console.log(model);
			scope.$watch(model, function(value) {
				// console.log('value=',value);
				// if(value === true) {
				$timeout(function() {
					element[0].focus();
				});
				// }
			});
			element.bind('blur', function() {
				// console.log('blur')
				// scope.$apply(model.assign(scope, false));
			})
		}
	};
});

userApp.directive('fixedTableHeaders', [ '$timeout', fixedTableHeaders ]);

function fixedTableHeaders($timeout) {
	return {
		restrict : 'A',
		link : link
	};

	function link(scope, element, attrs) {

		$timeout(function() {
			element.stickyTableHeaders();
		}, 0);
	}
}
userApp
		.directive(
				'myDirective',
				function(myService, $rootScope, $http, $templateCache,
						$location) {
					
					return function(scope, element, attrs) {
//						$scope.pageURL = $location.path();
						
						scope.fetchDetails = function(idOrUserName, userdetails) {
							
							if (userdetails != undefined) {
								
								scope.method = 'GET';
								scope.url = 'rest/service/usergroup/getUser/' + idOrUserName;

								$http(
										{
											method : scope.method,
											url : scope.url,
											//cache : $templateCache,
											headers : headerObj
										})
										.success(
												function(data, status) {
													//console.log("fetchDetails success-data")
													//console.log(data);
													scope.status = status;
													scope.data = data;
													if (scope.data.name != undefined) {
														var dispName = scope.data.name;
														var dispNameArray = dispName
																.split(' ');
														scope.data.firstName = dispNameArray[0];
														scope.data.lastName = dispNameArray[1];

													}
													var i=0;
													angular.forEach(scope.data.userGroupList,function(value){
															var tempObj = new Object();
															tempObj.groupName=value.groupName;
															tempObj.permissionLevevl=value.permissionLevevl;
															tempObj.grpWrite=false;
															tempObj.grpEx=false;
															if (value.permissionLevevl == 6 || value.permissionLevevl == 7){
																tempObj.grpWrite=true;
															}
															if (value.permissionLevevl == 5 || value.permissionLevevl == 7){
																tempObj.grpEx=true;
															}
															scope.data.userGroupList[i]=tempObj;
															//console.log("tempObj");
															//console.log(tempObj);
														i++
													})
													//console.log("scope.data");
													//console.log(scope.data);
												})
										.error(
												function(data, status) {
													scope.data = data
															|| "Request failed";
													scope.status = status;
												});
							} else {
								scope.method = 'GET';
								scope.url = 'rest/service/' + scope.type + '/'
										+ idOrUserName;

								$http(
										{
											method : scope.method,
											url : scope.url,
											data : scope.data,
											//cache : $templateCache,
											headers : headerObj
										})
										.success(
												function(data, status) {
													scope.status = status;
													scope.data = data;
													scope.jData = angular
															.fromJson(scope.data.jsonblob);
												//	scope.data.createdDate = getDateFormat(scope.data.createdDate);
													//scope.data.updatedDate = getDateFormat(scope.data.updatedDate);
												})
										.error(
												function(data, status) {
													scope.data = data
															|| "Request failed";
													scope.status = status;
												});
							}

						};

						scope.deleteRecord = function(id, odjDel) {
							scope.method = 'DELETE';
							 //console.log(id);
							if (odjDel.schemaType == 'project' || odjDel.schemaType == 'module') {
								//console.log(odjDel.schemaType);
									scope.url = 'rest/service/deleteObject';
									scope.method = 'POST';
									scope.data = {}
									scope.data.id = odjDel.id;
									scope.data.schemaType = odjDel.schemaType;
									scope.data.version = odjDel.version
									$http(
											{
												method : scope.method,
												url : scope.url,
												data : scope.data,
												//cache : $templateCache,
												headers : headerObj
											}).success(
											function(data, status) {
												scope.status = status;
												scope.data = data;
												schemaSourceDetails(myService,
														scope, $http,
														$templateCache, $rootScope,
														$location, odjDel.schemaType);
												odjDel.isRowHidden = true
												$('#deleteConfirmModal').modal(
														'hide');

											}).error(function(data, status) {
												if (status == 401) {
													$location.path('/');
												}
										scope.data = data || "Request failed";
										scope.status = status;
									});
								} 
							 else if (odjDel.grpprofile == true) {
									//console.log("Calling the delete controller");
									scope.url = 'rest/service/usergroup/deletegroup/' + id;
									$http(
											{
												method : scope.method,
												url : scope.url,
												data : scope.data,
												//cache : $templateCache,
												headers : headerObj
											}).success(
											function(data, status) {
												//console.log("Delete Success");
												scope.status = status;
												scope.data = data;
												schemaSourceDetails(myService,
														scope, $http,
														$templateCache, $rootScope,
														$location);
												odjDel.isRowHidden = true
												$('#deleteConfirmModal').modal(
														'hide');

											}).error(function(data, status) {
												if (status == 401) {
													$location.path('/');
												}
										scope.data = data || "Request failed";
										scope.status = status;
									});
								 }
							 else if (odjDel.profile != true
									&& odjDel.userprofile != true) {
								scope.url = 'rest/service/' + id;
								$http(
										{
											method : scope.method,
											url : scope.url,
											data : scope.data,
											//cache : $templateCache,
											headers : headerObj
										}).success(
										function(data, status) {
											scope.status = status;
											scope.data = data;
											schemaSourceDetails(myService,
													scope, $http,
													$templateCache, $rootScope,
													$location);
											schemaSourceDetails(myService,
													scope, $http,
													$templateCache, $rootScope,
													$location, 'DataSet');
											odjDel.isRowHidden = true
											$('#deleteConfirmModal').modal(
													'hide');

										}).error(function(data, status) {
											if (status == 401) {
												$location.path('/');
											}
									scope.data = data || "Request failed";
									scope.status = status;
								});
							} else if (odjDel.userprofile == true) {
								scope.url = 'rest/service/deleteUser/' + id;
								$http(
										{
											method : scope.method,
											url : scope.url,
											data : scope.data,
											//cache : $templateCache,
											headers : headerObj
										}).success(
										function(data, status) {
											scope.status = status;
											scope.data = data;
											schemaSourceDetails(myService,
													scope, $http,
													$templateCache, $rootScope,
													$location);
											odjDel.isRowHidden = true
											$('#deleteConfirmModal').modal(
													'hide');

										}).error(function(data, status) {
											if (status == 401) {
												$location.path('/');
											}
									scope.data = data || "Request failed";
									scope.status = status;
								});
							}
							else {
								scope.method = 'POST';
								scope.url = 'rest/service/moveToArchive';
								scope.profileDelete = new Object();
								scope.profileDelete.jsonblob = odjDel.datasetID+','+odjDel.datasourceid+','+odjDel.schemaId+','+id;
								scope.profileDelete.location = odjDel.dataSetTargetPath;
								scope.profileDelete.name = odjDel.schemaName;
								scope.profileDelete.createdBy = odjDel.user;
								$http(
										{
											method : scope.method,
											url : scope.url,
											data : scope.profileDelete,
											//cache : $templateCache,
											headers : headerObj
										}).success(function(data, status) {
												scope.status = status;
												scope.data = data;
											//	scope.delFail = false;
												odjDel.isRowHidden = true
												$('#deleteConfirmModal').modal('hide');
												scope.url = 'rest/service/moveDataToArchive';
												$http(
														{
															method : scope.method,
															url : scope.url,
															data : scope.profileDelete,
															//cache : $templateCache,
															headers : headerObj
														}).success(function(data, status) {
																scope.status = status;
																scope.data = data;
															//	scope.delFail = false;
																odjDel.isRowHidden = true
			
												}).error(function(data, status) {
													$('#schemarunID').html(data);
													if (status == 401) {
														$location.path('/');
													}
													//scope.delFail = true;
													$('#deleteConfirmModal').modal('hide');
													scope.data = data || "Request failed";
													scope.status = status;
												});

								}).error(function(data, status) {
									if (status == 401) {
										$location.path('/');
									}
									//scope.delFail = true;
									$('#deleteConfirmModal').modal('hide');
									$('#schemarunID').html($scope.restoreData);
									scope.data = data || "Request failed";
									scope.status = status;
									
								});
								
							}

						}
					};
				});
userApp.filter('startFrom', function () {
	return function (input, start) {
		if (input) {
			start = +start;
			return input.slice(start);
		}
		return [];
	};
});
userApp.directive('postsPagination', function(){  
	   return{
	      restrict: 'E',
	      template: '<ul class="pagination">'+
	        '<li ng-show="currentPage != 1"><a href="javascript:void(0)" ng-click="getLogDetails(\'prev\')">&laquo;</a></li>'+
	        '<li ng-show="currentPage != 1"><a href="javascript:void(0)" ng-click="getLogDetails(\'prev\')">&lsaquo; Prev</a></li>'+
	        /*'<li ng-repeat="i in range" ng-class="{active : currentPage == i}">'+
	            '<a href="javascript:void(0)" ng-click="getLogDetails(i)">{{i}}</a>'+
	        '</li>'+*/
	        '<li ng-show="totalPages > 0"><a href="javascript:void(0)" ng-click="getLogDetails(\'next\')">Next &rsaquo;</a></li>'+
	        '<li ng-show="totalPages > 0"><a href="javascript:void(0)" ng-click="getLogDetails(\'next\')">&raquo;</a></li>'+
	      '</ul>'
	   };
	});
