userApp
    .controller(
        'dataSchemaSource',
        function(myService, $scope, $http, $templateCache, $location,
            $rootScope, $route, $upload, $filter, $modal, $interval, $window) {

            /*
             * if(localStorage.getItem('itc.authToken')){ var authToken =
             * localStorage.getItem('itc.authToken');
             * $rootScope.authToken = authToken; }
             */
            //getHeader($scope, $location);
            $scope.dUsername = localStorage.getItem('itc.username');

            // $scope.dataSrc.test = [0, 1];
            $scope.frequencyArr = ["One Time", "Hourly", "Daily",
                "Weekly"
            ];
            $scope.filterRow = false;
            $scope.delFail = false;
            $scope.query = {}
            $scope.queryBy = '$'
            //   $scope.query['schedulerFrequency'] = 'Select Frequency';
            $scope.viewing = true;
            $scope.editing = false;
            $scope.addSchema = true;
            $scope.editData = new Object();
            $scope.totalSourcer = 1;
            $scope.oldName = '';
            $scope.Deluser = null
            $scope.DelObj = {};
            $scope.pipeEdit = false;
            $scope.savebutton = true;
            $scope.xmlEndTag = '';
            $scope.fileData = '';
            $scope.jobStatusArr = {};
            //$scope.delimiterArr = ["tab","space",,"comma","underscore","slash","Control-A","Control-B","Control-C","newline","carriage return"];
            $scope.delimiterArr = ["carriage return", "comma", "Control-A", "Control-B", "Control-C", "newline", "slash", "space", "tab", "underscore", "WhiteSpace"];

            $scope.editData.rowDeli = $scope.delimiterArr[0];
            $scope.editData.colDeli = $scope.delimiterArr[0];

            var userNameFromToken = localStorage.getItem('itc.username')
            //	console.log("username from token");
            //console.log(userNameFromToken);


          /*  getLogonUser($scope, $http, $templateCache,
                $rootScope, $location, userNameFromToken);
*/
            // $scope.editData.frequency = $scope.frequencyArr[0];
            
			
			/*typeFormatFetch($scope, $http, $templateCache,
                $rootScope, $location, 'Format', 'DataSource')
				*/
				
            // prevMenu = '';
            //changeMClass('one')
            // $scope.sourceType = ['file'];
            // $scope.editData.sourcerType = $scope.sourceType[0];
            $scope.newItem = function($event) {
                $scope.ddObject = new Object();
                $scope.ddObject.active = true;
                $scope.ddArray.push($scope.ddObject);
            }
            $scope.selectColumnPage = function() {
                $('#AllTableModal').modal('hide');
                $('#AllTableModal2').modal('show');
            }
            $scope.tableSelectBack = function() {
                $('#AllTableModal2').modal('hide');
                $scope.curTabColumn = [];
                $scope.tabArray = [];
                $scope.tableInfo = [];
                $('#AllTableModal').modal('show');
            }
            $scope.getColumnInfo = function() {
                //	alert('hiiii');
                //Getting all database information from previous modal using myservice and assign it to editData1 object
                //This info is required for the backend controller to return columns of corresponding table.
                $scope.errorCode = '';
                $scope.editData1 = {};
                var filedata = myService.get();

                angular.forEach(filedata, function(value1, key1) {
                    angular.forEach(value1, function(value2, key2) {
                        $scope.editData1[key2] = value2;
                    });
                });
                //	alert('hiii1');
                //$scope.editData1.selectedTable = finalSelectedTableObj.alltable1;
                $scope.editData1.selectedTable = $rootScope.checkedTab;
                //	alert('hiii2');
                //	console.log("editData1..");
                //	console.log($scope.editData1);
                //	console.log("Making http call to fetch column list..");

                $scope.url = 'rest/service/getDetailsForSelectedTables';
                $scope.method = 'POST';
                $http({
                    method: $scope.method,
                    url: $scope.url,
                    data: $scope.editData1,
                    headers: headerObj
                }).success(function(data, status) {
                    //console.log("Column data fetch - success");
                    //console.log(data);
                    //Response will be in this formart {TableName:{colname,dataType},{..}}
                    //  delete $rootScope.errorCode;
                    $rootScope.errorCode = '';
                    $scope.tableInfo = data;
                    $scope.tabelColNameType = new Object();
                    $scope.checkedCol = {};
                    $scope.tabArray = new Array();
                    $scope.tabQuery = {};

                    //Creating a new array to store only the tablename and its column names.
                    //0th element of each row will be table name and column names on rest.
                    var i = 0;
                    var j = 0;
                    angular.forEach($scope.tableInfo, function(value, key) {
                        j = 1;
                        $scope.tabArray[i] = new Array();
                        $scope.tabArray[i][0] = key; //table name - 0th pos
                        $scope.checkedCol[key] = new Array(); //Initialize user selected table column array.
                        angular.forEach(value, function(value2, key2) {
                            $scope.tabArray[i][j] = value2.name; //Adding column names on loop
                            $scope.checkedCol[key].push(value2.name); //Pre-initializing checkedCol array to preselect all columns by default. 
                            j++;
                        })
                        i++;
                    });
                    //	console.log($scope.checkedCol);
                    if ($rootScope.multiTab === false) {
                        $scope.TableSelect = $rootScope.Alltable[0];
                        $scope.populateColList($scope.TableSelect);
                    } else
                        $scope.TableSelect = "Select Table";
                    $rootScope.closeModal();
                    $scope.selectColumnPage();
                    $scope.status = status;
                }).error(function(data, status) {
                    if (status == 401) {
                        $location.path('/');
                    }

                    $rootScope.errorCode = data;
                    console.log($rootScope.errorCode);
                    $('#dbErrorText').html(data)
                    $('#connectLoader').hide();
                    $scope.data = data || "Request failed";
                    $scope.status = status;
                    //console.log(data);
                });
            }
            $scope.populateColList = function(currentTableSelected) {
                $scope.currentTable = currentTableSelected;
                var i;
                var k;
                //Creating a single table array having only its column names, each time when user changes the table using dropdown.
                $scope.curTabColumn = new Array();
                if (currentTableSelected != null) {
                    for (i = 0; i < $scope.tabArray.length; i++) {
                        if ($scope.tabArray[i][0] == currentTableSelected) {
                            k = 0;
                            for (j = 1; j < $scope.tabArray[i].length; j++) {
                                $scope.curTabColumn[k] = $scope.tabArray[i][j];
                                k++;
                            }
                        }
                    };
                    //Populate the textarea with query specific to table name selected in dropdown.
                    $scope.populateQuery(currentTableSelected);
                }
            }
            $scope.checkboxContain = function(checkboxColName, modalname) {
                //Check whether the column name exists in the checkedCol array(contain checked columns of each table.)
                if (modalname == "AllTableModal") {
                    return $rootScope.checkedTab.indexOf(checkboxColName) >= 0;
                } else if (modalname == "AllTableModal2") {
                    return $scope.checkedCol[$scope.currentTable].indexOf(checkboxColName) >= 0;
                }
            }
            $scope.checkboxToggle = function(checkboxName, modalname) {
                //Add or remove column from checkedTab array on check/un-check
                if (modalname == "AllTableModal") {
                    if ($rootScope.checkedTab.indexOf(checkboxName) === -1) {
                        $rootScope.checkedTab.push(checkboxName);
                    } else {
                        $rootScope.checkedTab.splice($rootScope.checkedTab.indexOf(checkboxName), 1);
                    }
                } else if (modalname == "AllTableModal2") {
                    if ($scope.checkedCol[$scope.currentTable].indexOf(checkboxName) === -1) {
                        $scope.checkedCol[$scope.currentTable].push(checkboxName);
                    } else {
                        $scope.checkedCol[$scope.currentTable].splice($scope.checkedCol[$scope.currentTable].indexOf(checkboxName), 1);
                    }
                }
            }
            $scope.clearAllCheck = function(modalname) {
                if (modalname == "AllTableModal") {
                    $rootScope.checkedTab = [];
                } else if (modalname == "AllTableModal2") {
                    $scope.checkedCol[$scope.currentTable] = [];
                }
            }
            $scope.checkAllBox = function(modalname) {
                if (modalname == "AllTableModal") {
                    $rootScope.checkedTab = [];
                    for (i = 0; i < $rootScope.Alltable.length; i++) {
                        $rootScope.checkedTab.push($rootScope.Alltable[i]);
                    }
                } else if (modalname == "AllTableModal2") {
                    var i;
                    for (i = 0; i < $scope.tabArray.length; i++) {
                        if ($scope.tabArray[i][0] == $scope.currentTable) {
                            k = 0;
                            $scope.checkedCol[$scope.currentTable] = new Array();
                            for (j = 0; j < $scope.tabArray[i].length; j++) {
                                $scope.checkedCol[$scope.currentTable].push($scope.tabArray[i][j]);
                                k++;
                            }
                        }
                    };
                }
            }
            $scope.clearQuery = function(TableSelect) {
                $scope.tableSelectQuery = "";
                delete $scope.tabQuery[TableSelect];

            }
            $scope.populateQuery = function(TableSelect) {
                if ($scope.tabQuery[TableSelect] != undefined) {
                    $scope.tableSelectQuery = $scope.tabQuery[TableSelect];
                } else {
                    $scope.tableSelectQuery = "";
                }
                //Pre-select Query radio button if any query exists for the current table.
                if ($scope.tableSelectQuery.length > 0) {
                    $scope.rdbmsCol = "writeQuery";
                } else {
                    $scope.rdbmsCol = "manualSelect";
                }
            }
            $scope.saveQuery = function(tableSelectQuery, TableSelect) {
                if (tableSelectQuery.toLowerCase().indexOf('select') != 0) {
                    alert('please enter proper query');
                    return false;
                }

                $scope.tabQuery[TableSelect] = tableSelectQuery;
                //if user writes query for a table, send all columns of that table to ingestion page irrespective of the his column selection. 
                //Info->Also the 'select column' radio button will be disabled until he clears the query for this table.
                $scope.checkAllBox("AllTableModal2");
            };
            $scope.ingestionpage = function(selectedTable) {
                $scope.checkedColTemp = {};
                //checkedCol is currently having only the table name as key and respective columns as an array.
                //It is now modifying each key(tablename) to add an array of objects which has column name and datatype name as attributes.
                //console.log($scope.tableInfo);
                angular.forEach($scope.checkedCol, function(value1, key1) {
                    angular.forEach($scope.tableInfo, function(value2, key2) {
                        if (key1 == key2) {
                            $scope.checkedColTemp[key1] = new Array();
                            angular.forEach(value1, function(value3, key3) {
                                angular.forEach(value2, function(value4, key4) {
                                    //	console.log(value4);
                                    if (value3 == value4.name) {
                                        var tempObj = new Object();
                                        tempObj.name = value4.name;
                                        tempObj.dataType = value4.dataType;
                                        if (value4.primaryKey)
                                            tempObj.primaryKey = value4.primaryKey;
                                        $scope.checkedColTemp[key1].push(tempObj);
                                    }
                                });
                            });
                        }
                    });
                });

                $scope.checkedCol = $scope.checkedColTemp;
                //	console.log($scope.checkedCol);
                $scope.previewpage = myService.get();
                //$scope.previewpage.selectedTable = selectedTable.alltable1;
                $scope.previewpage.selectedTable = $scope.editData1.selectedTable;
                $scope.previewpage.selectedTableDetails = angular.toJson($scope.checkedCol); //{TableName:{colname,dataType},{..}}
                //	console.log($scope.previewpage.selectedTableDetails);
                $scope.previewpage.tableQueries = angular.toJson($scope.tabQuery); //{TableName:query},{..}}
                $scope.previewpage.name = $scope.newSchemaName;
                $scope.previewpage.dataSchemaType = 'Automatic';

                if ($rootScope.multiTab === false) {
                    //	newSchemaName = $scope.newSchemaName;
                    $scope.previewpage.fileData.selectedColumnDetails = $scope.checkedCol[$scope.editData1.selectedTable];
                    //console.log($scope.previewpage.fileData.selectedColumnDetails);
                    $scope.previewpage.fileData.tableQueries = $scope.previewpage.tableQueries;
                }
                //console.log($scope.previewpage);
                //$scope.newStep = $scope.previewpage;
                if ($rootScope.multiTab === false) {
                    $scope.method = 'POST';
                    $scope.url = 'rest/service/getSchemaAuto';
                    $http({
                        method: $scope.method,
                        url: $scope.url,
                        data: $scope.previewpage.fileData,
                        // cache : $templateCache
                        headers: headerObj
                    }).success(function(data, status) {
                        $scope.status = status;
                        // alert("data :"+data);
                        $scope.errorCode = '';
                        $scope.previewpage.datapreview = data; // data;
                        myService.set($scope.previewpage);
                        $('#AllTableModal').modal('hide');
                        $location.path("/DataSchemaPreview/");


                        // datapreview = data

                    }).error(function(data, status) {
                        if (status == 401) {
                            $location.path('/');
                        }
                        alert('There is some error in the request');
                        $scope.errorCode = data; // data;
                        // console.log($scope.errorCode);
                        // $scope.closeModal();
                        // $location.path("/DataSchemaPreview/");

                        $scope.data = data || "Request failed";
                        $scope.status = status;

                    });

                } else {
                    console.log($scope.previewpage.tableQueries.length);
                    if ($scope.previewpage.tableQueries.length > 2) {
                        $scope.previewpage.fileData.tableQueries = $scope.previewpage.tableQueries;
                        $scope.url = 'rest/service/verifyMultiTableQueries';
                        $http({
                            method: $scope.method,
                            url: $scope.url,
                            data: $scope.previewpage.fileData,
                            // cache : $templateCache
                            headers: headerObj
                        }).success(function(data, status) {
                            $scope.status = status;
                            // alert("data :"+data);

                            if (data == '') {
                                $scope.errorCode = '';
                                myService.set($scope.previewpage);
                                $location.path("/IngestionSummary/");
                            } else {
                                $scope.errorCode = data; // data;
                            }

                            // datapreview = data

                        }).error(function(data, status) {
                            if (status == 401) {
                                $location.path('/');
                            }
                            alert('There is some error in the request');
                            $scope.errorCode = data; // data;
                            // console.log($scope.errorCode);
                            // $scope.closeModal();
                            // $location.path("/DataSchemaPreview/");

                            $scope.data = data || "Request failed";
                            $scope.status = status;

                        });
                    } else {
                        myService.set($scope.previewpage);
                        $location.path("/IngestionSummary/");
                    }


                }
                //$location.path("/IngestionSummary/");
            }
            $scope.schemanamenotok = false;
            $scope.chkSchemaName = function(schemaName) {
                schemanameCheck(schemaName, $scope, $http,
                    $templateCache, $rootScope, $location,
                    'dataschema');
            }
            $scope.stoprunStatus = true;
            $scope.getJobStatus = function() {
                $scope.stoprunStatus = true;
                //console.log($scope.jobStatusArr)
                $scope.method = 'GET';
                $scope.url = 'rest/service/getprofileRunStatus';
                // console.log($scope.exportObj)
                $http({
                    method: $scope.method,
                    url: $scope.url,
                    headers: headerObj
                }).success(
                    function(data, status) {
                        $scope.status = status;
                        angular.forEach(data, function(attr, key) {
                            //	console.log(key);
                            $scope.jobStatusArr[key] = attr;
                            if (attr == 'Started') {
                                $scope.stoprunStatus = false;
                            }
                            //	console.log($scope.jobStatusArr[key]);
                        });
                        //console.log($scope.stoprunStatus);
                        if ($scope.stoprunStatus === true) {
                            $interval.cancel(stopckhStatus);
                            stopckhStatus = undefined;
                        } else {
                            $interval.cancel(stopckhStatus);
                            stopckhStatus = undefined;
                            stopckhStatus = $interval(function() {
                                $scope.getJobStatus();
                            }, 50000);
                        }

                    }).error(function(data, status) {
                    if (status == 401) {
                        $location.path('/');
                    }
                    $scope.data = data || "Request failed";
                    $scope.status = status;

                });
            }
            $scope.stopScheduler = function(schedularId, schemaId) {
                stopProcess($scope, $http, $location, 'ingestion', schemaId, schedularId);
            }
            var test = window.location.pathname;
            var parts = window.location.pathname.split('/');
            //$("#userDName").text(localStorage.getItem('itc.dUsername'));

            $scope.load = function(tpl) {
                $scope.tpl = tpl;
            };
            $scope.load('tpl');
            $scope.method = 'GET';
            $scope.type = $location.path();
            $scope.type = $scope.type.replace(/\//g, '');
            if ($scope.type == 'DataSource') {
                schemaSourceDropDetails($scope, $http, $templateCache,
                    $rootScope, $location, 'DataSchema');
                typeFormatFetch($scope, $http, $templateCache,
                    $rootScope, $location, 'Type')
                typeFormatFetch($scope, $http, $templateCache,
                    $rootScope, $location, 'Format')

            }
            if ($scope.type == 'DataSchema') {
                typeFormatFetch($scope, $http, $templateCache,
                    $rootScope, $location, 'Type')
                $scope.valRule = 'No';
                $scope.valRule = ['Yes', 'No'];
                $scope.pIIRule = ['Obfuscate', 'Remove'];
                $scope.addSchemaMed = [{
                    "name": "---Select---"
                }, {
                    "name": "Manual"
                }, {
                    "name": "Automatic"
                }];
                $scope.editData = new Object();
                $scope.editData.addSchemaMed = "---Select---";
                var stopckhStatus = $interval(function() {
                    $scope.getJobStatus();
                }, 5000);
                //$scope.getJobStatus();
                $scope.$on('$destroy', function() {
                    // console.log('STOP');
                    //$interval.cancel(stopTime);
                    $interval.cancel(stopckhStatus);

                });

            } 
            $scope.exportFunc = function(schemaName, exportPath, schemaId) {

                $scope.schemaId = schemaId;

                $scope.exportPath = '';
                $scope.exportSchema = schemaName;
                $scope.localexportPath = exportPath;
                //$scope.profileType=type;
                $('#exportModal').modal('show');
            }

            $scope.downloadSchemaFunc = function(schemaName,type) {

                $scope.exportPath = '';
                // alert(schemaName);
                var fd = new FormData();
                fd.append("schemaName", schemaName);
                //console.log(fd);
                $scope.method = 'GET';
                // $scope.url='file-download/'+schemaName;
                $scope.url = 'file-download/getSchemaFileInTextFormat/' +
                    schemaName+"/"+type;
                $http({
                        method: $scope.method,
                        url: $scope.url,
                        headers: {

                            'X-Auth-Token': localStorage
                                .getItem('itc.authToken'),
                            'Content-Type': "text/plain",
                            'Cache-Control': "no-cache"
                        }
                    })
                    .success(
                        function(data, status) {
                            $scope.status = status;
                            $scope.data = data;
                            //$scope.data = $scope.data.replace(/,/g,'\n');
                            var d = data.replace(/,/g, '\r\n');
                            var blob = new Blob([d], {
                                    type: "text/plain;charset=utf-8"
                                }),
                                e = document
                                .createEvent('MouseEvents'),
                                a = document
                                .createElement('a');
                            a.download = schemaName + "_metaFile.txt";
                            a.href = window.URL
                                .createObjectURL(blob);
                            a.dataset.downloadurl = [
                                'text/json', a.download,
                                a.href
                            ].join(':');
                            e.initMouseEvent('click', true,
                                false, window, 0, 0, 0, 0,
                                0, false, false, false,
                                false, 0, null);
                            a.dispatchEvent(e);

                        }).error(function(data, status) {
                        if (status == 401) {
                            $location.path('/');
                        }
                        $scope.data = data || "Request failed";
                        $scope.status = status;

                    });
            };

            $scope.submitExport = function(exportData) {
                
                var type = exportData.export_type;
                var schemaId = $scope.schemaId;
               
                var exportTypeParam = 'format=' + type;
                $('#exportModal').modal('hide');
                $('#downloading-data-' + schemaId).show();
                $('#download-data-' + schemaId).hide();


                if ($scope.exportloc == 'local') {
                    $scope.exportObj = new Object();
                    //	$scope.localexportPath = 'd:/test';

                    $scope.method = 'GET';
                    
                     $scope.url = 'rest/service/export?' + 'datasetSchemaName=' + $scope.exportSchema + '_dataset' + '&' + exportTypeParam;

                    console.log($scope.exportPath)
                    $http({
                        method: $scope.method,
                        url: $scope.url,
                        headers: headerObj,
                        //data : $scope.exportObj
                    }).success(
                        function(data, status) {
                            $scope.status = status;


                            console.log(data);
                            $scope.data = data;
                            //use this name from datasetName
                            var downloadedfilename = $scope.exportSchema;
                            if (type == 'JSON') {
                                data = JSON.stringify(data);
                                downloadedfilename = downloadedfilename + '.json';
                            } else if (type == 'CSV') {
                                downloadedfilename = downloadedfilename + '.csv';

                            }
                            var blob = new Blob([data]);
                            var link = document.createElement('a');
                            link.href = window.URL.createObjectURL(blob);
                            link.download = downloadedfilename;
                            link.click();
                            $('#downloading-data-' + schemaId).hide();
                            $('#download-data-' + schemaId).show();

                        }).error(function(data, status) {
                        if (status == 401) {
                            $location.path('/');
                        }
                        $scope.data = data || "Request failed";
                        $scope.status = status;

                        $('#downloading-data-' + schemaId).hide();
                        $('#download-data-' + schemaId).show();
                    });
                } else {
                    $scope.exportObj = new Object();
                    $scope.exportObj.name = $scope.exportSchema + '_dataset';
                    if ($scope.exportPath) {
                        $scope.exportObj.location = $scope.exportPath;
                    } else {
                        $scope.exportObj.location = $('#editPath').val();
                    }

                    $scope.method = 'POST';
                    $scope.url = 'rest/service/exportHiveView?' + 'datasetSchemaName=' + $scope.exportSchema + '_dataset' + '&' + exportTypeParam;

                    $http({
                        method: $scope.method,
                        url: $scope.url,
                        data: $scope.exportObj,
                        headers: headerObj
                    }).success(
                        function(data, status) {
                            $scope.status = status;
                            $('#downloading-data-' + schemaId).hide();
                            $('#download-data-' + schemaId).show();

                        }).error(function(data, status) {
                        if (status == 401) {
                            $location.path('/');
                        }
                        $scope.data = data || "Request failed";
                        $scope.status = status;
                        $('#downloading-data-' + schemaId).hide();
                        $('#download-data-' + schemaId).show();

                    });
                }

            }
            $scope.openAddDataSchema = function() {
                delete $scope.multitable;
                $scope.showModal = function() {

                    var modalInstance = $modal
                        .open({
                            templateUrl: 'myModalContent.html',
                            controller: 'ModalInstanceCtrl'
                        });
                    // $scope.editData.addSchemaMed = '';

                    modalInstance.result.then(function() {
                        // $scope.selected = selectedItem;
                    }, function() {
                        // console.log('Modal dismissed at:
                        // ' + new Date());
                    });

                }();
            }
            $scope.addUpdateSchema = function(id, dbdetails) {
                // alert(sourcePath);
                // console.log($scope.editData1.id);

                if (id != undefined) {
                    $scope.method = 'GET';
                    $scope.type = $location.path();
                    $scope.type = $scope.type.replace(/\//g, '')

                    $scope.url = 'rest/service/update/' + $scope.type + '/' +
                        id;
                    if (dbdetails != undefined) {
                        // $scope.type = 'DataSource';
                        $scope.url = 'rest/service/DataSource/' + id;
                    }
                    $scope.editData1 = new Object();
                    $http({
                            method: $scope.method,
                            url: $scope.url,
                            // cache : $templateCache
                            headers: headerObj
                        })
                        .success(
                            function(data, status) {

                                $scope.status = status;

                                $scope.editData1 = angular
                                    .fromJson(data.jsonblob);
                                // console.log(data);
                                $scope.editData1.id = data.id;
                                if ($scope.editData1.xmlEndTag) {
                                    $scope.xmlEndTag = $scope.editData1.xmlEndTag;
                                    // console.log($scope.editData.xmlEndTag)
                                }
                                //console.log($scope.editData1.fileData.fileName);
                                if ($scope.editData1.fileData.fileName)
                                    $scope.fileName = $scope.editData1.fileData.fileName;
                                if ($scope.editData1.fileData.format) {
                                    $scope.editData1.format = $scope.editData1.fileData.format;
                                } else if ($scope.editData1.fileData.fileType) {
                                    $scope.editData1.fileType = $scope.editData1.fileData.fileType;
                                    $scope.editData1.format = $scope.editData1.fileData.fileType;
                                }
                                if ($scope.editData1.format == 'Fixed Width') {
                                    $scope.editData1.noofColumn = $scope.editData1.fileData.noofColumn;
                                    $scope.editData1.fixedValues = $scope.editData1.fileData.fixedValues;
                                } else if ($scope.editData1.format == 'Delimited') {
                                    $scope.editData1.rowDeli = $scope.editData1.fileData.rowDeli;
                                    $scope.editData1.colDeli = $scope.editData1.fileData.colDeli;
                                }
                                //console.log($scope.editData1.fileData.format);
                                // $scope.editData.xmlEndTag =
                                // data.xmlEndTag;
                                if (dbdetails != undefined) {
                                    $scope.dbDetails = new Object();
                                    $scope.dbDetails = angular
                                        .fromJson($scope.editData1.fileData);
                                    // console.log($scope.dbDetails.dbName);
                                    $('#detailDb')
                                        .modal('show');
                                }
                                $scope.ddArray = $scope.editData1.dataAttribute;
                                var i = 0;
                                angular
                                    .forEach(
                                        $scope.ddArray,
                                        function(attr) {
                                            $scope.ddArray[i].active = false;

                                            i++;
                                        });
                                // $scope.ddArray[0].active =
                                // true;

                            }).error(function(data, status) {
                            if (status == 401) {
                                $location.path('/');
                            }
                            $scope.data = data || "Request failed";
                            $scope.status = status;
                        });
                } else {
                    $("form#schemaForm").find(
                            "input[type=text], textarea,select")
                        .val("")
                    $('form#schemaForm').find(
                        'input:radio, input:checkbox').removeAttr(
                        'checked').removeAttr('selected');
                    $scope.editData1 = new Object();
                    $scope.ddArray = new Array();
                    $scope.ddObject1 = new Object();
                    $scope.ddObject1.active = true;
                    $scope.ddObject2 = new Object();
                    $scope.ddArray.push($scope.ddObject1);
                    $scope.ddArray.push($scope.ddObject2);

                }

                if (dbdetails == undefined) {
                    if ($scope.type == 'DataSchema' && id == undefined) {
                        $scope.viewing = false;

                        if ($scope.editData.addSchemaMed == 'Manual') {
                            $scope.editing = true;
                            $scope.schemaupload = false;
                            $scope.addSchema = false;
                        } else if ($scope.editData.addSchemaMed == 'Automatic') {

                            // Modal for Automatic

                            // console.log("Automatic");

                            $scope.showModal = function() {

                                var modalInstance = $modal
                                    .open({
                                        templateUrl: 'myModalContent.html',
                                        controller: 'ModalInstanceCtrl'
                                    });
                                // $scope.editData.addSchemaMed = '';

                                modalInstance.result.then(function() {
                                    // $scope.selected = selectedItem;
                                }, function() {
                                    // console.log('Modal dismissed at:
                                    // ' + new Date());
                                });

                            }();

                            $scope.editing = false;
                            // $scope.addSchema = false;
                            $scope.viewing = true;
                            $('#filepath').focus();
                        } else {
                            $scope.viewing = true;
                            $scope.editing = false;
                            $scope.schemaupload = false;
                        }
                        $scope.editData.addSchemaMed = "---Select---";
                    } else {
                        $scope.editing = true;
                        $scope.addSchema = false;
                        $scope.viewing = false;
                    }

                }

            }
            $scope.saveAddUpdateDataSource = function(editData) {
                $scope.data = {};
                $scope.data.name = editData.name;
                $scope.data.type = $location.path();
                $scope.data.type = $scope.data.type.replace(/\//g, '')
                $scope.editData.schema = editData.schema;
                $scope.editData.format = editData.format;
                $scope.editData.location = editData.location;
                $scope.editData.dataSource = editData.dataSource;
                $scope.editData.dataSourcerId = editData.name;
                $scope.data.jsonblob = angular.toJson(editData);
                $scope.method = 'POST';
                if (editData.id != undefined && editData.id != '') {
                    $scope.data.updatedBy = localStorage
                        .getItem('itc.username');
                    //$scope.data.updatedDate = new Date();
                    $scope.data.id = editData.id;
                    $scope.url = 'rest/service/' + $scope.data.type +
                        '/' + editData.id;

                } else {
                    $scope.data.createdBy = localStorage
                        .getItem('itc.username');
                    $scope.data.updatedBy = localStorage
                        .getItem('itc.username');
                    //$scope.data.createdDate = new Date();
                    $scope.url = 'rest/service/addEntity/';
                }

                $http({
                    method: $scope.method,
                    url: $scope.url,
                    data: $scope.data,
                    headers: headerObj
                }).success(
                    function(data, status) {
                        $scope.status = status;

                        schemaSourceDetails(myService, $scope,
                            $http, $templateCache, $rootScope,
                            $location);
                        $scope.editing = false;
                        $scope.viewing = true;

                    }).error(function(data, status) {
                    if (status == 401) {
                        $location.path('/');
                    }
                    $scope.data = data || "Request failed";
                    $scope.status = status;

                });

            }

            $scope.saveAddUpdateSchema = function(editData, dd, isQuit) {
                $scope.data = new Object();
                $scope.editData = new Object();
                //console.log(dd);
                $scope.data.name = editData.name;
                $scope.data.type = $location.path();
                $scope.data.type = $scope.data.type.replace(/\//g, '')
                $scope.editData.description = editData.description;
                // console.log($scope.editData.dataSchemaType)
                $scope.editData.dataSchemaType = editData.dataSchemaType
                $scope.editData.dataSourcerId = editData.name;
                $scope.editData.name = editData.name;
                //console.log(dd[0].Name);
                for (i = 0; i < dd.length; i++) {
                    //console.log(dd[i].Name);
                    if (dd[i].Name == undefined)
                        dd.splice(i, 1);
                }
                $scope.editData.dataAttribute = dd;
                $scope.editData.fileData = new Object();
                if ($scope.xmlEndTag != '') {
                    $scope.editData.xmlEndTag = $scope.xmlEndTag;
                } else if (editData.xmlEndTag) {
                    $scope.editData.xmlEndTag = editData.xmlEndTag;
                    //console.log($scope.editData.xmlEndTag );
                }


                /*if (editData.fileData.fileName){
                	$scope.editData.fileData.fileName = editData.fileData.fileName;
                }*/

                /*$scope.editData.fileData = new Object();*/
                //console.log($scope.editData.xmlEndTag);
                if (editData.format) {
                    $scope.editData.fileData.format = editData.fileType;
                    $scope.editData.fileData.fileType = editData.format;
                    //console.log(editData.format);
                    if (editData.fileType == 'Fixed Width') {
                        $scope.editData.fileData.noofColumn = editData.noofColumn;
                        $scope.editData.fileData.fixedValues = editData.fixedValues;
                    } else if (editData.format == 'Delimited') {
                        $scope.editData.fileData.rowDeli = editData.rowDeli;
                        $scope.editData.fileData.colDeli = editData.colDeli;
                    }
                }
                if (editData.id != undefined && editData.id != '') {
                    if ($scope.fileName) {
                        $scope.editData.fileData.fileName = $scope.fileName;
                    }
                }
                //console.log($scope.editData.fileData.fileName );
                //$scope.fileData
                $scope.data.jsonblob = angular.toJson($scope.editData);
                //console.log($scope.editData);
                $scope.method = 'POST';
                if (editData.id != undefined && editData.id != '') {

                    $scope.data.updatedBy = localStorage
                        .getItem('itc.username');
                    $scope.data.id = editData.id;
                    $scope.url = 'rest/service/' + $scope.data.type +
                        '/' + editData.id; // 'http://jsonblob.com/api/54215e4ee4b00ad1f05ed73d';
                    $http({
                        method: $scope.method,
                        url: $scope.url,
                        data: $scope.data,
                        headers: headerObj
                    }).success(
                        function(data, status) {
                            $scope.status = status;
                            // var fromAutoSchema = false;
                            // $rootScope.fromAutoSchema = false;
                            $scope.data = data;
                            $scope.dataschema = $scope.data
                            $scope.editSchema = true;
                            // console.log(isQuit)
                            if (isQuit != undefined) {
                                schemaSourceDetails(myService,
                                    $scope, $http,
                                    $templateCache, $rootScope,
                                    $location, 'DataSchema');

                            } else {
                                myService.set($scope);
                                $location.path('/ValidationRule/');
                            }

                            /*
                             * schemaSourceDetails(myService,$scope,
                             * $http, $templateCache, $rootScope,
                             * $location);
                             */
                        }).error(function(data, status) {
                        if (status == 401) {
                            $location.path('/');
                        }
                        $scope.data = data || "Request failed";
                        $scope.status = status;
                    });
                } else {
                    $scope.data.createdBy = localStorage
                        .getItem('itc.username');
                    $scope.data.updatedBy = localStorage
                        .getItem('itc.username');
                    $scope.url = 'rest/service/addEntity/';
                    $scope.data.dataSchemaType = 'Manual';
                    $scope.fileData = new Object();
                    $scope.fileData.fileType = editData.format;
                    if (editData.format == 'Fixed Width') {
                        $scope.fileData.noofColumn = editData.noofColumn;
                        $scope.fileData.fixedValues = editData.fixedValues;
                    } else if (editData.format == 'Delimited') {
                        $scope.fileData.rowDeli = editData.rowDeli;
                        $scope.fileData.colDeli = editData.colDeli;
                    }
                    $scope.data.fileData = $scope.fileData;
                    // console.log($scope.data);
                    myService.set($scope.data);

                    $location.path("/IngestionSummary/");
                }

            }
            $scope.canceloparation = function() {
                $scope.editing = false;
                $scope.schemaupload = false;
                $scope.viewing = true;
                $scope.addSchema = true;
                $scope.schemanamenotok = false;
                // $scope.editData.addSchemaMed = '';
            }

            $scope.delete1 = function() {
                currentUser = $scope.Deluser;
                objDel = $scope.DelObj;
                // alert(currentUser)
                $scope.deleteRecord(currentUser, objDel);
            };
            $scope.showconfirm = function(id, obj) {
                $scope.Deluser = id;
                $scope.DelObj = obj;
                $('#deleteConfirmModal').modal('show');
            };
            $scope.getName = function(s) {
                return s.replace(/^.*[\\\/]/, '');
            }
            var myVar;
            $scope.runScheduler = function(scedulerID, schedulerName,
                schemaid) {
                $('#' + schemaid + 'loader').show();
                $scope.jobStatusArr[scedulerID] = 'Started';
                //	$scope.getJobStatus();
                stopckhStatus = $interval(function() {
                    $scope.getJobStatus();
                }, 15000);
                myVar = setTimeout(function() {
                    // console.log(schemaid);
                    $scope.method = 'POST'
                    $scope.fileData = new Object();
                    $scope.url = 'rest/service/runScheduler/' +
                        schedulerName;
                    $http({
                        method: $scope.method,
                        url: $scope.url,
                        // cache : $templateCache
                        headers: headerObj
                    }).success(function(data, status) {
                        $scope.status = status;
                        //sleep(1000);
                        $('#' + schemaid + 'loader').hide();
                        //schemaSourceDetails(myService,$scope, $http,$templateCache, $rootScope,$location, 'DataSchema');
                    }).error(function(data, status) {
                        if (status == 401) {
                            $location.path('/');
                        }
                        $scope.data = data || "Request failed";
                        $scope.status = status;
                        $('#' + schemaid + 'loader').hide();
                        /*$('#runFN').html(data.fileName);
                        $('#runBT').html(data.fileSize);
                        $('#runTT').html(data.timeTaken);
                        $('#confirmRun').modal('show');*/
                    });
                }, 3000);
            }
            $scope.chartData = new Object();
            $scope.getIngestionLog = function(id) {
                $scope.getMyId = id;

                // alert($('#dataIngestionLog').css('display'));
                /*
                 * if($('#dataIngestionLog').css('display') == 'block' ||
                 * direct != undefined){
                 */

                // console.log($scope.getMyId);
                $scope.method = 'GET';

                $scope.url = 'rest/service/listIngestionDetails/' + id;

                $http({
                        method: $scope.method,
                        url: $scope.url,
                        headers: headerObj
                    })
                    .success(
                        function(data, status) {
                            $scope.status = status;
                            $scope.dataIngLog = data;
                            if ($scope.dataIngLog.ingestionStart != null) {
                                $scope.dataIngLog.ingestionStartArr = $scope.dataIngLog.ingestionStart
                                    .split('|');
                            }

                            if ($scope.dataIngLog.ingestionFails != null) {
                                $scope.dataIngLog.ingestionFailsArr = $scope.dataIngLog.ingestionFails
                                    .split('|');
                            }
                            if ($scope.dataIngLog.ingestionComplete != null) {
                                $scope.dataIngLog.ingestionCompleteArr = $scope.dataIngLog.ingestionComplete
                                    .split('|');
                                TableArray = new Array();
                                $scope.dataIngLog.completeTableArray = new Array();
                                //console.log($scope.dataIngLog.ingestionCompleteArr[0]);
                                if ($scope.dataIngLog.ingestionCompleteArr[0].indexOf('~') !== -1) {
                                    $scope.dataIngLog.ingestionCompleteArrTemp = $scope.dataIngLog.ingestionCompleteArr[0]
                                        .split('~');

                                    TableArray = $scope.dataIngLog.ingestionCompleteArrTemp[1].split('#');
                                    //console.log(TableArray);
                                    for (var i = 0; i < TableArray.length; i++) {
                                        $scope.dataIngLog.completeTableArray[i] = TableArray[i].split('@');
                                        //console.log($scope.dataIngLog.completeTableArray[i]);
                                    }
                                } else {
                                    $scope.dataIngLog.ingestionCompleteArrTemp = new Array();
                                    $scope.dataIngLog.ingestionCompleteArrTemp[0] = $scope.dataIngLog.ingestionCompleteArr[0];
                                }
                            }

                            if ($scope.dataIngLog.validationStart != null) {
                                $scope.dataIngLog.validationStartArr = $scope.dataIngLog.validationStart
                                    .split('|');

                            }
                            // console.log($scope.dataIngLog.validationStartArr[0]);
                            if ($scope.dataIngLog.validationComplete != null) {
                                $scope.dataIngLog.validationCompleteArr = $scope.dataIngLog.validationComplete
                                    .split('|');
                            }
                            // console.log($scope.dataIngLog.ingestionStartArr[0]);
                            if ($scope.dataIngLog.noOfRecords != 0) {
                                $scope.chartData = [
                                    [
                                        'No Of Cleansed',
                                        $scope.dataIngLog.noOfCleansed
                                    ],
                                    [
                                        'No Of Range Fails',
                                        $scope.dataIngLog.validationLogDetails.noOfRangeFails
                                    ],
                                    [
                                        'No Of Regex Fails',
                                        $scope.dataIngLog.validationLogDetails.noOfRegexFails
                                    ],
                                    [
                                        'No Of Fixed Length Fails',
                                        $scope.dataIngLog.validationLogDetails.noOfFixedlLengthFails
                                    ],
                                    [
                                        'No Of WhiteList Fails',
                                        $scope.dataIngLog.validationLogDetails.noOfWhiteListFails
                                    ],
                                    [
                                        'No Of BlackList Fails',
                                        $scope.dataIngLog.validationLogDetails.noOfBlackListFails
                                    ],
                                    [
                                        'No Of Strict Validation Fails',
                                        $scope.dataIngLog.validationLogDetails.noOfMandatoryFails
                                    ],
                                    [
                                        'No Of DataTypeMismatch Fails',
                                        $scope.dataIngLog.validationLogDetails.noOfDataTypeMismatchFails
                                    ],
                                    [
                                        'No Of ColumnMismatch Fails',
                                        $scope.dataIngLog.validationLogDetails.noOfColumnMismatchFails
                                    ],
                                    [
                                        'No Of other Fails',
                                        $scope.dataIngLog.validationLogDetails.noOfotherFails
                                    ]
                                ];
                            } else {
                                $scope.chartData = [];
                            }

                            // $scope.charDraw($scope.dataIngLog);
                            // console.log($scope.dataIngLog);
                            $('#dataIngestionLog')
                                .modal('show')
                        }).error(function(data, status) {
                        if (status == 401) {
                            $location.path('/');
                        }
                        $scope.data = data || "Request failed";
                        $scope.status = status;
                    });
                /* } */

            }
            $scope.chartTitle = "Ingestion Log Chart";
            $scope.chartWidth = 500;
            $scope.chartHeight = 200;
            /*
             * $scope.chartData = [ ['Work', 11], ['Eat', 2],
             * ['Commute', 2], ['Watch TV', 2], ['Sleep', 7] ];
             */
            $scope.getProject = function(name) {
                $scope.method = 'GET';
                $scope.data.createdBy = localStorage.getItem('itc.username');
                $scope.data.updatedBy = localStorage.getItem('itc.username');
                $scope.url = 'rest/service/getUsedProjectList/' + name;
                $http({
                    method: $scope.method,
                    url: $scope.url,
                    data: $scope.data,
                    headers: headerObj
                }).success(
                    function(data, status) {
                        $scope.status = status;
                        if (data.length == 0) {
                            alert('No project associated with the profile');
                            return false;
                        } else {
                            $scope.liniageData = new Object();
                            $scope.liniageData.projectlist = data;
                            $scope.liniageData.profileName = name;
                            //console.log($scope.liniageData);
                            myService.set($scope.liniageData);
                            $location.path('/dataLiniage/');
                        }
                        //console.log(data)

                    }).error(function(data, status) {
                    if (status == 401) {
                        $location.path('/');
                    }
                    $scope.data = data || "Request failed";
                    $scope.status = status;

                });
            }


            $scope.callBulk = function(statusBulk, schemaname) {

                console.log('schemaname:' + schemaname);
                $scope.profileName = schemaname;
                
                $scope.bObj = new Object();
                $scope.bObj.name = schemaname;
               
                $scope.method = 'GET';

                $scope.url = 'rest/service/bulkProfiles/' + schemaname;
                $http({
                    method: $scope.method,
                    url: $scope.url,
                    data: $scope.bObj,
                    headers: headerObj
                }).success(
                    function(data, status) {
                        $scope.status = status;
                        //console.log('response data:'+data);
                        $scope.bulkData = data;
                        
                    }).error(function(data, status) {
                    if (status == 401) {
                        $location.path('/');
                    }
                    $scope.data = data || "Request failed";
                    $scope.status = status;

                });
                console.log('bulkData:'+JSON.stringify($scope.bulkData,null,4));
                $('#bulkModal').modal('show');
            }
            $scope.disableRun = function(source){
                
                
                if(source!= null){
                var local = source.split('_');
                var searchSource = local[local.length - 1];
                
                return 'Source'==searchSource;

                 
                }
            }            
            

        });