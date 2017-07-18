var i= 1;
var n = 1;
var pipeArray = new Array();
var sourceID;
var targetIDtemp;
var isChange = false;
var noneEdit = false;
jsPlumb.ready(function () {
	
	//$('#flowchart-demo').html('');
	
		$("#flowchart-demo").droppable({
			
                drop: function (e, ui) {
					//alert($(ui.draggable)[0].id);
                    if ($(ui.draggable)[0].id.indexOf("jsPlumb") !== -1) {
                    	var flowChartJson = $('#jsonOutput').val();
                    //	alert(flowChartJson);
                    	if(flowChartJson != '' && n < 2){
                    		var flowChart = JSON.parse(flowChartJson);
                    		//console.log(flowChart);
                    		var nodes = flowChart.nodes;
                    		n = nodes.length;
                    		
                    	}
                    	
                    	n++;
                    	var Stoppos = $(this).position();
                    	var currentPos = ui.helper.position();
                       // alert("left="+parseInt(currentPos.left)+" right"+parseInt(currentPos.top));
                      //  left = e.left;         
                       // top = e.top;
                    	//console.log(Stoppos);
                    	 e.stopPropagation(); 
                    	//alert(e.pageX/100);
                        x = ui.helper.clone();
						//x.css('position', 'absolute');
						x.css('left', parseInt(currentPos.left));
						x.css('top', parseInt(currentPos.top)+150);
						x.attr('class', 'list-group-item window '+ui.helper.attr('data-nodetype').replace(/\ /g,''));
						x.attr('id', 'flowchartWindow'+ui.helper.attr('data-nodeid')+'pipe'+selectedPipeId+n);
						x.attr('title', x.html());
						//x.attr('id', ui.helper.attr('data-nodetype'));
						//x.attr('data-nodetype', 'flowchartWindow'+selectedPipeId+i);
                    ui.helper.remove();
                    /*x.draggable({
                        helper: 'original',
                        containment: '#flowchart-demo',
                        tolerance: 'fit'
                    });*/
                    
                    x.appendTo('#flowchart-demo');
					//console.log(x);
					instance.draggable(jsPlumb.getSelector(".window"), { grid: [20, 20] });
				//	alert(ui.helper.attr('data-nodetype'));
					if(ui.helper.attr('data-nodetype') == "Dataset" || ui.helper.attr('data-nodetype') == "Linear Regression" || ui.helper.attr('data-nodetype') == "Binary Logistic Regressionn" || ui.helper.attr('data-nodetype') == "MultiClass Logistic Regression")
						_addEndpoints("Window"+ui.helper.attr('data-nodeid')+'pipe'+selectedPipeId+n, ["BottomCenter"]);
					else if(ui.helper.attr('data-nodetype') == "KMeans Clustering" || ui.helper.attr('data-nodetype') == "Random Forest Classification" || ui.helper.attr('data-nodetype') == "Random Forest Regression")
						_addEndpoints("Window"+ui.helper.attr('data-nodeid')+'pipe'+selectedPipeId+n, ["BottomCenter"]);
					else if(ui.helper.attr('data-nodetype') == "Hive" || ui.helper.attr('data-nodetype') == "Pig")
						_addEndpoints("Window"+ui.helper.attr('data-nodeid')+'pipe'+selectedPipeId+n, ["TopLeft","TopCenter","TopRight","BottomCenter"]);
					else if(ui.helper.attr('data-nodetype') == "Compare Model")
						_addEndpoints("Window"+ui.helper.attr('data-nodeid')+'pipe'+selectedPipeId+n, ["TopLeft","TopCenter","TopRight"]);
					else if(ui.helper.attr('data-nodetype') == "Join" || ui.helper.attr('data-nodetype') == "Train" || ui.helper.attr('data-nodetype') == "Test")
						_addEndpoints("Window"+ui.helper.attr('data-nodeid')+'pipe'+selectedPipeId+n, ["TopLeft","TopRight","BottomCenter"]);
					else if(ui.helper.attr('data-nodetype') == "Partition")
						_addEndpoints("Window"+ui.helper.attr('data-nodeid')+'pipe'+selectedPipeId+n, ["TopCenter","BottomLeft","BottomRight"]);
						
					else
						_addEndpoints("Window"+ui.helper.attr('data-nodeid')+'pipe'+selectedPipeId+n, ["TopCenter","BottomCenter"]);	
					i++;
					
                }

                }
            });
        
    var instance = jsPlumb.getInstance({
        // default drag options
        DragOptions: { cursor: 'pointer', zIndex: 2000 },
        // the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
        // case it returns the 'labelText' member that we set on each connection in the 'init' method below.
        ConnectionOverlays: [
            [ "Arrow", { location: 1 } ],
            
        ],
        Container: "flowchart-demo",
        drag: function(event) {
            var top = $(this).position().top;
            var left = $(this).position().left;

            ICZoom.panImage(top, left);
        },
    });

    var basicType = {
        connector: "StateMachine",
        paintStyle: { strokeStyle: "red", lineWidth: 1 },
        hoverPaintStyle: { strokeStyle: "blue" },
        overlays: [
            "Arrow"
        ]
    };
    instance.registerConnectionType("basic", basicType);
	
    // this is the paint style for the connecting lines..
    var connectorPaintStyle = {
            lineWidth: 1,
            strokeStyle: "#B7B7B7",
            joinstyle: "round",
            outlineColor: "white",
            outlineWidth: 2
        },
    // .. and this is the hover style.
        connectorHoverStyle = {
            lineWidth: 1,
            strokeStyle: "#216477",
            outlineWidth: 2,
            outlineColor: "white"
        },
        endpointHoverStyle = {
            fillStyle: "#216477",
            strokeStyle: "#216477"
        },
    // the definition of source endpoints (the small blue ones)
        sourceEndpoint = {
            endpoint: "Dot",
            maxConnections: -1,
            maxConnections: -1,
            paintStyle: {
                strokeStyle: "#B7B7B7",
                fillStyle: "transparent",
                radius: 5,
                lineWidth: 3
            },
            isSource:true, 
            isTarget:true,
            connector: [ "Flowchart" ],
            connectorStyle: connectorPaintStyle,
            hoverPaintStyle: endpointHoverStyle,
            connectorHoverStyle: connectorHoverStyle,
            dragOptions: {},
            overlays: [
                [ "Label", {
                    location: [0.5, 1.5],
                    cssClass: "endpointSourceLabel"
                } ]//, label: "drag"
            ]
        }
    // the definition of target endpoints (will appear when the user drags a connection)
        targetEndpoint = {
            endpoint: "Dot",
            paintStyle: { fillStyle: "#B7B7B7", radius: 5 },
            hoverPaintStyle: endpointHoverStyle,
            maxConnections: -1,
            connector: [ "Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true } ],
            connectorStyle: connectorPaintStyle,
            hoverPaintStyle: endpointHoverStyle,
            connectorHoverStyle: connectorHoverStyle,
            dropOptions: { hoverClass: "hover", activeClass: "active" },
            isSource:true, 
            isTarget:true,
            overlays: [
                [ "Label", { location: [0.5, -0.5], cssClass: "endpointTargetLabel" } ]//, label: "Drop"
            ]
        },
        init = function (connection) {
		//console.log(connection);
		var con = new Object();
		con['connectionId'] = connection.id;
		con['pageSourceId'] = connection.sourceId;
		con['pageTargetId'] = connection.targetId;
		connections.push(con);
            connection.getOverlay("label").setLabel(connection.sourceId.substring(15) + "-" + connection.targetId.substring(15));
        };

    var _addEndpoints = function (toId, sourceAnchors) {
        for (var i = 0; i < sourceAnchors.length; i++) {
            var sourceUUID = toId + sourceAnchors[i];
           // console.log(sourceAnchors[i]);
            instance.addEndpoint("flowchart" + toId,
            		
            		sourceEndpoint, {
            	
                anchor: sourceAnchors[i], uuid: sourceUUID,
                cssClass:sourceUUID,
            });
        }
       /* for (var j = 0; j < targetAnchors.length; j++) {
        	//alert(targetAnchors[j]);
            var targetUUID = toId + targetAnchors[j];
            instance.addEndpoint("flowchart" + toId, targetEndpoint, { anchor: targetAnchors[j], uuid: targetUUID });
        }*/
    };

    // suspend drawing and initialise.
    instance.batch(function () {

       // _addEndpoints("Window4", ["TopCenter", "BottomCenter"], ["LeftMiddle", "RightMiddle"]);
       // _addEndpoints("Window2", ["LeftMiddle", "BottomCenter"], ["TopCenter", "RightMiddle"]);
      // _addEndpoints("Window1", ["RightMiddle", "BottomCenter"], ["LeftMiddle", "TopCenter"]);
    //    _addEndpoints("Window1", ["LeftMiddle", "RightMiddle"], ["TopCenter", "BottomCenter"]);
		//_addEndpoints("Window5", ["TopCenter", "BottomCenter"], ["LeftMiddle", "RightMiddle"]);

        // listen for new connections; initialise them the same way we initialise the connections at startup.
        instance.bind("connection", function (connInfo, originalEvent) {
            init(connInfo.connection);
        });
		
        // make all the window divs draggable
        //instance.draggable(jsPlumb.getSelector(".flowchart-demo .window"), { grid: [20, 20] });
        // THIS DEMO ONLY USES getSelector FOR CONVENIENCE. Use your library's appropriate selector
        // method, or document.querySelectorAll:
        jsPlumb.draggable(document.querySelectorAll(".window"), { grid: [20, 20] });
        
        // connect a few up
       // instance.connect({uuids: ["Window2BottomCenter", "Window3TopCenter"], editable: true});
      //  instance.connect({uuids: ["Window2LeftMiddle", "Window4LeftMiddle"], editable: true});
      //  instance.connect({uuids: ["Window4TopCenter", "Window4RightMiddle"], editable: true});
      //  instance.connect({uuids: ["Window3RightMiddle", "Window2RightMiddle"], editable: true});
      //  instance.connect({uuids: ["Window4BottomCenter", "Window1TopCenter"], editable: true});
      //  instance.connect({uuids: ["Window3BottomCenter", "Window1BottomCenter"], editable: true});
        //

        //
        // listen for clicks on connections, and offer to delete connections on click.
        //
        /*instance.bind("dblclick", function (conn, originalEvent) {
            if (confirm("Delete connection from " + conn.sourceId + " to " + conn.targetId + "?"))
                instance.detach(conn);
            conn.toggleType("basic");
        });*/
        instance.bind("click", function (conn, originalEvent) {
        	
        	 if(mydiv_selector){
        		 if(mydiv_type == 'node'){
        			 var prevID = $(mydiv_selector).attr('id');
             		// alert(prevID);
             		 $('#'+prevID).removeClass('selectedNode');
        		 }
        		 else{
        			 var prevID = $(mydiv_selector).attr('id');
             		// alert(prevID);
        			 $('#'+prevID).removeClass('strokeStylecon'); 
        		 }
        		
        	 }
        	// console.log(conn);
        	 mydiv_selector = conn;
        	 mydiv_type = 'connection';
        	 var newID = $(mydiv_selector).attr('id')
        	 $('#'+newID).addClass('strokeStylecon');
        	/*var sourceName = $('#'+conn.sourceId).html();
        	var targetName = $('#'+conn.targetId).html();
        	//console.log(sourcename);
            if (confirm("Delete connection from " + sourceName + " to " + targetName + "?")){
            	 instance.detach(conn);
            	 isChange = true;
            	 $("#saveall").trigger("click");
            }
               
            conn.toggleType("basic");*/
           
        });
        instance.bind("connectionDrag", function (connection) {
        	
            console.log("connection " + connection.id + " is being dragged. suspendedElement is ", connection.sourceId, " of type ", connection.targetId);
        });
       
        instance.bind("connectionDragStop", function (connection) {
        //	console.log(connection);
        	var sourceName = $('#'+connection.sourceId).html();
        	var targetName = $('#'+connection.targetId).html();
        	//console.log(sourcename);
          //  console.log("connection " + connection.id + " was dragged");
            isChange = true;
            $("#saveall").trigger("click");
        });

        instance.bind("connectionMoved", function (params) {
            console.log("connection " + params.connection.id + " was moved");
        });
        

    });

    //jsPlumb.fire("jsPlumbDemoLoaded", instance);
   
$('#saveall').click(function(e) {
	saveFlowchartinDraft();
  });
 $('#loadChat').click(function(e,param) {
	// alert(param);
    loadFlowchart(param);
  });
 $('#saveDB').click(function(e) {
		saveFlowchart();
	  });
 /*$(function() {
     var isDragging = false;
     //console.log("connection was moved");
     $(".flowchart-demo")
     .mousedown(function() {
     	 console.log("connection1 was moved");
     })
     .mouseup(function() {
    	// saveFlowchart();
     });

 });*/
// $( ".window" ).unbind( "click");
 //$( ".window" ).unbind( "dblclick");
 $(document).off("click", ".window");
 $(document).off("dblclick", ".window");
 $(document).off("keyup");
 var  mydiv_selector ;
 var  mydiv_type;
 
 $(document).on('dblclick','.window',function(){
	// $( ".window" ).unbind( "click");
	 if(mydiv_selector){
		 var prevID = $(mydiv_selector).attr('id');
		// alert(prevID);
		 $('#'+prevID).removeClass('selectedNode');
	 }
	 mydiv_selector = $(this);
	 var newID = $(mydiv_selector).attr('id')
	 $('#'+newID).addClass('selectedNode');
	 mydiv_type = 'node';
	 //alert(noneEdit);
	 if($(this).attr('data-nodetype') == 'Dataset'){
			// document.getElementById("prpertyTD").innerHTML='<object type="type/html" data="views/dataSet.html" ></object>';
			 	var dataSetID = $(this).attr('id');
			 	if(dataSetID){
			 		 dataSetID =  dataSetID.substr(0, dataSetID.indexOf('pipe'));
						dataSetID = dataSetID.replace('flowchartWindow','');
						var scope = angular.element(document.getElementById("pipeGraph")).scope();
					    scope.$apply(function () {
					    	//scope.editData.filterColumn = '';
					    scope.selectdataset(dataSetID);
					    });
			 	}
			 	
		}
	 else if(noneEdit === true && trnsEdit === false){
		var moduleID = $(this).attr('id');
		var transforId =  moduleID.substr(0, moduleID.indexOf('pipe'));
		transforId = transforId.replace('flowchartWindow','');
		var transforversion =  moduleID.substr(moduleID.indexOf('version')+7);
		 var scope = angular.element(document.getElementById("pipeGraph")).scope();
		    scope.$apply(function () {
		    	//scope.editData.filterColumn = '';
		    scope.moduleHistory(transforId,transforversion);
		    });
	 }
		else {//if($(this).attr('data-nodetype') == 'Column Filter')
			 targetIDtemp = $(this).attr('id');
			var flowChartJson = $('#jsonOutput').val();
			if(flowChartJson == ''){
				alert('Please add one connection');
				return false;
			}
			var flowChart = JSON.parse(flowChartJson);
			var connections = flowChart.connections;
			var datanodetype = $(this).attr('data-nodetype');
			var i=0;
			sourceID = new Array();
			souceNodeType = new Array();
			dataSetID = new Array();
			dataSetversion = new Array();
			anchor = new Array();
			sourceanchor = new Array();
				$.each(connections, function( index, elem ) {
					if(elem.targetId == targetIDtemp){
						console.log(elem);
						sourceID[i] = elem.sourceId;
						anchor[i] = elem.anchors[1][0];
						sourceanchor[i] = elem.anchors[0][0];
						//alert(sourceanchor);
						souceNodeType[i] = $('#'+sourceID[i]).attr('data-nodetype');
						dataSetID[i] =  sourceID[i].substr(0, sourceID[i].indexOf('pipe'));
						dataSetID[i] = dataSetID[i].replace('flowchartWindow','');
						if(dataSetID[i] == 'sampleid'){
							alert('Please Configure the source transformation');
							return false;
						}
						if(souceNodeType[i] != 'Dataset'){
							dataSetversion[i] =  sourceID[i].substr(sourceID[i].indexOf('version')+7);
						}
						else{
							dataSetversion[i] = 0;
						}
						
						i++;
					}
						
				});
				//console.log(sourceID);
				var algoArray = ["Linear Regression","Binary Logistic Regression","MultiClass Logistic Regression","KMeans Clustering","Random Forest Classification","Random Forest Regression","Compare Model"];
				var columnData = ["Dataset","Column Filter","Clean Missing Data","Join","Group By","Hive","Pig","MapReduce","Partition"];
				//alert(souceNodeType);
				if($(this).attr('data-nodetype') == "Train"){
					if(souceNodeType[0] == "Train" || souceNodeType[1] == "Train"){
						alert($(this).attr('data-nodetype')+ ' should not connect with Train');
						return false;
					}
					else if(souceNodeType[0] == "Test" || souceNodeType[1] == "Test"){
						alert($(this).attr('data-nodetype')+ 'should not connect with Test');
						return false;
					}
					else if(algoArray.indexOf(souceNodeType[0]) === -1 && algoArray.indexOf(souceNodeType[1]) === -1){
						alert($(this).attr('data-nodetype')+ ' should  connect with one algorithm');
						return false;
					}
					else if(columnData.indexOf(souceNodeType[0]) === -1 && columnData.indexOf(souceNodeType[1]) === -1){
						alert($(this).attr('data-nodetype')+ ' should  connect with one Dataset');
						return false;
					}
						
				}
				if($(this).attr('data-nodetype') == "Test"){
					
					if(souceNodeType[0] == "Test" || souceNodeType[1] == "Test"){
						alert($(this).attr('data-nodetype')+ 'should not connect with Test');
						return false;
					}
					else if(algoArray.indexOf(souceNodeType[0]) !== -1 && algoArray.indexOf(souceNodeType[1]) !== -1){
						alert($(this).attr('data-nodetype')+ ' should not connect with algorithm');
						return false;
					}
					else if(souceNodeType[0] == "Train" && souceNodeType[1] == "Train"){
						alert($(this).attr('data-nodetype')+ ' should  connect with Train');
						return false;
					}
					else if(columnData.indexOf(souceNodeType[0]) === -1 && columnData.indexOf(souceNodeType[1]) === -1){
						alert($(this).attr('data-nodetype')+ ' should  connect with one Dataset');
						return false;
					}
					
				}
				var transforId =  targetIDtemp.substr(0, targetIDtemp.indexOf('pipe'));
				transforId = transforId.replace('flowchartWindow','');
				var transforversion =  targetIDtemp.substr(targetIDtemp.indexOf('version')+7);
				//console.log(transforversion);
				
				//console.log(dataSetID);
				var scope = angular.element(document.getElementById("pipeGraph")).scope();
			    scope.$apply(function () {
			    	//scope.editData.filterColumn = '';
			    scope.getColumnNameByTabID(dataSetID,dataSetversion,anchor,transforId,transforversion,datanodetype,souceNodeType,sourceanchor);
			    });
			  //  $('#prpertyTD').show();
			    //document.getElementById("prpertyTD").innerHTML='<object type="type/html" data="views/filtercol.html" ></object>';
		}
		
		 /*if(){
			 
		 }*/
		
		   
		    //other logic goes here...
		});

 $(document).keyup(function(e){
//	 mydiv_selector = instance.getSelector('.window');
	
     if(e.keyCode == 46 && noneEdit === false){
    	 if(window.location.href.indexOf('project') >= 0){
    		// console.log(mydiv_selector);
        	 if(mydiv_type != 'node'){
        		 var sourceName = $('#'+mydiv_selector.sourceId).html();
        	     	var targetName = $('#'+mydiv_selector.targetId).html();
        	     	//console.log(sourcename);
        	         if (confirm("Delete connection from " + sourceName + " to " + targetName + "?")){
        	         	 instance.detach(mydiv_selector);
        	         	 isChange = true;
        	         	 $("#saveall").trigger("click");
        	         }
        	            
        	         mydiv_type.toggleType("basic");
        	 }
        	 else{
        		 if (confirm("Delete stage " + mydiv_selector.context.firstChild.data + " from flowchart?")){
        	    	// console.log(mydiv_selector);
        	    	 instance.remove(mydiv_selector);
        	    	 isChange = true;
        	    	 saveFlowchartinDraft();
        	    	 }
        	     }
        	 }
    		}
    	
    	

 }) 
 
 $(document).on('contextmenu','.window',function(e){
	 var $contextMenu = $("#contextMenu");
	// alert(e.target.id);
	 //alert(e.target.attr('data-nodetype'));
	 var nodeID = e.target.id
	var nodeType = $('#'+nodeID).attr('data-nodetype');
	 //console.log(e.target.data-nodetype);
	 if(nodeType == 'Compare Model' && noneEdit === false){
		 selectedComapare = nodeID;
		 $contextMenu.css({
		      display: "block",
		      left: e.pageX-300,
		      top: e.pageY-30
		    });
	 }
	
	    return false;
	  });
	  
 $("body").on("click", function() {
	 $("#contextMenu").hide();
  }); 
 /*$(document).on('dblclick','.window',function(){
	 if (confirm("Delete stage " + $(this).context.firstChild.data + " from flowchart?")){
	 instance.remove($(this));
	 isChange = true;
	 saveFlowchartinDraft();
	 }
	});*/
 	/*$(document).on('click','.window',function(){//flowchartWindow125565
 	//	console.log($(this));
	var stageID = $(this).context.id;
	stageID = stageID.replace('flowchartWindow','');
	stageID = stageID.substr(0,stageID.length - 1)
	var scope = angular.element(document.getElementById("pipeGraph")).scope();
    scope.$apply(function () {
    scope.selectPipeline(stageID,'PipelineStage');
    });
	    //other logic goes here...
	});*/
  function addTask(id,name,i,nodetype,param){
  //alert(id);
  var instance=window.instance;
	if(typeof id === "undefined"){
		numberOfElements++;
		id = "flowchartWindow"+selectedPipeId + numberOfElements;
	}
	i = id.slice(-1);
//	console.log(i);
	//$('<span class="window" id="' + id + '" data-nodetype="task" style="position: absolute;">').appendTo('#flowchart-demo').html(name);
	var  x = $('<span class="window" id="' + id + '" data-nodetype="'+nodetype+'" context-menu="menuOptions">').text(name).appendTo($('#flowchart-demo'));
	//x = ui.helper.clone();
	//x.css('position', 'absolute');

	x.attr('class', 'window '+nodetype.replace(/\ /g,'')+' list-group-item');
	x.attr('id', id);
	x.attr('title', x.html());
	//ui.helper.remove();
	if(param != 'runHistory'  &&( param == '6' || param == '7')){
	x.draggable({
	    helper: 'original',
	    containment: '#flowchart-demo',
	    tolerance: 'fit'
	});
	}
	else if(param == undefined){
		x.draggable({
		    helper: 'original',
		    containment: '#flowchart-demo',
		    tolerance: 'fit'
		});
	}
//	 x.appendTo('#flowchart-demo');
//	instance.draggable(instance.getSelector(".window"), { grid: [20, 20] });
	
	
	 
	
      //  jsPlumb.draggable($('#' + id));
        return id;
}
  
  window.instance=instance;
function saveFlowchartinDraft(){
//console.log(window.instance.getAllConnections());
        var instance=window.instance;
        if (pipeArray.indexOf(selectedPipeId) === -1) {
			pipeArray[pipeArray.length] = selectedPipeId;
		}
	var nodes = []
	$('span[id^="flowchartWindow"]').each(function (idx, elem) {
	var $elem = $(elem);
	var endpoints = instance.getEndpoints($elem.attr('id'));
	//console.log('endpoints of ');
	//console.log(endpoints[0].canvas.className);
//	console.log($elem);
		nodes.push({
			blockId: $elem.attr('id'),
			name: $elem.context.firstChild.data,
			nodetype: $elem.attr('data-nodetype'),
			positionX: parseInt($elem.css("left"), 10),
			positionY: parseInt($elem.css("top"), 10)
		});
		//console.log(idx);
		
	 });
	instance.connections = [];
	var connections = [];
	//console.log(instance.getAllConnections());
	$.each(instance.getAllConnections(), function (idx, connection) {
	//	console.log('endpoints');
	//	console.log(connection.endpoints);
	 connections.push({
                connectionId: connection.id,
                sourceId: connection.sourceId,
                targetId: connection.targetId,
                anchors: $.map(connection.endpoints, function (endpoint) {
               // console.log(endpoint.anchor.x)
                    return [[endpoint.anchor.x,
                    endpoint.anchor.y,
                    endpoint.anchor.orientation[0],
                    endpoint.anchor.orientation[1],
                    endpoint.anchor.offsets[0],
                    endpoint.anchor.offsets[1]]];
                    
                })
            });
        });
		var stageList = [];
			var k= 0;
			//console.log(instance.getAllConnections());
			$.each(instance.getAllConnections(), function (idx, connection) {
				var sourceID = connection.sourceId;
				var targetID = connection.targetId;
				
				var tempSorceID =  sourceID.substr(0, sourceID.indexOf('pipe'));
				tempSorceID = tempSorceID.replace('flowchartWindow','');
				if(sourceID.indexOf('version') != -1){
					var tempSorceversion =  sourceID.substr(sourceID.indexOf('version')+7);
				}
				else{
					var tempSorceversion = 0;
				}
				
				var tempTargetID =  targetID.substr(0, targetID.indexOf('pipe'));
				tempTargetID = tempTargetID.replace('flowchartWindow','');
				if(targetID.indexOf('version') != -1){
					var tempTargetversion =  targetID.substr(targetID.indexOf('version')+7);
				}
				else{
					var tempTargetversion = 0;
				}
				
				
				var finalSourceID = tempSorceID+'-'+tempSorceversion;
				
				var finaltargetID = tempTargetID+'-'+tempTargetversion;
				
					stageList.push({
						stageName: finalSourceID,
		                output: finaltargetID,
		                input:'',
		               
		            });
					
					
					k++;
					
		        });
		//	console.log(stageList.length);
			if(stageList.length >= 1){
				stageList.push({
					stageName: stageList[stageList.length - 1].output,
	                output: '',
	                input:stageList[stageList.length - 1].stageName,
	               
	            });
			}
			
		//	console.log(stageList);
			for(k = 1;k<stageList.length;k++){
				for(j=k-1;j>=0;j--){
					if(stageList[j].output == stageList[k].stageName){
						if(stageList[k].input  != ''){
							if (stageList[k].input != stageList[j].stageName){
								if(stageList[k].input.indexOf(stageList[j].stageName) === -1)
									 stageList[k].input +=',' +stageList[j].stageName;
								stageList[k].input = uniqueTowns(stageList[k].input);
							}
							
						}
						else{
							stageList[k].input = stageList[j].stageName;
						}
						
						//delete sourcedestDetails['stages'][i];
					}
					if(stageList[k].output == stageList[j].stageName){
						if(stageList[j].input  != ''){
							if (stageList[j].input != stageList[k].stageName){
								if(stageList[j].input.indexOf(stageList[k].stageName) === -1)
									 stageList[j].input +=',' +stageList[k].stageName;
								stageList[j].input = uniqueTowns(stageList[j].input);
							}
							
						}
						else{
							stageList[j].input = stageList[k].stageName;
						}
						
						//delete sourcedestDetails['stages'][i];
					}
				}
			}
		
				
			
			
		//	console.log(stageList);
			//console.log(stageList[0].stageName);
			/*for(j=i;j>=0;j--){
				if(stageList[j].output == stageList[i].stageName){
					
							stageList[i].input +=',' +stageList[j].stageName;
					
					//delete sourcedestDetails[i];
				}
				 
				
			}*/
		//	console.log(stageList);
			var dulicateIndex = new Array();
			for(i = 1;i<stageList.length;i++){
				for(j=i-1;j>=0;j--){
					if(stageList[j].stageName == stageList[i].stageName){
						dulicateIndex[dulicateIndex.length] = i;
						//alert(stageList[j].stageName)
						//alert(stageList[i].stageName)
						if(stageList[j].output != stageList[i].output){
							
							if(stageList[j].output != ''){
								if(stageList[i].output != undefined){
									if (stageList[j].output.indexOf(',') === -1){
										var stageTemp = stageList[j].output;
										var inputTemp = stageList[j].stageName;
									}
									
									//if (stageList[i].output.indexOf(stageList[i].output) === -1)
									if(stageList[i].output != ''){
										stageList[j].output += ','+stageList[i].output;
										stageList[j].output = uniqueTowns(stageList[j].output);
									}
									
								}
								
								
							}
							else{
								if(stageList[i].output != undefined )
								stageList[j].output = stageList[i].output;
								var stageTemp = stageList[i].output;
								//console.log(stageTemp);
								var inputTemp = stageList[i].stageName;
								}
							
						//	stageList.splice(i, 1); 
						//	continue;
							/*stageList[i].input = inputTemp;
							stageList[i].output = '';
							stageList[i].stageName = stageTemp;*/
						//	continue;
							
						} 
						
						if(stageList[j].input != stageList[i].input){
							if(stageList[j].input != ''){
								//if(stageList[j].input != stageList[i].input){
									if(stageList[i].input != undefined && stageList[i].input != stageList[j].stageName){
										if (stageList[j].input.indexOf(stageList[i].input) === -1)
											stageList[j].input += ','+stageList[i].input;
											stageList[j].input = uniqueTowns(stageList[j].input);
									}
									
							//	}
								
							}
							else{
								if(stageList[i].input != undefined && stageList[i].input != stageList[j].stageName)
								stageList[j].input = stageList[i].input;
								
							}
							
						}
					}
				}
			}
					for(i = 1;i<stageList.length;i++){
						for(j=i-1;j>=0;j--){
				//	console.log(stageList[i]);
				//	console.log(stageList[j]);
					//console.log(i); console.log(stageList[i]);
					//console.log(j); console.log(stageList[j]);
					if(stageList[j].output == stageList[i].stageName){
						//console.log(stageList[j].output+'-----'+stageList[i].stageName)
						//console.log(stageList[j].stageName+'-----'+stageList[i].input)
						/*if(stageList[i].stageName == '1529-3'){
							console.log(stageList[i].input);
							console.log(stageList[j].stageName);
						}*/
						//console.log(stageList[i].input);
							//console.log(stageList[j].stageName);
						if(stageList[i].input == ''){
							stageList[i].input = stageList[j].stageName;
						}
						//else if(stageList[j].stageName != stageList[i].input){
							if (stageList[i].input.indexOf(stageList[j].stageName) === -1)
						stageList[i].input +=',' +stageList[j].stageName;
							stageList[i].input = uniqueTowns(stageList[i].input);
					//	}
				
				//delete sourcedestDetails[i];
					}
					if(stageList[i].output == stageList[j].stageName){
						//console.log(stageList[i].output+'-----'+stageList[j].stageName)
						//console.log(stageList[j].stageName+'-----'+stageList[i].input)
						/*if(stageList[j].stageName == '1529-3'){
							console.log(stageList[j].input);
							console.log(stageList[i].stageName);
						}*/
						//console.log(stageList[i].input);
						//console.log(stageList[j].stageName);
						if(stageList[j].input == ''){
							stageList[j].input = stageList[i].stageName;
						}
						//else if(stageList[j].stageName != stageList[i].input){
						//console.log(stageList[j].input.indexOf(stageList[i].stageName));
							if (stageList[j].input.indexOf(stageList[i].stageName) === -1)
						stageList[j].input +=',' +stageList[i].stageName;
							stageList[j].input = uniqueTowns(stageList[j].input);
					//	}
				
				//delete sourcedestDetails[i];
					}
					
					
				}
			}
			//console.log(stageList);
			/*for(d=0;d<dulicateIndex.length;d++){
				console.log(dulicateIndex[d]);
				delete stageList[dulicateIndex[d]];
				delete stageList[dulicateIndex[d]];
				delete stageList[dulicateIndex[d]];
				
			}*/
					//console.log(stageList);
			for(j=1;j<stageList.length;j++){
				for(i=j-1;i>=0;i--){
					
					
				if(stageList[j].stageName == stageList[i].stageName){
					//console.log(stageList[j].stageName);
					//console.log(stageList[i].stageName);
							delete stageList[j].stageName;
							delete stageList[j].input;
							delete stageList[j].output;
					//delete sourcedestDetails[i];
				}
				
			}
			}
			//console.log(stageList.length);
			for(j=0;j<stageList.length;j++){
			//	console.log(stageList[j].stageName);
			if(stageList[j].stageName == undefined){
				console.log(stageList[j].stageName);
				stageList.splice(j,1);
			}
			//	delete stageList[j];
				
			}
			//console.log(stageList.length);
			//console.log(stageList);
			var stageList1 = new Array();
			stageList1.stageList = new Array();
			$.each(stageList, function (key, value) {
				stageList1.stageList.push(value)
			     });
			//console.log(stageList1);    
        var flowChart = {};
        var flowChart1 = {};
        var flowCharttemp = {};
        flowCharttemp.stageList={};
        flowChart1.nodes = nodes;
        flowChart1.connections = connections;
        flowCharttemp.stageList.stages = stageList1.stageList;
        $.extend(flowChart1, flowCharttemp );
       // flowChart = $.merge(flowChart1, flowCharttemp.stageList);
		var flowChartJson = JSON.stringify(flowChart1);
		//console.log(flowChartJson);
	
		$('#jsonOutput').val(flowChartJson);
		/*var scope = angular.element(document.getElementById("pipeGraph")).scope();
		scope.$apply(function () {
			scope.graphDraft = $('#jsonOutput').val();
		});*/
		/*// var scope = angular.element(document.getElementById("pipeGraph")).scope();
 		scope.$apply(function () {
 			//scope.myFormText.$dirty = true;
 			scope.dirtyFrom();
 		});*/
		
 		$("#loadChat").trigger("click");
		//$scope.saveGraph();
		//$scope.removeDataArr();
}
function saveFlowchart(){
	//saveFlowchartinDraft();
	saveFlowchartinDraft();
	var scope = angular.element(document.getElementById("pipeGraph")).scope();
	scope.$apply(function () {
	scope.saveGraph();
	});
}
var noneEdit = false;
var trnsEdit = false;
function loadFlowchart(param){
//	alert(param);
	if(param != undefined){
		if(param == 'runHistory' || ( param != '6' && param != '7') ){
			//alert(param);
			noneEdit = true;
			//alert(noneEdit);
			if(param != 'runHistory'){
				trnsEdit = true;
			}
		}
		else{
			noneEdit = false;
		}
	}
	
	else{
		noneEdit = false;
	}
//	alert(noneEdit)
	var posArray = new Array();
	$('#flowchart-demo').html('');
	//jsPlumb.fire("jsPlumbDemoLoaded", instance);
	var instance=window.instance;
	instance.setSuspendDrawing(true);
	//console.log(instance)
	 instance.deleteEveryEndpoint();
	var flowChartJson = $('#jsonOutput').val();
	if(flowChartJson != ''){
		var flowChart = JSON.parse(flowChartJson);
		var nodes = flowChart.nodes;
		
	//	console.log(nodes)
		$.each(nodes, function( index, elem ) {
				var i=0;
				//nodetype: $elem.attr('data-nodetype'),
				var id = addTask(elem.blockId,elem.name,i,elem.nodetype,param);
				//alert(id)
				
				repositionElement(id, elem.positionX, elem.positionY);
				
				posArray[i] = new Array();
				posArray[i]['x'] = elem.positionX;
				posArray[i]['y'] = elem.positionY;
				var j = id.slice(-1);
				var tempID = id.replace('flowchartWindow','');
			//	alert(elem.nodetype);
				if(param != 'runHistory' &&( param == '6' || param == '7')){
					instance.draggable(instance.getSelector(".window"), { grid: [20, 20] });
				}
				else if(param == undefined){
						instance.draggable(instance.getSelector(".window"), { grid: [20, 20] });
				}
				if(elem.nodetype == "Dataset" || elem.nodetype == "Linear Regression" || elem.nodetype == "Binary Logistic Regression" || elem.nodetype == "MultiClass Logistic Regression")
					_addEndpoints("Window"+tempID, ["BottomCenter"]);
				else if(elem.nodetype == "KMeans Clustering" || elem.nodetype == "Random Forest Classification" || elem.nodetype == "Random Forest Regression")
					_addEndpoints("Window"+tempID, ["BottomCenter"]);
				else if(elem.nodetype == 'Hive' || elem.nodetype == 'Pig')
				_addEndpoints("Window"+tempID, ["TopLeft","TopCenter","TopRight","BottomCenter"]);
				else if(elem.nodetype == "Compare Model")
					_addEndpoints("Window"+tempID, ["TopLeft","TopCenter","TopRight"]);
				else if(elem.nodetype == "Join" || elem.nodetype == "Train" || elem.nodetype == "Test")
					_addEndpoints("Window"+tempID, ["TopLeft","TopRight","BottomCenter"]);
				else if(elem.nodetype  == "Partition")
					_addEndpoints("Window"+tempID, ["TopCenter","BottomLeft","BottomRight"]);
				else if(elem.nodetype == "Ingestion")
					_addEndpoints("Window"+tempID, ["BottomCenter"]);
				else
				_addEndpoints("Window"+tempID, ["TopCenter", "BottomCenter"]);	
				
			i++;
			//instance.recalculateOffsets(id);
		});
		
								
		var connections = flowChart.connections;
		$.each(connections, function( index, elem ) {
			//console.log(elem.endpoints)
			/*var eps = elem.endpoints;
		    console.log(eps[0].getUuid() +"->"+ eps[1].getUuid());*/
			 var connection = instance.connect({
				source: elem.sourceId,
				target: elem.targetId,
				anchors: elem.anchors,
				 editable: true,
				 connector: [ "Flowchart" ],
				endpointStyles:[ 
				{ strokeStyle: "#B7B7B7",
	             fillStyle: "transparent" },
				{ fillStyle:"#B7B7B7" }
				],
				paintStyle:{ lineWidth: 1,
	            strokeStyle: "#B7B7B7",
	            joinstyle: "round",
	            outlineColor: "white",
	            outlineWidth: 2
	           },
				hoverPaintStyle: {
	            lineWidth: 1,
	            strokeStyle: "#216477",
	            outlineWidth: 2,
	            outlineColor: "white"
	        },
			 connectorPaintStyle: {
	            endpoint: "Dot",
	            paintStyle: {
	                strokeStyle: "#B7B7B7",
	                fillStyle: "transparent",
	                radius: 5,
	                lineWidth: 3
	            },
	        },
	  
	        
	    
			});
			 var i=0;
			// console.log(posArray[i]);
			 
			repositionElement(elem.connectionId,posArray[i]['x'],posArray[i]['y']);
			i++;
		});
		
		numberOfElements = flowChart.numberOfElements;
	}
	instance.setSuspendDrawing(false, true);
}
function repositionElement(id, posX, posY){
	var instance=window.instance;
	//instance.repaint(id);
	//alert(posX);
	//console.log(pipeArray.indexOf(selectedPipeId))
	//if (pipeArray.indexOf(selectedPipeId) !== -1) {
	$('#'+id).css('left', posX);
	$('#'+id).css('top', posY);
	instance.repaint(id);
//	}
	
	//console.log(pipeArray);
	
}
function uniqueTowns(towns){
	var arrTowns = towns.split(",");
	var arrNewTowns = [];
	var seenTowns = {};
	for(var i=0;i<arrTowns.length;i++) {
	if (!seenTowns[arrTowns[i]]) {
	seenTowns[arrTowns[i]]=true;
	arrNewTowns.push(arrTowns[i]);
	}
	}
	return arrNewTowns.join(",");
	}
});
$('#pipeGraph').bind('beforeunload',function(){

    //save info somewhere
   
   return 'are you sure you want to leave?';

});
