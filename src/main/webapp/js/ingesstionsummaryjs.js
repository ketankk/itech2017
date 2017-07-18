var ingesstionsummary = function(myService, $scope, $http, $templateCache,
		$location, $rootScope, $route, $upload, $filter) {
	$scope.desiredLocation = myService.get();
	
	//console.log('delocation:'+JSON.stringify($scope.desiredLocation,null,4));

	$scope.desiredLocation.fileData.uploadType=$scope.desiredLocation.filetype;
	/*console.log('upload type inside file data:'+$scope.desiredLocation.fileData.uploadType);
	console.log('filedata:'+JSON.stringify($scope.desiredLocation.fileData,null,4));*/
	$scope.schemaPage = new Object();
	/*if(newSchemaName !=undefined){*/
		$('#profileLoader').hide();
		$('#ingesstionsummaryID').show();
		
	/*}else
		$('#profileLoader').show();*/
	//$scope.schemaPage.datapreview = new object();
	//console.log($scope.desiredLocation);
	$scope.schemaPage.fileData = $scope.desiredLocation.fileData;
	$scope.firstColumn=new Array();
	$scope.secondColumn=new Array();
	$scope.finalView=new Array();
	//console.log($scope.desiredLocation);
	/*for(var i=0;i<$scope.desiredLocation.dataAttribute.length;i++){
		firstColumn.push($scope.desiredLocation.dataAttribute.Name);
	}*/
	angular.forEach($scope.desiredLocation.dataAttribute, function(value, key) {
	    /* do something for all key: value pairs */
		//console.log(value.Name);
		$scope.firstColumn.push(value.Name);
		$scope.secondColumn.push(value.dataType);
	});
	
	$scope.finalView.push($scope.firstColumn);
	$scope.finalView.push($scope.secondColumn);
	angular.forEach($scope.desiredLocation.datapreviewprev, function(value, key) {
	    /* do something for all key: value pairs */
		//console.log(key);
		$scope.finalView.push(value);
	});
	//console.log($scope.firstColumn);
	//$scope.schemaPage.datapreview = $scope.desiredLocation.dataAttribute.concat($scope.desiredLocation.datapreviewprev);
	
	//$scope.finalView.push($scope.desiredLocation.datapreviewprev);
	$scope.schemaPage.datapreview = $scope.finalView;
	//console.log($scope.finalView)
	 $scope.backoparation = function() {
		//$location.path("/DataSchema/");
		//console.log($scope.desiredLocation);
		backbutton=true;
		//console.log($scope.schemaPage);
		$scope.schemaPage.description=$scope.desiredLocation.description;
		console.log($scope.schemaPage)
		myService.set($scope.schemaPage);
		//$scope.previewpage = myService.get();
		//$scope.datapreview = $scope.previewpage.datapreview;
		$location.path("/DataSchemaPreview/");
		
	}
	
	$scope.editData = new Object();
	var userName=localStorage.getItem('itc.username')
	if ($scope.desiredLocation.encryptionData.isEncryptionAvailable == false){
		$scope.editData.setPath=$scope.desiredLocation.encryptionData.datasetRootPath.concat('/',userName,'/',$scope.desiredLocation.name,'/')
	}
	else if ($scope.desiredLocation.encryptionData.isEncryptionAvailable == true && $scope.desiredLocation.isEncrypted == true){
		$scope.editData.setPath=$scope.desiredLocation.encryptionData.encryptionZonePath.concat('/',userName,'/',$scope.desiredLocation.name,'/')
	}
	else {
		$scope.editData.setPath=$scope.desiredLocation.encryptionData.datasetRootPath.concat('/',userName,'/',$scope.desiredLocation.name,'/')
	}
	// $scope.editData.sourcePath = $scope.desiredLocation.fileName;
	// $scope.editData.setPath = $scope.desiredLocation.setPath;
	$scope.sourcenamenotok = false;
	$scope.hdfsPathAcess = false;
	$scope.dataError = '';
	// $scope.sourcenameOk = false;
	// console.log($scope.sourcenamenotok);
	
	$scope.editData.dataSchemaType = $scope.desiredLocation.dataSchemaType;
	newSchemaName = $scope.desiredLocation.newSchemaName;
	//console.log(newSchemaName);
	$scope.frequencyArr = [ "One Time", "Hourly", "Daily", "Weekly" ];
	typeFormatFetch($scope, $http, $templateCache, $rootScope, $location,
			'Format', 'DataSource')
	// console.log($scope.desiredLocation.fileName);
	$scope.chksourcePath = function(sourcePath) {
		// alert(sourcePath);

		if (sourcePath != undefined) {
			$scope.method = 'POST'
			$scope.sourcePath = new Object();
			$scope.url = 'rest/service/sourceLocationCheck/';
			$scope.sourcePath.name = sourcePath;
			$http({
				method : $scope.method,
				url : $scope.url,
				data : $scope.sourcePath,
				// cache : $templateCache
				headers : headerObj
			}).success(function(data, status) {
				$scope.status = status;
				if (data == 'true') {
					$scope.sourcenamenotok = true;
				} else if (data == 'false') {
					$scope.sourcenamenotok = false;
				}
				// datapreview = data
			}).error(function(data, status) {
				if (status == 401) {
					$location.path('/');
				}
			});

		}
	}
	$scope.chkTargetHDFSPathAcess = function(hdfsPath, editData) {
		// alert(hdfsPath);
		$scope.dataError = '';
		if (hdfsPath != undefined) {
			$scope.method = 'POST'
			$scope.hdfsPath = new Object();
			$scope.url = 'rest/service/verifyTargetHDFSPathAcess/';
			$scope.hdfsPath.location = hdfsPath;
			$http({
				method : $scope.method,
				url : $scope.url,
				data : $scope.hdfsPath,
				// cache : $templateCache
				headers : headerObj
			}).success(function(data, status) {
				$scope.status = status;
				// console.log(data);
				$scope.hdfsPathAcess = false;
				$scope.savefullIngenstion(editData);
				// datapreview = data
			}).error(function(data, status) {
				if (status == 401) {
					$location.path('/');
				}
				$scope.hdfsPathAcess = true;
				$scope.dataError = data;
				// $scope.savefullIngenstion(editData);
				// console.log($scope.dataError);

			});

		}
	}
	//console.log($scope.desiredLocation.dataSchemaType);
	if ($scope.desiredLocation.dataSchemaType == 'Automatic') {
		if ($scope.desiredLocation.fileName != undefined) {
			var re = /(?:\.([^.]+))?$/;
			var format = re.exec($scope.desiredLocation.fileName)[1];
			format = format.toUpperCase();
			$scope.editData.format = format;

			var urlstr = $scope.desiredLocation.fileName;
			var r = /[^\/]*$/;
			urlstr = urlstr.replace(r, ''); // '/this/is/a/folder/'
			// console.log(urlstr);
			$scope.editData.sourcePath = urlstr;

		} else {
			if($scope.desiredLocation.filetype == 'fileUpload'){
				 } 
			else {
				// console.log('ENTER');
				$scope.editData.fileData = new Object();
				$scope.editData.fileData = angular
						.fromJson($scope.desiredLocation.fileData);
				// console.log($scope.editData.fileData)
				var format = $scope.editData.fileData.dbType;
				format = format.toUpperCase();
				// console.log(format);
				$scope.editData.format = format;
				if ($scope.editData.format == 'MYSQL') {
					$scope.editData.format = 'MySQL'
				}
				// console.log($scope.editData.format)
				$scope.editData.sourcePath = 'RDBMS';
			}
		}
	}
	else if ($scope.desiredLocation.dataSchemaType == 'Manual') {
		$scope.editData.fileData = new Object();
		$scope.editData.fileData = angular
				.fromJson($scope.desiredLocation.fileData);
		// console.log($scope.editData.fileData[0].dbType)
		var format = $scope.editData.fileData.fileType;
		//format = format.toUpperCase();
		//console.log(format);
		$scope.editData.format = format;
		if ($scope.editData.format == 'MYSQL') {
			$scope.editData.format = 'MySQL'
		}
		
		// console.log($scope.editData.format)
	//	$scope.editData.sourcePath = 'RDBMS';
	}
		
	$scope.editData.frequency = $scope.frequencyArr[0];

	$scope.resetField = function() {
		if ($scope.editData.frequency == 'One Time') {
			$scope.editData.startBatch = '';
			$scope.editData.endBatch = '';
			// console.log($scope.editData.startBatch)
		}

	}
	$scope.cancelIngestion = function() {
		$location.path('/DataSchema/');
	}
	$scope.savefullIngenstion = function(editData) {
		// alert('hiii');
		// $scope.chkTargetHDFSPathAcess(editData.setPath);
		//console.log($scope.desiredLocation)
		//console.log($scope.desiredLocation.fileData);
		
		$scope.dataschema = new Object();
		$scope.editdataschema = new Object();
		$scope.editdataschema.dataAttribute = new Array();
		$scope.editdataschema.dataAttribute.Name = new Object();
		$scope.editdataschema.dataSchemaType = $scope.desiredLocation.dataSchemaType;
		// console.log($scope.desiredLocation);

		//console.log($scope.dataError);

		$scope.editdataschema.description = $scope.desiredLocation.description;
		if ($scope.desiredLocation.dataSchemaType == 'Manual') {
			$scope.editdataschema.jsonblob = angular
					.fromJson($scope.desiredLocation.jsonblob);
			$scope.editdataschema.jsonblob.dataSchemaType = $scope.desiredLocation.dataSchemaType;
			$scope.editdataschema.jsonblob.name = $scope.desiredLocation.name;
			$scope.desiredLocation.newSchemaName = $scope.desiredLocation.name;
			$scope.editdataschema.fileData = $scope.desiredLocation.fileData;
			$scope.editdataschema.jsonblob.fileData = $scope.desiredLocation.fileData;
			if ($scope.desiredLocation.xmlEndTag != undefined){
				$scope.editdataschema.jsonblob.xmlEndTag = $scope.desiredLocation.xmlEndTag;
				$scope.editdataschema.xmlEndTag = $scope.desiredLocation.xmlEndTag;
			}
				
			$scope.dataschema.jsonblob = angular
					.toJson($scope.editdataschema.jsonblob);
		} else if ($scope.desiredLocation.dataSchemaType == 'Automatic') {
			// console.log($scope.desiredLocation.fileData);
			$scope.editdataschema.dataAttribute.dataType = new Object()
			$scope.editdataschema.dataAttribute = $scope.desiredLocation.dataAttribute;
			$scope.editdataschema.name = $scope.desiredLocation.newSchemaName;
			$scope.editdataschema.fileData = $scope.desiredLocation.fileData;
			$scope.editdataschema.dataSourcerId = 'NewSchema';
			if ($scope.desiredLocation.xmlEndTag != undefined)
				$scope.editdataschema.xmlEndTag = $scope.desiredLocation.xmlEndTag;
			$scope.dataschema.jsonblob = angular.toJson($scope.editdataschema);
		}
		//if ($scope.dataError == '') {
		if ($scope.desiredLocation.selectedTable != undefined) {
			//console.log($scope.desiredLocation.fileData);
			//console.log($scope.desiredLocation.fileData.dbType);
			$scope.method = 'POST'
			$scope.data = new Object();
			$scope.url = 'rest/service/createEntities/';
			tempobj = new Object();
			tempobj = $scope.desiredLocation.fileData
			delete $scope.desiredLocation.fileData;
			$scope.data = $scope.desiredLocation;
			$scope.data.location = editData.sourcePath;
			$scope.data.frequency = editData.frequency;
			//console.log($scope.data);
			$scope.data.dbType = tempobj.dbType;
			$scope.data.dbName = tempobj.dbName;
			$scope.data.hostName = tempobj.hostName;
			$scope.data.port = tempobj.port;
			$scope.data.userName = tempobj.userName;
			$scope.data.password = tempobj.password;
			
			//$scope.data.format = editData.format;
			$scope.data.datasetlocation = editData.setPath;
			$scope.data.createdBy = localStorage.getItem('itc.username');
			//$scope.data.updatedBy = localStorage.getItem('itc.username');
			$http({
				method : $scope.method,
				url : $scope.url,
				data : $scope.data,
				// cache : $templateCache
				headers : headerObj
			}).success(function(data, status) {
				$scope.status = status;

				//myService.set($scope);
				$location.path("/DataSchema/");
				// datapreview = data
			}).error(function(data, status) {
				if (status == 401) {
					$location.path('/');
				}
				$scope.hdfsPathAcess = true;
				$scope.dataError = data;
				// $scope.savefullIngenstion(editData);
				// console.log($scope.dataError);

			});

		}
		else{
			$scope.dataschema.name = $scope.desiredLocation.newSchemaName;
			$scope.dataschema.type = 'DataSchema';
			$scope.method = 'POST';
			//console.log($scope.dataschema)
			$scope.dataschema.createdBy = localStorage.getItem('itc.username');
			$scope.dataschema.updatedBy = localStorage.getItem('itc.username');
			$scope.url = 'rest/service/addEntity/';
			$http({
				method : $scope.method,
				url : $scope.url,
				data : $scope.dataschema,
				headers : headerObj
			})
					.success(
							function(data, status) {
								$scope.status = status;
								/*
								 * schemaSourceDetails($scope, $http,
								 * $templateCache, $rootScope, $location);
								 */
								$scope.dataschema.id = data.id;
								if ($scope.desiredLocation.dataSchemaType == 'Automatic') {
									//$scope.editdataschema.fileData = $scope.desiredLocation.fileData;
									// jData = angular.fromJson(jdata.fileData);

									if ($rootScope.fileSys == 'file') {
										jData1 = angular
												.fromJson($scope.editdataschema.fileData);
										$scope.filetempPath = jData1.fileName;
									} else if($rootScope.fileSys== 'DB'){
										console.log($rootScope.fileSys);
										jData1 = angular
												.fromJson($scope.editdataschema.fileData);
												
												

										$scope.filetempPath = filetemPath
												+ '.database';
									}
									else{
									console.log($rootScope.fileSys);
										jData1 = angular
												.fromJson($scope.editdataschema.fileData);
												
												r=jData1.fileName

												var filetemp = r.split('.');
                    							var filetemPath = filetemp[0];
                    							//console.log(filetemPath)

										$scope.filetempPath = filetemPath
												+ '.database';
									}
									// $scope.dataschema.filetempPath = new
									// Object();
									// $scope.dataschema.filetempPath =
									// $scope.filetempPath;
									// console.log(jData1.fileName)
									var fromAutoSchema = true;
								} else {
									var fromAutoSchema = false;
								}

								$rootScope.fromAutoSchema = fromAutoSchema;
								$scope.dataSource = {};
								$scope.editDataSource = {};
								$scope.editDataSet = {};
								$scope.editDataSchedular = {};
								/*
								 * $scope.editDataSource.fileData = new Array();
								 * if($scope.desiredLocation.dataSchemaType ==
								 * 'Automatic'){ var re = /(?:\.([^.]+))?$/; var
								 * format = re.exec($scope.filetempPath)[1];
								 * format = format.toUpperCase();
								 * $scope.dataSource.format = format;
								 * $scope.editDataSource.format = format; }
								 */
								$scope.editDataSource.format = editData.format;
								$scope.dataSource.name = $scope.desiredLocation.newSchemaName
										+ '_Source';
								$scope.dataSource.type = 'DataSource';
								$scope.editDataSource.schema = $scope.desiredLocation.newSchemaName;
								$scope.editDataSource.fileData = $scope.editdataschema.fileData
								$scope.editDataSource.location = editData.sourcePath;
								$scope.editDataSource.dataSource = $scope.desiredLocation.newSchemaName
										+ '_Source';
								$scope.editDataSource.name = $scope.desiredLocation.newSchemaName
										+ '_Source';
								;
								$scope.editDataSource.dataSourcerId = $scope.desiredLocation.newSchemaName
										+ '_Source';
								if ($rootScope.fileSys == 'file') {
									$scope.editDataSource.sourcerType = 'File';
								} else {
									$scope.editDataSource.sourcerType = 'RDBMS';
								}
								if ($scope.desiredLocation.dataSchemaType == 'Manual') {
									$scope.editDataSource.sourcerType = 'File';
								}
								$scope.dataSource.jsonblob = angular
										.toJson($scope.editDataSource);
								//console.log($scope.editDataSource);
								$scope.method = 'POST';
								$scope.dataSource.createdBy = localStorage
										.getItem('itc.username');
								$scope.dataSource.updatedBy = localStorage
										.getItem('itc.username');
								$scope.url = 'rest/service/addEntity/';

								$http(
										{
											method : $scope.method,
											url : $scope.url,
											data : $scope.dataSource,
											headers : headerObj
										}).success(function(data, status) {
									$scope.status = status;
									/*
									 * schemaSourceDetails($scope, $http,
									 * $templateCache, $rootScope, $location);
									 */
									$scope.editing = false;
									$scope.viewing = true;

								}).error(function(data, status) {
									if (status == 401) {
										$location.path('/');
									}
									$scope.data = data || "Request failed";
									$scope.status = status;

								});
								$scope.dataSet = {};
								$scope.dataSet.name = $scope.desiredLocation.newSchemaName
										+ '_DataSet';
								$scope.dataSet.type = 'DataSet';
								$scope.editDataSet.dataIngestionId = $scope.desiredLocation.newSchemaName
										+ '_DataSet';
								$scope.editDataSet.name = $scope.desiredLocation.newSchemaName
										+ '_DataSet';
								$scope.editDataSet.Schema = $scope.desiredLocation.newSchemaName;
								$scope.editDataSet.location = editData.setPath;
								$scope.editDataSet.isEncrypted = $scope.desiredLocation.isEncrypted;
								$scope.dataSet.jsonblob = angular
										.toJson($scope.editDataSet);
								$scope.method = 'POST';

								$scope.dataSet.createdBy = localStorage
										.getItem('itc.username');
								$scope.dataSet.updatedBy = localStorage
										.getItem('itc.username');
							//	$scope.dataSet.createdDate = new Date();
								$scope.url = 'rest/service/addEntity/';

								$http(
										{
											method : $scope.method,
											url : $scope.url,
											data : $scope.dataSet,
											headers : headerObj
										})
										.success(
												function(data, status) {
													$scope.status = status;
													/*
													 * schemaSourceDetails($scope,
													 * $http, $templateCache,
													 * $rootScope, $location);
													 */
													$scope.dataScheduler = {};
													$scope.dataScheduler.name = $scope.desiredLocation.newSchemaName
															+ '_Schedular';
													$scope.dataScheduler.type = 'DataIngestion';
													$scope.editDataSchedular.dataIngestionId = $scope.desiredLocation.newSchemaName
															+ '_Schedular';
													$scope.editDataSchedular.name = $scope.desiredLocation.newSchemaName
															+ '_Schedular';
													$scope.editDataSchedular.dataSource = $scope.desiredLocation.newSchemaName
															+ '_Source';
													$scope.editDataSchedular.destinationDataset = $scope.desiredLocation.newSchemaName
															+ '_DataSet';
													$scope.editDataSchedular.frequency = editData.frequency;
													$scope.editDataSchedular.startBatch = editData.startBatch;
													$scope.editDataSchedular.endBatch = editData.endBatch;
													$scope.datasetPath = editData.setPath;
													$scope.dataScheduler.jsonblob = angular
															.toJson($scope.editDataSchedular);
													$scope.method = 'POST';

													$scope.dataScheduler.createdBy = localStorage
															.getItem('itc.username');
													$scope.dataScheduler.updatedBy = localStorage
															.getItem('itc.username');
													/*myService
													.set($scope);*/
													//$location.path("/ValidationRule/");

												//	$scope.dataScheduler.createdDate = new Date();
													$scope.url = 'rest/service/addEntity/';

													$http(
															{
																method : $scope.method,
																url : $scope.url,
																data : $scope.dataScheduler,
																headers : headerObj
															})
															.success(
																	function(
																			data,
																			status) {
																		$scope.status = status;
																		
																		  /*schemaSourceDetails($scope,
																		  $http,
																		  $templateCache,
																		  $rootScope,
																		  $location);*/
																		 /* $location.path("/DataIngestion/");*/
																		 
																		
																		  /*var
																		  testRunHtml =
																		  'Sucessfully created schema:'+$scope.desiredLocation.newSchemaName+ '<br/>Source:'
																		  +$scope.desiredLocation.newSchemaName+'_Source'+'<br/>Dataset:'
																		  +$scope.desiredLocation.newSchemaName+'_DataSet'+'<br/>Scheduler:'
																		  +$scope.desiredLocation.newSchemaName+'_Schedular'+'<br/>';
																		  $('#finalmodalBODY').html(testRunHtml);
																		  $('#finalModel').modal('show');*/
																		  
																		 //console.log($scope)
																		myService
																				.set($scope);
																		$location
																				.path("/ValidationRule/");

																	})
															.error(
																	function(
																			data,
																			status) {
																		$scope.data = data
																				|| "Request failed";
																		$scope.status = status;

																	});

												})
										.error(
												function(data, status) {
													$scope.data = data
															|| "Request failed";
													$scope.status = status;

												});

							}).error(function(data, status) {
								if (status == 401) {
									$location.path('/');
								}
						$scope.data = data || "Request failed";
						$scope.status = status;

					});
		}
		//}
	}
	$scope.runautoSchema = function() {

		$('#finalModel').modal('hide');
		$scope.method = 'POST'
		$scope.fileData = new Object();
		$scope.url = 'rest/service/testRunIngestion';
		if ($rootScope.fromAutoSchema == true) {
			$scope.fileData.fileName = $scope.filetempPath;
		}
		$scope.fileData.targetPath = $scope.datasetPath;
		$http({
			method : $scope.method,
			url : $scope.url,
			data : $scope.fileData,
			// cache : $templateCache
			headers : headerObj
		}).success(function(data, status) {
			$scope.status = status;

			// datapreview = data
		}).error(function(data, status) {
			if (status == 401) {
				$location.path('/');
			}
			$scope.data = data || "Request failed";
			$scope.status = status;
			$('#runFN').html(data.fileName);
			$('#runBT').html(data.fileSize);
			$('#runTT').html(data.timeTaken);
			$('#confirmRun').modal('show');
		});

	}
	$scope.canceloparation = function() {
		$location.path("/DataSchema/");
	}

	
}