userApp
    .controller(
        'datalineageCtrl',
        function(myService, $scope, $http, $templateCache, $location,
            $rootScope, $route, $upload, $filter, $modal, $interval, $window) {
            $scope.myVar = 1;
            $scope.mySelect = 1;
            $scope.saveData = new Object();
            $scope.tagData = {};
            
            /*function calls*/
            $scope.disTables = false;
            $scope.displaylineage = false;
            $scope.noSelection = true;

            // clears all selections
            cancelall = function(){
                $scope.entityselnotok=false;
                $scope.disTables = false;
                $scope.displaylineage = false;
                $scope.noSelection = true;
                $scope.tableChoice = null; //clear the search 
                $scope.textQuery = null;


                //tag related 
                $scope.tagselectnotok=false;
                $scope.tagData.stag = null;
                $scope.tagData.searchTag=null;
                $scope.tagedTables = false;
                $scope.noSelection = true;
            }

            $scope.clearSearch = function() {
                cancelall() //clears all selections
            }

            // toggle button for type text and dsl
            $scope.toggle = function(checkBox) {
                $scope.checkBox = !$scope.checkBox;
                if (checkBox) {

                    cancelall()
                    $scope.text = false


                } else {
                    //console.log('text');
                    $scope.text = true
                }



            }
            /*
            get the type of tables
            */
            $scope.getTableChoice = function() {
                $scope.tableChoice = null; // clear the table search
                $scope.tagedTables = false
                $scope.method = 'GET';
                //$scope.url = 'rest/service/governance/types';
                $scope.url = 'rest/service/governance/types?type=' + 'CLASS' ;
                $http({
                    method: $scope.method,
                    url: $scope.url,
                    headers: headerObj
                }).success(function(data, status) {

                    $scope.status = status;
                    //console.log(data)
                    $scope.dbList = data;

                }).error(function(data, status) {


                });
            }
            /*
            get the tables list according to the type selected
            */
            $scope.listTables = function(option) {
                if(option!='back'){
                    $scope.resulttab = option // shows the name on top of table 
                }

                var cy = cytoscape({
                    container: document.getElementById('lineage'),
                });
                cy.destroy();

                
                $scope.noSelection = false;
                $scope.displaylineage = false;

                if ($scope.text == true) {

                    if(option==undefined||option==''||option==null){
                        $scope.txtsearchnotok=true;
                    }
                    else{
                        $('#lineageloader').show();
                        $scope.tableList=null;
                        $scope.txtsearchnotok=false
                        $scope.disTables = true;
                        $scope.tflag=true
                        $scope.method = 'GET';
                        $scope.url = 'rest/service/governance/entities/textsearch?query='+option

                        $http({
                            method: $scope.method,
                            url: $scope.url,
                            headers: headerObj
                        }).success(function(data, status) {

                            $scope.status = status;
                            
                            if (status == 200) {
                                $scope.tflag=false
                                $('#lineageloader').hide();
                                //console.log("tables:"+data)

                                $scope.saveData.tables = data;
                                $scope.tableList = $scope.saveData.tables;
                                console.log(data)
                                myService.set($scope.saveData);

                                filtertable(tstart, tend)
                                
                            }
                            

                        }).error(function(data, status) {


                        });

                    }

                    

                } else {
                    
                    if (option == undefined||option=='back') {
                        $scope.noSelection=true;
                        if(option=='back'){
                            $scope.disTables = true;
                            //get the table list from existing selection
                            stables = myService.get($scope.saveData);
                            $scope.tableList = stables.tables;
                            $scope.resulttab = stables.entityname
                        }
                        else{
                            //validation if option is undefined
                            $scope.entityselnotok=true;
                        }
                        
                        

                    } else {

                        $scope.tableList=null;
                        $scope.disTables = true;
                        $scope.entityselnotok=false;

                        $('#lineageloader').show();
                        
                        $scope.method = 'GET';
                        $scope.url = 'rest/service/governance/listentity?type=' + option; 

                        $http({
                            method: $scope.method,
                            url: $scope.url,
                            headers: headerObj
                        }).success(function(data, status) {

                            $scope.status = status;
                            if (status == 200) {
                                $('#lineageloader').hide();
                                //console.log("tables:"+data)

                                $scope.saveData.tables = data;
                                $scope.saveData.entityname=option;
                                $scope.tableList = $scope.saveData.tables;

                                console.log($scope.tableList)
                                myService.set($scope.saveData);
                                filtertable(tstart, tend)
                            }

                        }).error(function(data, status) {
                            $('#lineageloader').hide();
                            $scope.noSelection=true;

                        });
                    }
                }


            }

            /*
            get the lineage corresponding to the table selected
            */
            $scope.dispLineage = function(guid, name) {
                $scope.gFlag = true;
                $scope.displaylineage = true;
                $scope.disTables = false;
                $scope.noSelection = false;
                //detail required to get lineage
                $scope.tableid = guid
                $scope.tablename = name;

                $scope.method = 'GET';
                $scope.url = 'rest/service/governance/lineage/' + guid;

                $http({
                    method: $scope.method,
                    url: $scope.url,
                    headers: headerObj
                }).success(function(data, status) {

                    $scope.status = status;
                    $scope.saveData.lDetails = data;
                    myService.set($scope.saveData)
                    $scope.entityGuid = data.entityGuid;

                    if (status == 200) {
                        $scope.gFlag = false
                        $scope.nodataLin=false;
                        drawLineage(data) //calling a function to create graph
                    }
                    


                }).error(function(data, status) {
                    $scope.nodataLin=true;
                    $scope.gFlag=false;

                });

                /*
                lineage starts here
                */
                drawLineage = function(data) {

                    lineageData = new Object(); //elements object
                    lineageData.nodes = data.nodes;
                    //lineageData.nodes=nodes;
                    lineageData.edges = data.edges;


                    var cy = cytoscape({
                        container: document.getElementById('lineage'),
                        autoungrabify: true,
                        boxSelectionEnabled: false,
                        autounselectify: true,
                        //style sheet for chart elements
                        style: [{
                                selector: 'node[type="hive_table"]',
                                style: {
                                    'width': '50px',
                                    'height': '50px',
                                    'text-valign': 'top',
                                    'color': 'black',
                                    'content': 'data(name)',
                                    'background-color': '#84CB2F',
                                    'background-image': ['images/table.png'],
                                }
                            },
                            {
                                selector: 'node[type="hive_process"]',
                                style: {
                                    'width': '50px',
                                    'height': '50px',
                                    'text-valign': 'top',
                                    'color': 'black',
                                    'content': 'Query',
                                    'background-color': '#44AFE9',
                                    'background-image': ['images/query.png'],


                                }
                            },
                            {
                                selector: 'node[?target]',
                                style: {
                                    'width': '50px',
                                    'height': '50px',
                                    'text-valign': 'top',
                                    'color': 'black',
                                    'content': 'data(name)',
                                    'background-color': '#FF5733',
                                    'background-image': ['images/table.png'],


                                }
                            },
                            {
                                selector: 'node[type="hdfs_path"]',
                                style: {
                                    'width': '50px',
                                    'height': '50px',
                                    'text-valign': 'center',
                                    'color': 'black',
                                    'background-color': '#84CB2F',
                                    'background-image': ['images/table.png'],
                                }
                            },

                            {
                                selector: 'edge',
                                style: {
                                    'curve-style': 'bezier',
                                    'width': '1.5px',
                                    'line-color': 'gray',
                                    'line-style': 'solid',
                                    'target-arrow-shape': 'triangle',
                                    'target-arrow-color': 'gray',



                                }
                            }
                        ],
                        elements: lineageData,
                        layout: {
                            name: 'dagre', //external layout 
                            rankDir: 'LR', //orientation left-right
                            minLen: function(edge) {
                                return 2
                            }
                        },


                    });

                    // sets the view port, zoom value and position of chart, initial values
                    cy.viewport({
                        zoom: 0.7,
                        pan: {
                            x: 400,
                            y: 200
                        }
                    });

                    //sets the max and min zoom values
                    cy.minZoom(0.7)
                    cy.maxZoom(2)

                    //mouseover event
                    cy.on('mouseover', 'node', function(evt) {
                        var node = evt.target;
                        node.qtip({

                            content: function(evt) {
                                return this.data('name')
                            },
                            show: {
                                event: event.type,
                                ready: true
                            },
                            hide: {
                                event: 'mouseout unfocus'
                            },
                            position: {
                                my: 'bottom center',
                                at: 'top center'
                            },
                            style: {
                                classes: 'qtip-bootstrap',
                                tip: {
                                    width: 16,
                                    height: 8
                                }
                            }
                        }, event);
                    });

                    //set default tab select as Properties
                    $scope.category = 'Properties'; 

                    var props = {};
                    console.log(data.propJson.values)
                    angular.forEach(data.propJson.values, function(v, k) {

                        if (angular.isObject(v)) {

                            if (k == "db") {
                                //console.log($scope.prop.owner)
                                props[k] = data.propJson.values.owner;
                            }
                            if (k == "sd") {
                                //console.log(v.values.qualifiedName)
                                props[k] = v.values.qualifiedName;
                            }
                            if (k == "columns") {
                                column = {}
                                column = v;
                                props[k] = 'column';
                            }
                            if (k == "parameters") {

                                param = {}
                                param = v
                                props[k] = 'Parameters';
                            }

                        } else {

                            props[k] = v;
                        }

                    });

                    $scope.propDetails = props;
                }
            }
            /*
            lineage ends
            */



            $scope.tabCategory = function(category) {
                $scope.category = category;

                getLineagedetail(myService.get($scope.saveData), $scope.category);
            }

            $scope.isActive = function(category) {

                return $scope.category === category;
            }

            /*
            get details of a particular lineage
            */
            getLineagedetail = function(det, cat) {
                //console.log(det)

                if (cat == 'Audit') {
                    //console.log(det.lDetails.auditJson.events)
                    $scope.auditDetails = det.lDetails.auditJson.events;
                }

                if (cat == 'Tags') {
                    $scope.tagDetails=[];
                    console.log(det.lDetails.tagJson)
                    angular.forEach(det.lDetails.tagJson,function(v,k){
                        $scope.tagDetails.push(v)
                    });
                    console.log($scope.tagDetails)
                }
                if (cat == 'Schema') {
                    console.log(det.lDetails.schemaJson.results.rows)
                    $scope.schemaDetails = det.lDetails.schemaJson.results.rows;
                }
                if (cat == 'Properties') {
                    //console.log($scope.propDetails)

                }
            }


            $scope.detailsAudit = function(tkey) {
                //console.log($scope.auditDetails)
                angular.forEach($scope.auditDetails, function(value, key) {
                    if (value.timestamp == tkey) {
                        //console.log(value.timestamp)
                        modified = value.details


                    }


                });
                $('#auditDetmodal').modal('show');
            }


            /*
            tagging functions
            */


            //modal box for create tag
            $scope.createnewtag = function() {

                $scope.tagData = {}
                $('#createTagmodal').modal('show');
            }

            //cancels create tag, hides modal box
            $scope.cancelCreatetag = function() {
                $('#createTagmodal').modal('hide');
                $('#addTagmodal').modal('hide');
                console.log('cancel create tag')
            }

            //creates the tag
            $scope.submitCreatetag = function(tData) {

                if (tData.typeName != undefined) {
                    console.log(tData);
                    $scope.tdata = new Object();
                    $scope.traits = {}

                    $scope.traits.typeName = tData.typeName;
                    $scope.traits.typeDescription = tData.typeDescription;
                    $scope.traits.superTypes = []
                    /*for(i=0;i<tData.superTag.length;i++){
                        $scope.traits.superTypes.push(tData.superTag)
                    }
                    console.log($scope.traits.superTypes)*/
                    $scope.traits.superTypes = tData.superTag;


                    $scope.traits.hierarchicalMetaTypeName = "org.apache.atlas.typesystem.types.TraitType";
                    $scope.traits.attributeDefinitions = []
                    $scope.tdata.traitTypes = []
                    $scope.tdata.traitTypes[0] = ($scope.traits);
                    $scope.tdata.enumTypes = [];
                    $scope.tdata.structTypes = [];
                    $scope.tdata.classTypes = [];
                    console.log($scope.tdata)


                    $scope.method = 'POST';
                    $scope.url = 'rest/service/governance/types';
                    $http({
                        method: $scope.method,
                        url: $scope.url,
                        data: $scope.tdata,
                        headers: headerObj
                    }).success(function(data, status) {

                        $scope.status = status;
                        //console.log(data)

                    }).error(function(data, status) {


                    });

                    $('#createTagmodal').modal('hide');

                } else {
                    console.log('plese fill the feilds')
                }
            }

            //updates the tag list
            $scope.updateTags = function() {

                $scope.method = 'GET';
                $scope.url = 'rest/service/governance/types?type=' + 'TRAIT' ;
                $http({
                    method: $scope.method,
                    url: $scope.url,
                    headers: headerObj
                }).success(function(data, status) {

                    $scope.status = status;
                    //console.log(data)
                    if (status == 200) {
                        $scope.tagData.tagSug = data
                    }

                }).error(function(data, status) {
                    console.log(status)

                });
                //$scope.tagData.tagSug=['hdfs_tag','kafka_tag']
                $scope.tags = $scope.tagData.tagSug
            }

            //displays modal box for assigning tags
            $scope.addTags = function(id,cat) {
                $scope.tagData.stag = null; //clear the selection 
                
                if (id == undefined) {
                    console.log($scope.tableid)
                    $scope.taggedTablename = $scope.tablename;
                    $scope.taggedTableguid = $scope.tableid

                } else {
                    console.log(id)
                    if(cat=='schemadet'){
                        $scope.columntag=true;
                        $scope.taggedcolguid=id;
                    }
                    else{
                        $scope.taggedTableguid = id;
                    }
                    
                }

                $('#addTagmodal').modal('show');


            }

            //displays modal box for assigning tags to multiple tables
            $scope.addtagMulti = function(selList,cat) {

                $('#addTagmodal').modal('show');
                
                $scope.addtagMultiple = true;
                $scope.selGuid = [];

                if(cat=='schemadet'){
                    $scope.selcol = [];
                    
                    angular.forEach(selList, function(value, key) {
                        if (selList[key].checked) {
                            
                            $scope.selcol.push(selList[key]);
                        }
                    });
                    angular.forEach($scope.selcol, function(v, k) {
                       
                        angular.forEach(v, function(val, ke) {
                            if(ke=='$id$'){

                                $scope.selGuid.push(val.id)
                            }
                            
                        });
                        
                        
                    });
                    console.log($scope.selGuid)
                }
                else{
                    $scope.selTables = [];
                    
                    angular.forEach(selList, function(value, key) {
                        if (selList[key].checked) {
                            $scope.selTables.push(selList[key]);
                        }
                    });
                    angular.forEach($scope.selTables, function(v, k) {

                        $scope.selGuid.push(v.entityGuid)
                    });
                }
                
            }

            //assigns the tag to particular table
            $scope.assignTag = function(stag) {
                $('#addTagmodal').modal('hide');
                $scope.assignTagdata = new Object();

                $scope.assignTagdata.jsonClass = "org.apache.atlas.typesystem.json.InstanceSerialization$_Struct";
                $scope.assignTagdata.typeName = stag;
                $scope.assignTagdata.values = {};

                if ($scope.addtagMultiple == true) {
                    for (i = 0; i < $scope.selGuid.length; i++) {
                        //$scope.taggedTableguid = $scope.selGuid[i]
                        assigntag($scope.assignTagdata , $scope.selGuid[i])
                    }
                   
                } else {

                    assigntag($scope.assignTagdata)

                }

            }

           
            var assigntag = function(obj,idlst) {

                $scope.method = 'POST';
                if($scope.addtagMultiple==true){
                    $scope.url = 'rest/service/governance/entities/' + idlst + '/tag' ;
                }
                else{
                    if($scope.columntag==true){
                        console.log($scope.tableid)
                        $scope.url = 'rest/service/governance/entities/' +$scope.tableid+'/' +$scope.taggedcolguid + '/tag' ;
                    }
                    else{
                        $scope.url = 'rest/service/governance/entities/' + $scope.taggedTableguid + '/tag' ;
                    }
                }
                

                $http({
                    method: $scope.method,
                    url: $scope.url,
                    headers: headerObj,
                    data: obj
                }).success(function(data, status) {

                    $scope.status = status;
                    
                    if (status == 200) {
                        //$scope.tableList = data

                    }
                    if($scope.columntag==true){
                        console.log($scope.columntag)
                        console.log(data)
                        $scope.gFlag = false
                        $scope.nodataLin=false;
                        drawLineage(data) //calling a function to create graph

                        $scope.saveData.lDetails = data;
                        myService.set($scope.saveData)
                    }
                    filtertable(tstart, tend)

                }).error(function(data, status) {
                    console.log(status)

                });

                

            }

            //empty div element with no selections
            $scope.tagDiv = function() {
                $scope.tagData.stag = null
                $scope.disTables = false;
                $scope.displaylineage = false;
                $scope.noSelection = true;

            }

            // switch flag for notification --  not used
                    $scope.switchBool = function (value) {
                    $scope[value] = !$scope[value];
                    };


            //display the tables tagged to particular tag
            $scope.tagedTables = false;
            $scope.showTagtable = function(stag) {

                if (stag == undefined || stag == '') {
                    ///console.log(stag)
                    //$scope.successTextAlert = "Please select one from dropdown";
                    $scope.showSuccessAlert = true;
                    $scope.tagselectnotok=true
                    $scope.tagedTables = false;

                } else {
                    //console.log(stag)
                    $scope.seltag = stag
                    $scope.tagselectnotok=false
                    $scope.tagedTables = true;
                    $scope.noSelection = false;
                    $scope.tagflag=true;
                }

                $scope.method = 'GET';
                $scope.url = 'rest/service/governance/entities?tagName=' + stag ;
                $http({
                    method: $scope.method,
                    url: $scope.url,
                    headers: headerObj
                }).success(function(data, status) {

                    $scope.status = status;
                    console.log(data)
                    if (status == 200) {
                        $scope.tagflag=false;
                        $scope.tagedTablelist = data
                    }

                }).error(function(data, status) {
                    console.log(status)

                });

            }

            //clear the tag search , no selection made
            $scope.clearTagtable = function() {
                cancelall();   //clears all selections

            }

            //opens modal box to de-assign particular tag 
            $scope.deleteTag = function(choiceDel, id) {

                $scope.choiceDels = choiceDel
                $('#deleteTagmodal').modal('show');
                if(id==undefined){
                    console.log($scope.tableid)
                    $scope.removetagGuid=$scope.tableid
                }else{
                    $scope.removetagGuid = id;
                }
                
                $scope.removeTag = choiceDel;


            }

            //de-assigns the tag 
            $scope.removetag = function() {
                $('#deleteTagmodal').modal('hide');
                $scope.method = 'DELETE';
                $scope.url = 'rest/service/governance/entities/' + $scope.removetagGuid + '/traits/' +  $scope.removeTag;
                $http({
                    method: $scope.method,
                    url: $scope.url,
                    headers: headerObj
                }).success(function(data, status) {

                    $scope.status = status;
                    console.log(data)
                    if (status == 200) {
                        $scope.tableList = data
                        filtertable(tstart, tend)
                    }

                }).error(function(data, status) {
                    console.log(status)

                });

            }


            /*
            tagging functions ends here 
            */



            /*
            pagination
            */
            $scope.pagelimit = 10;
            tstart = 0
            tend = $scope.pagelimit - 1;

            $scope.paginate = function(check) {

                if (check == "prev" && tstart != 0) {

                    tstart = tstart - $scope.pagelimit;
                    tend = tend - $scope.pagelimit
                    filtertable(tstart, tend)

                }

                if (check == "next" && tend <= $scope.tableList.length) {

                    tstart = tstart + $scope.pagelimit;

                    tend = tend + $scope.pagelimit

                    filtertable(tstart, tend)
                }

                if (check == "fst" && tstart != 0) {

                    tstart = 0

                    tend = $scope.pagelimit - 1;

                    filtertable(tstart, tend)
                }

            }

            filtertable = function(tstart, tend) {
                if($scope.tableList!=null){
                   
                    $scope.pgrange = (tstart + 1) + "-" + (tend + 1)
                }
                else{
                    $scope.pgrange= 'No Data'
                }
                $scope.filteredlist = [];
                //console.log(tstart+"--"+tend)
                for (i = tstart; i <= tend; i++) {
                    if ($scope.tableList[i] != undefined)
                        $scope.filteredlist.push($scope.tableList[i])
                }
                //console.log($scope.filteredlist)
            }

            //pagination ends

            /*
            popover functions
            */
            
        })


