var validaionTable = function(myService, $scope, $http, $templateCache,
		$location, $rootScope, $route, $upload, $filter, $anchorScroll) {

	$scope.validRuleName = [ 'Regex', 'Range', 'White List', 'Black List',
			'Fixed Length', 'Confidential', 'Strict Validation','Primary' ];
	$scope.validRuleinfo = [
			'It must be a valid regular expression pattern with proper syntax. e.g.'+ 
			"Subexpression Matches"+"\n"+
			"^  Matches beginning of line."+"\n"+
			"$  Matches end of line."+"\n"+
			".  Matches any single character except newline. Using m option allows it to match newline as well."+"\n"+
			"[...]  Matches any single character in brackets."+"\n"+
			"[^...]  Matches any single character not in brackets"+"\n"+
			"\\A  Beginning of entire string"+"\n"+
			"\\z  End of entire string"+"\n"+
			"\\Z  End of entire string except allowable final line terminator."+"\n"+
			"re*  Matches 0 or more occurrences of preceding expression."+"\n"+
			"re+  Matches 1 or more of the previous thing"+"\n"+
			"re?  Matches 0 or 1 occurrence of preceding expression."+"\n"+
			"re{ n}  Matches exactly n number of occurrences of preceding expression."+"\n"+
			"re{ n,}  Matches n or more occurrences of preceding expression."+"\n"+
			"re{ n, m}  Matches at least n and at most m occurrences of preceding expression."+"\n"+
			"+a| b  Matches either a or b."+"\n"+
			"(re)  Groups regular expressions and remembers matched text."+"\n"+
			"(?: re)  Groups regular expressions without remembering matched text."+"\n"+
			"(?> re)  Matches independent pattern without backtracking."+"\n"+
			"\\w  Matches word characters."+"\n"+
			"\\W  Matches nonword characters."+"\n"+
			'\\s  Matches whitespace.'+"\n"+
			"\\S  Matches nonwhitespace."+"\n"+
			"\\d  Matches digits. Equivalent to [0-9]."+"\n"+
			"\\D  Matches nondigits."+"\n"+
			"\\A  Matches beginning of string."+"\n"+
			"\\Z  Matches end of string. If a newline exists, it matches just before newline."+"\n"+
			"\\z  Matches end of string."+"\n"+
			"\\G  Matches point where last match finished."+"\n"+
			"\\b  Matches word boundaries when outside brackets. Matches backspace (0x08) when inside brackets."+"\n"+
			"\\B  Matches nonword boundaries."+"\n"+
			"\\n, \t, etc.  Matches newlines, carriage returns, tabs, etc."+"\n"+
			"\\Q  Escape (quote) all characters up to \\E"+"\n"+
			'\\E  Ends quoting begun with \\Q',
			'Range validation is applicable for date and numeric types of data. It must be a valid numeric range separated by colon(:). e.g. 4,6 or <5 or >5 or <=5 or >=5 or 2012/01/12,2014/13/15',
			'WhiteList validator can be applicable for any types of data. In this validation, the list of the valid values matching with data present in the actual DataSet will be included .List of valid values must be separated by comma(,). e.g. 4,5,7 or john,smith,lobo',
			'BlackList validator can be applicable for any type of data.In this validation, the list of the valid values matching with data present in the actual DataSet will be excluded.List of valid values must be separated by comma(,). e.g. 4,5,7 or john,smith,lobo',
			'FixedLength validation is applicable for both string and numeric types of data except Double. Input should be a valid numeric value. e.g. 4',
			'Choose the appropriate action to make your confidential data safe',
			'If "YES" is chosen, data for which validation rule/s fails, will be removed from cleansed data.If "NO", even when validation fails, data will be retained in the dataset, but a separate copy of "Quarantined" data will be maintained.',
			'Is primary key or not' ];
	$scope.pIIRule = [ 'Obfuscate', 'Remove', 'No' ];
	$scope.mandatoryArr = [ 'Yes', 'No' ];
	$scope.piidef = 'Obfuscate';
	$scope1 = myService.get();
	//console.log($scope1)
	$scope.dataschemaTableblob = new Object();
	$scope.editSchema = $scope1.editSchema;
	$scope.correctArr = new Array();
	$scope.errorArr = new Array();
	$scope.valArray = new Array();
	$scope.title = new Array();
	$scope.dataschemaTableblob = angular.fromJson($scope1.dataschema.jsonblob);
	// console.log($scope.dataschemaTableblob);//piirule
	$scope.dataschemaTable = angular
			.fromJson($scope.dataschemaTableblob.dataAttribute);
	$scope.dataschemaTable1 = $scope.dataschemaTable;
	// console.log($scope.dataschemaTable)
	$scope.canceloparation = function(modalID) {
		$("#" + modalID).on('hidden.bs.modal', function() {
			$location.path("/DataSchema/");
			$scope.$apply();
		});
		/*
		 * $('#finalModel').modal('hide'); $location.path("/DataSchema/");
		 */
	}

	$scope.ruleComb = new Array();

	for ( var i = 0; i < $scope.dataschemaTable.length; i++) {
		var column = "'" + $scope.dataschemaTable[i]['Name'] + "'";
		$scope.valArray[column] = new Array();
		$scope.ruleComb[i] = new Array();
		$scope.errorArr[i] = new Array();
		$scope.correctArr[i] = new Array();
		for ( var j = 0; j < $scope.validRuleName.length; j++) {
			if ($scope.dataschemaTable[i][$scope.validRuleName[j]] == undefined) {
				if ($scope.validRuleName[j] == 'Confidential') {
					if ($scope.dataschemaTable[i]['piirule'] == 'Y') {
						$scope.ruleComb[i][j] = $scope.piidef;
					} else {
						$scope.ruleComb[i][j] = "No";
					}

				} else if ($scope.validRuleName[j] == 'Strict Validation' || $scope.validRuleName[j] == 'Primary') {
					$scope.ruleComb[i][j] = "No";
				} else {
					$scope.ruleComb[i][j] = "N/A";
				}
			} else {
				$scope.ruleComb[i][j] = $scope.dataschemaTable[i][$scope.validRuleName[j]];
			}
			var rule = "'" + $scope.validRuleName[j] + "'"
			$scope.valArray[column][rule] = i + ',' + j;
			$scope.errorArr[i][j] = false;
			$scope.correctArr[i][j] = false;
		}
	}

	$scope.editdata = {};
	$scope.dataschema = new Object();
	$scope.dataschema = $scope1.dataschema;
	$scope.editdata.name = $scope.dataschema.name;
	$scope.editdata.type = 'DataSchema';
	$scope.saveValRule = function(totalDD) {
		// console.log(totalDD);
		var i = 0;
		$scope.editdata.dataAttribute = new Array();
		for ( var i = 0; i < $scope.dataschemaTable.length; i++) {
			$scope.columnData = new Object();
			$scope.columnData.Name = new Object();
			$scope.columnData.dataType = new Object();
			$scope.columnData.Name = $scope.dataschemaTable[i].Name;
			$scope.columnData.dataType = $scope.dataschemaTable[i].dataType;
			$scope.columnData.description = $scope.dataschemaTable[i].description;
			for ( var j = 0; j < $scope.validRuleName.length; j++) {
				var newRule = $scope.validRuleName[j];
				var tdVal = $scope.ruleComb[i][j];
				if ($scope.validRuleName[j] == 'Confidential'
						|| $scope.validRuleName[j] == 'Strict Validation') {
					if (tdVal == 'No') {
						tdVal = 'N/A';
					}
				}
				var tdValcase = tdVal.toUpperCase();
				if (tdValcase != 'N/A' && tdValcase != '') {
					$scope.columnData[newRule] = tdVal;
				}
				$scope.errorArr[i][j] = false
				$scope.correctArr[i][j] = true;

			}
			$scope.editdata.dataAttribute.push($scope.columnData);

		}
		$scope.editdata.dataSchemaType = $scope.dataschemaTableblob.dataSchemaType;
		if ($scope.dataschemaTableblob.xmlEndTag)
			$scope.editdata.xmlEndTag = $scope.dataschemaTableblob.xmlEndTag;
		// console.log($scope.editdata.dataSchemaType);
		$scope.editdata.description = $scope.dataschemaTableblob.description;
		$scope.dataschema.jsonblob = angular.toJson($scope.editdata);
		$scope.method = 'POST';
		$scope.dataschema.updatedBy = localStorage.getItem('itc.username');
		//$scope.dataschema.updatedDate = new Date().getTime();

		$scope.url = 'rest/service/validatorValidation';
		$http({
			method : $scope.method,
			url : $scope.url,
			data : $scope.dataschema,
			headers : headerObj
		})
				.success(
						function(data, status) {
							$scope.status = status;
							$scope.resultsError = new Array();
							$scope.resultsError = data;
							// console.log($scope.resultsError.length)
							if ($scope.resultsError.length > 0) {
								/*
								 * for(var i=0;i<$scope.dataschemaTable.length;i++) {
								 * 
								 * for(var j=0;j<$scope.resultsError.length;j++) {
								 * eachError =
								 * $scope.resultsError[i].split('|'); if(){ } } }
								 */
								var j = 0;
								for (i = 0; i < $scope.resultsError.length; i++) {
									eachError = new Array();
									eachError = $scope.resultsError[i]
											.split('|');
									var rule = "'" + eachError[0] + "'";
									var column = "'" + eachError[1] + "'";
									var title = "'" + eachError[2] + "'";

									if ($scope.valArray[column][rule]) {
										// console.log($scope.valArray[column][rule])
										var indexs = $scope.valArray[column][rule];
										indexsArr = new Array();
										indexsArr = indexs.split(',');
										// alert(indexsArr[0] + indexsArr[1]);
										if (j == 0) {
											$location.hash(indexsArr[0]
													+ indexsArr[1]);
											$anchorScroll();
											j++;
										}

										$scope.errorArr[indexsArr[0]][indexsArr[1]] = true
										$scope.correctArr[indexsArr[0]][indexsArr[1]] = false;
										eachError = $scope.resultsError[i]
												.split('|');
										var rule = "'" + eachError[0] + "'";
										var column = "'" + eachError[1] + "'";
										var title = eachError[2];
										$scope.title[indexsArr[0]] = new Array();
										$scope.title[indexsArr[0]][indexsArr[1]] = '';
										$scope.title[indexsArr[0]][indexsArr[1]] = title;

										// console.log(title);
										// console.log($scope.title[indexsArr[0]][indexsArr[1]]);
									}

									// console.log(eachError);
								}
							} else {
								$scope.editdata.dataSchemaType = $scope.dataschemaTableblob.dataSchemaType;
								if ($scope.dataschemaTableblob.xmlEndTag)
									$scope.editdata.xmlEndTag = $scope.dataschemaTableblob.xmlEndTag;
								if ($scope.dataschemaTableblob.fileData)
								$scope.editdata.fileData =  $scope.dataschemaTableblob.fileData;
								// console.log($scope.editdata.dataSchemaType);
								$scope.editdata.description = $scope.dataschemaTableblob.description;
								$scope.dataschema.jsonblob = angular
										.toJson($scope.editdata);
								$scope.method = 'POST';
								$scope.dataschema.updatedBy = localStorage
										.getItem('itc.username');
								//$scope.dataschema.updatedDate = new Date();

								$scope.method = 'POST';
								$scope.dataschema.updatedBy = localStorage
										.getItem('itc.username');
								//$scope.dataschema.updatedDate = new Date();

								$scope.url = 'rest/service/'
										+ $scope.dataschema.type + '/'
										+ $scope.dataschema.id;
								$http(
										{
											method : $scope.method,
											url : $scope.url,
											data : $scope.dataschema,
											headers : headerObj
										}).success(function(data, status) {
									$scope.status = status;

								}).error(function(data, status) {
									if (status == 401) {
										$location.path('/');
									}
									$scope.data = data || "Request failed";
									$scope.status = status;

								});
								if ($scope.dataschemaTableblob.dataSchemaType == 'Manual') {
									$location.path('/DataSchema/');
								} else {
									if ($scope1.editSchema == true) {
										$location.path('/DataSchema/');
									} else {
										var testRunHtml = 'Sucessfully created <br/><table><tr><td><b>schema :</b> </td><td>&nbsp;'
												+ $scope.dataschema.name
												+ ' </td></tr><tr><td><b>Source :</b></td><td>&nbsp;'
												+ $scope.dataschema.name
												+ '_Source'
												+ '</td></tr><tr><td><b>Dataset :</b></td><td>&nbsp;'
												+ $scope.dataschema.name
												+ '_DataSet'
												+ '</td></tr><tr><td><b>Scheduler : </b></td><td>&nbsp;'
												+ $scope.dataschema.name
												+ '_Schedular'
												+ '</td></tr></table>';
												console.log('upload-type:'+$scope.dataschemaTableblob.fileData.uploadType);
										$('#finalmodalBODY').html(testRunHtml);
										$('#finalModel').modal('show');
									}
								}
							}

						}).error(function(data, status) {
							if (status == 401) {
								$location.path('/');
							}
					$scope.data = data || "Request failed";
					$scope.status = status;

				});
	}
	$scope.skipValRule = function(totalDD) {
		if ($scope.dataschemaTableblob.dataSchemaType == 'Manual') {
			$location.path('/DataSchema/');
		} else {
			if ($scope1.editSchema == true) {
				$location.path('/DataSchema/');
			} else {
				$scope.dataschema = new Object();
				$scope.dataschema = $scope1.dataschema;
				var testRunHtml = 'Sucessfully created <br/><table><tr><td><b>schema :</b> </td><td>&nbsp;'
						+ $scope.dataschema.name
						+ ' </td></tr><tr><td><b>Source :</b></td><td>&nbsp;'
						+ $scope.dataschema.name
						+ '_Source'
						+ '</td></tr><tr><td><b>Dataset :</b></td><td>&nbsp;'
						+ $scope.dataschema.name
						+ '_DataSet'
						+ '</td></tr><tr><td><b>Scheduler : </b></td><td>&nbsp;'
						+ $scope.dataschema.name
						+ '_Schedular'
						+ '</td></tr></table>';
				$('#finalmodalBODY').html(testRunHtml);
				$('#finalModel').modal('show');
			}
		}
	}
	$scope.runautoSchema = function() {

		$('#TestRunLoader').show();
		$scope.method = 'POST'
		$scope.fileData = new Object();
		$scope.url = 'rest/service/testRunIngestion';
		if ($rootScope.fromAutoSchema == true) {
			
			console.log($scope1.filetempPath)
			$scope.fileData.fileName = $scope1.filetempPath;
		}
		$scope.fileData.targetPath = $scope1.datasetPath;
		
		$http({
			method : $scope.method,
			url : $scope.url,
			data : $scope.fileData,
			// cache : $templateCache
			headers : headerObj
		}).success(function(data, status) {
			$scope.status = status;
			$('#runFN').html(data.fileName);
			$('#runBT').html(data.fileSize);
			$('#runTT').html(data.timeTaken);
			$('#TestRunLoader').hide();
			$('#finalModel').modal('hide');
			$('#confirmRun').modal('show');
			// datapreview = data
		}).error(function(data, status) {
			if (status == 401) {
				$location.path('/');
			}
			$scope.data = data || "Request failed";
			$scope.status = status;

		});

	}

}
