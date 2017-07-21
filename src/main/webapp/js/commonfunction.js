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
		
		//when clicked on devices
		
		$scope.detaildataSchema='[]';
		
/*
    $scope.method = 'GET';
    $scope.type = $location.path();
    $scope.type = $scope.type.replace(/\//g, '');
    if ($tabType != undefined) {
        $scope.type = $tabType;
    } else {
        $tabType = $scope.type;
    }
  if ($tabType == 'Topics') {

        $scope.url = 'http://13.126.228.155:8081/NotificationPlatform/getAllTopics';
    } 
    $http({
            method: $scope.method,
            url: $scope.url,
            // cache : $templateCache
            headers: headerObj
        })
        .success(
            function(data, status) {
                $scope.data = data;
				console.log(data);
                
            }).error(function(data, status) {
            if (status == 401) {
                $location.path('/');
            }
            $scope.data = data || "Request failed";
            $scope.status = status;
        });
		*/
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