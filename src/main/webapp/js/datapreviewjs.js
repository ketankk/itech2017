var dataSchemapreview = function(myService, $scope, $http, $templateCache,
    $location, $rootScope, $route, $upload, $filter) {

    $scope.previewpage = myService.get();
    //console.log($scope.previewpage);
    $scope.filetempPath = '';
    $scope.datasetPath = ''
    $scope.tableview = true;
    // $scope.ingeationView = false;
    $scope.editdata = new Object();
    $scope.editDataBulk = new Object();
    $scope.editdata.isEncrypted = $scope.previewpage.isEncrypted
    $scope.editdata.encryptionData = $scope.previewpage.encryptionData
    //to save the description of table
    if ($scope.previewpage.description != undefined) {
        //console.log($scope.previewpage.description);
        $scope.editdata.description = $scope.previewpage.description;
    }
    $scope.editdata.newSchemaName = '';
    $scope.editdata.newSchemaName = newSchemaName;

    typeFormatFetch($scope, $http, $templateCache, $rootScope, $location,
        'Type', 'DataSchema')
    // console.log($scope.sourceType);
    // alert("datapreview :"+$scope.sourceType);
    $scope.schemanamenotok = false;
    $scope.chkSchemaName = function(schemaName) {
        console.log("chkSchemaName called..")
        console.log(schemaName)
        schemanameCheck(schemaName, $scope, $http, $templateCache, $rootScope,
            $location, 'dataschemapreview');
    }

    $scope.editdata.datapreviewprev = $scope.previewpage.datapreview;
    $scope.datapreview = $scope.previewpage.datapreview;
    //console.log($scope.editdata.datapreviewprev);

    //for bulk ingestion
    if ($scope.previewpage.bulkDatapreview != undefined) {
        $scope.editdata.bulkDatapreviewprev = $scope.previewpage.bulkDatapreview.jsonblobForBulk;
        $scope.bulkDatapreview = $scope.previewpage.bulkDatapreview.jsonblobForBulk;
        console.log($scope.bulkDatapreview);
    }
    $scope.column = {};
    var limit = 0;


    var dataPrev = $scope.datapreview;
    //console.log(dataPrev);
    jobsFlag = $scope.previewpage.jobFlag;
    jobCheck = $scope.previewpage.jobCheck;

    //console.log("flag"+jobsFlag);
    if (dataPrev != undefined) {
        $scope.columns = {
            header: $scope.datapreview[0]
        };
        $scope.columnsdata = {
            datatype: $scope.datapreview[1]
        };
        $scope.columnName = new Array();
        $scope.columnType = new Array();
        var i = 0;
        angular.forEach($scope.columns.header, function(attr) {
            $scope.columnName[i] = attr;
            i++;
            //console.log($scope.columnName[i])
        });
        var i = 0;
        angular.forEach($scope.columnsdata.datatype, function(attr) {
            $scope.columnType[i] = attr;
            i++;
        });
        $scope.piiRule = $scope.datapreview[2];
        // console.log($scope.columnName);
        // console.log($scope.piiRule);
        $scope.datapreview.shift();
        $scope.datapreview.shift();

        if (backbutton) {
            backbutton = false;
        } else
            $scope.datapreview.shift();

        $scope.fileDBData = $scope.previewpage.fileData;
        if ($scope.fileDBData.fileName != undefined) {
            var re = /(?:\.([^.]+))?$/;
            console.log($scope.fileDBData.fileName);
            var format = re.exec($scope.fileDBData.fileName)[1];
            var fileext = format.toUpperCase();
            if (fileext == 'XML') {
                var xmlEndTag = $scope.datapreview[0];
                $scope.editdata.xmlEndTag = xmlEndTag[0]
                $scope.datapreview.shift();
            }
        }
    } else if (jobsFlag == "true") {
      
        $scope.nmss=$scope.previewpage.bulkNames.toString();
        $scope.jobArray = new Object();
        $scope.jobArray = $scope.previewpage.jobs;

        $scope.jobArrayHeader = {
            //jobHeaderBulk: $scope.previewpage.header
            jobHeaderBulk: $scope.jobArray[0]
        };

        $scope.jobArray.splice(0, 1)
        // $scope.jobArray.push($scope.jobArrayHeader.jobHeaderBulk);
        // $scope.jobArray.reverse();

    } else {

        $scope.columnsBulk = {
            headerBulk: $scope.bulkDatapreview[0]
        };
        $scope.bulkDatapreview.splice(0, 1);



    }

    $scope.ingestionSummaryPage = function(editdata, columnName, columnType) {
        //console.log('ingestion summary page');
        $scope.data = new Object();
        // $scope.hdfsPathAcess = false;
        // alert("hey you");
        $scope.editdata.newSchemaName = editdata.newSchemaName;
        $scope.editdata.dataAttribute = new Array();
        $scope.editdata.fileData = new Object();
        $scope.editdata.dataAttribute.Name = new Object();
        $scope.editdata.dataAttribute.dataType = new Object();
        $scope.data.name = $scope.editdata.newSchemaName;
        $scope.editdata.name = $scope.editdata.newSchemaName;
        if ($scope.editdata.xmlEndTag != undefined)
            $scope.editdata.xmlEndTag = $scope.editdata.xmlEndTag;
        $scope.data.type = 'DataSchema';
        // $scope.editdata.description = newSchemaName +' description';
        $scope.editdata.dataSourcerId = 'NewSchema';
        $scope.editdata.dataSchemaType = 'Automatic';
        $scope.editdata.fileName = $rootScope.fileName;
        // console.log(columnName.length);
        for (var j = 0; j < columnName.length; j++) {
            $scope.columnData = new Object();
            $scope.columnData.Name = new Object();
            $scope.columnData.dataType = new Object();

            $scope.columnData.Name = columnName[j]
            $scope.columnData.dataType = columnType[j];
            // console.log($scope.piiRule[j]);
            if ($scope.piiRule[j] == 'Y') {
                $scope.columnData.piirule = $scope.piiRule[j];
            }
            $scope.editdata.dataAttribute.push($scope.columnData);
        }
        $scope.editdata.fileData = $scope.fileDBData;
        $scope.editdata.dataSchemaType = 'Automatic';
        $scope.editdata.filetype = $scope.previewpage.filetype;
        //console.log($scope.editdata)
        myService.set($scope.editdata);

        $location.path("/IngestionSummary/");
    }
    $scope.resetField = function() {
        if ($scope.editData.frequency == 'One Time') {
            $scope.editData.startBatch = '';
            $scope.editData.endBatch = '';
            // console.log($scope.editData.startBatch)
        }

    }
    $scope.editData = new Object();
    $scope.frequencyArr = ["One Time", "Hourly", "Daily", "Weekly"];
    $scope.editData.frequency = $scope.frequencyArr[0];
    $scope.resetField = function() {
        if ($scope.editData.frequency == 'One Time') {
            $scope.editData.startBatch = '';
            $scope.editData.endBatch = '';
            // console.log($scope.editData.startBatch)
        }

    }

    $scope.saveNewSchema = function(columnName, columnData) {

        $scope.data = new Object();
        // alert("hey you");
        $scope.editdata.dataAttribute = new Array();
        $scope.editdata.dataAttribute.Name = new Object();
        $scope.editdata.dataAttribute.dataType = new Object();
        $scope.data.name = $scope.editdata.newSchemaName;
        $scope.editdata.name = $scope.editdata.newSchemaName;
        $scope.data.type = 'DataSchema';
        // $scope.editdata.description = newSchemaName +' description';
        $scope.editdata.dataSourcerId = 'NewSchema';
        $scope.editdata.dataSchemaType = 'Automatic';
        $scope.editdata.fileName = $rootScope.fileName;
        i = 0;
        angular.forEach(columnName.header,
            function(attr) {
                $scope.columnData = new Object();
                $scope.columnData.Name = new Object();
                $scope.columnData.dataType = new Object();
                $scope.columnData.valRule = new Object();
                $scope.columnData.Name = $('#colName' + i).text().trim();
                $scope.columnData.dataType = $(
                    '#dataType' + i + ' option:selected').text();
                $scope.columnData.valRule = "No";
                $scope.editdata.dataAttribute.push($scope.columnData);
                i++;
            });
        /*
         * i=0; angular.forEach(columnData.datatype, function(attr) {
         * $scope.editdata.dataAttribute[i]['dataType = attr;
         * //$scope.datasetArr[i] = attr.name; i++; });
         */
        // console.log($scope.editdata.dataAttribute)
        // $scope.data.dataAttribute = dd;
        $scope.data.jsonblob = angular.toJson($scope.editdata);

        $scope.method = 'POST';
        $scope.data.createdBy = localStorage.getItem('itc.username');
        $scope.data.updatedBy = localStorage.getItem('itc.username');
        $scope.url = 'rest/service/addEntity/';
        $http({
            method: $scope.method,
            url: $scope.url,
            data: $scope.data,
            headers: headerObj
        }).success(
            function(data, status) {
                $scope.status = status;
                schemaSourceDetails(myService, $scope, $http,
                    $templateCache, $rootScope, $location);
                var fromAutoSchema = true;
                $rootScope.fromAutoSchema = fromAutoSchema;
                $location.path("/DataSchema/");

            }).error(function(data, status) {
            if (status == 401) {
                $location.path('/');
            }
            $scope.data = data || "Request failed";
            $scope.status = status;

        });

    }

    var z = {};
    $scope.tdClicks = function() {
        // alert(tdID);
        var x = "",
            y = ""
        $("td span").click(function() {
            z = $(this);
            x = $(this).text().trim();
            var len = $(this).val();
            if (!x) {
                x = "";
            }
            // alert(x);
            $(this).html("<input type='text' size='30' value='" + x + "' />");
            $(this).find("input[type='text']").focus();
            $(this).find("input[type='text']").caretToEnd();
            $("td span").unbind("click");
            $(this).find("input[type='text']").bind("blur", function() {
                // alert($('#text'+tdID).val());
                $scope.catchme($(this).val());
                $scope.tdClicks();
            });
        });
    }

    $scope.catchme = function(wht) {
        // alert(wht);
        $(z).text(wht);
    }

    //editing of bulk jobs
    $scope.editable = function(columnData, index, rowData) {
        angular.forEach($scope.bulkDatapreview, function(value, key) {
            angular.forEach(value, function(v1, k1) { //this is nested angular.forEach loop

                if (rowData == value) {
                    if (index == k1)
                        value[index] = columnData; // replacing the edited value in theexisting array 

                }
            });
        });

    }

    $scope.submitJobs = function(choice) {
        
        $scope.header = [];
        $scope.header = $scope.columnsBulk.headerBulk;
        $scope.selectedJobs = [];
        $scope.selectedJobs.push($scope.header);
        $scope.jobList = [];
        $scope.leapy=false;
        $scope.date=false;
        $scope.namej=false;
        $scope.msg=false;
        $scope.vdate=false;
        $scope.ingestionId=false;

        angular.forEach(choice, function(value, key) {
            if (choice[key].checked) {
                $scope.selectedJobs.push(choice[key]);

                angular.forEach(value, function(v, k) {
                    if (k == 0){
                        if(v== ''){

                            $scope.date=true;
                            console.log($scope.date)
                           
                        }else{
                            $scope.vDate=isValidDate(v);
                            //console.log($scope.vDate)
                            $scope.date=false;}
                    }
                    if (k == 1) {
                         if(v== ''){
                            $scope.namej=true;
                           
                        }else
                            $scope.namej=false;
                        $scope.jobList.push(v);
                    }
                    if (k == 2) {
                         if(v== ''){
                            $scope.ingestionId=true;
                           
                        }else
                            $scope.ingestionId=false;
                      
                    }
                    
                });
            }
        });
        if($scope.selectedJobs.length<=1)
            $scope.msgs=true;
        $scope.datas = {};
        $scope.datas.name = $scope.previewpage.bulkDatapreview.name;
        $scope.datas.userName = $scope.previewpage.bulkDatapreview.userName;
        $scope.datas.createdBy = localStorage.getItem('itc.username');
        $scope.datas.updatedBy = localStorage.getItem('itc.username');
        $scope.datas.type = $scope.previewpage.bulkDatapreview.type;

        $scope.method = 'POST';
        $scope.url = 'rest/service/bulkNameCheck ';
        $scope.data = new Object();
        $scope.data.bulkNames = $scope.jobList; // data to be sent for validation
        $scope.data.jsonblobForBulk = $scope.selectedJobs; //selected job names
        //console.log($scope.data);

        $http({
            method: $scope.method,
            url: $scope.url,
            data: $scope.data,
            headers: {
                'X-Auth-Token': localStorage.getItem('itc.authToken')
            }
        }).success(function(data, status) {

                $scope.status = status;
                $scope.jobData = new Object();
                $scope.jobData.jobFlag = 'true';
                $scope.jobData.bulkNames = data.bulkNames;
                //console.log('duplicate jobs'+data.bulkNames)
                //$scope.jobData.bulkNames = ['Job1','Job2'];
                angular.forEach($scope.jobData.bulkNames, function(v1, k1) {
                    angular.forEach($scope.selectedJobs, function(value, key) {
                        if (key != 0) {
                            angular.forEach(value, function(v, k) {
                                if (k == 1) {
                                    if (v == v1) {
                                        $scope.jobData.jobCheck =true;
                                        $scope.selectedJobs.splice(key, 1);
                                    }
                                }
                            });

                        }

                    });
                });

                $scope.jobData.jobs = $scope.selectedJobs;
                $scope.jobData.data = $scope.datas;
                //console.log($scope.jobData);
                myService.set($scope.jobData);
                if($scope.jobData.jobs.length>1 && $scope.date==false && $scope.vDate== true && $scope.leapy==false && $scope.ingestionId==false && $scope.namej==false){
                   $location.path("/bulkJobsPreview/"); 
               }else
               {
                if($scope.jobData.jobCheck ==true ){
                    $scope.msg=true;
                    $scope.nms=$scope.jobData.bulkNames.toString();
                }else        
                    if( $scope.date==true)
                        $scope.msgs=false;
                    if( $scope.vDate==false)
                        $scope.vdate=true;

               }
                

            }).error(function(data, status) {

            $scope.data = data || "Request failed";
            $scope.status = status;
            console.log(status)
        });

    }


    $scope.submitBulk = function() {
        $location.path("/DataSchema/");
        console.log($scope.jobArray)
        $scope.jobArray.push($scope.jobArrayHeader.jobHeaderBulk);
        $scope.jobArray.reverse();
        $scope.method = 'POST';
        $scope.data = {};
        $scope.data.name = $scope.previewpage.data.name;
        $scope.data.userName = $scope.previewpage.data.userName;
        $scope.data.createdBy = localStorage.getItem('itc.username');
        $scope.data.updatedBy = localStorage.getItem('itc.username');
        //$scope.data.fileName=$scope.previewpage.bulkDatapreview.originalFileName;
        $scope.data.type = $scope.previewpage.data.type;
        $scope.data.jsonblobForBulk = $scope.jobArray;

        //$scope.data.header=$scope.previewpage.header
        console.log($scope.data)

        $scope.url = 'rest/service/addEntity/';
        $http({
            method: $scope.method,
            url: $scope.url,
            data: $scope.data,
            headers: {
                'X-Auth-Token': localStorage.getItem('itc.authToken')
            }
        }).success(
            function(data, status) {
                $scope.status = status;

                $location.path("/DataSchema/");

            }).error(function(data, status) {
            if (status == 401) {
                $location.path('/');
            }
            $scope.data = data || "Request failed";
            $scope.status = status;
            $location.path("/DataSchema/");
        });



    }
    $scope.cancelBulksubmit = function(){
        console.log('Bulk Profile creation terminated')
        $location.path('/DataSchema/');
    }
    //--------------------------------

    $scope.columnBulk1 = function(choice) {

        angular.forEach(choice, function(value, key) {

            if (key == 0 && value == "") {
                // console.log(key + "-" + value)

                return true;
            }
        });

    }
    // validates date format
    var isValidDate = function (date) {
        //console.log('validate date:'+date)
        var valid = true;

    var vals=[];
    var vals = date.split('-');
    var year = vals[0];
    var month = vals[1];
    var day = vals[2];
   //console.log(year+month+day)

        if(isNaN(month) || isNaN(day) || isNaN(year)) return false;

        if((month < 1) || (month > 12)) valid = false;
        else if((day < 1) || (day > 31)) valid = false;
        else if(((month == 4) || (month == 6) || (month == 9) || (month == 11)) && (day > 30)) valid = false;
        else if((month == 2) && (((year % 400) == 0) || ((year % 4) == 0)) && ((year % 100) != 0) && (day > 29)) valid = false;
        else if((month == 2) && ((year % 100) == 0) && (day > 29)) valid = false;
        else if((month == 2) && (day > 28)) {
            //valid = false;
            $scope.leapy=true;
        }

    return valid;
    
}

$scope.callcontainheader=  function(){
    console.log('header flag') //workaround to make contain header flag true
}

}