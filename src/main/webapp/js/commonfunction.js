var selectedComapare;
var listWorkspace = function($scope, $http) {
    $scope.url = 'rest/service/listObject/workspace';
    $scope.method = 'GET';
    $http({
        method: $scope.method,
        url: $scope.url,
        // cache : $templateCache
        headers: headerObj
    }).success(function(data, status) {
        $scope.workSpaceList = data;
        $scope.worksapceNamearray = angular.fromJson($scope.workSpaceList);
        var i = 0;
        $scope.workSpaceName = new Array()
        angular.forEach($scope.worksapceNamearray, function(attr) {
            $scope.workSpaceName[i] = attr.name;
            i++;
        });
        //$scope.editData.workSpace = jsonData[0];
        //	$scope.editData.initWork = jsonData[0];
        //console.log($scope.editData.workSpace)
        $scope.status = status;
        //	$('#prpertyTD').show();
    }).error(function(data, status) {
        if (status == 401) {
            $location.path('/');
        }
        $scope.data = data || "Request failed";
        $scope.status = status;
    });

}
var getTypeList = function($scope, $http, $rootScope) {
    $scope.method = 'GET';
    $scope.url = 'rest/service/list/dataschema';
    $http({
        method: $scope.method,
        url: $scope.url,
        // cache : $templateCache
        headers: headerObj
    }).success(function(data, status) {
        $scope.data = data;
        $scope.editdataData = new Object();
        $scope.editdataData.Schema = $scope.data[0];
        $scope.status = status;

    }).error(function(data, status) {
        if (status == 401) {
            $location.path('/');
        }
        $scope.data = data || "Request failed";
        $scope.status = status;
    });

}

var getDataSource = function($scope, $http, $rootScope) {
    $scope.method = 'GET';
    $scope.url = 'rest/service/list/DataSource';
    $http({
        method: $scope.method,
        url: $scope.url,
        // cache : $templateCache
        headers: headerObj
    }).success(function(data, status) {
        $scope.data = data;
        $scope.status = status;
        $scope.editData.dataSource = $scope.data[0];
        // $scope.editData.destinationDataset = $scope.data[0];

    }).error(function(data, status) {
        if (status == 401) {
            $location.path('/');
        }
        $scope.data = data || "Request failed";
        $scope.status = status;
    });

}

var getDataSet = function($scope, $http, $rootScope) {
    $scope.method = 'GET';
    $scope.url = 'rest/service/list/dataset';
    $http({
        method: $scope.method,
        url: $scope.url,
        // cache : $templateCache
        headers: headerObj
    }).success(function(data, status) {
        $scope.data = data;
        $scope.editData.destinationDataset = $scope.data[0];
        $scope.status = status;
        // $scope.editData.dataSet=$scope.data[0];

    }).error(function(data, status) {
        if (status == 401) {
            $location.path('/');
        }
        $scope.data = data || "Request failed";
        $scope.status = status;
    });

}
var schemanameCheck = function(schemaName, $scope, $http, $templateCache,
    $rootScope, $location, $tabType, type) {



    if (schemaName != undefined) {
        $scope.schemaName = new Object();
        $scope.type = type;
        console.log($scope.type)
        $scope.method = 'POST';
        $scope.url = 'rest/service/schemaNameCheck/';
        $scope.schemaName.name = schemaName;

        $http({
            method: $scope.method,
            url: $scope.url,
            data: $scope.schemaName,
            // cache : $templateCache
            headers: headerObj
        }).success(function(data, status) {
            $scope.status = status;

            if (data == 'true') {

                if ($scope.type == 'Bulk') {

                    $scope.bulknamenotok = true;
                } else {

                    $scope.schemanamenotok = true;
                }

            } else if (data == 'false') {
                if ($scope.type == 'Bulk') {

                    $scope.bulknamenotok = false;
                } else {

                    $scope.schemanamenotok = false;
                }
            }

            // datapreview = data
        }).error(function(data, status) {
            if (status == 401) {
                $location.path('/');
            }
        });

    }

}


var getHeader = function($scope, $location) {
    if (localStorage.getItem("itc.userRole") == null) {
        $location.path('/');
    }
    $scope.userRole = localStorage.getItem("itc.userRole");
    if ($scope.userRole == 'admin') {
        $('#isAdmin').show();
    } else {
        $('#isAdmin').hide();
    }
    $scope.userDName = localStorage.getItem('itc.dUsername');
    $("#userDName").text(localStorage.getItem('itc.dUsername'));
    // console.log('$scope.userRole'+$scope.userRole);
}
var schemaSourceDetails = function(myService, $scope, $http, $templateCache,
    $rootScope, $location, $tabType, $filter) {

    // $scope.itemsPerPage = 2;
    // $scope.currentPage = 1;
    /*
     * if(localStorage.getItem('itc.authToken')){ var authToken =
     * localStorage.getItem('itc.authToken'); $rootScope.authToken = authToken; }
     */
    // console.log($rootScope.authToken);
    $scope.method = 'GET';
    $scope.type = $location.path();
    $scope.type = $scope.type.replace(/\//g, '');
    if ($tabType != undefined) {
        $scope.type = $tabType;
    } else {
        $tabType = $scope.type;
    }
    if ($tabType == 'DataSchema') {

        $scope.url = 'rest/service/profiles';
    } else if ($tabType == 'driver') {
        $scope.url = 'rest/service/getStreamDrivers';
    } else if ($tabType == 'project' || $tabType == 'module') {
        $scope.url = 'rest/service/listObject/' + $scope.type;
    } else {
        $scope.url = 'rest/service/' + $scope.type;
    }
    // 'http://jsonblob.com/api/54215e4ee4b00ad1f05ed73d';//http://jsonblob.com/api/541aa950e4b0ad15b49f3cfd
    // alert($scope.url)
    $http({
            method: $scope.method,
            url: $scope.url,
            // cache : $templateCache
            headers: headerObj
        })
        .success(
            function(data, status) {

                $scope.status = status;
                $scope.data = data;
                if ($tabType == 'DataSchema') {
                    $scope.detaildataSchema = {};
                    $scope.editData.addSchemaMed = "---Select---";
                } else if ($tabType == 'DataSource') {
                    $scope.detaildataSource = {};
                } else if ($tabType == 'DataSet') {
                    $scope.detaildataSet = new Array();
                } else if ($tabType == 'DataIngestion') {
                    $scope.detaildataIngestion = {};
                } else if ($tabType == 'DatapipeWorkbench') {
                    $scope.detaildataPipe = {};
                } else if ($tabType == 'project' || $tabType == 'module') {
                    $scope.detaildataPipe = {};
                } else if ($tabType == 'PipelineStage') {
                    $scope.allStages = {};
                    $scope.detaildataPipeStageMap = new Object();
                    // console.log($scope.detaildataPipeStageMap.length);
                    $scope.detaildataPipeStageHive = new Object();
                    $scope.detaildataPipeStagePig = new Object();
                    $scope.detaildataPipeStageSpark = new Object();
                } else if ($tabType == 'Streaming') {
                    $scope.detailStreaming = {};
                } else if ($tabType == 'driver') {
                    $scope.detailDriver = {};
                }
                $scope.totalItems = $scope.data.length;
                // console.log('total'+$scope.totalItems)
                /*
                 * $scope.pageCount = function () { return
                 * Math.ceil($scope.data.length / $scope.itemsPerPage); };
                 */

                // $scope.data.$promise.then(function () {
                /*
                 * $scope.$watch('currentPage + itemsPerPage',
                 * function() { var begin = (($scope.currentPage - 1) *
                 * $scope.itemsPerPage), end = begin +
                 * $scope.itemsPerPage; // alert(end);
                 * $scope.filtereddetaildata1 = $scope.data.slice(begin,
                 * end);
                 */

                $scope.detaildata = angular.fromJson($scope.data);
                //console.log($scope.detaildata.length);
                $scope.totalSourcer = $scope.detaildata.length;
                //console.log('count'+$scope.totalSource);
                if ($scope.detaildata.length == 0) {
                    console.log($tabType)
                    if ($tabType == 'project' || $tabType == 'module') {
                        $('#projectLoader').hide();
                        $('#pipeGraph').show();
                    } else if ($tabType == 'Streaming') {
                        $('#streamLoader').hide();
                        $('#streamingCtrlpage').show();

                        // $scope.detailStreaming = {};
                    } else if ($tabType == 'DataSchema') {
                        $('#profileLoader').hide();
                        $('#dataSchemaSourcepage').show()
                    } else if ($tabType == 'DataSchema') {
                        $('#profileLoader').hide();
                        $('#dataSchemaSourcepage').show()
                    }
                }
                if ($tabType == 'DataSchema') {
                    $scope.detaildataSchema = $scope.detaildata;

                } //schemaJsonBlob
                // console.log($scope.detaildata);
                i = 0;
                angular
                    .forEach(
                        $scope.detaildata,
                        function(attr) {

                            if ($tabType == 'DataSource') {
                                $scope.detaildataSource[i] = angular
                                    .fromJson(attr.jsonblob);
                                $scope.detaildataSource[i].id = attr.id;
                            } else if ($tabType == 'DataSchema') {

                                $scope.editData[i] = new Object();
                                $scope.editData[i] = angular
                                    .fromJson(attr.schemaJsonBlob);
                                //console.log($scope.editData[i].fileName)
                                if ($scope.editData[i].fileName != undefined) {

                                    $scope.detaildataSchema[i].fileName = $scope.editData[i].fileName;
                                }

                                if (attr.schemaModificationDate) {
                                    $scope.detaildataSchema[i].lastModified = getDateFormat(attr.schemaModificationDate);
                                    $scope.detaildataSchema[i].lastModifiedtimestamp = Date.parse(attr.schemaModificationDate);
                                } else
                                    $scope.detaildataSchema[i].lastModified = '';
                                $scope.detaildataSchema[i].dataSchemaType = $scope.editData[i].dataSchemaType;
                                $scope.jobStatusArr[attr.scedulerID] = attr.jobStatus;
                                //	console.log($scope.jobStatusArr)
                                $scope.detaildataSchema[i].profile = true;
                                $('#profileLoader').hide();
                                $('#dataSchemaSourcepage').show()
                            } else if ($tabType == 'DataSet') {
                                $scope.detaildataSet[i] = angular
                                    .fromJson(attr.jsonblob);
                                $scope.detaildataSet[i].id = attr.id;

                            } else if ($tabType == 'DataIngestion') {
                                $scope.detaildataIngestion[i] = angular
                                    .fromJson(attr.jsonblob);
                                $scope.detaildataIngestion[i].id = attr.id;
                            } else if ($tabType == 'DatapipeWorkbench') {
                                $scope.detaildataPipe[i] = angular
                                    .fromJson(attr.jsonblob);
                                $scope.detaildataPipe[i].id = attr.id;
                            } else if ($tabType == 'project' || $tabType == 'module') {
                                if (attr.jsonblob != null) {
                                    $scope.detaildataPipe[i] = angular
                                        .fromJson(attr.jsonblob);
                                    //console.log($scope.detaildataPipe[i]);
                                    $scope.detaildataPipe[i].id = attr.id;
                                    $scope.detaildataPipe[i].version = attr.version;
                                    $scope.detaildataPipe[i].schemaType = $tabType;
                                    $scope.detaildataPipe[i].created_by = attr.created_by;
                                    $scope.detaildataPipe[i].workspace_name = attr.workspace_name;
                                    $scope.detaildataPipe[i].permissionLevel = attr.permissionLevel;
                                    $scope.detaildataPipe[i].created = attr.created;
                                    $scope.detaildataPipe[i].lastModifiedtimestamp = Date.parse(attr.created);
                                }
                                $('#projectLoader').hide();
                                $('#pipeGraph').show();

                            } else if ($tabType == 'Streaming') {
                                $scope.detailStreaming[i] = angular
                                    .fromJson(attr);
                                //console.log(JSON.stringify($scope.detailStreaming,null,4))
                                //$scope.detailStreaming[i].id = attr.id;
                                $('#streamLoader').hide();
                                $('#streamingCtrlpage').show();

                                // $scope.detailStreaming = {};
                            } else if ($tabType == 'driver') {
                                $scope.detailDriver[i] = attr;
                                $scope.detailDriver[i].id = attr.driverId;
                                // $scope.detailStreaming = {};
                            } else if ($tabType == 'PipelineStage') {
                                var stageArray = angular
                                    .fromJson(attr.jsonblob);
                                $scope.allStages[i] = stageArray;
                                $scope.allStages[i].id = attr.id;
                                // myService.set($scope.allStages);
                                if (stageArray.seletType == 'MapReduce') {
                                    $scope.detaildataPipeStageMap[i] = stageArray;
                                    $scope.detaildataPipeStageMap[i].id = attr.id;
                                } else if (stageArray.seletType == 'Hive') {
                                    $scope.detaildataPipeStageHive[i] = stageArray;
                                    $scope.detaildataPipeStageHive[i].id = attr.id;

                                } else if (stageArray.seletType == 'Pig') {
                                    $scope.detaildataPipeStagePig[i] = stageArray;
                                    $scope.detaildataPipeStagePig[i].id = attr.id;

                                } else if (stageArray.seletType == 'Spark') {
                                    $scope.detaildataPipeStageSpark[i] = angular
                                        .fromJson(attr.jsonblob);
                                    $scope.detaildataPipeStageSpark[i].id = attr.id;
                                    // alert($scope.detaildataPipeStageSpark[i].id);

                                }

                            }

                            i++;
                        });

                if ($tabType == 'project' || $tabType == 'module' || $tabType == 'DatapipeWorkbench') {
                    if (selectedPipeId == '') {
                        if ($scope.detaildata[0].id)
                            selectedPipeId = $scope.detaildata[0].id;
                        selectedversion = $scope.detaildata[0].version;
                    } else {
                        var selId = Object.keys($scope.detaildataPipe).length - 1;

                        selectedPipeId = $scope.detaildataPipe[selId].id;
                        selectedversion = $scope.detaildata[selId].version;

                    }


                    //console.log(selectedPipeId);
                    // alert(selectedPipeId)
                    /*if ($tabType == 'project' || $tabType == 'module')
                    	$scope.selectPipeline(selectedPipeId,'',selectedversion,'first');
                    else
                    	$scope.selectPipeline(selectedPipeId);*/

                    /*
                     * Added by 19726 on 16-11-2016
                     * Custom Date sort function 
                     */
                    $scope.propertyName = 'created'; //Project
                    $scope.reverse = true;
                    $scope.lastModifiedtimestamp = $scope.detaildataPipe;

                    $scope.orderByField2 = function(propertyName) {

                        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
                        $scope.propertyName = propertyName;

                    };
                    /////////////////////////////////

                }
                if ($tabType == 'DataSet') {
                    /*	$scope.editstageData.inputDataset = $scope.detaildataSet[0].name;
                    	$scope.editstageData.outDataset = $scope.detaildataSet[0].name;*/
                    // console.log($scope.editstageData);

                }
                // });
                if ($tabType == 'PipelineStage') {
                    $scope.mapLength = Object
                        .keys($scope.detaildataPipeStageMap).length;
                    $scope.hiveLength = Object
                        .keys($scope.detaildataPipeStageHive).length;
                    $scope.pigLength = Object
                        .keys($scope.detaildataPipeStagePig).length;
                    $scope.sparkLength = Object
                        .keys($scope.detaildataPipeStageSpark).length;
                    //
                }
                if ($tabType == 'DataSchema')
                    console.log($scope.jobStatusArr)
                //$scope.getScope();
                //$scope.toggleOpen()
                $scope.totalSourcer = $scope.detaildata.length;

                $scope.editing = false;
                $scope.viewing = true;
                $scope.addSchema = true;
                /*
                 * Added by 19726 on 16-11-2016
                 * Custom Date sort function
                 */
                $scope.propertyName = 'lastModified'; //Datasets
                $scope.reverse = false;
                $scope.lastModified = $scope.detaildataSchema;

                $scope.orderByField = function(propertyName) {

                    $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : true;
                    $scope.propertyName = propertyName;
                };
                /////////////////////////////////
            }).error(function(data, status) {
            if (status == 401) {
                $location.path('/');
            }
            $scope.data = data || "Request failed";
            $scope.status = status;
        });
}
var schemaSourceDropDetails = function($scope, $http, $templateCache,
    $rootScope, $location, $tabType) {

    // $scope.itemsPerPage = 2;
    // $scope.currentPage = 1;

    $scope.method = 'GET';
    $scope.schemaDetail = {};
    $scope.type = $tabType;

    $scope.url = 'rest/service/list/' + $scope.type; // 'http://jsonblob.com/api/54215e4ee4b00ad1f05ed73d';//http://jsonblob.com/api/541aa950e4b0ad15b49f3cfd
    // alert($scope.url)
    $http({
        method: $scope.method,
        url: $scope.url,
        // cache : $templateCache
        headers: headerObj
    }).success(function(data, status) {

        $scope.status = status;
        $scope.schemaDetail = data;
        $scope.editData.schema = $scope.schemaDetail[0];

    }).error(function(data, status) {
        if (status == 401) {
            $location.path('/');
        }
        $scope.data = data || "Request failed";
        $scope.status = status;
    });

}
var typeFormatFetch = function($scope, $http, $templateCache, $rootScope,
    $location, dataType, pageurl) {

    // $scope.itemsPerPage = 2;
    // $scope.currentPage = 1;

    $scope.method = 'GET';

    $scope.type = $location.path();
    $scope.type = $scope.type.replace(/\//g, '');
    if (pageurl != undefined) {
        $scope.type = pageurl;
    }
    $scope.url = 'rest/service/list/' + $scope.type + '/' + dataType; // 'http://jsonblob.com/api/54215e4ee4b00ad1f05ed73d';//http://jsonblob.com/api/541aa950e4b0ad15b49f3cfd
    // alert($scope.url)
    $http({
        method: $scope.method,
        url: $scope.url,
        // cache : $templateCache
        headers: headerObj
    }).success(function(data, status) {

        $scope.status = status;
        if (dataType == 'Format') {

            $scope.sourceFormat = {};
            $scope.sourceFormat = data;
            if ($scope.editData.format == undefined)
                $scope.editData.format = $scope.sourceFormat[0];
        } else if (dataType == 'Type') {
            $scope.sourceType = {};
            $scope.sourceType = data;
            if (pageurl == undefined) {
                $scope.editData.sourcerType = $scope.sourceType[0];
            }
            // $scope.dd.dataType = $scope.sourceType[0];
        } else if (dataType == 'Frequency') {
            $scope.sourceFreq = {};
            $scope.sourceFreq = data;
            $scope.editData.frequency = $scope.sourceFreq[0];
            // $scope.dd.dataType = $scope.sourceType[0];
        } else if (dataType == 'stageType') {
            $scope.stageType = {};
            $scope.stageType = data;
            $scope.editstageData.seletType = $scope.stageType[1];
            // console.log($scope.editData.seletType);
        }

    }).error(function(data, status) {
        if (status == 401) {
            $location.path('/');
        }
        $scope.data = data || "Request failed";
        $scope.status = status;
    });

}
var getDateFormat = function(timemodi) {
    var lastModified = new Date(timemodi);
    var year = lastModified.getFullYear();
    var month = lastModified.getMonth() + 1;
    var date = lastModified.getDate();
    var hour = lastModified.getHours();
    var min = lastModified.getMinutes();
    var sec = lastModified.getSeconds();
    return date + '/' + month + '/' + year + ' ' + hour + ':' + min + ':' + sec;
}


var getLogonUser = function($scope, $http, $templateCache,
    $rootScope, $location, userName) {
    //console.log("In getLogonUser");
    $scope.method = 'GET';
    $scope.url = 'rest/service/usergroup/getUser/' + userName;
    $http({
            method: $scope.method,
            url: $scope.url,
            data: $scope.data,
            headers: headerObj
        })
        .success(
            function(data, status) {
                //console.log("data");
                $rootScope.userProfileData = data;
                //console.log($scope.userProfileData);
                $scope.status = status;
                $rootScope.su = data.isSuperUser;
                //console.log("$rootScope.su");
                //console.log($rootScope.su);
            })
        .error(
            function(data, status) {
                //console.log("failed");
                $scope.data = data ||
                    "Request failed";
                $scope.status = status;
                $rootScope.su = false;
            });
}
var showGroupDetails = function($scope, $rootScope, $location, $http) {
    delete $scope.editgroupData;
    $scope.method = 'GET';
    $scope.url = 'rest/service/usergroup/listGroup/';
    $scope.userGroupDetails = new Object();
    $scope.userGrpPerm = {};
    $http({
        method: $scope.method,
        url: $scope.url,
        headers: headerObj
    }).success(function(data, status) {
        //console.log("userGroupDetails");
        //	console.log(data);
        $scope.status = status;
        $scope.userGroupDetails = data;
        var i = 0;
        angular.forEach(data, function(attr) {
            $scope.userGroupDetails[i].grpprofile = true;
            i++;
        });
        angular.forEach($scope.userGroupDetails, function(grp) {
            $scope.userGrpPerm[grp.groupName] = new Array();
            //$scope.userGrpPerm[grp.groupName].push('r');
        });
        //console.log("$scope.userGrpPerm");
        //console.log($scope.userGrpPerm);
    }).error(function(data, status) {
        if (status == 401) {
            $location.path('/');
        }
        $scope.data = data || "Request failed";
        $scope.status = status;
    });
}
var showuserdetails = function($scope, $rootScope, $location, $http) {
    delete $scope.edituserData;
    $scope.method = 'GET';
    $scope.url = 'rest/service/usergroup/listUsers/';
    $scope.userListDetails = new Object();
    $scope.edituserData = new Object();
    $scope.role = ["admin", "user", "abc"];
    $scope.edituserData.role = $scope.role[0];
    $http({
        method: $scope.method,
        url: $scope.url,
        // cache : $templateCache
        headers: headerObj
    }).success(function(data, status) {

        $scope.status = status;
        $scope.userListDetails = data;
        //console.log("$scope.userListDetails");
        //console.log($scope.userListDetails);
        var i = 0;
        angular.forEach(data, function(attr) {
            $scope.userListDetails[i].userprofile = true;

            i++;
        });
        $('#userLoader').hide();
        $('#userDetailsPage').show()
    }).error(function(data, status) {
        if (status == 401) {
            $location.path('/');
        }
        $scope.data = data || "Request failed";
        $scope.status = status;
        $('#userLoader').hide();
        $('#userDetailsPage').show()
    });
}


var stopProcess = function($rootScope, $scope, $http, $location, type, schemaId, schedularId) {

    /* Added by 19726 on 29-11-2016
     * Once the project ingestion start, 
     * this api provides to stop running process
     */

    if (type == 'project' && $rootScope.selectedPipeType == 'Ingestion') {

        $scope.method = 'DELETE';
        $scope.url = 'rest/service/project/ingestion/' + selectedPipeId + '/' + selectedversion;

        $http({
            method: $scope.method,
            url: $scope.url,
            headers: headerObj
        }).success(
            function(data, status) {

                $scope.status = status;
                $scope.data = data;
                if ($scope.data == 'success') {
                    $scope.projectRun[selectedPipeId] = false;
                    $scope.runStop = $scope.projectRun[selectedPipeId];
                }

            }).error(function(data, status) {
            console.log("Error ->" + data);
            if (status == 401) {
                alert(data)
            }
            if (status == 403) {
                $location.path('/');
            }
            $scope.data = data || "Request failed";
            $scope.status = status;

        });

    } else {

        $scope.method = 'GET';
        if (type == 'project') {
            $scope.url = 'rest/service/dashboard/stopProcess/' + type + '/' + selectedPipeId;

            $http({
                method: $scope.method,
                url: $scope.url,
                // data : scope.data,
                headers: headerObj
            }).success(
                function(data, status) {
                    $scope.status = status;
                    $scope.data = data;
                    if ($scope.data == 'Process terminated.') {
                        $scope.projectRun[selectedPipeId] = false;
                        $scope.runStop = $scope.projectRun[selectedPipeId];
                    } else if ($scope.data == 'Termination of running process not possible.') {
                        alert($scope.data);
                    }
                }).error(function(data, status) {
                if (status == 401) {
                    alert(data)
                }
                if (status == 403) {
                    $location.path('/');
                }
                $scope.data = data || "Request failed";
                $scope.status = status;

            });
        } else {

            $scope.url = 'rest/service/dashboard/stopProcess/' + type + '/' + schemaId;
            // console.log(scope.url);
            $http({
                method: $scope.method,
                url: $scope.url,
                // data : scope.data,
                headers: headerObj
            }).success(
                function(data, status) {
                    $scope.status = status;
                    $scope.data = data;
                    if ($scope.data == 'Process terminated.') {
                        $scope.jobStatusArr[schedularId] = 'Failed';
                    } else if ($scope.data == 'Termination of running process not possible.') {
                        alert($scope.data);
                    }
                }).error(function(data, status) {
                if (status == 401) {
                    alert(data)
                }
                if (status == 403) {
                    $location.path('/');
                }
                $scope.data = data || "Request failed";
                $scope.status = status;

            });
        }
    }

}