var PipelineCtrl = function(myService, $scope, $http, $templateCache, $location, $rootScope, $route, $interval, $upload, uploadsService, $timeout) {
    getHeader($scope, $location);
    //$("#userDName").text(localStorage.getItem('itc.dUsername'));
    $scope.dUsername = localStorage.getItem('itc.username').trim();
    $scope.editData = new Object();
    $scope.editstageData = new Object();
    $scope.showinputData = false;
    $scope.viewing = true;
    $scope.canvasshow = false;
    $('#prpertyTD').hide();
    $scope.proHis = true;
    $scope.query = {};
    $scope.queryBy = '$';
    $scope.querysub = '';
    $scope.projectRun = new Array();
    $scope.filterRow = false;
    $scope.projectexist = false;
    $scope.hidesearch=false;
    //$('#templteSlide').hide();	



    getLogonUser($scope, $http, $templateCache,
        $rootScope, $location, $scope.dUsername);

    // $scope.editstageData.inputDataset = 'Select';
    $scope.addsetStage = [{
        "name": "--Select--"
    }, {
        "name": "Dataset"
    }, {
        "name": "Stage"
    }];
    $scope.inputdatasetlist = new Array();
    $scope.inputdatasetlist[0] = 'Select Table';
    $scope.outputdatasetlist = '';
    $scope.editTableData = new Object();
    $scope.editTableData.table1 = $scope.inputdatasetlist[0];
    $scope.joinArray = ['left', 'right', 'inner', 'outer'];
    $scope.workSpaceList = new Array();
    //$scope.editData.workSpace = 'Add Workspace'


    listWorkspace($scope, $http);
    $scope.FilterArray = ['where'];
    $scope.editTableData.filter = $scope.FilterArray[0];
    $scope.expressArray = ['==', '!=', '>', '<'];
    $scope.editstageData.join = $scope.joinArray[0];
    $scope.files = '';
    $scope.querymatches = [];
    // console.log($scope.addsetStage );
    $scope.editData1 = new Object();
    $scope.editData1.addStageSchema = "--Select--";
    $scope.graphShow = true;
    $scope.pipeEdit = false;
    $scope.pipeView = true;

    $scope.runstatushow = false;
    $scope.pipeDetailsshow = true;
    $scope.offsetHour = ['Minutes'];
    $scope.offsetDay = ['Hour', 'Minutes'];

    $scope.pipelineStart = false;
    $scope.logUpdate = true;
    $scope.pipeprevLog = new Object();
    //changeMClass('five')




    $scope.swapView = function(swape) {
        $('#saveProject').html('');
        $('#saveStatus').html('');

        if (swape == 'canvas') {
            schemaSourceDetails(myService, $scope, $http, $templateCache, $rootScope,
                $location, 'project');
            listWorkspace($scope, $http);
            $scope.viewing = true;
            $scope.canvasshow = false;
            $('#prpertyTD').hide();
            $scope.runH = false;
            $scope.proHis = true;
            //$('#templteSlide').hide();	
            $('#content').css('padding-left', '125px');
            $(".menu-bar").removeClass('subMenuOpen');

        } else {
            $scope.viewing = false;
            $scope.canvasshow = true;
            $scope.runH = false;
            $('#prpertyTD').show();
            $scope.runH = false;
            $scope.proHis = true;
            $('#content').css('padding-left', '190px');
            $(".menu-bar").toggleClass("subMenuOpen");
            //$scope.selectPipeline(selectedPipeId,'',selectedversion,$scope.permission);
            //$("#loadChat").trigger("click");
            //$('#templteSlide').hide();
        }
    }
    $scope.showChart = function() {
        //alert($scope.permission);
        $scope.selectPipeline(selectedPipeId, '', selectedversion, $scope.permission, '', projectType); //passing runID as 'null' and projectType
    }
    $scope.chkProjectName = function(projName) {
        $scope.url = 'rest/service/validateProjectName/' + projName;

        $http({
                method: $scope.method,
                url: $scope.url,
                headers: headerObj
            })
            .success(

                function(data, status) {
                    // chartDataModel = {};

                    console.log(data);
                    if (data == 'true')
                        $scope.projectexist = true;
                    else
                        $scope.projectexist = false;
                }).error(function(data, status) {
                if (status == 401) {
                    $location.path('/');
                }
                $scope.data = data || "Request failed";
                $scope.status = status;
            });

    }

    $scope.showRunH = function(projHis) {
       
        if (projHis == undefined) {
         
            $('#content').css('padding-left', '127px');
            $(".menu-bar").toggleClass("subMenuOpen");
        } else {

            $scope.proHis = true;
        }
        $scope.method = 'GET';

        //hardcoded projectstype Transformation
        projectType = $scope.projectType;
       // alert(projectType);
        if (projectType == 'Ingestion') {
            $scope.url = 'rest/service/projectSchedulerHistory/' + $scope.projectName + '/' + selectedPipeId;
            $('#transformation-header').hide();
            $('#ingestion-header').show();

        } else if (projectType == 'Transformation') {

            $scope.url = 'rest/service/getProjectRunHistory/' + $scope.projectName + '/' + selectedPipeId;
            $('#ingestion-header').hide();
            $('#transformation-header').show();

        }
        /* else {   
			alert("ingestion");  
			$scope.url = 'rest/service/projectSchedulerHistory/' + $scope.projectName + '/' + selectedPipeId;
            $('#transformation-header').hide();
            $('#ingestion-header').show();
		} */
        $http({
                method: $scope.method,
                url: $scope.url,
                headers: headerObj
            })
            .success(

                function(data, status) {
                    // chartDataModel = {};
                    $scope.status = status;
                    $scope.runHistory = data;
                    $scope.canvasshow = false;
                    $scope.runH = true;
                    $scope.canvasshow = false;
                    $('#prpertyTD').hide();
                    //console.log(data);
                }).error(function(data, status) {
                if (status == 401) {
                    $location.path('/');
                }
                $scope.data = data || "Request failed";
                $scope.status = status;
            });

    }
    var stopRun;
    $scope.selectPipeline = function(id, type, version, first, runID, projectType) {
        $scope.hidesearch=true;
        //run id from UI is not coming
        $scope.projectType = projectType;
		console.log('project type1:-->>'+projectType)

        /*if($scope.myFormText.$dirty == true){
			if(!confirm("You have some unsave data.Do you want to save them?")) {
				$scope.myFormText.$dirty = false;
                 
              }
              else{
              	 $scope.saveGraph();
              	 event.preventDefault();
              }
		}*/
        //console.log(selectColumn);
        //	alert(first);

        if (first != 'runHistory') {
            $('#content').css('padding-left', '190px');
            $(".menu-bar").toggleClass("subMenuOpen");
            $scope.permission = first
        }
        $scope.runH = false;
        //	console.log("show me");
        if (stopRun)
            $interval.cancel(stopRun);
        //selectPipeline
        $scope.jsonData = new Object();
        //if(first == undefined || first == 'runHistory' || first == '6' || first == '7'){
        $scope.viewing = false;
        $scope.canvasshow = true;
        //	}
        if (first == 'runHistory') {
            $scope.proHis = false;
        } else {
            $scope.proHis = true;
        }
        $('#prpertyTD').hide();
        //$('#templteSlide').hide();	

        $rootScope.canvastoggle = 0;
        //	console.log(selectColumn);
        $('#flowchart-demo').val('');
        $('#jsonOutput').val('');
        firsttime = 'true'
        /*var instance=window.instance;
         instance.reset();*/

        $scope.method = 'GET';
        if (type == '') {
            $scope.type = $location.path();
            $scope.type = $scope.type.replace(/\//g, '')
        } else {
            $scope.type = type;
        }

        $scope.url = 'rest/service/listObject/project/' + id + '/' + version;

        $http({
                method: $scope.method,
                url: $scope.url,
                headers: headerObj
            })
            .success(

                function(data, status) {
                    // chartDataModel = {};
                    $scope.status = status;
                    if (type == '') {
                        $scope.editData = new Object();
                        $scope.editData = angular
                            .fromJson(data.jsonblob);
                        $scope.editData.createdDate = data.created;
                        $scope.editData.id = data.id;
                        $scope.editData.updatedBy = data.created_by;
                        if (data.permissionLevel) {
                            $scope.editData.permissionLevel = data.permissionLevel;
                            $scope.permissionLevel = data.permissionLevel;
                        }

                        if (first == 'runHistory') {
                            $scope.project_run_id = runID;
                        }
                        // $scope.editData.id = data.id;

                        // $scope.viewModel = new
                        // flowchart.ChartViewModel(chartDataModel);
                        // $scope.editData.ExecutionGraph =
                        // $scope.editData.ExecutionGraph.replace('\"','')
                        // console.log($scope.editData.ExecutionGraph);
                        $scope.projectName = $scope.editData.name
                        var graphTag = '<b>Project : ' +
                            $scope.editData.name + '</b>'
                        // graphTag = graphTag.toUpperCase();
                        $('#graphHead').html(graphTag);
                        //	alert($scope.editData.ExecutionGraph);
                        if ($scope.editData.ExecutionGraph != '' &&
                            $scope.editData.ExecutionGraph != undefined) {
                            var flowChart = $scope.editData.ExecutionGraph;
                            var flowChartJson = JSON.stringify(flowChart);
                            //console.log(flowChartJson);

                            //$("#saveall").trigger("click");
                            //jsPlumb.loadFlowchart();
                            $('#jsonOutput').val(flowChartJson);
                        } else {
                            $('#jsonOutput').val('');
                        }



                    } else {
                        $scope.editstageData = new Object();
                        $scope.inputdatasetlist = new Array();
                        $scope.inputdatasetlist[0] = 'Select Table';
                        $scope.outputdatasetlist = '';
                        $scope.editstageData = angular
                            .fromJson(data.jsonblob);
                        if ($scope.editstageData.inputDataset)
                            $scope.inputdatasetlist = $scope.editstageData.inputDataset;
                        if ($scope.editstageData.outDataset)
                            $scope.outputdatasetlist = $scope.editstageData.outDataset;
                        $scope.showinoutputData = true;
                        $scope.showinputData = true;
                        $scope.hiveQueryDiv = true;
                        $scope.editstageData.id = data.id;
                        $('#AddStage').modal('show');
                    }
                    if (type == '') {
                        //$("span").removeClass('ptagactive');
                        // alert('#' + id);
                        //$('#' + id).addClass('ptagactive');
                        //$('#' + id).html(data.name);
                        //$('#runStatus').html('');
                        //$('#pipeLog').html('');
                        selectedPipeId = id;
                        selectedversion = version;
                        $scope.projectRun[selectedPipeId] = false;
                        $scope.runStop = $scope.projectRun[selectedPipeId];
                        /*if(first == undefined){*/
                        $scope.pipeprevLog = new Object();
                        $scope.pipelineStart = false;
                        $scope.projectRunStatus();
                        stopRun = $interval(function() {
                            $scope.projectRunStatus();
                        }, 5000);
                        //}

                        //console.log($('#jsonOutput').val());
                        //console.log($("#loadChat"));
                        if (flowChartJson != '')
                            $("#loadChat").trigger("click", first);
                    }
                    $rootScope.canvastoggle = 1;
                    $scope.hideRight = true;
                    $scope.showRight = false;
                    $('#prpertyTD').show();
                    $scope.datanode = 'project';
                }).error(function(data, status) {
                if (status == 401) {
                    $location.path('/');
                }
                $scope.data = data || "Request failed";
                $scope.status = status;
            });

    }
    $scope.moduleHistory = function(moduleID, moduleversion) {
        $scope.data = {};

        $scope.method = 'GET';
        $scope.url = 'rest/service/getModuleHistory/' + $scope.project_run_id + '/' + moduleID + '/' + moduleversion;
        $http({
            method: $scope.method,
            url: $scope.url,
            headers: headerObj
        }).success(

            function(data, status) {
                $scope.status = status;
                $scope.moduleHis = data;
                //console.log($scope.moduleHis);
                $scope.datanode = 'moduleHistory';
                $scope.tranformType = 'Module History';
                $('#saveStatus').html('');
                $('#prpertyTD').show();
            }).error(function(data, status) {
            scope.data = data || "Request failed";
            scope.status = status;

        });

    }
    $scope.saveAddUpdatePipeline = function(editDataPipe, oparationedit) {
		console.log('project type here'+editDataPipe.project_type)
        $('#flowchart-demo').val('');
        $scope.data = {};
        $scope.data.name = editDataPipe.name;
        $scope.data.project_type = editDataPipe.project_type;
		
		var projectType=editDataPipe.project_type;
		
        $scope.data.schemaType = 'project';
        //$scope.data.type = $scope.data.type.replace(/\//g, '')
        // $scope.editData.dataPipeName = editData.name;


        $scope.method = 'POST';
        if (oparationedit != undefined) {
            // editDataPipe.ExecutionGraph = '';
            $scope.data.jsonblob = angular.toJson(editDataPipe);
            $scope.data.workspace_name = $('#workspacename').val();

            if ($scope.workSpaceName.indexOf($scope.data.workspace_name) === -1) {
                $scope.data.workspace_name = 'Add Workspace' + '|' + $scope.data.workspace_name;
            }


            $scope.data.updatedBy = localStorage.getItem('itc.username');
            //$scope.data.updatedDate = new Date();
            $scope.data.id = editDataPipe.id;
            $scope.url = 'rest/service/' + $scope.data.type + '/' +
                editDataPipe.id;

        } else {

            editDataPipe.ExecutionGraph = '';
            $scope.data.jsonblob = angular.toJson(editDataPipe);
            $scope.data.workspace_name = $('#workspacename').val();
            if ($scope.workSpaceName.indexOf($scope.data.workspace_name) === -1) {
                $scope.data.workspace_name = 'Add Workspace' + '|' + $scope.data.workspace_name;
            }
            $scope.data.created_by = localStorage.getItem('itc.username');
            $scope.data.updated_by = localStorage.getItem('itc.username');
            //		$scope.data.createdDate = new Date();
            $scope.url = 'rest/service/addObject/';

            $('#flowchart-demo').val('');
            $('#jsonOutput').val('');

            $('.ng-isolate-scope').val('');
            //$scope.chartViewModel = new Object();
            // $scope.viewModel = new flowchart.ChartViewModel(chartDataModel);
            // deleteAll();
            // $scope.chartViewModel = new
            // flowchart.ChartViewModel(chartDataModel);
        }
        //console.log($scope.data);
        $http({
            method: $scope.method,
            url: $scope.url,
            data: $scope.data,
            headers: headerObj
        }).success(

            function(data, status) {
                $scope.status = status;
                if (oparationedit != undefined) {
                    $('#editPipeLine').modal('hide');
                    $scope.selectPipeline(editDataPipe.id,'','','','',projectType);
                } else {
                    $("body").removeClass("modal-open");
                    $('#AddModal').modal('hide');
                    $scope.selectPipeline(data.id, '', data.version,'','',projectType);
                    //schemaSourceDetails(myService, $scope, $http,
                    //	$templateCache, $rootScope, $location,'project');
                    //listWorkspace($scope,$http);


                    //$route.reload();
                    //$scope.getScope();
                }

                // $scope.addNewNode(data.name);

            }).error(function(data, status) {
            if (status == 401) {
                $location.path('/');
            }
            $scope.data = data || "Request failed";
            $scope.status = status;

        });

    }
    $scope.clearForm = function(formName, datasetType) {
        // alert("form#"+formName)

        if (formName == 'Stage') {
            formName = 'stageForm1';
        } else if (formName == 'Dataset') {
            formName = 'datasetform';
        }
        if ($('#workspacename')) {
            $('#workspacename').val('Default');
        }

        //$scope.editData1.addStageSchema = "--Select--";

        if (formName == 'stageForm1') {
            // if(chartDataModel["nodes"].length > 0){
            $scope.querymatches = [];
            $scope.editstageData = new Object();
            $scope.editTableData = new Object();
            $scope.inputdatasetlist = new Array();
            $scope.inputdatasetlist[0] = 'Select Table';
            $scope.editTableData.table1 = $scope.inputdatasetlist[0];
            $scope.editTableData.table2 = $scope.inputdatasetlist[0];
            $scope.editTableData.table3 = $scope.inputdatasetlist[0];
            $scope.editTableData.table4 = $scope.inputdatasetlist[0];
            $scope.editTableData.table5 = $scope.inputdatasetlist[0];
            $scope.editTableData.table6 = $scope.inputdatasetlist[0];
            $scope.editTableData.table7 = $scope.inputdatasetlist[0];
            for (i = 1; i <= 7; i++) {
                $scope.columnName[i] = new Array();
                $scope.columnName[i][0] = 'Column';

            }
            $scope.editTableData.columnval1 = $scope.columnName[1][0];
            $scope.editTableData.columnval2 = $scope.columnName[2][0];
            $scope.editTableData.columnval3 = $scope.columnName[3][0];
            $scope.editTableData.columnval4 = $scope.columnName[4][0];
            $scope.editTableData.columnval5 = $scope.columnName[5][0];
            $scope.editTableData.columnval6 = $scope.columnName[6][0];
            $scope.editTableData.columnval7 = $scope.columnName[7][0];
            $scope.editTableData.filter = $scope.FilterArray[0];
            $scope.editTableData.join = $scope.joinArray[0];
            $scope.editTableData.expression = $scope.expressArray[0];
            $scope.outputdatasetlist = '';
            $scope.showinoutputData = false;
            $scope.showinputData = false;
            $scope.editstageData.seletType = $scope.stageType[1];
            $scope.editstageData.inputDataset = "Add New dataset";
            $scope.editstageData.outDataset = "Add New dataset";
            // var no = new ComboBox('cb_identifier');
            $('#AddStage').modal('show');
            /*
             * } else{ alert('Please add dataset first in the canvas;'); return
             * false; }
             */
        } else if (formName == 'datasetform') {
            // if(chartDataModel["nodes"].length > 0){
            $scope.editdataData = new Object();
            $scope.datasetType = datasetType;
            // alert($scope.datasetType);
            $('#AddDataSet').modal('show');
            /*
             * } else{ alert('Please add dataset first in the canvas;'); return
             * false; }
             */
        } else if (formName == 'PipeForm1') { //PipeForm1
            //alert('hiiiiiiii');
            $scope.editData = new Object();
            $scope.projectexist = false;
            //$scope.editData.frequency = 'Hourly';
            $('#AddModal').modal('show');
        }
        /*
         * $("form#" + formName).find("input[type=text],
         * textarea,select").val("") $("form#" + formName).find('input:radio,
         * input:checkbox').removeAttr( 'checked').removeAttr('selected');
         */
        /*
         * if (formName == 'stageForm1') { typeFormatFetch($scope, $http,
         * $templateCache, $rootScope, $location, 'stageType');
         * console.log($scope.stageType) $scope.editstageData = new Object();
         * $scope.editstageData.seletType = $scope.stageType[0];
         * console.log($scope.editstageData.seletType) }
         */
    };

    $scope.saveGraph = function() {
        $scope.data = {};
        $scope.data.type = '/listObject/project';
        $scope.method = 'GET';
        $scope.url = 'rest/service/' + $scope.data.type + '/' + selectedPipeId + '/' + selectedversion;
        $http({
            method: $scope.method,
            url: $scope.url,
            headers: headerObj
        }).success(

            function(data, status) {
                $scope.status = status;
                $scope.data = data;
                //console.log(data.jsonblob);
                var jsonData = angular.fromJson(data.jsonblob);
                var newJson = $('#jsonOutput').val();
                //$scope.data.datasetIds = ''
                //console.log(newJson);
                var notconfigure = false;
                if (newJson != '') {
                    jsonDatatemp = JSON.parse(newJson);
                    jsonData.stageList = jsonDatatemp.stageList;
                    delete jsonDatatemp.stageList;
                    jsonData.ExecutionGraph = jsonDatatemp;
                    //$scope.data.datasetIds = '';
                    angular.forEach(jsonData.ExecutionGraph.nodes, function(attr) {
                        //console.log(attr);
                        if (attr.nodetype != 'Ingestion' && attr.nodetype != 'Dataset' && attr.blockId.indexOf('version') == -1) {
                            notconfigure = true;
                        }
                        /*	else if(attr.nodetype == 'Dataset'){
                        		var datasetId =  attr.blockId.substr(0, attr.blockId.indexOf('pipe'));
                        		datasetId = datasetId.replace('flowchartWindow','');
                        		$scope.data.datasetIds += datasetId+',';
                        	}*/
                    });
                }
                /*if($scope.data.datasetIds.length > 0){
                	var lastChar = $scope.data.datasetIds.slice(-1);
                	if (lastChar == ',') {
                		$scope.data.datasetIds = $scope.data.datasetIds.slice(0, -1);
                	}
                	$scope.data.datasetIds = $scope.data.datasetIds.substr()
                }*/
                if (notconfigure === true) {
                    alert('Please configure all the tranformation');
                    return false;
                }

                $scope.data.schemaType = 'project';
                $scope.data.id = selectedPipeId;
                $scope.data.version = selectedversion;
                $scope.data.workspace_name = data.workspace_name;
                jsonData.workspace_name = data.workspace_name;
                $scope.data.jsonblob = angular.toJson(jsonData);
                $scope.data.updated_by = localStorage.getItem('itc.username');
                //	$scope.data.updatedDate = new Date();
                $scope.data.id = selectedPipeId;
                $scope.method = "POST";
                $scope.url = 'rest/service/addObject/';

                //	console.log($scope.data);
                $http({
                    method: $scope.method,
                    url: $scope.url,
                    data: $scope.data,
                    headers: headerObj
                }).success(

                    function(data, status) {
                        $scope.status = status;
                        $scope.myFormText.$dirty = false;
                        //console.log(selectedversion)
                        selectedversion = data.version;
                        //console.log(selectedversion)
                        /*schemaSourceDetails(myService, $scope, $http, $templateCache, $rootScope,
                        		$location, 'project');
                        listWorkspace($scope,$http);*/
                        /*$route.reload();*/
                        $scope.viewing = false;
                        $scope.canvasshow = true;
                        $('#saveProject').html('Project saved sucessfully');
                        setTimeout(function() {
                            $('#saveProject').html('');
                        }, 5000)
                    }).error(function(data, status) {
                    $scope.data = data || "Request failed";
                    $scope.status = status;
                    $('#saveProject').html('Project saved failed');
                    setTimeout(function() {
                        $("#saveProject").fadeOut(1500);
                    }, 5000)
                });



            }).error(function(data, status) {
            scope.data = data || "Request failed";
            scope.status = status;

        });

    }


    $scope.document = {};

    $scope.setTitle = function(fileInput) {

        var file = fileInput.value;
        var filename = file.replace(/^.*[\\\/]/, '');
        var title = filename.substr(0, filename.lastIndexOf('.'));
        $("#title").val(title);
        $("#title").focus();
        $scope.document.title = title;
    };

    $scope.uploadFile = function(files) {

        /*
         * uploadsService.uploadFile(files).then(function(promise){
         * 
         * $scope.code = promise.code(); //console.log($scope.code);
         * $scope.fileName = promise.fileName(); });
         */
        $scope.files = files;
    };

    $scope.callAtInterval = function() {
        // console.log("$scope.callAtInterval - Interval occurred");
        $scope.type = $location.path();
        $scope.type = $scope.type.replace(/\//g, '')
        // alert($scope.type);
        // alert($scope.pipeEdit);
        // alert($scope.pipelineStart);
        if ($scope.type == 'DatapipeWorkbench' && $scope.pipeEdit == true) {
            $scope.data = {};
            var errorC = 0;
          
            // scope.data.name = editDatastage.stagename;
            $scope.data.type = 'listPipelineStageLogDetails';
            // scope.data.jsonblob = angular.toJson(editDatastage);
            $scope.method = 'GET';
            // console.log(authService.rootscope);
            /* console.log(newJson); */
            $scope.url = 'rest/service/' + $scope.data.type + '/' +
                selectedPipeId;
            // console.log(scope.url);
            $http({
                    method: $scope.method,
                    url: $scope.url,
                    // data : scope.data,
                    headers: headerObj
                })
                .success(

                    function(data, status) {
                        $scope.status = status;
                        $scope.data = data;
                        // console.log(data);
                        var runstatusLog = '';

                        // console.log($scope.data.length)
                        if ($scope.data.length == 0) {
                            $scope.logUpdate = false;

                        } else {
                            if ($scope.pipeprevLog.length != $scope.data.length) {
                                $scope.logUpdate = true;
                            } else if ($scope.pipeprevLog[$scope.pipeprevLog.length - 1].status != $scope.data[$scope.data.length - 1].status) {
                                $scope.logUpdate = true;
                            } else {
                                $scope.logUpdate = false;
                            }
                        }

                        if ($scope.logUpdate == true) {
                            $('#pipeLog').html('');
                            angular.forEach(data, function(gattr) {
                                runstatusLog = gattr.stage + '  ' +
                                    gattr.status + '  ' + gattr.startTime + '  ' + gattr.endTime;
                                // $('#runStatus').apend('<p>'+runstatusLog+'</p>');
                                $('<p>' + runstatusLog + '</p>')
                                    .appendTo('#pipeLog');
                            });
                            $scope.pipeprevLog = $scope.data;
                        }

                        // $prevdata = $scope.runstatus;

                        // $('#runStatus').after('<p>'+data+'</p>');

                    }).error(function(data, status) {
                    if (status == 401) {
                        $location.path('/');
                    }
                    $scope.data = data || "Request failed";
                    $scope.status = status;

                });
        }
    }




    $scope.jsonData = new Object();

    $scope.projectRunStatus = function() {
		//console.log('projectrun status')

        /*
         * Added by 19726 on 10-11-2016
         * Show leftmenu links based on project type
         * 
         */

        $rootScope.selectedPipeType = '';
        $scope.method = 'GET';
        $scope.url = 'rest/service/project/projectType/' + selectedPipeId;


        $http({
                method: $scope.method,
                url: $scope.url

            })
            .success(
					
                function(data, status) {

                    if (data == 'Ingestion') {
						
                        $rootScope.selectedPipeType = 'Ingestion';
                        $('#clickablethreesub').show();
                        $('#clickabletwosub').hide();
                        /****** AJAX CALL TO CHECK PROJECT STATUS *******/
                        $scope.method = 'GET';
                        $scope.url = 'rest/service/project/schedulerStatus/' + selectedPipeId;

                        $http({
                                method: $scope.method,
                                url: $scope.url

                            })
                            .success(function(data, status) {
                                if (data.status == 'Active') {
                                    console.log("Active");
                                    $scope.projectRun[selectedPipeId] = true;
                                    $scope.runStop = $scope.projectRun[selectedPipeId];
                                } else {
                                    console.log("Response -> " + data.status);
                                    console.log(data);
                                    $scope.projectRun[selectedPipeId] = false;
                                    $scope.runStop = $scope.projectRun[selectedPipeId];
                                }

                            })
                            .error(function(data, status) {
                                console.log("Error occurred !!!");

                            });

                    } else {
                        $rootScope.selectedPipeType = 'Transformation';
                        $('#clickabletwosub').show();
                        $('#clickablethreesub').hide();
                    }
                }).error(function(data, status) {
                console.log("Error occurred !!!");
                if (status == 401) {
                    $location.path('/');
                }
                $scope.data = data || "Request failed";
                $scope.status = status;
            });

        //////////////////////////
        //selectColumn = false;
        $scope.jsonData = new Object();
        $scope.data = {};
        var errorC = 0;
     
        // scope.data.name = editDatastage.stagename;
        // scope.data.jsonblob = angular.toJson(editDatastage);
        $scope.method = 'GET';
        // console.log(authService.rootscope);
        /* console.log(newJson); */
        $scope.url = 'rest/service/projectrunstatus/' + selectedPipeId + '/' + selectedversion;
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
              
                //console.log(data)
                $scope.jsonData = $scope.data;
                $scope.jsonData[$scope.jsonData.projectId] = new Array();
                $scope.jsonData[$scope.jsonData.projectId] = $scope.jsonData;
                //console.log(Object.keys($scope.jsonData).length);
                if (Object.keys($scope.jsonData).length == 1) {
                    $interval.cancel(stopRun);
                    $scope.projectRun[$scope.jsonData.projectId] = false;
                    //	$scope.runStop = $scope.projectRun[$scope.jsonData.projectId];
                    $("#prunload").hide();
                }

                if (Object.keys($scope.jsonData).length > 1 && $scope.jsonData[$scope.jsonData.projectId].runStatus != 'submitted to oozie') {
                    $("#prunload").hide();
                }
                if (Object.keys($scope.jsonData).length > 1 && $scope.jsonData[$scope.jsonData.projectId].runStatus != 'RUNNING' && $scope.jsonData[$scope.jsonData.projectId].runStatus != 'submitted to oozie') {
                    $interval.cancel(stopRun);
                    $scope.projectRun[$scope.jsonData.projectId] = false;
                    //$scope.runStop = $scope.projectRun[$scope.jsonData.projectId];
                    $("#prunload").hide();
                } else {
                    $scope.runStop = $scope.projectRun[$scope.jsonData.projectId];
                }
                //	console.log($scope.jsonData[$scope.jsonData.projectId]);
                $scope.moduleStaus = angular.fromJson($scope.jsonData.moduleRunStatusList);
                $scope.moduleRunStatus = new Array();
                //	console.log($scope.moduleStaus.length);
                if ($scope.moduleStaus) {
                    for (var m = 0; m < $scope.moduleStaus.length; m++) {
                        var moduleId = $scope.moduleStaus[m].moduleId;
                        var moduleVersion = $scope.moduleStaus[m].moduleVersion;
                        var modver = moduleId + '_' + moduleVersion;
                        //alert(moduleId);
                        $scope.moduleRunStatus[modver] = new Array();
                        $scope.moduleRunStatus[modver]['runStatus'] = $scope.moduleStaus[m].runStatus;
                        $scope.moduleRunStatus[modver]['startTime'] = $scope.moduleStaus[m].startTime;
                        $scope.moduleRunStatus[modver]['endTime'] = $scope.moduleStaus[m].endTime;
                        $scope.moduleRunStatus[modver]['details'] = $scope.moduleStaus[m].details;
                        var spanID = 'flowchartWindow' + moduleId + 'pipe' + selectedPipeId;
                        var moduleType = $('[id*="' + spanID + '"]').attr('data-nodetype');
                        if (moduleType)
                            moduleType = moduleType.replace(/\ /g, '');
                        if ($scope.moduleRunStatus[modver]['runStatus'].toUpperCase() == 'OK') {
                            $('[id*="' + spanID + '"]').removeClass(moduleType + 'waitmod').addClass(moduleType + 'rightm');
                        } else if ($scope.moduleRunStatus[modver]['runStatus'].toUpperCase() == 'KILLED' || $scope.moduleRunStatus[modver]['runStatus'].toUpperCase() == 'ERROR') {
                            $('[id*="' + spanID + '"]').removeClass(moduleType + 'waitmod').addClass(moduleType + 'failmod');
                        } else if ($scope.moduleRunStatus[modver]['runStatus'].toUpperCase() == 'RUNNING') {
                            $('[id*="' + spanID + '"]').addClass(moduleType + 'waitmod');
                        }
                        //console.log($scope.moduleRunStatus[modver]['runStatus']);
                        //	alert($scope.moduleRunStatus[modver]['runStatus']);

                    }
                }
                //console.log($scope.moduleRunStatus);
                var datasetC = 0;
                //console.log($scope.jsonData)

            }).error(function(data, status) {
            if (status == 401) {
                $location.path('/');
            }
            scope.data = data || "Request failed";
            scope.status = status;

        });

    }
    $scope.stopPipeLine = function() {

        stopProcess($rootScope, $scope, $http, $location, 'project');
    }

    $scope.startPipeLine = function() {
		//console.log('start pipeline')
        var projectType = $scope.projectType;
		//var projectType1 =projectType;
		console.log('project type:'+"---"+projectType)
        $scope.data = {};
        var errorC = 0;
        var flowChartJson = $('#jsonOutput').val();
        if (flowChartJson != '')
            var flowChart = JSON.parse(flowChartJson);
        //alert(instance.getAllConnections().length);
        if ((flowChart == '' || flowChart == undefined) || (instance.getAllConnections().length == 0)) {
            alert('Please draw a proper graph before run the project.');
            return false;
        }
        $("#prunload").show();
        //setTimeout(function() { $("#prunload").hide(); }, 5000);
        $scope.projectRun[selectedPipeId] = true;
        $scope.runStop = $scope.projectRun[selectedPipeId];
        // alert('hi');
        // scope.data.name = editDatastage.stagename;
        $scope.data.type = 'project';
        // scope.data.jsonblob = angular.toJson(editDatastage);
        $scope.method = 'GET';
        // console.log(authService.rootscope);
        // console.log(newJson); 
        //$scope.url = 'rest/service/' + $scope.data.type + '/' + selectedPipeId + '/' +selectedversion;

        if (projectType == "Ingestion") {
			
            $scope.url = 'rest/service/project/ingestion/' + selectedPipeId + '/' + selectedversion;
        } else if (projectType == "Transformation") {
            $scope.url = 'rest/service/project/' + selectedPipeId + '/' + selectedversion;
        }
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
                $timeout(function() {
                    $scope.projectRunStatus();
                }, 5000);

            }).error(function(data, status) {
            if (status == 401) {
                $location.path('/');
            }
            $scope.data = data || "Request failed";
            $scope.status = status;

        });
    }
    /*stopRun = $interval(function() {
    	$scope.projectRunStatus();
    }, 5000);*/
    $scope.$on('$destroy', function() {
        // console.log('STOP');
        //$interval.cancel(stopTime);
        $interval.cancel(stopRun);

    });

    schemaSourceDetails(myService, $scope, $http, $templateCache, $rootScope,
        $location, 'project');
    $scope.notiData = new Object();
    $scope.notiData = myService.get();
    console.log($scope.notiData);
    if ($scope.notiData.length > 0) {
        $scope.editData = new Object();
        $scope.editData = angular
            .fromJson(data.jsonblob);
        $scope.editData.createdDate = $scope.notiData.created;
        $scope.editData.id = $scope.notiData.id;
        $scope.editData.updatedBy = $scope.notiData.created_by;
        if ($scope.notiData.permissionLevel) {
            $scope.editData.permissionLevel = $scope.notiData.permissionLevel;
            $scope.permissionLevel = $scope.notiData.permissionLevel;
            $scope.projectName = $scope.editData.name
            var graphTag = '<b>Project : ' +
                $scope.editData.name + '</b>'
            // graphTag = graphTag.toUpperCase();
            $('#graphHead').html(graphTag);
            //			alert($scope.editData.ExecutionGraph);
            if ($scope.editData.ExecutionGraph != '' &&
                $scope.editData.ExecutionGraph != undefined) {
                var flowChart = $scope.editData.ExecutionGraph;
                var flowChartJson = JSON.stringify(flowChart);
                //console.log(flowChartJson);

                //$("#saveall").trigger("click");
                //jsPlumb.loadFlowchart();
                $('#jsonOutput').val(flowChartJson);
            } else {
                $('#jsonOutput').val('');
            }
            selectedPipeId = $scope.notiData.id;
            selectedversion = $scope.notiData.version;
            /*if(first == undefined){*/
            $scope.pipeprevLog = new Object();
            $scope.pipelineStart = false;

            stopRun = $interval(function() {
                $scope.projectRunStatus();
            }, 5000);
            //}

            //console.log($('#jsonOutput').val());
            //console.log($("#loadChat"));
            if (flowChartJson != '')
                $("#loadChat").trigger("click", first);
        }
    }


    $scope.cleanMode = ['Replace with mean', 'Replace with median', 'Custom Value', 'Remove entire row']; /*,'Remove entire column'*/
    $scope.editData.cleanModeSelected = $scope.cleanMode[0];

    $scope.cleanModeSelect = false;
    $scope.columnName = new Object();
    $scope.tableName = new Array();
    $scope.columnNameByID = new Array();
    $scope.editData.columnNameByID2 = new Array();
    $scope.tableNameData = new Array();
    $scope.getColumnName = function(tablename1, tableNo) {
        var posTable = jQuery.inArray(tablename1, $scope.tableName);
        if (posTable == -1) {
            $scope.method = 'GET';
            $scope.url = 'rest/service/getColumns/' + tablename1;
            $http({
                method: $scope.method,
                url: $scope.url,
                // cache : $templateCache
                headers: headerObj
            }).success(function(data, status) {
                $scope.data = data;
                // console.log($scope.data);
                $scope.columnName[tableNo] = new Object();

                $scope.columnName[tableNo] = $scope.data;
                $scope.tableNameData[tablename1] = $scope.data;
                // console.log($scope.columnName);
                $scope.status = status;
                $scope.tableName[$scope.tableName.length] = tablename1;

            }).error(function(data, status) {
                if (status == 401) {
                    $location.path('/');
                }
                $scope.data = data || "Request failed";
                $scope.status = status;
            });
        } else {
            var prevTable = $scope.tableName[posTable];
            $scope.columnName[tableNo] = new Object();

            $scope.columnName[tableNo] = $scope.tableNameData[prevTable];
        }
    }
    $scope.tranformType = '';
    $scope.showRight = true;
    $scope.hideRight = false;
    $scope.closerightPanel = function(clsOpen) {
        if (clsOpen == 'close') {
            $rootScope.canvastoggle = 0;
            $('#prpertyTD').hide();
            $scope.showRight = true;
            $scope.hideRight = false;
        } else {
            $rootScope.canvastoggle = 1;
            $('#prpertyTD').show();
            $scope.hideRight = true;
            $scope.showRight = false;
        }
    }
    $scope.showRight = true;
    $scope.datanode = 'dataset';
    $scope.selectdataset = function(id) {
        //alert(id);
        $rootScope.canvastoggle = 1;
        $scope.hideRight = true;
        $scope.showRight = false;
        $('#prpertyTD').hide();
        $scope.method = 'GET';
        $scope.url = 'rest/service/dataset/' + id;
        //console.log($scope.url)
        $http({
                method: $scope.method,
                url: $scope.url,
                //cache : $templateCache,
                headers: headerObj
            })
            .success(

                function(data, status) {
                    $scope.status = status;
                    $scope.datasetdata = data;
                    $scope.jData = angular
                        .fromJson($scope.data.jsonblob);
                    $scope.datanode = 'dataset';
                    $('#prpertyTD').show();
                    //	scope.data.createdDate = getDateFormat(scope.data.createdDate);
                    //scope.data.updatedDate = getDateFormat(scope.data.updatedDate);
                })
            .error(

                function(data, status) {
                    $scope.data = data ||
                        "Request failed";
                    $scope.status = status;
                });
    }
    $scope.getColumnNameByTabID = function(tableID, sorceversion, anchor, transforId, targetversion, tranformType, souceNodeType, sourceanchor) {


        $scope.id1 = tableID;
        if (tranformType == 'Ingestion') souceNodeType[0] = 'Ingestion'; // Added on 29-Sep-2016 by 19726


        delete $scope.jarLocation;
        delete $scope.columnNameAndDatatype;
        console.log(sourceanchor);
        $scope.colArray = [];
        $scope.colArray1 = [];
        $scope.editData = new Object();

        $rootScope.canvastoggle = 1;
        $scope.hideRight = true;
        $scope.showRight = false;
        $('#prpertyTD').hide();
        $('#saveStatus').html('');
        $scope.editData.filterColumn = new Object();;
        str = '';
        $scope.editData.columnNameByID = new Array();
        $scope.editData.columnNameByID2 = new Array();
        $scope.columnNameByID = new Array();
        $scope.columnNameByID2 = new Array();
        tableArray = new Array();
        $scope.tranformType = tranformType;
        var souceLen = tableID.length;
        $scope.method = 'GET';

        if (tranformType == 'Hive' || tranformType == 'Pig' || tranformType == 'MapReduce') {
            //	alert(souceLen);
            SourceverVal = [];
            $scope.tempArray = new Array();
            for (var s = 0; s < souceLen; s++) {
                // alert(tableID[s]);
                if (anchor[s] == '0')
                    var tableno = 'table1';
                else if (anchor[s] == '0.5')
                    var tableno = 'table2';
                else if (anchor[s] == '1')
                    var tableno = 'table3';
                if (tranformType == 'Hive' || tranformType == 'Pig') {

                    if (sourceanchor) {
                        console.log(sourceanchor[s])
                        if (sourceanchor[s] == '0')
                            var split = 'split1';

                        else if (sourceanchor[s] == '1')
                            var split = 'split2';
                        //	 alert(souceNodeType)
                        if (souceNodeType[s] == 'Partition') {
                            SourceverVal.push({
                                id: tableID[s] + '_' + sorceversion[s],

                                tableName: tableno,
                                inputSplits: split
                            });
                        } else {
                            SourceverVal.push({
                                id: tableID[s] + '_' + sorceversion[s],
                                tableName: tableno
                            });
                        }

                    }

                } else {
                    if (sourceanchor) {
                        if (sourceanchor[s] == '0')
                            var split = 'split1';

                        else if (sourceanchor[s] == '1')
                            var split = 'split2';
                        if (souceNodeType == 'Partition')
                            $scope.editData.tagetSet = split;
                    }
                    SourceverVal.push({
                        id: tableID[s] + '_' + sorceversion[s],
                        tableName: tableno
                    });
                }


                //	 console.log(SourceverVal)
                $scope.tempArray[tableno] = $scope.columnNames;
                // console.log($scope.tempArray[tableno]);
                /*SourceverVal[s] = new Object();
                SourceverVal[s].id= tableID[s]+'_'+ sorceversion[s];
                SourceverVal[s].tableName= tableno;*/
                /*if(s<souceLen-1){
						 SourceverVal = SourceverVal[s]+', ';
					 }*/
                // tableArray[s] = tableno;
                //	 alert(tableArray[s]);
                $scope.columnNames = new Array();

                if (souceNodeType[s] == 'Dataset') {
                    var tmpversion = 0;
                    $scope.url = 'rest/service/getColumnsById/' + tableID[s] + '/' + tmpversion + '/' + tableno;
                } else {
                    if (sorceversion[s] == undefined)
                        sorceversion[s] = 0
                    $scope.url = 'rest/service/getColumnsById/' + tableID[s] + '/' + sorceversion[s] + '/' + tableno;

                }
                $http({
                    method: $scope.method,
                    url: $scope.url,

                    // cache : $templateCache
                    headers: headerObj
                }).success(function(data, status) {
                    $scope.data = data;
                    //alert(s);

                    //console.log($scope.data);
                    //$scope.columnNameByID.push.apply($scope.columnNameByID, $scope.data);
                    //columnNames.push($scope.data)
                    var tempArray = $scope.data;
                    var keyTab = tempArray[0];
                    if (keyTab)
                        keyTab = keyTab.name;
                    tempArray.shift();
                    var i = 0;
                    //console.log(tempArray);
                    var myData = tempArray;
                    dataArray = [];
                    //console.log(tempArray);
                    //	console.log(myData);
                    for (key in myData) {
                        //  dataArray.push(key);   
                        // Push the key on the array
                        //console.log(key)
                        dataArray.push(myData[key].name); // Push the key's value on the array
                    }

                    $scope.columnNames[keyTab] = dataArray.toString();
                    //console.log($scope.columnNames[keyTab])
                    //$scope.columnNameByID.push($scope.data);



                }).error(function(data, status) {
                    if (status == 401) {
                        $location.path('/');
                    }
                    $scope.data = data || "Request failed";
                    $scope.status = status;
                });
                //$scope.columnNames[tableno] =  tableArray[s];

            }
            $scope.editData.sourceID = SourceverVal

            $scope.datanode = 'templatetransform';
            if (transforId == 'sampleid') {
                $scope.url = 'no url';
            } else {

                if (targetversion == undefined)
                    targetversion = 0
                $scope.url = 'rest/service/listObject/module/' + transforId + '/' + targetversion;
            }
            if ($scope.url != 'no url') {
                $scope.editData.version = targetversion;
                $scope.editData.id = transforId;
                $http({
                    method: $scope.method,
                    url: $scope.url,
                    // cache : $templateCache
                    headers: headerObj
                }).success(function(data, status) {
                    $scope.data = data;
                    if (tranformType == 'Hive') {
                        $scope.editData.seletType = 'Hive';
                        var tempData = angular.fromJson(data.jsonblob);

                        if (tempData) {
                            var tempData1 = tempData.params.hiveSql;
                            $scope.editData.hiveSql = tempData1;
                        }
                        if (tempData.params.udfJarPath) {
                            $scope.editData.udfJarPath = tempData.params.udfJarPath;
                            $scope.jarLocation = tempData.params.udfJarPath;
                        }
                        if (tempData.params.temporaryFunc)
                            $scope.editData.temporaryFunc = tempData.params.temporaryFunc;
                        console.log($scope.editData.udfJarPath);
                        if (tempData.params.columnList) {
                            $scope.columnNameAndDatatype = tempData.params.columnList;
                            $scope.editData.columnList = tempData.params.columnList;
                        }

                    } else if (tranformType == 'Pig') {
                        $scope.editData.seletType = 'Pig';
                        var tempData = angular.fromJson(data.jsonblob);

                        var tempData1 = tempData.params.pig;
                        $scope.editData.pig = unescape(tempData.params.pig);
                        if (tempData.params.udfJarPath) {
                            $scope.editData.udfJarPath = tempData.params.udfJarPath;
                            $scope.jarLocation = tempData.params.udfJarPath;
                        }
                        if (tempData.params.columnList) {
                            $scope.columnNameAndDatatype = tempData.params.columnList;
                            $scope.editData.columnList = tempData.params.columnList;
                        }

                    } else if (tranformType == 'MapReduce') {
                        $scope.editData.seletType = 'MapReduce';
                        var tempData = angular.fromJson(data.jsonblob);
                        //console.log(tempData);
                        if (tempData) {
                            $scope.editData.mapclass = tempData.params.mapperClass;
                            $scope.editData.reduceclass = tempData.params.reducerClass;
                            $scope.editData.OutputKeyClass = tempData.params.outputKey;
                            $scope.editData.OutputValueClass = tempData.params.outputValue;
                            if (tempData.params.MRjarPath) {
                                $scope.editData.MRjarPath = tempData.params.MRjarPath;
                                $scope.jarLocation = tempData.params.MRjarPath;
                            }
                            if (tempData.params.columnList) {
                                $scope.columnNameAndDatatype = tempData.params.columnList;
                                $scope.editData.columnList = tempData.params.columnList;
                            }
                        }

                    }
                    $scope.status = status;

                    $('#prpertyTD').show();

                }).error(function(data, status) {
                    if (status == 401) {
                        $location.path('/');
                    }
                    $scope.data = data || "Request failed";
                    $scope.status = status;
                });
            } else {
                if (tranformType == 'Hive') {
                    $scope.editData.seletType = 'Hive';

                } else if (tranformType == 'Pig') {
                    $scope.editData.seletType = 'Pig';

                } else if (tranformType == 'MapReduce') {
                    $scope.editData.seletType = 'MapReduce';

                }

                $('#prpertyTD').show();

            }
        } else if ($rootScope.transFormModel.indexOf(tranformType) !== -1 && tranformType != 'Compare Model') {
            if (tranformType == "KMeans Clustering" || tranformType == "Random Forest Classification" || tranformType == "Random Forest Regression") {
                $scope.modelTransformAddition(tableID, sorceversion, anchor, transforId, targetversion, tranformType, souceNodeType);
            } else if (tranformType == "Linear Regression" || tranformType == "Binary Logistic Regression" || tranformType == "MultiClass Logistic Regression") {
                $scope.modelTransform(tableID, sorceversion, anchor, transforId, targetversion, tranformType, souceNodeType);
            } else {
                $scope.modelNewTransform(tableID, sorceversion, anchor, transforId, targetversion, tranformType, souceNodeType);
            }

        } else if (tranformType == 'Train') {
            $scope.actionTransform(tableID, sorceversion, anchor, transforId, targetversion, tranformType, souceNodeType);
        } else if (tranformType == 'Partition' || tranformType == 'Subset') {
            $scope.partitionSubTransform(tableID, sorceversion, anchor, transforId, targetversion, tranformType, souceNodeType);
        } else if (tranformType == 'Test' || tranformType == 'Compare Model') {
            $scope.datanode = 'testCompare';
            if (transforId != 'sampleid') {
                $scope.method = 'GET';

                if (targetversion == undefined)
                    targetversion = 0
                $scope.url = 'rest/service/listObject/module/' + transforId + '/' + targetversion;
                $scope.editData.version = targetversion;
                $scope.editData.id = transforId;
                $http({
                    method: $scope.method,
                    url: $scope.url,

                    headers: headerObj
                }).success(function(data, status) {
                    $scope.data = data;

                    var tempData = angular.fromJson(data.jsonblob);
                    //console.log(tempData);
                    if (tempData) {
                        var tempData1 = tempData.params;

                        if (tempData1) {
                            $scope.editData.description = tempData.params.description;
                        }

                        /*if(tempData.params.table3)
                        $scope.editData.table3 = tempData.params.table3;*/
                        //console.log($scope.editData.table3);
                    }


                    $('#prpertyTD').show();
                }).error(function(data, status) {
                    if (status == 401) {
                        $location.path('/');
                    }
                    $scope.data = data || "Request failed";
                    $scope.status = status;
                });
            } else {

                $('#prpertyTD').show();
            }
        } else if (tranformType == 'Group By') {
            $scope.checkedArray = new Array();
            $scope.editData.columnNamesJoin = new Array();
            $scope.datanode = 'groupby';
            SourceverVal = [];
            for (var s = 0; s < souceLen; s++) {
                if (anchor[s] == '0')
                    var tableno = 'table1';
                else if (anchor[s] == '0.5')
                    var tableno = 'table2';
                else if (anchor[s] == '1')
                    var tableno = 'table3';
                SourceverVal.push({
                    id: tableID[s] + '_' + sorceversion[s],
                    tableName: tableno
                });
                if (sourceanchor) {
                    if (sourceanchor[s] == '0')
                        var split = 'split1';

                    else if (sourceanchor[s] == '1')
                        var split = 'split2';
                    if (souceNodeType[s] == 'Partition')
                        $scope.editData.tagetSet = split;
                }
                // console.log(tableno)
                // $scope.tempArray[tableno] = $scope.columnNames;
                $scope.columnNamesGroup = new Array();
                if (souceNodeType[s] == 'Dataset') {
                    var datasetVersion = 0;
                    $scope.url = 'rest/service/getColumnsById/' + tableID[s] + '/' + datasetVersion + '/' + tableno;
                } else {
                    if (sorceversion[s] == undefined)
                        sorceversion[s] = 0
                    $scope.url = 'rest/service/getColumnsById/' + tableID[s] + '/' + sorceversion[s] + '/' + tableno;
                    //$scope.url = 'rest/service/listObject/module/'+tableID[s]+'/'+sorceversion[s]+'/'+tableno;
                };

                $http({
                    method: $scope.method,
                    url: $scope.url,
                    // cache : $templateCache
                    headers: headerObj
                }).success(function(data, status) {
                    $scope.data = data;
                    //alert(s);

                    var tempArray = $scope.data;
                    var keyTab = tempArray[0];
                    keyTab = keyTab.name;
                    //console.log(keyTab);
                    tempArray.shift();
                    //console.log(tempArray);
                    $scope.columnNamesGroup[keyTab] = new Array();
                    $scope.columnNamesGrouptemp = new Array();
                    $scope.columnNamesGroup[keyTab] = tempArray;
                    //$scope.columnNamesGrouptemp = tempArray;

                    if (transforId != 'sampleid') {
                        $scope.method = 'GET';

                        if (targetversion == undefined)
                            targetversion = 0
                        $scope.url = 'rest/service/listObject/module/' + transforId + '/' + targetversion;
                        $scope.editData.version = targetversion;
                        $scope.editData.id = transforId;
                        $http({
                            method: $scope.method,
                            url: $scope.url,

                            headers: headerObj
                        }).success(function(data, status) {
                            $scope.data = data;

                            var tempData = angular.fromJson(data.jsonblob);
                            //	console.log(tempData);
                            if (tempData) {
                                var tempData1 = tempData.params;

                                if (tempData1) {
                                    if (tempData.params.groupby) {
                                        $scope.checkedArray = new Array();
                                        $scope.editData.groupby = tempData.params.groupby;
                                        $scope.editData.oparation = tempData.params.oparation;
                                        //console.log($scope.editData.groupby);
                                        //console.log($scope.editData.groupby.length);
                                        //console.log($scope.editData.groupby[0]);
                                        /*for(var g=0;g<$scope.editData.groupby.length;g++){*/
                                        //$scope.editData.opInt[$scope.editData.groupby[g].name]= $scope.editData.groupby[g].oparation;
                                        //$scope.columnNameByID2 = $scope.editData.groupby;
                                        //console.log($scope.editData.columnNameByID2);
                                        console.log($scope.columnNamesGrouptemp)
                                        $scope.slelect2add = new Array();
                                        $scope.columnNameByIDgroup = new Array();
                                        $scope.editData.filterColumn = new Array();
                                        if ($scope.editData.groupby.length > 0) {
                                            for (var i = 0; i < $scope.columnNamesGroup['table2'].length; i++) {
                                                if ($scope.editData.groupby.indexOf($scope.columnNamesGroup['table2'][i].name) !== -1) {
                                                    $scope.columnNameByID2.push($scope.columnNamesGroup['table2'][i]);
                                                    //$scope.columnNamesGrouptemp.splice(i,1);
                                                    $scope.slelect2add.push($scope.columnNamesGroup['table2'][i].name);
                                                    $scope.editData.filterColumn.push($scope.columnNamesGroup['table2'][i].name);
                                                } else {
                                                    $scope.columnNamesGrouptemp.push($scope.columnNamesGroup['table2'][i]);
                                                }
                                            }
                                        } else {
                                            for (var i = 0; i < $scope.columnNamesGroup['table2'].length; i++) {
                                                $scope.columnNamesGrouptemp.push($scope.columnNamesGroup['table2'][i]);
                                            }
                                        }




                                        /*}*/
                                        console.log($scope.columnNamesGrouptemp)
                                        for (var g = 0; g < $scope.editData.oparation.length; g++) {
                                            if ($scope.editData.oparation[g].oparation != 'None') {
                                                $scope.checkedArray[$scope.editData.oparation[g].name] = true;
                                                $scope.colArray.push($scope.editData.oparation[g].name);
                                            }

                                            $scope.editData.opInt[$scope.editData.oparation[g].name] = $scope.editData.oparation[g].oparation;
                                            //$scope.checkedArray[$scope.editData.groupby[g].name] = true;
                                        }
                                        //	console.log($scope.checkedArray);
                                    }

                                    /*if(tempData.params.table3)
                                    $scope.editData.table3 = tempData.params.table3;*/
                                    //console.log($scope.editData.table3);
                                }

                            }

                            $('#prpertyTD').show();
                        }).error(function(data, status) {
                            if (status == 401) {
                                $location.path('/');
                            }
                            $scope.data = data || "Request failed";
                            $scope.status = status;
                        });
                    } else {
                        for (var i = 0; i < $scope.columnNamesGroup['table2'].length; i++) {
                            $scope.columnNamesGrouptemp.push($scope.columnNamesGroup['table2'][i]);
                        }
                        $('#prpertyTD').show();
                    }
                    $scope.status = status;



                }).error(function(data, status) {
                    if (status == 401) {
                        $location.path('/');
                    }
                    $scope.data = data || "Request failed";
                    $scope.status = status;
                });
            }
            $scope.editData.sourceID = SourceverVal;
            $scope.editData.opInt = new Object();



        } else if (tranformType == 'Join') {
            $scope.editData.columnNamesJoin = new Array();
            $scope.datanode = 'join';
            SourceverVal = [];
            for (var s = 0; s < souceLen; s++) {
                if (anchor[s] == '0')
                    var tableno = 'table1';
                else if (anchor[s] == '0.5')
                    var tableno = 'table2';
                else if (anchor[s] == '1')
                    var tableno = 'table3';
                SourceverVal.push({
                    id: tableID[s] + '_' + sorceversion[s],
                    tableName: tableno
                });
                if (sourceanchor) {
                    if (sourceanchor[s] == '0')
                        var split = 'split1';

                    else if (sourceanchor[s] == '1')
                        var split = 'split2';

                    if (souceNodeType[s] == 'Partition')
                        $scope.editData.tagetSet = split;
                }
                // console.log(tableno)
                // $scope.tempArray[tableno] = $scope.columnNames;
                $scope.columnNamesJoin = new Array();
                if (souceNodeType[s] == 'Dataset') {
                    var datasetVersion = 0;
                    $scope.url = 'rest/service/getColumnsById/' + tableID[s] + '/' + datasetVersion + '/' + tableno;
                } else {
                    if (sorceversion[s] == undefined)
                        sorceversion[s] = 0
                    $scope.url = 'rest/service/getColumnsById/' + tableID[s] + '/' + sorceversion[s] + '/' + tableno;
                    //$scope.url = 'rest/service/listObject/module/'+tableID[s]+'/'+sorceversion[s]+'/'+tableno;
                };

                $http({
                    method: $scope.method,
                    url: $scope.url,
                    // cache : $templateCache
                    headers: headerObj
                }).success(function(data, status) {
                    $scope.data = data;
                    //alert(s);

                    var tempArray = $scope.data;
                    var keyTab = tempArray[0];
                    keyTab = keyTab.name;
                    //console.log(keyTab);
                    tempArray.shift();
                    //console.log(tempArray);
                    $scope.columnNamesJoin[keyTab] = new Array();
                    $scope.columnNamesJoin[keyTab] = tempArray;
                    //console.log($scope.columnNamesJoin[keyTab])

                    $scope.status = status;



                }).error(function(data, status) {
                    if (status == 401) {
                        $location.path('/');
                    }
                    $scope.data = data || "Request failed";
                    $scope.status = status;
                });
            }
            $scope.editData.sourceID = SourceverVal;

            if (transforId != 'sampleid') {
                $scope.method = 'GET';

                if (targetversion == undefined)
                    targetversion = 0
                $scope.url = 'rest/service/listObject/module/' + transforId + '/' + targetversion;
                $scope.editData.version = targetversion;
                $scope.editData.id = transforId;
                $http({
                    method: $scope.method,
                    url: $scope.url,

                    headers: headerObj
                }).success(function(data, status) {
                    $scope.data = data;

                    var tempData = angular.fromJson(data.jsonblob);
                    //console.log(tempData);
                    if (tempData) {
                        var tempData1 = tempData.params;

                        if (tempData1) {
                            if (tempData.params.table1)
                                $scope.editData.table1 = tempData.params.table1;
                            if (tempData.params.table3)
                                $scope.editData.table3 = tempData.params.table3;
                            //console.log($scope.editData.table3);
                        }

                    }

                    $('#prpertyTD').show();
                }).error(function(data, status) {
                    if (status == 401) {
                        $location.path('/');
                    }
                    $scope.data = data || "Request failed";
                    $scope.status = status;
                });
            } else {
                $('#prpertyTD').show();
            }
        } else {
            $scope.datanode = 'templatecustom';
            $scope.columnNameByID2 = new Array();
            for (var s = 0; s < souceLen; s++) {

                var tempSoruceType = souceNodeType[s];
                if (sourceanchor) {

                    if (sourceanchor[s] == '0')
                        var split = 'split1';

                    else if (sourceanchor[s] == '1')
                        var split = 'split2';

                    if (souceNodeType[s] == 'Partition')
                        $scope.editData.tagetSet = split;
                }
                console.log(souceNodeType + souceNodeType[s]);

                if (souceNodeType[s] == 'Dataset' || souceNodeType == 'Ingestion') {

                    console.log("souceNodeType[s] -> " + souceNodeType[s]);


                    var tempId = targetversion.match(/(\d+)/g);
                    var pid = tempId.toString();

                    var projectId = pid.substr(0, 4);
                    var projectVersion = pid.substr(4, 1);


                    //rest call to get ingestion details

                    $scope.method = 'GET';

                    if (souceNodeType[s] == 'Dataset') {

                        $scope.url = 'rest/service/getColumnsById/' + tableID[s];
                    } else if (souceNodeType == 'Ingestion') {
                        $scope.url = 'rest/service/project/schedule/' + projectId;

                    }
                    $http({
                            method: $scope.method,
                            url: $scope.url
                        })
                        .success(function(data) {

                            console.log("Rest call details -> " + data);
                            $scope.editData = data;
                        }).error(function(data, status) {
                            console.log("Rest call Error -> " + status);
                        });
                    //rest call Ends

                } else {
                    if (sorceversion[s] == undefined)
                        sorceversion[s] = 0
                    $scope.url = 'rest/service/listObject/module/' + tableID[s] + '/' + sorceversion[s];

                }
                $http({
                    method: $scope.method,
                    url: $scope.url,
                    // cache : $templateCache
                    headers: headerObj
                }).success(function(data, status) {
                    $scope.data = data;


                    if (tempSoruceType == 'Dataset' || tempSoruceType == 'Ingestion') {

                        //$scope.columnNameByID.push.apply($scope.columnNameByID, $scope.data);
                        $scope.columnNameByID = $scope.columnNameByID.concat($scope.data);
                        //$scope.columnNameByID.push($scope.data);
                    } else {
                        var tempData = angular.fromJson(data.jsonblob);

                        if (tempData) {

                            var tempData1 = tempData.params.columnList;


                            if (tempData1) {
                                $scope.columnNameByID.push.apply($scope.columnNameByID, tempData1);
                                //$scope.columnNameByID.push(tempData1); //$.parseJSON('[' + tempData1 + ']');//eval('(' + tempData1 + ')'); ;
                            }

                            if (tranformType == 'Clean Missing Data') {

                                $scope.editData.cleanModeSelected = tempData.params.oparater;

                                if ($scope.editData.cleanModeSelected == 'Custom Value') {
                                    $scope.editData.customValue = tempData.params.value;

                                }
                            }

                        }

                    }
                    $scope.editData.columnNameByID = $scope.columnNameByID;
                    $scope.status = status;

                    $('#prpertyTD').show();


                    if (tranformType == 'Clean Missing Data') {
                        $scope.cleanModeSelect = true;

                    } else {
                        $scope.cleanModeSelect = false;
                    }

                }).error(function(data, status) {
                    if (status == 401) {
                        $location.path('/');
                    }
                    $scope.data = data || "Request failed";
                    $scope.status = status;
                });
            }
            if (transforId != 'sampleid') {
                $scope.method = 'GET';

                if (targetversion == undefined)
                    targetversion = 0
                $scope.url = 'rest/service/listObject/module/' + transforId + '/' + targetversion;
                $scope.editData.version = targetversion;
                $scope.editData.id = transforId;
                $http({
                    method: $scope.method,
                    url: $scope.url,

                    headers: headerObj
                }).success(function(data, status) {
                    $scope.data = data;

                    var tempData = angular.fromJson(data.jsonblob);
                    if (tempData) {
                        if (tranformType == 'Clean Missing Data') {
                            var tempData1 = tempData.params.selectedcolumnList;
                        } else {
                            var tempData1 = tempData.params.columnList
                        }
                        if (tempData.params.oparater) {

                            $scope.editData.cleanModeSelected = tempData.params.oparater;

                            if ($scope.editData.cleanModeSelected == 'Custom Value') {
                                $scope.editData.customValue = tempData.params.value;

                            }
                        }

                        if (tempData1) {
                            $scope.columnNameByID2 = new Array();
                            for (var g = 0; g < tempData1.length; g++) {
                                $scope.columnNameByID2[tempData1[g].name] = true;
                                $scope.colArray1.push(tempData1[g]);
                            }


                        }


                    }


                    $scope.editData.filterColumn = new Object();

                    $scope.editData.filterColumn = $scope.columnNameByID2;



                    $scope.status = status;

                    if (tranformType == 'Clean Missing Data') {
                        $scope.cleanModeSelect = true;

                    } else {
                        $scope.cleanModeSelect = false;
                    }

                }).error(function(data, status) {
                    if (status == 401) {
                        $location.path('/');
                    }
                    $scope.data = data || "Request failed";
                    $scope.status = status;
                });
            }
        }


    }
    $scope.dirtyFrom = function() {
        $scope.myFormText.$dirty = true;
    }
    $scope.actionTransform = function(tableID, sorceversion, anchor, transforId, targetversion, tranformType, souceNodeType) {
        //$scope.checkedArray = new Array();



        $scope.datanode = 'action';
        SourceverVal = [];
        var algoSource;
        var souceLen = tableID.length;
        var indexD = -1;
        $scope.columnNameByID = new Array();
        $scope.origcolumnNameByID = new Array();
        $scope.columnNameByIDlabel = new Array();
        $scope.editData.features = new Array();
        $scope.editData.label = new Array();
        for (var s = 0; s < souceLen; s++) {
            var tempSoruceType = souceNodeType[s];
            if (anchor[s] == '0')
                var tableno = 'table1';
            else if (anchor[s] == '0.5')
                var tableno = 'table2';
            else if (anchor[s] == '1')
                var tableno = 'table3';
            SourceverVal.push({
                id: tableID[s] + '_' + sorceversion[s],
                tableName: tableno
            });

            // $scope.tempArray[tableno] = $scope.columnNames;

            if (souceNodeType[s] == 'Dataset') {
                var datasetVersion = 0;
                $scope.url = 'rest/service/getColumnsById/' + tableID[s];;
            } else if ($rootScope.transFormModel.indexOf(souceNodeType[s]) !== -1) {
                algoSource = souceNodeType[s];
                continue;
            } else {
                if (sorceversion[s] == undefined)
                    sorceversion[s] = 0
                $scope.url = 'rest/service/listObject/module/' + tableID[s] + '/' + sorceversion[s];
                //	$scope.url = 'rest/service/getColumnsById/'+tableID[s]+'/'+sorceversion[s];
                //$scope.url = 'rest/service/listObject/module/'+tableID[s]+'/'+sorceversion[s]+'/'+tableno;
            }
            $http({
                method: $scope.method,
                url: $scope.url,
                // cache : $templateCache
                headers: headerObj
            }).success(function(data, status) {
                $scope.data = data;
                //alert(s);
                //alert(tempSoruceType);	
                if (data.jsonblob != undefined) {
                    var tempData = angular.fromJson(data.jsonblob);

                    if (tempData) {
                        if (tempData.params)
                            var tempData1 = tempData.params.columnList;


                        if (tempData1) {
                            $scope.columnNameByID = tempData1;
                            $scope.origcolumnNameByID = tempData1;
                            //$scope.columnNameByID.push(tempData1); //$.parseJSON('[' + tempData1 + ']');//eval('(' + tempData1 + ')'); ;
                        }



                    }

                } else {

                    //$scope.columnNameByID.push.apply($scope.columnNameByID, $scope.data);
                    $scope.columnNameByID = $scope.data;
                    $scope.origcolumnNameByID = $scope.data;;
                    //$scope.columnNameByID.push($scope.data);


                }
                $scope.columnNameByIDlabel = new Array();
                for (var d = 0; d < $scope.columnNameByID.length; d++) {
                    if ($scope.columnNameByID[d].dataType == 'int' || $scope.columnNameByID[d].dataType == 'float' || $scope.columnNameByID[d].dataType == 'double' || $scope.columnNameByID[d].dataType == 'long') {
                        $scope.columnNameByIDlabel[$scope.columnNameByIDlabel.length] = $scope.columnNameByID[d];
                    }

                }


                $scope.status = status;



            }).error(function(data, status) {
                if (status == 401) {
                    $location.path('/');
                }
                $scope.data = data || "Request failed";
                $scope.status = status;
            });
        }
        $scope.editData.sourceID = SourceverVal;
        $scope.editData.algoSource = algoSource;
        $scope.editData.opInt = new Object();


        if (transforId != 'sampleid') {
            $scope.method = 'GET';

            if (targetversion == undefined)
                targetversion = 0
            $scope.url = 'rest/service/listObject/module/' + transforId + '/' + targetversion;
            $scope.editData.version = targetversion;
            $scope.editData.id = transforId;
            $http({
                method: $scope.method,
                url: $scope.url,

                headers: headerObj
            }).success(function(data, status) {
                $scope.data = data;

                var tempData = angular.fromJson(data.jsonblob);

                if (tempData) {
                    var tempData1 = tempData.params;

                    if (tempData1) {
                        if (tempData.params) {
                            if (tempData.params.label)
                                $scope.editData.label = tempData.params.label;
                            $scope.prevlabel = $scope.editData.label;

                            if (tempData.params.features) {
                                $scope.editData.features = new Array();
                                $scope.editData.features = tempData.params.features;
                            }


                            //$scope.editData.features = $scope.editData.features.split(",");

                            //alert($scope.editData.label.name);
                            //alert($scope.columnNameByID);
                            for (var k = 0; k < $scope.columnNameByID.length; k++) {
                                if ($scope.editData.label) {
                                    if ($scope.columnNameByID[k].name == $scope.editData.label.name) {
                                        indexD = k;
                                        break;
                                    }
                                }


                            }
                            //var i = $scope.columnNameByID.indexOf($scope.editData.label.name);
                            //	alert(indexD);
                            if (indexD != -1) {
                                if ($scope.columnNameByID.length > 0)
                                    $scope.columnNameByID.splice(indexD, 1);
                            }

                            //getHTML();
                            /*for(var i = $scope.columnNameByID.length; i--;) {
									console.log($scope.columnNameByID[i]);
									console.log($scope.editData.label);
							          if($scope.columnNameByID[i] == $scope.editData.label) {
							        	  console.log($scope.columnNameByID[i]);
							        	  $scope.columnNameByID.splice(i, 1);
							          }
							      }
								console.log($scope.columnNameByID);*/
                            /*if(tempData.params.table3)
                            $scope.editData.table3 = tempData.params.table3;*/
                            //console.log($scope.editData.table3);
                        }

                    }
                }
                $('#prpertyTD').show();
            }).error(function(data, status) {
                if (status == 401) {
                    $location.path('/');
                }
                $scope.data = data || "Request failed";
                $scope.status = status;
            });
        } else {
            $('#prpertyTD').show();
        }
    }
    $scope.updateFeatureList = function() {
        console.log($scope.columnNameByID);
        $scope.columnNameByID = $scope.origcolumnNameByID;
        for (var k = 0; k < $scope.columnNameByID.length; k++) {
            if ($scope.columnNameByID[k].name == undefined)
                delete $scope.columnNameByID[k];
            if ($scope.editData.label) {
                if ($scope.columnNameByID[k].name == $scope.editData.label.name) {
                    indexD = k;
                }
            }


        }
        var indexD1 = -1;
        for (var k = 0; k < $scope.editData.features.length; k++) {
            if ($scope.editData.label) {
                if ($scope.editData.features[k].name == $scope.editData.label.name) {
                    indexD1 = k;
                    break;
                }
            }


        }
        if (indexD1 != -1) {
            if ($scope.editData.features.length > 0)
                $scope.editData.features.splice(indexD1, 1);
        }
        console.log($scope.editData.features);
        //var i = $scope.columnNameByID.indexOf($scope.editData.label.name);
        //alert(indexD);
        if (indexD != -1) {
            if ($scope.columnNameByID.length > 0)
                $scope.columnNameByID.splice(indexD, 1);
        }
        if ($scope.prevlabel) {
            $scope.columnNameByID.push($scope.prevlabel);
        }
        console.log($scope.columnNameByID);
    }
    $scope.partitionSubTransform = function(tableID, sorceversion, anchor, transforId, targetversion, tranformType, souceNodeType) {
        //$scope.checkedArray = new Array();

        $scope.datanode = 'partition';
        SourceverVal = [];
        var algoSource;
        var souceLen = tableID.length;
        $scope.columnNameByID = new Array();
        $scope.columnNameByIDlabel = new Array();
        for (var s = 0; s < souceLen; s++) {
            //alert(tableID[s]);
            var tempSoruceType = souceNodeType[s];
            if (anchor[s] == '0') {
                var tableno = 'table1';
                var targetSet = 'parition1';
            } else if (anchor[s] == '0.5')
                var tableno = 'table2';
            else if (anchor[s] == '1') {
                var tableno = 'table3';
                var targetSet = 'parition2';
            }

            SourceverVal.push({
                id: tableID[s] + '_' + sorceversion[s],
                tableName: tableno
            });
            // console.log(tableno)
            // $scope.tempArray[tableno] = $scope.columnNames;

            if (souceNodeType[s] == 'Dataset') {
                var datasetVersion = 0;
                $scope.url = 'rest/service/getColumnsById/' + tableID[s];;
            } else if ($rootScope.transFormModel.indexOf(souceNodeType[s]) !== -1) {
                algoSource = souceNodeType[s];
                continue;
            } else {
                if (sorceversion[s] == undefined)
                    sorceversion[s] = 0
                $scope.url = 'rest/service/listObject/module/' + tableID[s] + '/' + sorceversion[s];

                //$scope.url = 'rest/service/getColumnsById/'+tableID[s]+'/'+sorceversion[s];
                //$scope.url = 'rest/service/listObject/module/'+tableID[s]+'/'+sorceversion[s]+'/'+tableno;
            }
            $http({
                method: $scope.method,
                url: $scope.url,
                // cache : $templateCache
                headers: headerObj
            }).success(function(data, status) {
                $scope.data = data;
                //alert(s);
                //alert(tempSoruceType);	
                if (data.jsonblob != undefined) {
                    var tempData = angular.fromJson(data.jsonblob);

                    if (tempData) {
                        if (tempData.params)
                            var tempData1 = tempData.params.columnList;


                        if (tempData1) {
                            $scope.columnNameByID = tempData1;
                            //$scope.columnNameByID.push(tempData1); //$.parseJSON('[' + tempData1 + ']');//eval('(' + tempData1 + ')'); ;
                            console.log($scope.columnNameByID);
                        }



                    }

                } else {
                    //console.log($scope.data);
                    //$scope.columnNameByID.push.apply($scope.columnNameByID, $scope.data);
                    $scope.columnNameByID = $scope.data;
                    //console.log($scope.columnNameByID);
                    //$scope.columnNameByID.push($scope.data);
                    //console.log($scope.columnNameByID);

                }


                $scope.status = status;

                $scope.editData.columnlist = $scope.columnNameByID;

            }).error(function(data, status) {
                if (status == 401) {
                    $location.path('/');
                }
                $scope.data = data || "Request failed";
                $scope.status = status;
            });
        }
        $scope.editData.sourceID = SourceverVal;
        $scope.editData.algoSource = algoSource;
        $scope.editData.opInt = new Object();


        if (transforId != 'sampleid') {
            $scope.method = 'GET';

            if (targetversion == undefined)
                targetversion = 0
            $scope.url = 'rest/service/listObject/module/' + transforId + '/' + targetversion;
            $scope.editData.version = targetversion;
            $scope.editData.id = transforId;
            $http({
                method: $scope.method,
                url: $scope.url,

                headers: headerObj
            }).success(function(data, status) {
                $scope.data = data;

                var tempData = angular.fromJson(data.jsonblob);
                //console.log(tempData);
                if (tempData) {
                    var tempData1 = tempData.params;

                    if (tempData1) {
                        if (tempData.params) {
                            $scope.editData.percentage = tempData.params.percentage;
                            if (tempData.params.sampling)
                                $scope.editData.sampling = tempData.params.sampling;

                        }

                    }

                }
                $('#prpertyTD').show();
            }).error(function(data, status) {
                if (status == 401) {
                    $location.path('/');
                }
                $scope.data = data || "Request failed";
                $scope.status = status;
            });
        } else {
            $('#prpertyTD').show();
        }
    }

    $scope.modelTransformAddition = function(tableID, sorceversion, anchor, transforId, targetversion, tranformType, souceNodeType) {
        $scope.datanode = 'modelAddition';
        $scope.editData = new Object();
        if (transforId != 'sampleid') {
            $scope.method = 'GET';

            if (targetversion == undefined)
                targetversion = 0
            $scope.url = 'rest/service/listObject/module/' + transforId + '/' + targetversion;
            $scope.editData.version = targetversion;
            $scope.editData.id = transforId;
            $http({
                method: $scope.method,
                url: $scope.url,

                headers: headerObj
            }).success(function(data, status) {
                $scope.data = data;

                var tempData = angular.fromJson(data.jsonblob);
                //	console.log(tempData);
                if (tempData) {
                    var tempData1 = tempData.params;

                    if (tempData1) {
                        if (tempData.params.trees)
                            $scope.editData.trees = tempData.params.trees;
                        if (tempData.params.iteration)
                            $scope.editData.iteration = tempData.params.iteration;
                        if (tempData.params.depth)
                            $scope.editData.depth = tempData.params.depth;
                        if (tempData.params.bins)
                            $scope.editData.bins = tempData.params.bins;
                        if (tempData.params.numofclasses)
                            $scope.editData.numofclasses = tempData.params.numofclasses;
                        if (tempData.params.seed)
                            $scope.editData.seed = tempData.params.seed;
                        if (tempData.params.subset)
                            $scope.editData.subset = tempData.params.subset;
                        if (tempData.params.impurity)
                            $scope.editData.impurity = tempData.params.impurity;
                        //console.log($scope.editData.table3);
                    }

                }

                $('#prpertyTD').show();
            }).error(function(data, status) {
                if (status == 401) {
                    $location.path('/');
                }
                $scope.data = data || "Request failed";
                $scope.status = status;
            });
        } else {
            $('#prpertyTD').show();
        }
    }
    $scope.modelNewTransform = function(tableID, sorceversion, anchor, transforId, targetversion, tranformType, souceNodeType) {
        $scope.datanode = 'modelnew';
        $scope.editData = new Object();
        if (transforId != 'sampleid') {
            $scope.method = 'GET';

            if (targetversion == undefined)
                targetversion = 0
            $scope.url = 'rest/service/listObject/module/' + transforId + '/' + targetversion;
            $scope.editData.version = targetversion;
            $scope.editData.id = transforId;
            $http({
                method: $scope.method,
                url: $scope.url,

                headers: headerObj
            }).success(function(data, status) {
                $scope.data = data;

                var tempData = angular.fromJson(data.jsonblob);
                //	console.log(tempData);
                if (tempData) {
                    var tempData1 = tempData.params;

                    if (tempData1) {
                        if (tempData.params.stepsize)
                            $scope.editData.stepsize = tempData.params.stepsize;
                        if (tempData.params.iteration)
                            $scope.editData.iteration = tempData.params.iteration;
                        if (tempData.params.impurity)
                            $scope.editData.impurity = tempData.params.impurity;
                        if (tempData.params.bins)
                            $scope.editData.bins = tempData.params.bins;
                        if (tempData.params.depth)
                            $scope.editData.depth = tempData.params.depth;
                        if (tempData.params.regularization)
                            $scope.editData.regularization = tempData.params.regularization;
                        if (tempData.params.minBatchFraction)
                            $scope.editData.minBatchFraction = tempData.params.minBatchFraction;
                        if (tempData.params.lambda)
                            $scope.editData.lambda = tempData.params.lambda;
                        if (tempData.params.numofclasses)
                            $scope.editData.numofclasses = tempData.params.numofclasses;

                    }

                }

                $('#prpertyTD').show();
            }).error(function(data, status) {
                if (status == 401) {
                    $location.path('/');
                }
                $scope.data = data || "Request failed";
                $scope.status = status;
            });
        } else {
            $('#prpertyTD').show();
        }
    }
    $scope.modelTransform = function(tableID, sorceversion, anchor, transforId, targetversion, tranformType, souceNodeType) {
        $scope.datanode = 'model';
        $scope.editData = new Object();
        if (transforId != 'sampleid') {
            $scope.method = 'GET';

            if (targetversion == undefined)
                targetversion = 0
            $scope.url = 'rest/service/listObject/module/' + transforId + '/' + targetversion;
            $scope.editData.version = targetversion;
            $scope.editData.id = transforId;
            $http({
                method: $scope.method,
                url: $scope.url,

                headers: headerObj
            }).success(function(data, status) {
                $scope.data = data;

                var tempData = angular.fromJson(data.jsonblob);
                //	console.log(tempData);
                if (tempData) {
                    var tempData1 = tempData.params;

                    if (tempData1) {
                        if (tempData.params.stepsize)
                            $scope.editData.stepsize = tempData.params.stepsize;
                        if (tempData.params.iteration)
                            $scope.editData.iteration = tempData.params.iteration;
                        if (tempData.params.intercept)
                            $scope.editData.intercept = tempData.params.intercept;
                        if (tempData.params.regParam)
                            $scope.editData.regParam = tempData.params.regParam;
                        if (tempData.params.minBatchFraction)
                            $scope.editData.minBatchFraction = tempData.params.minBatchFraction;
                        /*if(tempData.params.numofclasses)
                        	$scope.editData.numofclasses = tempData.params.numofclasses;*/

                        //console.log($scope.editData.table3);
                    }

                }

                $('#prpertyTD').show();
            }).error(function(data, status) {
                if (status == 401) {
                    $location.path('/');
                }
                $scope.data = data || "Request failed";
                $scope.status = status;
            });
        } else {
            $('#prpertyTD').show();
        }
    }
    $scope.changeColumn = function(Value) {
        // console.log(Value);
        $scope.editData.filterColumn = Value;
        $scope.slelect2add = Value;
        for (g = 0; g < $scope.slelect2add.length; g++) {
            console.log($scope.slelect2add[g]);
            $scope.checkedArray[$scope.slelect2add[g]] = false;
            var index = $scope.colArray.indexOf($scope.slelect2add[g]);
            $scope.colArray.splice(index, 1);
            $scope.editData.opInt[$scope.slelect2add[g]] = 'None';
            //$scope.editData.oparation[g].oparation = 'None'
        }
        // $scope.checkedArray[$scope.slelect2add[g].name] = false;
        //$scope.colArray.push($scope.slelect2add[g].name);
    }
    $scope.uploadJarFile = function(files) {
        if ($('#uploadJarFile'))
            $('#uploadJarFile').removeClass('uploadButt');
        if ($('#PigJarId'))
            $('#PigJarId').removeClass('uploadButt');
        if ($('#HiveJarId'))
            $('#HiveJarId').removeClass('uploadButt');
        var fd = new FormData();

        // Take the first selected file
        fd.append("file", files[0]);
        var promise = $http.post(
            'rest/service/uploadMapRedJar/', fd,

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


            //console.log(response.data);
            $scope.jarLocation = response.data;
            //console.log($scope.jarLocation);
            /*$scope.columnNameArray=response.data;
            //console.log($scope.columnNameArray);
            $('#addAtribute').show();
            $('#uploadedTable').show();*/
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

    $scope.uploadOutputSchemaFile = function(files) {
        var fd = new FormData();

        // Take the first selected file
        fd.append("file", files[0]);
        var promise = $http.post(
            'rest/service/uploadSchema/', fd,

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


            //console.log(response.data);
            $scope.columnNameAndDatatype = new Array();
            $scope.columnNameAndDatatype = response.data;
            //console.log($scope.columnNameArray);
            //$('#addAtribute').show();
            //$('#uploadedTable').show();
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



    $scope.chkGroupby = function(chkName) {
        //	console.log($scope.slelect2add);
        if ($scope.slelect2add != undefined) {
            if ($scope.slelect2add.indexOf(chkName) === -1) {
                return false
            } else {
                return true;
            }
        }

    }
    $scope.chkChecked = function(chkName) {
        //	console.log($scope.slelect2add);
        if ($scope.colArray != undefined) {
            if ($scope.colArray.indexOf(chkName) === -1) {
                return true;
            } else {
                return false;
            }
        }

    }
    $scope.colArray = [];
    $scope.colArray1 = [];
    $scope.stingOp = ["Count"];
    $scope.intOp = ["Max", 'Min', 'Sum'];
    //$scope.input=[];
    $scope.runHiveQuery = function(query) {



        // request body : post
        $scope.runObj = new Object();
        $scope.runObj.query = query;
        $scope.runObj.entityId = $scope.id1[0];

        $scope.method = 'POST';
        $scope.url = 'rest/service/getHiveResult/'

        $http({
            method: $scope.method,
            url: $scope.url,
            data: $scope.runObj,
            headers: headerObj
        }).success(

            function(data, status) {
                $scope.status = status;
                $scope.runHiveData = data;
                //var arr=JSON.parse(data);                   
                console.log(data);
                var headerArray = [];
                for (var key in data[0]) {
                    headerArray.push(key);
                    //console.log(key);
                }
                $scope.headerArray = headerArray;
                $('#RunhiveQuery').modal('show');


            }).error(function(data, status) {
            console.log(data);
            headerArray = [];
            $scope.runHiveData = data;
            if (status == 401) {

                $location.path('/');
            }
            $scope.data = data || "Request failed";
            $scope.status = status;


        });
        /*$http.get("http://www.w3schools.com/angular/customers.php")
        .then(function (response) {$scope.names = response.data.records;});*/


    }
    $scope.exportHiveFuncProj = function(tableName, exportPath) {
        //alert('hirof');
        //$scope.schemaId = schemaId;

        $scope.exportPath = '';
        $scope.exportSchema = tableName;
        $scope.localexportPath = exportPath;
        $('#hiveQuerySampledata').modal('show');
    }


    $scope.submitHiveExportProj = function(exportData, exportloc) {
        // alert('hi'+exportData.export_type+" "+$scope.exportSchema+" "+$scope.exportloc+ab);
        var type = exportData.export_type;
        //var schemaId=$scope.schemaId;

        var exportTypeParam = 'format=' + type;
        $('#hiveQuerySampledata').modal('hide');


        /*$('#downloading-data-'+schemaId).show();
        $('#download-data-'+schemaId).hide();*/
        $scope.exportloc = exportloc;

        if ($scope.exportloc == 'local') {
            $scope.exportObj = new Object();
            //	$scope.localexportPath = 'd:/test';

            $scope.method = 'GET';
            //$scope.url = 'rest/service/export?'+'datasetpath='+$scope.localexportPath+'&'+exportTypeParam;
            $scope.url = 'rest/service/export?' + 'datasetSchemaName=' + $scope.exportSchema + '&' + exportTypeParam;

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
                    /*$('#downloading-data-'+schemaId).hide();
                    $('#download-data-'+schemaId).show();*/

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
            $scope.exportObj.name = $scope.exportSchema;
            if ($scope.exportPath) {
                $scope.exportObj.location = $scope.exportPath;
            } else {
                $scope.exportObj.location = $('#editPath').val();
            }

            $scope.method = 'POST';
            $scope.url = 'rest/service/exportHiveView' + '?' + exportTypeParam;

            $http({
                method: $scope.method,
                url: $scope.url,
                data: $scope.exportObj,
                headers: headerObj
            }).success(

                function(data, status) {
                    $scope.status = status;
                    /*$('#downloading-data-'+schemaId).hide();
                    $('#download-data-'+schemaId).show();*/

                }).error(function(data, status) {
                if (status == 401) {
                    $location.path('/');
                }
                $scope.data = data || "Request failed";
                $scope.status = status;
                /*$('#downloading-data-'+schemaId).hide();
                $('#download-data-'+schemaId).show();*/

            });
        }

    }
    $scope.saveTransform = function(transformData, isjoin) {

        //alert(transformData);
        //alert(isjoin); return false;
        // var targetIDtemp1
        $scope.transformData = new Object();
        $scope.data = new Object();
        $scope.transformData.params = new Object();
        $scope.data.project_id = selectedPipeId;
        console.log(transformData.tagetSet)
        if (transformData.tagetSet != 'undefined')
            $scope.transformData.inputSplits = transformData.tagetSet;
        if (isjoin == 'join') {
            delete transformData.filterColumn;
            $scope.transformData.params.table1 = $scope.editData.table1;
            $scope.transformData.params.table3 = transformData.table3;
            $scope.transformData.params.dataset = transformData.sourceID;
            //var c = $($scope.columnNamesJoin['table3']).filter($scope.columnNamesJoin['table1']);
            //console.log(c);
            if ($scope.editData.table1.length != $scope.editData.table3.length) {
                alert('Please select same numbers of columns from both the tables');
                return false;
            }
            console.log(transformData.table3);
            var tempTable2 = new Object();
            tempTable2 = $scope.columnNamesJoin['table3'];
            // var deleteObj = tempTable2.splice(transformData.table3,1)
            // console.log(deleteObj);
            var list = $scope.columnNamesJoin['table1'];
            for (var i = 0; i < tempTable2.length; i++) {
                if (i != transformData.table3)
                    list.push(tempTable2[i]);
            }
            // var list = $scope.columnNamesJoin['table1'].concat(tempTable2);
            /*var arrayUnique = function(a) {
				    return list.reduce(function(p, c) {
				        if (p.indexOf(c) < 0) p.push(c);
				        return p;
				    }, []);
				};
			 console.log(arrayUnique);*/
            var count = {};
            var firstOccurences = {};

            // Loop through the list

            var item, itemCount;
            for (var i = 0, c = list.length; i < c; i++) {
                item = list[i].name;
                itemCount = count[item];
                itemCount = count[item] = (itemCount == null ? 1 : itemCount + 1);

                if (itemCount == 2)
                    list[firstOccurences[item]].name = list[firstOccurences[item]].name + "1";
                if (count[item] > 1)
                    list[i].name = list[i].name + count[item]
                else
                    firstOccurences[item] = i;
            }

            // Return
            $scope.transformData.params.columnList = list;
            //  $scope.columnNamesJoin['table3'].push(deleteObj);

            //
            console.log($scope.transformData.params.columnList);


        } else if (isjoin == 'groupby') {
            //console.log($scope.colArray);
            // console.log(transformData.opInt);
            // delete transformData.filterColumn;
            // $scope.transformData.params.table2 = $scope.editData.table1;
            $scope.transformData.params.groupby = [];
            $scope.transformData.params.oparation = [];
            $scope.transformData.params.columnList = [];
            console.log($scope.editData.filterColumn);
            $scope.transformData.params.groupby = transformData.filterColumn;
            /*for(var k=0;k<$scope.colArray.length;k++){
				// console.log($scope.colArray[k]);
				 //console.log(transformData.opInt[$scope.colArray[k]]);
				 if(transformData.opInt[$scope.colArray[k]] != undefined){
					 
					 $scope.transformData.params.groupby[k] = new Object();
					 $scope.transformData.params.groupby[k].name = $scope.colArray[k];
					 $scope.transformData.params.groupby[k].oparation = transformData.opInt[$scope.colArray[k]];
					 $scope.transformData.params.groupby.push($scope.colArray[k]);
					
				 }
				 else{
					 $scope.transformData.params.groupby.push( $scope.colArray[k] );
					
				 }
			 }*/
            //	 console.log($scope.columnNamesGroup['table2']);
            //	 console.log(transformData.opInt);
            for (var k = 0; k < $scope.columnNamesGroup['table2'].length; k++) {
                // console.log($scope.colArray[k]);
                //console.log(transformData.opInt[$scope.colArray[k]]);
                if ($scope.transformData.params.groupby.indexOf($scope.columnNamesGroup['table2'][k].name) !== -1) {
                    $scope.transformData.params.columnList.push($scope.columnNamesGroup['table2'][k]);
                }
                if (transformData.opInt[$scope.columnNamesGroup['table2'][k].name] != undefined && transformData.opInt[$scope.columnNamesGroup['table2'][k].name] != 'None') {

                    /*$scope.transformData.params.groupby[k] = new Object();
                    $scope.transformData.params.groupby[k].name = $scope.colArray[k];
                    $scope.transformData.params.groupby[k].oparation = transformData.opInt[$scope.colArray[k]];*/
                    $scope.transformData.params.oparation.push({
                        name: $scope.columnNamesGroup['table2'][k].name,
                        oparation: transformData.opInt[$scope.columnNamesGroup['table2'][k].name]
                    });
                    if ($scope.transformData.params.columnList.indexOf($scope.columnNamesGroup['table2'][k].name) === -1) {
                        $scope.transformData.params.columnList.push({
                            name: $scope.columnNamesGroup['table2'][k].name + '_' + transformData.opInt[$scope.columnNamesGroup['table2'][k].name],
                            dataType: $scope.columnNamesGroup['table2'][k].dataType
                        });

                    }
                } else {
                    $scope.transformData.params.oparation.push({
                        name: $scope.columnNamesGroup['table2'][k].name,
                        oparation: 'None'
                    });

                }


            }
            // $scope.transformData.params.groupby1 = $scope.transformData.params.groupby;
            //  $scope.transformData.params.columnList  = $scope.columnNamesGroup['table2'];
            //$scope.transformData.params.groupBy.name  = $scope.name;
            //  $scope.transformData.params.groupBy.dataType  = $scope.dataType;
            //	 console.log($scope.transformData.params);



        }
        // console.log($scope.colArray1.length);
        else if (isjoin == 'cleanColumn') {
            //	 console.log($scope.colArray1.length);
            //	 console.log($scope.colArray1);
            if ($scope.colArray1.length == 0) {
                //alert('Please select atlest one column for missing data');
                $('#saveStatus').html('<font color="red">Please select atlest one column for missing data</font>');
                setTimeout(function() {
                    $('#saveStatus').html('');
                }, 5000)
                return false;
            }
            $scope.transformData.params.columnList = [];
            $scope.transformData.params.selectedcolumnList = [];
            $scope.sortedArray = new Array()
            for (var i = 0; i < transformData.columnNameByID.length; i++) {
                for (var k = 0; k < $scope.colArray1.length; k++) {
                    if (transformData.columnNameByID[i].name == $scope.colArray1[k].name) {
                        $scope.sortedArray.push($scope.colArray1[k])
                    }
                }
            }
            // console.log($scope.sortedArray);
            if ($scope.cleanModeSelect === true) {
                $scope.transformData.params.columnList = transformData.columnNameByID;
                for (var k = 0; k < $scope.sortedArray.length; k++) {

                    $scope.transformData.params.selectedcolumnList.push($scope.sortedArray[k]);
                }
            } else {
                for (var k = 0; k < $scope.sortedArray.length; k++) {

                    $scope.transformData.params.columnList.push($scope.sortedArray[k]);
                }
            }


            //	 console.log(transformData.columnNameByID2);
            /* if(transformData.filterColumn){*/
            //	 $scope.transformData.params.columnList = transformData.columnNameByID2; 
            /* }*/

        } else if (isjoin == 'partition') {
            //	 console.log($scope.colArray1.length);
            //	 console.log($scope.colArray1);
            $scope.transformData.params.columnList = transformData.columnlist;
            $scope.transformData.params.percentage = transformData.percentage;
            if (transformData.sampling)
                $scope.transformData.params.sampling = transformData.sampling;
        } else if (isjoin == 'model') {
            $scope.transformData.params.columnList = {};
            if (transformData.stepsize)
                $scope.transformData.params.stepsize = transformData.stepsize;
            if (transformData.iteration)
                $scope.transformData.params.iteration = transformData.iteration;
            if (transformData.intercept)
                $scope.transformData.params.intercept = transformData.intercept;
            if (transformData.regParam)
                $scope.transformData.params.regParam = transformData.regParam;
            if (transformData.minBatchFraction)
                $scope.transformData.params.minBatchFraction = transformData.minBatchFraction;
            if (transformData.numofclasses)
                $scope.transformData.params.numofclasses = transformData.numofclasses;
            if (transformData.trees)
                $scope.transformData.params.trees = transformData.trees;
            if (transformData.depth)
                $scope.transformData.params.depth = transformData.depth;
            if (transformData.bins)
                $scope.transformData.params.bins = transformData.bins;
            if (transformData.seed)
                $scope.transformData.params.seed = transformData.seed;
            if (transformData.subset)
                $scope.transformData.params.subset = transformData.subset;
            if (transformData.impurity)
                $scope.transformData.params.impurity = transformData.impurity;
            if (transformData.lambda)
                $scope.transformData.params.lambda = transformData.lambda;
        } else if (isjoin == 'testCompare') {
            $scope.transformData.params.columnList = {};
            $scope.transformData.params.description = transformData.description;
        } else if (isjoin == 'action') {
            $scope.transformData.params.columnList = {};
            if (transformData.label)
                $scope.transformData.params.label = transformData.label;
            $scope.transformData.params.algorithm = transformData.algoSource;
            // console.log(transformData.features);
            $scope.transformData.params.features = new Array();;
            //transformData.features = angular.fromJson(transformData.features);
            // $scope.transformData.params.features =  $scope.transformData.params.features.concat(transformData.features);
            if (transformData.features) {
                for (var k = 0; k < transformData.features.length; k++) {
                    // transformData.features[k] = JSON.parse(transformData.features[k]);
                    // console.log(transformData.features[k]);
                    // console.log(transformData.features[k]);
                    /*console.log('loop');
                    	console.log(transformData.features[k]);*/
                    $scope.transformData.params.features.push(transformData.features[k]);
                    /* $scope.transformData.params.features.push({
                    	 name: transformData.features[k].name,
                    	 dataType:transformData.features[k].dataType
                        });*/
                }
            }

            // $scope.transformData.params.features = transformData.features;
            //	 console.log($scope.transformData.params.features);

        } else if (isjoin == 'Ingestion') {


            //console.log("Type -> "+transformData.type);	

            var data = {};
            if (transformData.type == 'time_based') {
                data["projectId"] = $scope.data.project_id;
                data["type"] = transformData.type;
                data["startTime"] = $('#startTime > .form-control').val();
                data["endTime"] = $('#endTime > .form-control').val();
                data["repeats"] = transformData.repeats;
                data["frequency"] = transformData.frequency;

            } else {
                data["projectId"] = $scope.data.project_id;
                data["type"] = transformData.type;
                data["startTime"] = $('#startTime > .form-control').val();
                data["endTime"] = $('#endTime > .form-control').val();
                data["repeats"] = "";
                data["frequency"] = "";
            }

            //console.log("Rest Call -> "+data);		
            //rest call
            $scope.url = 'rest/service/project/schedule/' + $scope.data.project_id; //localhost:8080/rest/
            $scope.method = 'POST';

            $http({
                    method: $scope.method,
                    url: $scope.url,
                    data: data
                })
                .success(function(data, status) {

                    console.log(data);

                    if (data == 'Scheduler Information Saved Succesfully.') {
                        $scope.projectexist = true;
                        $('#saveStatus').html('Module saved sucessfully');
                    } //shows status on save
                    else {
                        //alert('not saved');
                        $scope.projectexist = false;
                        $('#saveStatus').html('<font color="red">Module save failed</font>');
                    }
                    setTimeout(function() {
                        $('#saveStatus').html('');
                    }, 5000)

                }).error(function(data, status) {
                    if (status == 401) {
                        $location.path('/');
                    }
                    $scope.data = data || "Request failed";
                    $scope.status = status;
                });

            return false;

        } //Ingestion close

        if ($scope.cleanModeSelect === true) {

            if (transformData.cleanModeSelected) {
                $scope.transformData.params.oparater = transformData.cleanModeSelected;
                if (transformData.cleanModeSelected == 'Custom Value') {
                    $scope.transformData.params.value = transformData.customValue
                }
            }

        }
        if (transformData.hiveSql) {
            // console.log(transformData.hiveSql);
            $scope.transformData.params.hiveSql = transformData.hiveSql;
            /* var SourceverVal = ''
             for(i=0;i<transformData.sourceID.length;i++){
            	 SourceverVal += transformData.sourceID[i]+'_'+transformData.sourceVersion[i]; 
             }*/
            $scope.transformData.params.dataset = transformData.sourceID;
            if ($scope.jarLocation)
                $scope.transformData.params.udfJarPath = $scope.jarLocation;
            // console.log($scope.columnNameAndDatatype);
            if ($scope.columnNameAndDatatype) {
                $scope.transformData.params.columnList = $scope.columnNameAndDatatype;
                $scope.transformData.isOutputDefined = true;
            } else {
                $scope.transformData.params.columnList = {};
                $scope.transformData.isOutputDefined = false;
            }
            if (transformData.temporaryFunc)
                $scope.transformData.params.temporaryFunc = transformData.temporaryFunc;
            console.log($scope.transformData.params);
        }
        if (transformData.pig) {
            $scope.transformData.params.dataset = transformData.sourceID;
            $scope.transformData.params.columnList = $scope.columnNameAndDatatype;
            $scope.transformData.params.pig = escape(transformData.pig);
            if ($scope.jarLocation)
                $scope.transformData.params.udfJarPath = $scope.jarLocation;
        }
        if (transformData.mapclass) {
            $scope.transformData.params.mapperClass = transformData.mapclass;
            $scope.transformData.params.MRjarPath = $scope.jarLocation;
            $scope.transformData.params.columnList = $scope.columnNameAndDatatype;
            $scope.transformData.params.outputKey = transformData.OutputKeyClass;
        }
        if (transformData.reduceclass) {
            $scope.transformData.params.reducerClass = transformData.reduceclass;
            $scope.transformData.params.outputValue = transformData.OutputValueClass;
        }

        $scope.data.jsonblob = angular.toJson($scope.transformData);
        $scope.data.version = transformData.version;
        $scope.data.schemaType = 'module';
        $scope.data.name = $scope.tranformType;
        //	console.log(transformData.id);
        // 	console.log($scope.data);
        if (transformData.id != "undefined") {
            $scope.data.id = transformData.id;
        } else {
            delete $scope.data.id;
        }
        if ($scope.data.version == "undefined") {
            delete $scope.data.version;
        }
        $scope.data.created_by = localStorage.getItem('itc.username');
        $scope.data.updated_by = localStorage.getItem('itc.username');
        //	$scope.data.createdDate = new Date();
        $scope.method = 'POST';
        $scope.url = 'rest/service/addObject/';
        //console.log($scope.data);
        $http({
            method: $scope.method,
            url: $scope.url,
            data: $scope.data,
            headers: headerObj
        }).success(

            function(data, status) {
                //console.log(data);
                $scope.myFormText.$dirty = true;
                $scope.status = status;
                $scope.version = data.version;
                var flowChartJson = $('#jsonOutput').val();
                var flowChart = JSON.parse(flowChartJson);
                var connections = flowChart.connections;
                var datanodetype = $(this).attr('data-nodetype');
                //alert(isjoin);
                if (isjoin == 'model') {
                    var nodes = flowChart.nodes;
                    //		console.log('nodes');
                    //	console.log(nodes);
                    $.each(nodes, function(index, elem) {
                        //console.log(elem.blockId);
                        //	console.log(targetIDtemp);
                        if (elem.blockId == targetIDtemp) {
                            console.log('matched');
                            var transforId = targetIDtemp.substr(0, targetIDtemp.indexOf('pipe'));
                            transforId = transforId.replace('flowchartWindow', '');

                            targetIDtemp1 = targetIDtemp.replace(transforId, data.id);
                            elem.blockId = targetIDtemp1;
                            if (targetIDtemp1.indexOf('version') === -1) {
                                targetIDtemp1 = targetIDtemp1 + 'version' + $scope.version;
                            } else {
                                targetIDtemp1 = targetIDtemp.substr(0, targetIDtemp.indexOf('version'));
                                targetIDtemp1 = targetIDtemp1 + 'version' + $scope.version;
                                //	console.log(targetIDtemp1)
                            }
                            elem.blockId = targetIDtemp1
                            $('#' + targetIDtemp).attr('id', elem.blockId);
                        }
                    });
                }

                $.each(connections, function(index, elem) {
                    if (elem.targetId == targetIDtemp) {
                        //	console.log(targetIDtemp);
                        //var dataSetID =  sourceID.substr(0, sourceID.indexOf('pipe'));
                        //dataSetID = dataSetID.replace('flowchartWindow','');

                        var transforId = targetIDtemp.substr(0, targetIDtemp.indexOf('pipe'));
                        transforId = transforId.replace('flowchartWindow', '');

                        targetIDtemp1 = targetIDtemp.replace(transforId, data.id);
                        elem.targetId = targetIDtemp1;
                        if (targetIDtemp1.indexOf('version') === -1) {
                            targetIDtemp1 = targetIDtemp1 + 'version' + $scope.version;
                        } else {
                            targetIDtemp1 = targetIDtemp.substr(0, targetIDtemp.indexOf('version'));
                            targetIDtemp1 = targetIDtemp1 + 'version' + $scope.version;
                            //	console.log(targetIDtemp1)
                        }
                        elem.targetId = targetIDtemp1
                        $('#' + targetIDtemp).attr('id', elem.targetId);

                    }

                });
                $.each(instance.getAllConnections(), function(idx, connection) {
                    //	console.log('endpoints');
                    //	console.log(connection.endpoints);
                    if (connection.targetId == targetIDtemp) {
                        connection.targetId = targetIDtemp1;
                    }
                    if (connection.sourceId == targetIDtemp) {
                        connection.sourceId = targetIDtemp1;
                    }
                    connections.push({
                        connectionId: connection.id,
                        sourceId: connection.sourceId,
                        targetId: connection.targetId,
                        anchors: $.map(connection.endpoints, function(endpoint) {
                            // console.log(endpoint.anchor.x)
                            return [
                                [endpoint.anchor.x,
                                    endpoint.anchor.y,
                                    endpoint.anchor.orientation[0],
                                    endpoint.anchor.orientation[1],
                                    endpoint.anchor.offsets[0],
                                    endpoint.anchor.offsets[1]
                                ]
                            ];

                        })
                    });
                    // instance.init(connection);
                });
                /*$.each(instance.getAllConnections(), function (idx, connection) {
                	 
                                if(connection.targetId == targetIDtemp){
                                	connection.targetId = targetIDtemp1;
                                }
                                if(connection.sourceId == targetIDtemp){
                                	connection.sourceId = targetIDtemp1;
                                }
                               
                 });*/
                //console.log(instance.getAllConnections());
				console.log(data);
                if (data != '')
                    $('#saveStatus').html('Module saved sucessfully');
                else
                    $('#saveStatus').html('<font color="red">Module save failed</font>');
                setTimeout(function() {
                    $('#saveStatus').html('');
                }, 5000)
                $("#saveall").trigger("click");

                // $scope.addNewNode(data.name);

            }).error(function(data, status) {
            if (status == 401) {
                $location.path('/');
            }
            $scope.data = data || "Request failed";
            $scope.status = status;

        });

    }

    $scope.delete1 = function() {
        currentUser = $scope.Deluser;
        objDel = $scope.DelObj;
        // alert(currentUser)
        $scope.deleteProject($scope.Deluser, objDel);
    };
    $scope.deleteProject = function(projID, objDel) {
        $scope.method = 'DELETE';
        $scope.url = 'rest/service/projectmanagement/deleteProject/' + projID;
        $http({
            method: $scope.method,
            url: $scope.url,
            // cache : $templateCache
            headers: headerObj
        }).success(function(data, status) {
            $scope.data = data;
            schemaSourceDetails(myService, $scope, $http, $templateCache, $rootScope,
                $location, 'project');
            //odjDel.isRowHidden = true
            $('#deleteConfirmModal').modal(
                'hide');

        }).error(function(data, status) {
            if (status == 401) {
                $location.path('/');
            }
            $scope.data = data || "Request failed";
            $('#deleteConfirmModal').modal(
                'hide');
            if (status == 403 || status == 500) {
                alert($scope.data);
            }
            $scope.status = status;
        });
    }
    $scope.showconfirm = function(id, obj) {
        // alert(id);
        $scope.Deluser = id;
        $scope.DelObj = obj;
        $('#deleteConfirmModal').modal('show');
    };
    $scope.importproj = function() {
        //alert('hi');
        $scope.exportPath = '';
        $scope.typeProj = 'Import';
        $('#exportProject').modal('show');
    }
    $scope.exportproj = function(projectObj) {

        $scope.exportPath = '';
        $scope.typeProj = 'Export';
        delete projectObj.ExecutionGraph;
        delete projectObj.stageList;
        $scope.projectObj = projectObj;
        $scope.exportProject = projectObj.name
        $('#exportProject').modal('show');
    }

    /* Added by 19726 on 01-09-2016  */

    $scope.displayChart = function(projID) {

        $('#displayChart').modal('show');
        $('#chart').empty(); //clear chart-data		

        var X_AXIS_ARRAY = [];
        var Y_AXIS_ARRAY = [];
        var arr = "";
        var arr2 = "";

        /*******  READ JSON FILE  *******/

        $.ajax({
            type: "GET",
            async: false,
            url: "includes/CCIL.json",
            //url: 'rest/service/project/chartData/1322',
            datatype: "json",
            success: function(data) {

                var data = data;
                var x_out = "";
                var y_out = "";
                var i = 0;

                for (i = 0; i < 1; i++) { // Loop to get the titles from JSON 

                    var val = data[i];
                    x_out += '[';
                    y_out += '[';

                    for (var key in val) {

                        x_out += '{label: "' + key + '", value: "' + key + '", title: "x_class"},\n';
                        y_out += '{label: "' + key + '", value: "' + key + '", title: "y_class"},\n';
                    }
                    x_out += ']';
                    y_out += ']';
                }


                // console.log(output);
                /*** RANGE DROP-DOWN ****/
                var range_json = '[{label: "10", value: "10", title: "range_class"}, {label: "100", value: "100", title: "range_class"}, {label: "1000", value: "1000", title: "range_class"}]';

                var x_output = eval(x_out);
                var y_output = eval(y_out);
                var range_output = eval(range_json);

                $("#x_axis").multiselect('dataprovider', x_output);
                $("#y_axis").multiselect('dataprovider', y_output);
                $("#data_size").multiselect('dataprovider', range_output);
            }
        });


        /*******  AFTER SELECTION OF X-AXIS AND Y-AXIS  *******/

        //AFTER TOP CATEGORY SELECTION


        $('#x_axis, #y_axis, #data_size').change(function() {

            var selected1 = $("#x_axis option:selected");
            var selected2 = $("#y_axis option:selected");
            var selected3 = $("#data_size option:selected");
            var x_value = "";
            var y_value = "";
            var range_value = "";

            selected1.each(function() {
                x_value = $(this).val();
            });
            selected2.each(function() {
                y_value = $(this).val();
            });
            selected3.each(function() {
                range_value = $(this).val();
            });

            //console.log("X value :"+x_value); return false;

            if (x_value.length > 0 && y_value.length > 0) {


                $.ajax({
                    type: "GET",
                    async: false,
                    url: "includes/CCIL.json",
                    //url: 'rest/service/project/chartData/1322',
                    datatype: "json",
                    success: function(data) {

                        var data = data;
                        //var out = "";
                        var i = 0;
                        X_AXIS_ARRAY = [];
                        Y_AXIS_ARRAY = [];

                        var range = (range_value > 0) ? range_value : data.length;

                        console.log("Range : " + range);

                        for (i = 0; i < range; i++) { // Loop to get the titles from JSON 

                            var val = data[i];

                            for (var key in val) {

                                if (x_value == key)
                                    X_AXIS_ARRAY.push(val[key]);

                                if (y_value == key)
                                    Y_AXIS_ARRAY.push(val[key]);

                            }
                        }
                    }

                }); //ajax close

                console.log("X Array : " + X_AXIS_ARRAY);
                console.log("Y Array : " + Y_AXIS_ARRAY);

                /******************************************************************/
                function ChangeChartType(chart, series, newType) {
                    newType = newType.toLowerCase();
                    switch (newType) {
                        case 'area':
                        case 'areaspline':
                            //chart.options.chart.options3d.enabled = false; //doesn't support
                            break;
                        default:
                            //chart.options.chart.options3d.enabled = false; //doesn't support
                            break;
                    }
                    for (var i = 0; i < series.length; i++) {
                        var srs = series[0];
                        try {
                            srs.chart.addSeries({
                                    type: newType,
                                    stack: srs.stack,
                                    yaxis: srs.yaxis,
                                    name: srs.name,
                                    color: srs.color,
                                    data: srs.options.data
                                },
                                false);
                            console.log(series.name);
                            series[0].remove();
                        } catch (e) {}
                    }
                }

                var chart;
                var coll = 'summz1';

                chart = new Highcharts.Chart({
                    chart: {
                        zoomType: 'x',
                        panning: true,
                        panKey: 'shift',

                        subtitle: {
                            text: 'Click and drag to zoom in. Hold down shift key to pan.'
                        },
                        legend: {
                            layout: 'horizontal',

                            verticalAlign: 'bottom',
                            x: 40,
                            y: 20,
                            floating: false,
                            maxHeight: 100
                        },

                        events: {
                            drilldown: function(e) {
                                alert(e);
                            }
                        },
                        renderTo: 'chart',
                        type: 'line',
                        inverse: true,
                        height: 500,
                        width: 1300,
                        options3d: {
                            enabled: false,
                            alpha: 15,
                            beta: 10,
                            depth: 5,
                            viewDistance: 10000
                        }
                    },
                    rangeSelector: {
                        selected: 1
                    },
                    scrollbar: {
                        enabled: true
                    },

                    scrollbar: {
                        enabled: true,
                        barBackgroundColor: 'gray',
                        barBorderRadius: 7,
                        barBorderWidth: 0,
                        buttonBackgroundColor: 'gray',
                        buttonBorderWidth: 0,
                        buttonArrowColor: 'yellow',
                        buttonBorderRadius: 7,
                        rifleColor: 'yellow',
                        trackBackgroundColor: 'white',
                        trackBorderWidth: 1,
                        trackBorderColor: 'silver',
                        trackBorderRadius: 7
                    },



                    title: {
                        text: 'CCIL: 15 MW Energy Analytics Dashboard'
                    },

                    turboThreshold: 100000,

                    xAxis: {
                        min: 0,
                        max: 10,
                        labels: {
                            style: {
                                color: 'red'
                            }
                        },
                        categories: X_AXIS_ARRAY
                    },
                    yAxis: {
                        title: {
                            margin: 10,
                            text: y_value
                        },
                    },
                    series: [{
                        data: Y_AXIS_ARRAY,
                        name: x_value,
                        drilldown: true
                    }]

                });


                $('.switcher').click(function() {

                    var newType = $(this).attr('id');

                    if (chart && chart.series && newType) {
                        ChangeChartType(chart, chart.series, newType);
                    }

                });

            }
            /******************************************************************/


        }); //x_axis close


    }

    /**  end of chart **/

    $scope.submitExportProj = function(typeProj) {
        if (typeProj == 'Import') {
            $scope.data = new Object();
            $scope.data.location = $scope.exportPath;
            $scope.method = 'POST';
            $scope.url = 'rest/service/projectImport';
            $http({
                method: $scope.method,
                url: $scope.url,
                data: $scope.data,
                // cache : $templateCache
                headers: headerObj
            }).success(function(data, status) {
                $scope.data = data;
                //	console.log(data);
                /*if(data == 'success'){
                	$scope.msgClass = 'alert-success';
                	$scope.exportMsg = 'Project Import sucessfull';
                }	
                else{
                	$scope.msgClass = 'alert-danger';*/
                $scope.exportMsg = $scope.data; //'Project Import failed';
                //}

                $('#exportProject').modal('hide');
                $('#exportConfirm').modal('show');

            }).error(function(data, status) {
                if (status == 401) {
                    $location.path('/');
                }
                $scope.data = data || "Request failed";
                $scope.status = status;
                $('#exportProject').modal('hide');
            });
        } else {
            $scope.data = new Object();
            $scope.data = $scope.projectObj;
            $scope.data.exportLocation = $scope.exportPath;
            $scope.method = 'POST';
            $scope.url = 'rest/service/projectExport';
            $http({
                method: $scope.method,
                url: $scope.url,
                data: $scope.data,
                // cache : $templateCache
                headers: headerObj
            }).success(function(data, status) {
                $scope.data = data;
                //console.log(data);
                /*if(data == 'true'){
                	$scope.msgClass = 'alert-success';
                	$scope.exportMsg = 'Project export sucessfull';
                }	
                else{
                	$scope.msgClass = 'alert-danger';*/
                $scope.exportMsg = $scope.data; //'Project export failed';
                //}

                $('#exportProject').modal('hide');
                $('#exportConfirm').modal('show');

            }).error(function(data, status) {
                if (status == 401) {
                    $location.path('/');
                }
                $scope.data = data || "Request failed";
                $scope.status = status;
                $('#exportProject').modal('hide');
            });
        }
    }
    $scope.showCompare = function() {
        //alert(selectedComapare);
        var tempSorceID = selectedComapare.substr(0, selectedComapare.indexOf('pipe'));
        tempSorceID = tempSorceID.replace('flowchartWindow', '');
        if (selectedComapare.indexOf('version') != -1) {
            var tempSorceversion = selectedComapare.substr(selectedComapare.indexOf('version') + 7);
        } else {
            var tempSorceversion = 0;
        }
        //alert(selectedPipeId);
        //alert(selectedversion)
        //console.log($scope.jsonData[selectedPipeId])
        $scope.matixHeader = ["col1", "col2", "col3", "col4", "col5"];
        $scope.moduleStaus = angular.fromJson($scope.jsonData.moduleRunStatusList);
        $scope.outputPath = '';
        //	console.log($scope.moduleStaus);
        if ($scope.moduleStaus) {
            for (var m = 0; m < $scope.moduleStaus.length; m++) {
                var moduleId = $scope.moduleStaus[m].moduleId;
                var moduleVersion = $scope.moduleStaus[m].moduleVersion;
                var modver = moduleId + '_' + moduleVersion;
                if (moduleId == tempSorceID) {
                    $scope.outputPath = $scope.moduleStaus[m].details;
                    $scope.outputPath = $scope.outputPath.replace('Output HDFS path ', '');
                    console.log($scope.outputPath)
                }
            }
        }

        /*please remove before commit*/
        //	$scope.outputPath = 'd:/results';
        if ($scope.outputPath == '') {
            alert('Output Path is empty.Not able to compare');
            return false;
        }
        $scope.data = '';
        $scope.data = selectedPipeId + '-' + selectedversion + ',' + tempSorceID + '-' + tempSorceversion + ',' + $scope.outputPath;
        $scope.method = 'POST';
        $scope.url = 'rest/service/getComparisonResult';

        $http({
            method: $scope.method,
            url: $scope.url,
            data: $scope.data,
            headers: headerObj
        }).success(function(data, status) {
            $scope.CompareData = data;
            //var i = 0;
            var j = 0
            $scope.rightColumn = new Array();
            $scope.leftColumn = new Array();
            $scope.modalLength = new Array();

            angular.forEach($scope.CompareData, function(attr, key) {
                //console.log(attr[0]);
                $scope.leftColumn[j] = key;
                $scope.rightColumn[j] = new Array();
                console.log(attr.length);
                for (i = 0; i < attr.length; i++) {
                    $scope.modalLength[i] = attr[i];
                    //console.log($scope.modalLength);
                    $scope.rightColumn[j][i] = new Array();
                    for (var k = 0; k < attr[i].length; k++) {
                        $scope.rightColumn[j][i][k] = attr[i][k];
                    }

                }
                j++;
            });
            /*for(i=0;i<attr.length;i++){
            	$scope.modalLength[i] = attr[i];
            	var attrArr = attr[i].split(',');
            	console.log(attrArr);
            	for(k=0;k<attrArr.length;k++){
            		$scope.rightColumn[j][i] = new Array();
            		$scope.rightColumn[j][i][k] = attrArr[k];
            		console.log($scope.rightColumn[j][i][k]);
            	}*/
            //console.log($scope.rightColumn);
            //console.log($scope.leftColumn);
            $('#compareModal').modal('show');
        }).error(function(data, status) {
            if (status == 401) {
                $location.path('/');
            }
            $scope.data = data || "Request failed";
            $scope.status = status;
        });
    }

}