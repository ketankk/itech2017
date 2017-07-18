userApp
    .controller(
        'streamingCtrl',
        function(myService, $scope, $http, $templateCache, $location,
            $rootScope, $route, $upload, $filter, $modal,$timeout) {

            $scope.addtype = [{
                "name": "-Select type-"
            }, {
                "name": "Producer"
            }, {
                "name": "Consumer"
            }, {
                "name": "Transformation Rules"
            }, {
                "name": "Topic"
            }];

            $scope.addtypePro = [{
                "name": "Flume "
            }, {
                "name": "Twitter"
            }];



            schemaSourceDetails(myService, $scope, $http,
                $templateCache, $rootScope, $location, 'Streaming');
            typeFormatFetch($scope, $http, $templateCache, $rootScope,
                $location, 'Type', 'DataSchema')
            getHeader($scope, $location);
            $scope.editData1 = new Object();
            $scope.ddArray = new Array();
            $scope.ddObject1 = new Object();
            $scope.ddObject1.active = true;
            $scope.ddObject2 = new Object();
            $scope.ddArray.push($scope.ddObject1);
            $scope.ddArray.push($scope.ddObject2);

            $scope.newatrri = function($event, name) {
                $scope.ddObject = new Object();
                $scope.ddObject.active = true;
                if (name == "manual")
                    $scope.ddArray.push($scope.ddObject);
                else
                    $scope.columnNameArray.push($scope.ddObject);
            }
            $scope.delete1 = function(id, obj) {

                currentUser = id;
                objDel = obj;

                /* currentUser = $scope.Deluser;
                objDel = $scope.DelObj; */
                // alert(currentUser)
                $scope.deleteStream(currentUser, objDel);
            };

            $scope.allconsumer = false;
            $scope.addStream = function() {

                $scope.editDatas = new Object();
                $scope.editDatas.typePC = $scope.addtype[0].name;

                $scope.editData1 = new Object();
                $scope.ddArray = new Array();
                $scope.columnNameArray = new Array();
                $scope.valshow = null;
                //$scope.fileInput=null;
                $('#addAtribute').hide();
                //$scope.document.fileInput='';
                $scope.ddObject1 = new Object();
                $scope.ddObject1.active = true;
                $scope.ddObject2 = new Object();
                $scope.ddArray.push($scope.ddObject1);
                $scope.ddArray.push($scope.ddObject2);
                $('#addStreamModal').modal('show');
                $scope.kafkadetails();

            };
            $scope.deleteStream = function(name, obj) {
                //console.log('entry to be deleted:' + name)
                $scope.method = 'POST';

                $scope.url = 'rest/service/deleteEntity/' + name;
                $http({
                    method: $scope.method,
                    url: $scope.url,
                    headers: headerObj
                }).success(
                    function(data, status) {
                        $scope.status = status;
                        $('#deleteConfirmModal').modal('hide');
                        schemaSourceDetails(myService, $scope,
                            $http, $templateCache, $rootScope,
                            $location, 'Streaming');
                        console.log('deleted entry:' + name)
                    }).error(function(data, status) {
                    if (status == 401) {
                        $location.path('/');
                    }
                    $scope.data = data || "Request failed";
                    $scope.status = status;

                });

            }
            $scope.showconfirm = function(id, obj) {
                //console.log('delete function:' + JSON.stringify(obj, null, 4))
                if (obj.count > 0) {
                    console.log("Cannot Delete ! first Stop the Running Job");
                    $('#alertMessage').modal('show');
                }

                if (obj.count == 0) {

                    $scope.Deluser = id;
                    $scope.DelObj = obj;
                    $('#deleteConfirmModal').modal('show');
                }
            };


            // $('#streamingCtrlpage').show();
            $scope.submitStream = function(editData) {
                $('#addStreamModal').modal('hide');
                $('#submitLoader').hide();
                $('#addDataset').modal('show');

            };
            typeFormatFetch($scope, $http, $templateCache, $rootScope,
                $location, 'Type', 'DataSchema')

            $scope.uploadFile = function(files) {
                var fd = new FormData();

                // Take the first selected file
                fd.append("file", files[0]);
                var promise = $http.post(
                    'rest/service/uploadSchemaFile/', fd,

                    {
                        withCredentials: true,
                        headers: {
                            'X-Auth-Token': localStorage
                                .getItem('itc.authToken'),
                            'Content-Type': undefined,
                            'Cache-Control': "no-cache"
                        },

                        transformRequest: angular.identity
                    }).then(function(response) {




                    $scope.columnNameArray = response.data;
                    //console.log($scope.columnNameArray);
                    $('#addAtribute').show();
                    $('#uploadedTable').show();
                    return {
                        code: function() {
                            return code;
                        },
                        fileName: function() {
                            return fileName;
                        },
                        response: response,
                    };
                });
                return promise;
            };
            /*
            Adds streaming enity to table
            */


            $scope.flumeFiletype = function(files) {
                srcFilename = document.getElementById('flumeform').elements["file"].value.toUpperCase();

                allowedSuffix = 'TXT';
                srcFileSuffix = srcFilename.slice((srcFilename.lastIndexOf(".") - 1 >>> 0) + 2).toUpperCase()
                if ((srcFileSuffix == "TXT") && (srcFileSuffix.indexOf(allowedSuffix) >= 0)) {
                    allowedSuffix = 'TXT'
                }
                if (srcFileSuffix != allowedSuffix) {
                    alert('File type not allowed. Allowed file type: ' + allowedSuffix.toLowerCase());
                    document.getElementById('flumeform').elements["file"].value = '';
                } else {

                    //console.log(files[0]);
                    $scope.fileDataContent = new Object();
                    $scope.fileDataContent = files[0];
                }

            }

            $scope.saveStreamDataset = function(datasetObj) {
                textbox = $scope.editDatas.textValue;
                /* var link = document.getElementById('downloadlink');
                 link.href = makeTextFile(textbox);
                 link.style.display = 'block';*/
                // console.log(ddAttri)

                $scope.data = new Object();
                $scope.jsonObj = new Object();
                var fdl = new FormData();
                //console.log(datasetObj);
                if (datasetObj.typePC == 'Producer') {
                    //console.log(datasetObj.typePC);
                    $scope.data.name = datasetObj.kafkaProducerName;
                    $scope.data.type = datasetObj.typePC;
                    $scope.jsonObj.consumerKey = datasetObj.consumerKey;
                    $scope.jsonObj.consumerSecret = datasetObj.consumerSecret;
                    $scope.jsonObj.token = datasetObj.token;
                    $scope.jsonObj.secret = datasetObj.secret;
                    $scope.jsonblob1 = new Object();
                    if ($scope.editDatas.producerSys == 'flumeP') {


                        $scope.jsonObj.flumeText = $scope.editDatas.textValue;
                        $scope.jsonObj.agentName = $scope.editDatas.agentName;
                    }
                    $scope.jsonblob1.producerDetail = angular.toJson($scope.jsonObj);
                    $scope.jsonblob1.type = $scope.editDatas.producerSys;
                    /* if($scope.editDatas.typeMQ=="-Select Queue-"){
                        console.log('select')
                        $scope.jsonblob1.queue= 'Kafka';
                    }  */
                    $scope.jsonblob1.queue = $scope.editDatas.typeMQ;
                    $scope.jsonblob1.Topic = new Array();
                    $scope.jsonblob1.Topic = $scope.editDatas.topicName;
                    $scope.jsonblob1.Topic = $scope.editDatas.topicName;
                    $scope.data.jsonblob = angular.toJson($scope.jsonblob1);


                    fdl.append("file", $scope.fileDataContent);

                    //console.log('producerData:' + JSON.stringify($scope.data, null, 4));

                } else if ($scope.editDatas.typePC = 'Consumer') {
                    //console.log($scope.editDatas);
                    $scope.data.name = $scope.editDatas.Consumer_Name;
                    $scope.data.dataschemaName = $scope.editDatas.Consumer_Name + '_schema';
                    $scope.data.type = $scope.editDatas.typePC;

                    $scope.jsonObj.Hostname = $scope.editDatas.Hostname;
                    $scope.jsonObj.Port = $scope.editDatas.Port;
                    // console.log('check location: ' + $scope.editDatas.Output_Location)
                    // console.log('check modlocation: ' + $scope.editDatas.Output_modLocation)
                    $scope.jsonObj.Output_Location = $scope.editDatas.Output_Location;
                    $scope.jsonObj.Topic = new Array();
                    $scope.jsonObj.Topic = $scope.editDatas.Topic;
                    $scope.jsonObj.Topic = $scope.editDatas.Topic;
                    $scope.jsonObj.Group_ID = $scope.editDatas.Group_ID;

                    $scope.jsonObj.type = $scope.editDatas.consumerSys;
                    if ($scope.jsonObj.type == 'sparkC') {
                        $scope.jsonObj.duration = $scope.editDatas.duration;
                    }
                    $scope.jsonObj.datasetName = $scope.editData1.name;
                    $scope.jsonObj.ruleName = $scope.editDatas.ruleName;
                    $scope.data.jsonblob = angular.toJson($scope.jsonObj);
                    $scope.jsonObj1 = new Object();
                    $scope.jsonObj1.dataSchemaType = 'Manual';

                    $scope.jsonObj1.dataAttribute = new Array();
                    if ($scope.valshow != 'manualschema') {
                        $scope.jsonObj1.dataAttribute = $scope.columnNameArray;
                    } else {
                        $scope.jsonObj1.dataAttribute = $scope.ddArray;
                    }

                    $scope.data.schemaJson = angular.toJson($scope.jsonObj1);

                    //console.log('consumer data:' + JSON.stringify($scope.data, null, 4));

                }

                $scope.method = 'POST';
                $scope.data.createdBy = localStorage
                    .getItem('itc.username');
                $scope.data.updatedBy = localStorage
                    .getItem('itc.username');
                fdl.append("data", $scope.data);

                $scope.url = 'rest/service/addStreamEntity/';
                $http({
                    method: $scope.method,
                    url: $scope.url,
                    data: $scope.data,
                    headers: headerObj
                }).success(function(data, status) {

                    $scope.status = status;
                    //console.log(JSON.stringify(data,null,4))
                    $scope.responseData = data;
                    console.log($scope.responseData.type + "-- created successfully");
                    if ($scope.responseData.type == "Producer")
                        $('#addStreamModal').modal('hide');
                    else
                        $('#addDataset').modal('hide');

                    $location.path('/Streaming/');
                    $route.reload();
                }).error(function(data, status) {

                    if (status == 401) {
                        $location.path('/');
                    }
                    $scope.data = data || "Request failed";
                    $scope.status = status;

                });
                $scope.dataschema = new Object();
                $scope.editdataschema = new Object();
                $scope.dataSet = new Object();
                $scope.editDataSet = new Object();
                $scope.editdataschema.dataAttribute = new Array();
                $scope.editdataschema.dataAttribute.Name = new Object();
                $scope.editdataschema.dataSchemaType = 'Manual';
                $scope.editdataschema.name = $scope.editDatas.Consumer_Name +
                    '_schema';
                $scope.editdataschema.newSchemaName = $scope.editDatas.Consumer_Name +
                    '_schema';
                if ($scope.valshow != 'manualschema') {
                    $scope.editdataschema.dataAttribute = $scope.columnNameArray;
                } else {
                    $scope.editdataschema.dataAttribute = $scope.ddArray;
                }

                $scope.dataschema.name = $scope.editdataschema.newSchemaName;
                $scope.dataschema.type = 'DataSchema';
                $scope.dataschema.jsonblob = angular
                    .toJson($scope.editdataschema);

                $scope.dataschema.createdBy = localStorage
                    .getItem('itc.username');
                $scope.dataschema.updatedBy = localStorage
                    .getItem('itc.username');

                $scope.url = 'rest/service/addEntity/';
                /*$http(
                        {
                            method : $scope.method,
                            url : $scope.url,
                            data : $scope.dataschema,
                            headers : headerObj
                        })
                        .success(
                                function(data, status) {
                                    $scope.status = status;
                                    $scope.dataSet.name = datasetObj.name
                                    $scope.dataSet.type = 'DataSet';
                                    $scope.editDataSet.dataIngestionId = datasetObj.name;
                                    $scope.editDataSet.name = datasetObj.name;
                                    $scope.editDataSet.Schema = $scope.dataschema.name;

                                    $scope.editDataSet.location = $scope.editDatas.Output_Location;
                                    $scope.dataSet.jsonblob = angular
                                            .toJson($scope.editDataSet);
                                    $scope.method = 'POST';

                                    $scope.dataSet.createdBy = localStorage
                                            .getItem('itc.username');
                                    $scope.dataSet.updatedBy = localStorage
                                            .getItem('itc.username');
                                    $scope.url = 'rest/service/addEntity/';
                                    $http(
                                            {
                                                method : $scope.method,
                                                url : $scope.url,
                                                data : $scope.dataSet,
                                                headers : headerObj
                                            })
                                            .success(
                                                    function(data,
                                                            status) {
                                                        $scope.status = status;
                                                        $('#addDataset')
                                                                .modal(
                                                                        'hide');
                                                        schemaSourceDetails(
                                                                myService,
                                                                $scope,
                                                                $http,
                                                                $templateCache,
                                                                $rootScope,
                                                                $location,
                                                                'Streaming');
                                                        $location
                                                                .path('/Streaming/');
                                                    })
                                            .error(
                                                    function(data,
                                                            status) {
                                                        $scope.data = data
                                                                || "Request failed";
                                                        $scope.status = status;

                                                    });

                                }).error(function(data, status) {
                            $scope.data = data || "Request failed";
                            $scope.status = status;

                        });*/
            }
            // edit property for streaming
            $scope.addUpdateStream = function(id) {


                $scope.hiden = true;
                if (id != undefined) {
                    $scope.method = 'GET';
                    $scope.type = $location.path();
                    $scope.type = $scope.type.replace(/\//g, '');
                    $scope.url = 'rest/service/update/' + id;
                    $scope.editData = new Object();

                    $http({
                        method: $scope.method,
                        url: $scope.url,
                        headers: headerObj
                    }).success(
                        function(data, status) {
                            $scope.sourceType = data.type;
                            //console.log(JSON.stringify(data,null,4))
                            $scope.status = status;
                            $scope.editDatam = data;


                            $scope.editData.name = data.name;
                            $scope.editData.jsonblob = angular
                                .fromJson(data.jsonblob);
                            $scope.jsonPrev = new Object();
                            $scope.jsonPrev = ($scope.editData.jsonblob)

                            $scope.editData.id = data.id;

                        }).error(function(data, status) {
                        if (status == 401) {
                            $location.path('/');
                        }
                        $scope.data = data || "Request failed";
                        $scope.status = status;
                    });
                } else {
                    $scope.editData = {};

                    $scope.update = function(user) {
                        $scope.editData = angular.copy(user);
                    };

                    $scope.reset = function() {
                        $scope.user = angular.copy($scope.editData);
                    };

                    $scope.reset();
                    /* $scope.editData.Schema = "Int"; */
                    $scope.editData.frequency = 'One Time';

                }
                $scope.editing = true;
                $scope.viewing = false;
                $scope.addNewBtn = false;

            }

            $scope.saveAddUpdateDataSet = function(editData) {

                //console.log(JSON.stringify(editData,null,4))

                $scope.data = {};
                //console.log($scope.jsonPrev)
                //$scope.data= angular.toJson($scope.editDatam);
                $scope.data.name = editData.name;
                $scope.jsonblob = new Object();
                $scope.jsonblob.Hostname = editData.jsonblob.Hostname;
                $scope.jsonblob.Port = editData.jsonblob.Port;
                $scope.jsonblob.Group_ID = editData.jsonblob.Group_ID;
                $scope.jsonblob.Topic = editData.jsonblob.Topic;
                $scope.jsonblob.duration = editData.jsonblob.duration;
                $scope.jsonblob.type = $scope.jsonPrev.type;
                $scope.jsonblob.datasetName = $scope.jsonPrev.datasetName;
                $scope.jsonblob.Output_Location = $scope.jsonPrev.Output_Location;
                $scope.data.jsonblob = angular.toJson($scope.jsonblob);

                //$scope.data.schemaJson=$scope.editDatam.schemaJson;
                $scope.data.id = $scope.editDatam.id;
                $scope.method = 'POST';
                if (editData.id != undefined && editData.id != null) {
                    //console.log('id defined')
                    $scope.data.createdBy = localStorage
                        .getItem('itc.username');
                    $scope.data.updatedBy = localStorage
                        .getItem('itc.username');

                    $scope.url = 'rest/service/update'

                } else {
                    $scope.data.createdBy = localStorage
                        .getItem('itc.username');
                    $scope.data.updatedBy = localStorage
                        .getItem('itc.username');
                    // $scope.data.createdDate = new Date();
                    $scope.url = 'rest/service/addEntity/';
                }
                //console.log('changes:' + JSON.stringify($scope.data, null, 4));
                $http({
                    method: $scope.method,
                    url: $scope.url,
                    data: $scope.data,
                    headers: headerObj
                }).success(
                    function(data, status) {
                        $scope.hiden = false;
                        $scope.status = status;

                        schemaSourceDetails(myService, $scope,
                            $http, $templateCache, $rootScope,
                            $location);
                        $scope.editing = false;
                        $scope.viewing = true;
                        $scope.addNewBtn = true;
                        $location.path('/Streaming/')
                    }).error(function(data, status) {
                    if (status == 401) {
                        $location.path('/');
                    }
                    $scope.data = data || "Request failed";
                    $scope.status = status;

                });

            }

            //edit ends here
            $scope.cancelUpdate = function() {

                $scope.editing = false;
                $scope.viewing = true;
                $scope.addNewBtn = true;
            }
            $scope.cancelADD = function() {

                $scope.hiden = false;
                $scope.editing = false;
                $scope.viewing = true;
                $scope.addNewBtn = true;
                $location.path('/Streaming/');
                $route.reload();
            }
            $scope.runStream = function(editData) {
                // alert('#'+editData.id+'loader')
                $('#' + editData.id + 'loader').show();
                $scope.data = new Object();


                $scope.data.name = editData.name;
                $scope.data.type = editData.type;
                $scope.data.jsonblob = angular.toJson(editData.jsonBlob);

                /* $scope.data=angular.toJson(editData);
                console.log($scope.data); */
                $scope.method = 'POST';
                $scope.data.createdBy = localStorage
                    .getItem('itc.username');
                $scope.data.updatedBy = localStorage
                    .getItem('itc.username');
                $scope.method = 'POST';
                $scope.data.createdBy = localStorage
                    .getItem('itc.username');
                $scope.data.updatedBy = localStorage
                    .getItem('itc.username');
                // $scope.data.createdDate = new Date();
                $scope.url = 'rest/service/startStream/';
                $http({
                    method: $scope.method,
                    url: $scope.url,
                    data: $scope.data,
                    headers: headerObj
                }).success(
                    function(data, status) {
                        $('#' + editData.id + 'loader').hide();
                        $scope.status = status;
                        schemaSourceDetails(myService, $scope,
                            $http, $templateCache, $rootScope,
                            $location, 'Streaming');
                        // console.log($scope.detailStreaming);
                        // $location.path('/Streaming/');

                    }).error(function(data, status) {
                    if (status == 401) {
                        $location.path('/');
                    }
                    $scope.data = data || "Request failed";
                    $scope.status = status;
                });
            };

            $scope.showDrivers = function(consumer) {
                // alert("helooooo:::"+consumer);
                // stramORDriver('Driver')
                $scope.allconsumer = false;
                // $('#StreamDrivers').modal('show');
                $scope.data = new Object();
                $scope.data.name = consumer;
                $scope.method = 'POST';
                $scope.url = 'rest/service/getStreamDrivers';

                $http({
                    method: $scope.method,
                    url: $scope.url,
                    data: $scope.data,
                    // cache : $templateCache,
                    headers: headerObj
                }).success(function(data, status) {
                    $scope.status = status;
                    $scope.data = data;

                    $scope.detailDriver = {};
                    $scope.totalItems = $scope.data.length;
                    $scope.detaildata = angular.fromJson($scope.data);
                    // alert($scope.detaildata.length)
                    var i = 0;
                    angular.forEach($scope.detaildata, function(attr) {
                        $scope.detailDriver[i] = attr;
                        $scope.detailDriver[i].id = attr.driverId;
                        // alert(attr.driverId);
                        // $scope.detailStreaming = {};
                        i++;
                    });

                    $scope.totalSourcer = $scope.detaildata.length;
                    $scope.editing = false;
                    $scope.viewing = true;
                    $scope.addSchema = true;

                    $('#StreamDrivers').modal('show');
                }).error(function(data, status) {
                    $scope.data = data || "Request failed";
                    $scope.status = status;
                });

            };

            $scope.showRunningJobs = function() {
                $scope.allconsumer = true;
                // $('#StreamDrivers').modal('show');
                $scope.data = new Object();
                // $scope.data.name = consumer;
                $scope.method = 'POST';
                $scope.url = 'rest/service/getStreamDrivers';

                $http({
                    method: $scope.method,
                    url: $scope.url,
                    data: $scope.data,
                    // cache : $templateCache,
                    headers: headerObj
                }).success(function(data, status) {
                    $scope.status = status;
                    $scope.data = data;

                    $scope.detailDriver = {};
                    $scope.totalItems = $scope.data.length;
                    $scope.detaildata = angular.fromJson($scope.data);
                    // alert($scope.detaildata.length)
                    var i = 0;
                    angular.forEach($scope.detaildata, function(attr) {
                        $scope.detailDriver[i] = attr;
                        $scope.detailDriver[i].id = attr.driverId;
                        // alert(attr.driverId);
                        // $scope.detailStreaming = {};
                        i++;
                    });

                    $scope.totalSourcer = $scope.detaildata.length;
                    $scope.editing = false;
                    $scope.viewing = true;
                    $scope.addSchema = true;

                    $('#StreamDrivers').modal('show');
                }).error(function(data, status) {
                    $scope.data = data || "Request failed";
                    $scope.status = status;
                });

            };

            $scope.stopDriver = function(id, con_name) {
                // alert("con_name length"+con_name.length);
                // alert(id);
                if (con_name != undefined) {
                    var idloader = id + con_name;
                } else {
                    var idloader = id;
                }
                $('#' + idloader + 'loader').show();
                // $('#' + con_name + 'loader').show();
                $scope.method = 'POST';
                $scope.url = 'rest/service/stopStreamDriver';
                $scope.stopData = new Object();
                $scope.stopData.driverId = id;
                $scope.stopData.stopBy = localStorage
                    .getItem('itc.username');
                $http({
                    method: $scope.method,
                    url: $scope.url,
                    data: $scope.stopData,
                    headers: {
                        'X-Auth-Token': localStorage
                            .getItem('itc.authToken')
                    }
                }).success(
                    function(data, status) {
                        // $('#' + con_name+ 'loader').hide();
                        $('#' + id + 'loader').hide();
                        $scope.status = status;
                        if (con_name.length != 0) {
                            $scope.showDrivers(con_name);
                        } else
                            $scope.showRunningJobs();
                        schemaSourceDetails(myService, $scope,
                            $http, $templateCache, $rootScope,
                            $location, 'Streaming');
                    }).error(function(data, status) {
                    if (status == 401) {
                        $location.path('/');
                    }
                    $scope.data = data || "Request failed";
                    $scope.status = status;

                });
            };

            /*method to get default kafka details*/
            $scope.kafkadetails = function() {
                $scope.kafkadet = new Object();
                $scope.kafkadet.zkhostName = $scope.editDatas.Hostname;
                $scope.kafkadet.zkhostPort = $scope.editDatas.Port;
                //console.log(angular.toJson($scope.kafkadet));
                $scope.editDatas.topicsSugs = [];

                $http({
                    method: 'GET',
                    url: 'rest/service/kafkadetails',
                    headers: headerObj

                }).success(function(data, status) {
                    user = localStorage
                        .getItem('itc.username');

                    $scope.editDatas.Hostname = data.zkhostName;
                    $scope.editDatas.Port = data.zkhostPort;
                    $scope.editDatas.Output_Location = data.outputLocation + user;
                    $scope.editDatas.Output_modLocation = data.outputLocation + user;
                    
                    $scope.editDatas.maxReplicationfactor=[];
                   
                    angular.forEach(data.kafkabrokerlist, function(v,k) {
                       $scope.editDatas.maxReplicationfactor.push(k+1)
                      
                    });

                    angular.forEach(data.topics, function(v, k) {
                        $scope.editDatas.topicsSugs.push(v)
                       
                    });

                    console.log($scope.editDatas.topicsSugs)

                }).error(function(data, status) {
                    console.log(data);
                });

            }

            //------------------------

            $scope.category = 'consumer';
            $scope.tabCategory = function(category) {
                $scope.category = category;

            }

            $scope.isActive = function(category) {
                return $scope.category === category;
            }

            //------------------------------------------------ transformation rules

            $scope.updateRules = function() {

                //$scope.transRules = ["rule1", "rule2"];

                $http.get('rest/service/getTransformationRulesName')
                    .success(function(data, status) {
                        //console.log(data);
                        $scope.transRules = data;

                    }).error(function(data, status) {
                        console.log(data);
                    });
            }

            $scope.chkRulename = function(ruleName) {
                //console.log('check rulename:' + ruleName )
                if (ruleName == undefined)
                    $scope.chkRule = true;
                else
                    $scope.chkRule = false;

                $scope.name = ruleName;
                $http.get('rest/service/getTransformationRulesName')
                    .success(function(data, status) {
                        //console.log(data);
                        angular.forEach(data, function(v, k) {
                            if (v == $scope.name)
                                $scope.ruleExists = true;
                            else
                                $scope.ruleExists = false;
                        });

                    }).error(function(data, status) {
                        console.log(data);
                    });
            }
            $scope.submitTrules = function(transData) {
                //console.log(transData);

                $scope.data = new Object();
                $scope.method = 'POST';
                $scope.data.createdBy = localStorage
                    .getItem('itc.username');
                $scope.data.updatedBy = localStorage
                    .getItem('itc.username');
                $scope.transObj = new Object();
                //$scope.transObj.Topic = transData.transTopicname;
                $scope.transObj.Output_Location = transData.transLocation;
                $scope.data.name = transData.transRulename;
                $scope.transObj.className = transData.ClassName;
                $scope.transObj.methodName = transData.methodName;
                $scope.data.jsonBlob = $scope.transObj;
                $scope.url = 'rest/service/createRule';
                $http({
                    method: $scope.method,
                    url: $scope.url,
                    data: $scope.data,
                    headers: headerObj
                }).success(function(data, status) {

                    $scope.status = status;
                    //console.log(data)
                    $('#addStreamModal').modal('hide');
                    $location.path('/Streaming/');
                    $route.reload();
                }).error(function(data, status) {

                    if (status == 401) {
                        $location.path('/');
                    }
                    $scope.data = data || "Request failed";
                    $scope.status = status;
                    $('#addStreamModal').modal('hide');
                    $location.path('/Streaming/');

                });

            }
            //------------------------------------------------topic creation 

            $scope.chkTopicname = function(topic) {
                //console.log('check topic name:' + topic )
                if (topic == undefined)
                    $scope.chkTopic = true;
                else
                    $scope.chkTopic = false;

                $scope.name = topic;
                $http.get('rest/service/kafkadetails')
                    .success(function(data, status) {
                        console.log(data.topics)
                        angular.forEach(data.topics, function(v, k) {
                            if (v.topicName == $scope.name)
                                $scope.topicExists = true;
                            else
                                $scope.topicExists = false;
                        });

                    }).error(function(data, status) {
                        console.log(data);
                    });
            }

            $scope.submitTopic = function(topicData) {
                //console.log(topicData);

                $scope.data = new Object();
                $scope.method = 'POST';
               
                $scope.data.topicName = topicData.nameTopic;
                $scope.data.partitionCount = topicData.partition;
                $scope.data.replicationFactor = topicData.replication;
                console.log($scope.data)
                $scope.url = 'rest/service/createKafkaTopic';
                $http({
                    method: $scope.method,
                    url: $scope.url,
                    data: $scope.data,
                    headers: headerObj
                }).success(function(data, status) {

                    $scope.status = status;
                    
                    if($scope.status==200){
                        $('#addStreamModal').modal('hide');
                    }
                    
                    $location.path('/Streaming/');
                    $route.reload();
                }).error(function(data, status) {

                    if (status == 401) {
                        $location.path('/');
                    }
                    $scope.data = data || "Request failed";
                    $scope.status = status;
                    $('#addStreamModal').modal('hide');

                });

            }

            /*
            get kafka topics on given host
            */
            $scope.updateTopics = function(host, port) {
                $scope.editDatas.topicsSug=[];
                console.log(host + port);
                
                if (host != undefined && port != undefined) {
                    zkdata = {
                        'host': host,
                        'port': port
                    };
                    console.log(zkdata);

                    $http.get('rest/service/kafkatopics?host=' + host + '&port=' + port)
                        .success(function(data, status) {
                            //console.log(data.topics)
                                                        

                            angular.forEach(data, function(v, k) {
                                $scope.editDatas.topicsSug.push(v)
                                
                            });

                        }).error(function(data, status) {
                            console.log(data);
                        });
                }
            }

            //validate jar location

            $scope.valLoc = function(location) {
                if (location == null)
                    $scope.valJar = true;
                else {
                    $scope.valJar = false;

                    var jar = location.split('.');
                    var lastJar = jar[jar.length - 1];
                }
                if (lastJar != 'jar')
                    $scope.vJar = true;
                else
                    $scope.vJar = false;

            }

            //check consumer name
            $scope.chkConsumername = function(name) {
                //console.log(name);
                if (name == null)
                    $scope.chkCname = true;
                else
                    $scope.chkCname = false;
                $scope.name = name;
                $http.get('')
                    .success(function(data, status) {

                        angular.forEach(data, function(v, k) {
                            if (v == $scope.name)
                                $scope.cExists = true;
                            else
                                $scope.cExists = false;
                        });

                    }).error(function(data, status) {
                        //console.log(data);
                    });
            }

            $scope.chkPartition = function(value) {
                if (value == null) {
                    $scope.partition = true;
                } else {
                    $scope.partition = false;


                    if (isNaN(value))
                        $scope.pPattern = true;
                    else
                        $scope.pPattern = false;

                }
            }

            $scope.chkReplication = function(value) {
                if (value == null) {
                    $scope.replication = true;
                } else {
                    $scope.replication = false;


                    if (isNaN(value))
                        $scope.rPattern = true;
                    else
                        $scope.rPattern = false;

                }
            }

            /*
             *validate if the topic is selected
             */
            $scope.chkTopicselected = function(name, type) {
                console.log('selected topic:'+name)

                if (type == 'flume') {
                    if (name == null || name== undefined)
                        $scope.producerTopicflume = true;
                        
                }
                if (type == 'twitter') {
                    if (name == null || name== undefined)
                        $scope.producerTopictwitter = true;

                    
                }
                if (type == 'others') {
                    if (name == null || name== undefined)
                        $scope.producerTopic = true;
                        
                }
                if (type == 'spark') {
                    if (name == null || name== undefined)
                        $scope.consumerTopicspark = true;
                       
                }
                if (type == 'flink') {
                    if (name == null || name== undefined)
                        $scope.consumerTopicflink = true;
                        
                }
                if (type == 'transformation') {
                    if (name == null || name== undefined)
                        $scope.transformationTopic = true;
                       
                }

                setTimeout(function () { 
                $scope.producerTopicflume = false;
                $scope.producerTopictwitter = false;
                $scope.producerTopic = false;
                $scope.consumerTopicspark = false;
                $scope.consumerTopicflink = false;
                $scope.transformationTopic = false;
                 }, 3);

            }

            /* sorting according to last modified*/
            $scope.bool=true;
            $scope.sortDate = function(){
                         
                $scope.bool = $scope.bool != true;
                //console.log('reverse the order'+$scope.bool)
            }
            $scope.criteria = 'updatedDate';
            $scope.direction = true;
            $scope.setCriteria = function(criteria) {
          if ($scope.criteria === criteria) {
            $scope.direction = !$scope.direction;
          } else {
            $scope.criteria = criteria;
            $scope.direction  = false;
          }
        }

        });