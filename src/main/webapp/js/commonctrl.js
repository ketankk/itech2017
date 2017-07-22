userApp
    .controller('DatepickerDemoCtrl',
        function($scope) {
            $scope.today = function() {
                $scope.dt = new Date();
            };
            $scope.today();

            $scope.clear = function() {
                $scope.dt = null;
            };

            // Disable weekend selection
            $scope.disabled = function(date, mode) {
                return (mode === 'day' && (date.getDay() === 0 || date
                    .getDay() === 6));
            };

            $scope.toggleMin = function() {
                $scope.minDate = $scope.minDate ? null : new Date();
            };
            $scope.toggleMin();

            $scope.open = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.opened = true;
            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd',
                'dd.MM.yyyy', 'shortDate'
            ];
            $scope.format = $scope.formats[0];
        });
// --------------------------- Date Picker Ends Here ---------------------------



userApp.controller('ModalInstanceCtrl', function(myService, $scope,
    $modalInstance, $http, $templateCache, $location, $rootScope, $route,
    $upload, $filter, $modal) {

    $scope.databaseType = ['MySQL', 'Oracle', 'DB2'];
    $scope.porArr = ["3306", "1521", "50000"];
    $scope.delimiterArr = ["carriage return", "comma", "Control-A", "Control-B", "Control-C", "newline", "slash", "space", "tab", "underscore", "WhiteSpace"];
    $scope.addSchemaMed = [{
        "name": "---Select---"
    }, {
        "name": "Manual"
    }, {
        "name": "Automatic"
    }];

    $scope.selectSize = ["BYTE", "KB", "MB", "GB"];

    $scope.editData = {};
    $scope.editData.addSchemaMed = "---Select---";
    $scope.ddArray = new Array();
    $scope.ddObject1 = new Object();
    $scope.ddObject1.active = true;
    $scope.ddObject2 = new Object();
    $scope.ddArray.push($scope.ddObject1);
    $scope.ddArray.push($scope.ddObject2);
    $scope.encryptionCheckbox = true;
    $scope.getEncryptionDetails = function() {
        $scope.method = 'GET';
        $scope.url = 'rest/service/getDatasetPathDetails/';
        $http({
            method: $scope.method,
            url: $scope.url,
            headers: headerObj
        }).success(
            function(data, status) {
                $scope.status = status;
                console.log("encryption data:")
                console.log(data)
                $scope.encryptionData = data;
                if ($scope.encryptionData.isEncryptionAvailable == true) {
                    $scope.encryptionCheckbox = false;
                }

            }).error(function(data, status) {
            if (status == 401) {
                $location.path('/');
            }
            $scope.data = data || "Request failed";
            $scope.status = status;
        });

    };
    $scope.getEncryptionDetails()
    $scope.newatrri = function($event) {
        $scope.ddObject = new Object();
        $scope.ddObject.active = true;
        $scope.ddArray.push($scope.ddObject);
    }
    $scope.errorCode = '';
    // $scope.editData.filepath = '';
    $scope.editData.dbType = $scope.databaseType[0];
    $scope.editData.port = $scope.porArr[0];
    $scope.editData.rowDeli = $scope.delimiterArr[0];
    $scope.editData.colDeli = $scope.delimiterArr[0];
    //$scope.editData.fixedValues = new Array();
    $scope.fileSys = 'file';
    typeFormatFetch($scope, $http, $templateCache, $rootScope, $location, 'Type', 'DataSchema')
    typeFormatFetch($scope, $http, $templateCache,
        $rootScope, $location, 'Format', 'DataSource');
    $rootScope.closeModal = function() {
        $modalInstance.dismiss('cancel');

    };

    //$scope.schemanamenotok = false;
    $scope.chkSchemaName = function(schemaName) {
        console.log("chkSchemaName called..")
        console.log(schemaName)
        if(schemaName == undefined){
        $scope.schemanameundefined = true;
    }else
        $scope.schemanameundefined = false;
        schemanameCheck(schemaName, $scope, $http, $templateCache, $rootScope,
            $location, 'dataschemapreview');
    }


    //validation for bulk ingestion name
    $scope.validateBulkname = function(bulkname) {
        console.log('bulk name:' + bulkname)
        if (bulkname == undefined) {
            $scope.checkName = true;
           
        } else {

             $scope.checkName = false;
        }
       var type='Bulk'
       schemanameCheck(bulkname, $scope, $http, $templateCache, $rootScope,
            $location, '',type);
    }


    //check for incorrect file range
    $scope.validateSize = function() {
        var minimumSize = $scope.editData.minSize;
        var maximumSize = $scope.editData.maxSize;

        if ($scope.editData.minType == 'KB' || 'MB' || 'GB' || 'TB') {
            if ($scope.editData.minType == 'KB')
                minimumSize = minimumSize * (Math.pow(1024, 1));
            else if ($scope.editData.minType == 'MB')
                minimumSize = minimumSize * (Math.pow(1024, 2));
            else if ($scope.editData.minType == 'GB')

                minimumSize = minimumSize * (Math.pow(1024, 3));

        }
        if ($scope.editData.maxType == 'KB' || 'MB' || 'GB' || 'TB') {
            if ($scope.editData.maxType == 'KB')
                maximumSize = maximumSize * (Math.pow(1024, 1));
            else if ($scope.editData.maxType == 'MB')

                maximumSize = maximumSize * (Math.pow(1024, 2));

            else if ($scope.editData.maxType == 'GB')
                maximumSize = maximumSize * (Math.pow(1024, 3));
        }


        if (minimumSize > maximumSize) {

            $scope.fileSize = true;
        } else
            $scope.fileSize = false;
    }


    $scope.saveAddUpdateSchema = function(editData, dd, isQuit) {

        $scope.data = new Object();
        $scope.editData = new Object();
        //console.log(dd);
        $scope.data.isEncrypted = $scope.isEncrypted
        $scope.data.encryptionData = $scope.encryptionData
        $scope.data.name = editData.name;
        $scope.data.type = $location.path();
        $scope.data.type = $scope.data.type.replace(/\//g, '')
        $scope.editData.description = editData.description;
        // console.log($scope.editData.dataSchemaType)
        $scope.editData.dataSchemaType = editData.dataSchemaType
        $scope.editData.dataSourcerId = editData.name;
        $scope.editData.name = editData.name;
        $scope.editData.dataAttribute = dd;
        for (i = 0; i < dd.length; i++) {
            //console.log(dd[i].Name);
            if (dd[i].Name == undefined)
                dd.splice(i, 1);
        }
        $scope.editData.fileData = new Object();


        if (editData.xmlEndTag) {
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
                    $rootScope.closeModal();
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
            //console.log($scope.data);
            myService.set($scope.data);
            $rootScope.closeModal();
            $location.path("/IngestionSummary/");
        }

    }
    $scope.fileDataContent = new Object();
   
    //file format check for bulk ingestion
    $scope.bulkIngestionFiletype = function(files) {
        srcFilename = document.getElementById('bulkIngestionForm').elements["file"].value.toUpperCase();

        allowedSuffix = 'XLSX';
        srcFileSuffix = srcFilename.slice((srcFilename.lastIndexOf(".") - 1 >>> 0) + 2).toUpperCase()
        if ((srcFileSuffix == "XLSX") && (srcFileSuffix.indexOf(allowedSuffix) >= 0)) {
            allowedSuffix = 'XLSX'
        }
        if (srcFileSuffix != allowedSuffix) {
            alert('File type not allowed. Allowed file type: ' + allowedSuffix.toLowerCase());
            document.getElementById('bulkIngestionForm').elements["file"].value = '';
        } else {

            $scope.uploadFile(files)
        }

    }

   


    $scope.submitStream = function(editData) {
        $('#submitLoader').show();
        $scope.data = new Object();
        // console.log(editData);
        $scope.data.name = editData.Consumer_Name;
        $scope.data.type = 'Streaming';
        // editData.dataSourcerId = editData.Consumer_Name;
        $scope.data.jsonblob = angular.toJson(editData);
        $scope.method = 'POST';
        $scope.data.createdBy = localStorage.getItem('itc.username');
        $scope.data.updatedBy = localStorage.getItem('itc.username');
        //  $scope.data.createdDate = new Date();
        $scope.url = 'rest/service/addEntity/';
        $http({
                method: $scope.method,
                url: $scope.url,
                data: $scope.data,
                headers: {
                    'X-Auth-Token': localStorage.getItem('itc.authToken')
                }
            })
            .success(
                function(data, status) {
                    $scope.status = status;
                    $('#submitLoader').hide();
                    $rootScope.closeModal();
                    $('#addDataset').modal('show');
                    /*schemaSourceDetails(myService, $scope, $http,
                            $templateCache, $rootScope, $location,
                            'Streaming');
                    $location.path('/Streaming/');*/
                }).error(function(data, status) {
                if (status == 401) {
                    $location.path('/');
                }
                $scope.data = data || "Request failed";
                $scope.status = status;

            });

    }

});
var headerCtrl = function(myService, $scope, $http, $templateCache, $location,
    $rootScope, $route, $interval, $timeout) {

    $scope.totalPages = 0;
    $scope.range = [];
    $scope.logData = new Array();
    $scope.currentPage = 1

    $scope.clearLog = function() {
        $scope.logData = new Array();
        $scope.logtype = '';
    }
    var promise;
    $scope.showLog = true;

    
    $scope.search = {};

    $scope.resetFilters = function() {
        // needs to be a function or it won't trigger a $watch
        $scope.search = {};
    };

    // pagination controls
    $scope.currentPage = 1;
    //  $scope.totalItems = $scope.logData.length;
    // items per page
    $scope.clearlog = function() {

        delete $scope.lastcount;
        $interval.cancel($scope.promise);
        delete $scope.promise;
        console.log($scope.promise)
        $scope.showLog = false;
        //$interval.cancel(stopLog);
        stopLog = undefined;
        //alert(stopLog);
    }


}
var leftbarCtrl = function(myService, $scope, $http, $templateCache, $location,
    $rootScope, $route) {

    $scope.transFormData = ["Column Filter", "Clean Missing Data", "Group By", "Join", "Partition", "Subset"];
    $scope.transFormCustom_trans = ["Hive", "Pig", "MapReduce"];
    $scope.transFormCustom = ["Ingestion"];
    $rootScope.transFormModel = ["Binary Logistic Regression", "Compare Model", "Decision Tree Classification", "Decision Tree Regression", "KMeans Clustering", "Linear Regression", "MultiClass Logistic Regression", "Naive Bayes Classification", "Random Forest Classification", "Random Forest Regression", "SVM Classification"];
    $scope.transFormAction = ["Train", "Test"];
    $scope.callSubMenu = function() {
        //alert($location.path());

        if ($location.path() == '/Topics/') {

            schemaSourceDetails(myService, $scope, $http, $templateCache, $rootScope,
                $location, 'Topics');

        }

    }
    $scope.callSubMenu();    $scope.addDragClass = function() {
        //  console.log('inside');
        if ($scope.userProfileData.haveWritePermissionOnProject === true || $scope.userProfileData.isSuperUser == true) {

            //if(menuID != 'thirdLink'){
            $(".dragMe").draggable({
                helper: 'clone',
                cursor: 'move',
                tolerance: 'fit'
            });
        }
    }

    $scope.Deluser;
    $scope.delete1 = function() {
        //currentUser = $scope.Deluser;
        //objDel = $scope.DelObj;
        $scope.deleteRecord(currentUser, objDel);
    };
    $scope.showconfirm = function(id, obj) {

        currentUser = id;

        objDel = obj;
        $('#deleteConfirmModal').modal('show');
    };

}

var mainController = function(myService, $scope, $http, $templateCache, $location,
    $rootScope, $route, $interval) {
        
        /* topics */
        
        
        
                
                
        var fetchTopics = function(){
            console.log('topics')
            
            $scope.method = 'GET';
        
        url1 = 'https://hpz7pbrlx6.execute-api.us-east-1.amazonaws.com/prod/alltopics';
        url2='http://13.126.228.155:8081/NotificationPlatform/getAllTopics';
        //$scope.url3="rest/service/topics"
        /*
         $http({
            method: $scope.method,
            url: $scope.url,
          //  cache : $templateCache,
            headers: headerObj
        }).success(function(data, status) {
            $scope.status = status;
            $scope.topics = data;
            console.log(data)
        }).error(function(data, status) {
           
            $scope.data = data || "Request failed";
            $scope.status = status;
        }); 
        */
         $.ajax({
            type: 'GET',
            url: url2,
            crossDomain: true,
            success: function (data) {
                $scope.topics =data;
                console.log('ajax'+$scope.topics);

            },
            error: function (request, status, error) {

                alert(error);
            }
        });
        
        
        
        /*
        
            $scope.topics=[
                    {
                    "name": "test123",
                    "arn": "arn:aws:sns:us-east-1:038184107766:test123"
                    }
                ]*/
        }




        /**
method to create a topic
**/
$scope.sendmsg=function(msgbody){
    console.log('sendmsg');
   console.log(msgbody);


       url1='http://13.126.228.155:8081/NotificationPlatform/publishToTopic';

$scope.data=new Object();


   $scope.data.topicArn=msgbody.topic.arn;
   $scope.data.message=msgbody.msg;
   $scope.data.sender=msgbody.sender;





 $http({
            method: 'POST',
            url: url1,
            data:$scope.data,
            //cache : $templateCache,
            headers: headerObj
        }).success(function(data, status) {
            $scope.status = status;
            $scope.devices = data;
            console.log(data)


            $('#sendMessage').modal('hide');
        }).error(function(data, status) {
           
            $scope.data = data || "Request failed";
            $scope.status = status;
        }); 



}


/**
method to send /publish message to Any topic
**/
$scope.createTopic=function(topic){
    console.log('createTopic');



    url1='http://13.126.228.155:8081/NotificationPlatform/createTopic';

   console.log(topic);
$scope.data=new Object();


   $scope.data.name=topic.name;
  

 $http({
            method: 'POST',
            url: url1,
            data:$scope.data,
            //cache : $templateCache,
            headers: headerObj
        }).success(function(data, status) {
            $scope.status = status;
            $scope.devices = data;
            console.log(data)


            $('#createTopic').modal('hide');
        }).error(function(data, status) {
           
            $scope.data = data || "Request failed";
            $scope.status = status;
        }); 



}


$scope.selectedDevice=[];
$scope.toggleSelection = function(device) {
    console.log("toggle"+device+$scope.selectedDevice);
    var idx = $scope.selectedDevice.indexOf(device);

    // Is currently selected
    if (idx > -1) {
      $scope.selectedDevice.splice(idx, 1);
    }

    // Is newly selected
    else {
      $scope.selectedDevice.push(device);
    }
};


/**
method to subscribe devices to Any topic
**/
$scope.subscribeToTopic=function(subscribe){
    console.log('subscribeToTopic');
   console.log(subscribe);
console.log('selected device'+ $scope.selectedDevice);
   $scope.data=new Object();


   $scope.data.deviceArns=$scope.selectedDevice;
   $scope.data.topicArn=subscribe.topicName.arn;
   console.log($scope.data+"suscribe");
   //$scope.data.msgText=subscribe.msg;
   //$scope.data.msgSender=subscribe.sender;




        url1='http://13.126.228.155:8081/NotificationPlatform/subscribeDevicesToTopic';


 $http({
            method:'POST',
            url:url1,
            data:$scope.data,
            //cache : $templateCache,
            headers: headerObj
        }).success(function(data, status) {
            $scope.status = status;
            $scope.devices = data;
            console.log(data)
        }).error(function(data, status) {
           
            $scope.data = data || "Request failed";
            $scope.status = status;
        }); 



}
/*
Get All messages for topic
*/
$scope.showMessages=function(topic){
//open modal
topicArn=topic.arn;
$scope.topicHeaderName=topic.name;

        url1='http://13.126.228.155:8081/NotificationPlatform/getAllMessagesOfTopic?arn='+topicArn;


 $http({
            method:'GET',
            url:url1,
            headers: headerObj
        }).success(function(data, status) {
            $scope.status = status;
            $scope.topicMsgs = data;
                        console.log("TopicMsgs"+$scope.topicMsgs)

                    $('#topicMsg').modal('show');

        }).error(function(data, status) {
           
            $scope.data = data || "Request failed";
            $scope.status = status;
        }); 

}


$scope.deliveryReport=function(msg){
console.log(msg+"del")

msgId=msg.messageId;

        url1='http://13.126.228.155:8081/NotificationPlatform/getDeliveryResults?messageId='+msgId;


 $http({
            method:'GET',
            url:url1,
            headers: headerObj
        }).success(function(data, status) {
            $scope.status = status;
            $scope.deliveryReport = data;
            console.log("DeliveryReports"+$scope.topicMsgs)

        $('#msgDelivery').modal('show');

        }).error(function(data, status) {
           
            $scope.data = data || "Request failed";
            $scope.status = status;
        }); 

    
}



$scope.openCreateTopic=function(){
        $('#createTopic').modal('show');

            console.log('openCreateTopic');
        }

$scope.openSendMsg=function(){
        console.log('openSendMsg');
                $('#sendMessage').modal('show');



        }
        var fetchDevices = function(){
                        fetchTopics();  
            console.log('devices')
            
            $scope.method = 'GET';
        
        url1 = 'https://hpz7pbrlx6.execute-api.us-east-1.amazonaws.com/prod/alldevice';
        url2='http://13.126.228.155:8081/NotificationPlatform/getAllDevices';
        //$scope.url3="rest/service/devices"

        /*
         $http({
            method: $scope.method,
            url: $scope.url,
            //cache : $templateCache,
            headers: headerObj
        }).success(function(data, status) {
            $scope.status = status;
            $scope.devices = data;
            console.log(data)
        }).error(function(data, status) {
           
            $scope.data = data || "Request failed";
            $scope.status = status;
        }); */
        
         $.ajax({
            type: 'GET',
            url: url2,
            crossDomain: true,
            success: function (data) {
                $scope.devices =data;
                console.log('ajax'+$scope.devices);



/**

*/

$scope.selectedDevice = function selectedDevice() {
        console.log("filter");

    return filterFilter($scope.devices, { selected: true });
  };

$selection=[];

  // Watch fruits for changes
  $scope.$watch('devices|filter:{selected:true}', function (nv) {
    console.log("watcher");
    $scope.selection = nv.map(function (device) {
      return device;
    });
  }, true);
  /*
*/


            },
            error: function (request, status, error) {

                console.log(error);
            }
        });
        
        
        
        
        /*
            $scope.devices=[
    {
        "id": 8,
        "arn": "arn:aws:sns:us-east-1:038184107766:endpoint/GCM/iTechGCM/dca98fe6-e214-31e1-a916-f50096575110",
        "token": "eNYwi1cBy5o:APA91bFmp6lDQI01e5esxryqGfqukp5ryP3iTJDTxGseoCqeiu3rvc8eQ_p-rv8I42TCwr3_plyGZwojxCSS-nfbaRYm_75VBEqMHLxjsZGC3HXWKp3sbgQ20Ik-ZcV6M4dgOoJTAUKq",
        "os": "Android",
        "osVersion": "5.0.2",
        "deviceType": "slte",
        "appVersion": "1.0.0",
        "deviceId": "355427060420052",
        "email": ""
    },
    {
        "id": 2,
        "arn": "arn:aws:sns:us-east-1:038184107766:endpoint/GCM/iTechGCM/d7d786e8-9460-3cdd-91f4-754fd92b2c60",
        "token": "dAgJZHDG03o:APA91bG28juKwxyBZcx6SPXeVV08oYHvaq37j8e5bnDaN0V9bkJ9nF-1HfGzFSCdTSKKDpi4UxfGj4i_VZj_4uu3ihtxPCoVNPvHYOO1y9RHjZZzs9DM21xj3P9ihqmemYiqn85eqwRB",
        "os": "Android",
        "osVersion": "6.0.1",
        "deviceType": "mido",
        "appVersion": "1.0.0",
        "deviceId": "863194039715708",
        "email": ""
    }
]*/

        }


$('#streamLoader').hide()
        
        /* ends */
        
        
        
        
        

    $scope.pipeEdit = false;
    $scope.pipelineStart = false;
    //listWorkspace($scope,$http);
    $('#prpertyTD').hide();
    delete mydiv_selector;
    delete mydiv_type;
    $(document).off("keyup");
    //  $('#templteSlide').hide();  

    var getViewId = function() {
        var test = window.location.pathname;
        var parts = window.location.pathname.split('/');
        if (parts.length <= 3) {
            return true;
        }
        return false;

    };
    $scope.pageURL = function() {
        return $location.path();
    }
    $scope.isLoginPage = function() {
        var viewId = getViewId();

        return viewId;

    }


    $scope.keyDown = function(evt) {

        if (evt.keyCode === ctrlKeyCode) {

            ctrlDown = true;
            evt.stopPropagation();
            evt.preventDefault();
        }
    };
    $scope.icon = 'icon-data';
    $scope.golocation = function(path, icon) {
        console.log(path);  
        if (path != "#")
            $location.path("/" + path + "/");
        $scope.icon = icon;
        
        
        if(path=="Topics"){
            fetchTopics();
        }
        if(path=="Devices"){
            fetchDevices();
        }

        /*
         *  Added by 19726 on 23-11-2016
         *  CSS code to hide left panel of project tab
         */
        $('#content').css('padding-left', '125px');
        $(".menu-bar").removeClass('subMenuOpen');
    }
    $scope.checkedLoggedin = function() {

        if (localStorage.getItem("itc.username") == null || localStorage.getItem("itc.username") == undefined || localStorage.getItem("itc.username") == '' || $location.path() == '/') {
            var isloogedin = "false";
            //return isloogedin;
        } else {
            var isloogedin = "true";
        }
        //console.log(isloogedin)
        return isloogedin;
    }
    $scope.logOutPage = function() {
        console.log(localStorage.getItem("itc.username"));
        if (localStorage.getItem("itc.username") == null) {
            $location.path('/');
        }
        $(".menu-bar").removeClass('subMenuOpen');
        $scope.method = 'POST';
        var userName = localStorage.getItem('itc.username');
        $scope.url = 'rest/service/logout/' + userName;
        $http({
            method: $scope.method,
            url: $scope.url,
            //cache : $templateCache,
            headers: headerObj
        }).success(function(data, status) {
            $scope.status = status;
            $scope.data = data;
            $rootScope.authToken = '';
            localStorage.clear();
            $route.reload();
            /*menu._resetMenu();
            menu = null;*/
        }).error(function(data, status) {
            //if (status == 401) {
            $location.path('/');
            //}
            $scope.data = data || "Request failed";
            $scope.status = status;
        });

        // console.log(localStorage.getItem('itc.username'));
        // prevMenu = 'one';
        // $location.path("/");

    }

    if ($scope.isLoginPage() === false) {
        if (localStorage.getItem('itc.username') === null) {
            $scope.logOutPage();
        }
    }

    $scope.userdetails = function() {
        $location.path("/userDetails/");

    }
    
    
    

    $scope.getDDRecord = function() {
        $scope.method = 'GET';
        $scope.url = 'rest/service/listsourcer';

        $http({
            method: $scope.method,
            url: $scope.url,
            headers: headerObj
        }).success(function(data, status) {

            $scope.status = status;
            $scope.data = data;
            $scope.detaildata = angular.fromJson($scope.data);

        }).error(function(data, status) {
            if (status == 401) {
                $location.path('/');
            }
            $scope.data = data || "Request failed";
            $scope.status = status;
        });

        $location.path("/DataSchema/");

    }
    $scope.openModel = function(modelID) {
        $scope.edituserData = new Object();
        $("#" + modelID).modal('show')
    }
    $scope.resetUserId = function(userinfo) {

        if (userinfo.newpass == userinfo.curpass) {
            alert('New password and Current can\'t be same!');
            return false;
        } else if (userinfo.newpass != userinfo.conpass) {
            alert('New password and confirm password not matched!');
            return false;
        }
        data = new Object;

        data.password = userinfo.curpass;
        data.newpassword = userinfo.newpass;
        data.retypepassword = userinfo.conpass
        $scope.method = 'POST';
        var userName = localStorage.getItem('itc.username');
        $scope.url = 'rest/service/updatePassword/' + userName;
        $scope.data = data;
        $http({
            method: $scope.method,
            url: $scope.url,
            data: $scope.data,
            headers: headerObj
        }).success(function(data, status) {

            $scope.status = status;
            $scope.data = data;
            $("#resetodal").modal('hide')
            $scope.conMail = true;

        }).error(function(data, status) {
            if (status == 401) {
                $location.path('/');
            }
            $("#forgetModal").modal('hide')
            $scope.data = data || "Request failed";
            $scope.status = status;
        });

    }


}
var userController = function($scope, $rootScope, $location, $http, $interval) {
    $scope.forgtPass = false;
    $scope.loginForm = true;
    $scope.conMail = false;
    $scope.resetPass = false;
    $scope.resPass = false;
    $scope.pipeEdit = false;
    var fromAutoSchema = false;
    $rootScope.fromAutoSchema = fromAutoSchema;
    stopTime1 = $interval(function() {
        $scope.callAtInterval1();
    }, 1500);
    $scope.callAtInterval1 = function() {
        $('#loginLoader').hide();
        $('#loginPageContent').show();
    }

    $scope.submitUserDetails = function() {
        $scope.domains = ['hotmail.com', 'gmail.com', 'aol.com'];
        $scope.topLevelDomains = ["com", "net", "org"];
        $scope.data = 'name=' + $scope.username + '&amp;passwd=' +
            $scope.password;

        var data = {
            username: $scope.username,
            password: $scope.password
        }
        var itc = {};
        itc.username = '';

        $scope.method = 'POST';
        $scope.url = 'rest/user/authenticate';
        $http({
            method: $scope.method,
            url: $scope.url,
            params: data
        }).success(function(data, status) {

            $scope.status = status;
            $scope.data = data;
            $scope.detaildata = angular.fromJson($scope.data);
            var authToken = data.token;
            $rootScope.authToken = authToken;
            $scope.username = data.token.split(":")[0];
            $scope.dUsername = data.token.split(":")[1];
            $rootScope.userRole = data.token.split(":")[4];
            // console.log($scope.dUsername);
            localStorage.setItem('itc.authToken', $rootScope.authToken);
            localStorage.setItem('itc.username', $scope.username);
            localStorage.setItem('itc.dUsername', $scope.dUsername);
            localStorage.setItem('itc.userRole', $scope.userRole);
            headerObj = {
                'X-Auth-Token': localStorage.getItem('itc.authToken'),
                'Cache-Control': "no-cache"
            };
            if ($scope.rememberMe) {
                $cookieStore.put('authToken', authToken);
            }

            $location.path("/Topics/");

        }).error(function(data, status) {

            if (status == '401') {
                $scope.wrgPass = true;
            }
            if (status == '405') {
                $scope.wrgPass = true;
            }
            $scope.data = data || "Request failed";
            $scope.status = status;
        });

        /*
         * $http.post('rest/user/authenticate', data).success( function(data,
         * status, headers, config) { $scope.user = data; var loginAuth = false;
         * for (key = 0; key < (data.length); key++) { // if(data[key].name ==
         * $scope.username && // data[key].password == $scope.password){
         * 
         * $location.path("/allSources/"); loginAuth = true; // } if (loginAuth
         * === false) { $scope.conMail = false; $scope.resPass = false;
         * $scope.wrgPass = true; } } }).error(function(data, status, headers,
         * config) { alert("failure message: " + JSON.stringify({ data : data
         * })); });
         */

    };
    $scope.forgetPass = function() {

        // $scope.loginForm = false;
        // $scope.resPass = false;
        // $scope.forgtPass = true;
        $("#forgetModal").modal('show')
    }
    $scope.closeBox = function(pname) {

        $scope.loginForm = true;
        // $scope.forgtPass = false;
        $("#loginModal").modal('hide')
        if (pname == 'reset') {
            $("#password_modal").modal('hide')
            $scope.resetpassTab = false;
        }
    }
    $scope.loadLoginConfirm = function(forgetUser) {
        $scope.wrgPass = false;
        $scope.loginForm = true;
        // $scope.forgtPass = false;
        $scope.resPass = false;
        $scope.method = 'POST';
        $scope.url = 'rest/user/forgetPassword/' + forgetUser;
        $http({
            method: $scope.method,
            url: $scope.url,
        }).success(function(data, status) {

            $scope.status = status;
            $scope.data = data;
            $("#forgetModal").modal('hide')
            $scope.conMail = true;

        }).error(function(data, status) {
            if (status == 401) {
                $location.path('/');
            }
            $("#forgetModal").modal('hide')
            $scope.data = data || "Request failed";
            $scope.status = status;
        });

    }

}


//------------------------------------------------------------------------------------------------------------------------------------