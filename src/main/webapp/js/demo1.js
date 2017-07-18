var i= 1;
var n = 1;
var pipeArray = new Array();
var sourceID;
var targetIDtemp;
jsPlumb.ready(function () {
	//alert('hiiiiiiiii');
	//$('#flowchart-demo').html('');
	
	
	
		$(".dragMe").draggable({
        helper: 'clone',
        cursor: 'move',
        tolerance: 'fit'
		});
		$("#flowchart-demo").droppable({
			
                drop: function (e, ui) {
				//	alert($(ui.draggable)[0].id);
                    if ($(ui.draggable)[0].id.indexOf("jsPlumb_1") !== -1) {
                    	var flowChartJson = $('#jsonOutput').val();
                    	//alert(flowChartJson);
                    	if(flowChartJson != '' && n < 2){
                    		var flowChart = JSON.parse(flowChartJson);
                    		//console.log(flowChart);
                    		var nodes = flowChart.nodes;
                    		n = nodes.length;
                    		
                    	}
                    	var currentPos = ui.helper.position();
                    	 e.stopPropagation(); 
                    	n++;
                    	//alert(n);
                        x = ui.helper.clone();
					//	x.css('position', 'absolute');
                        x.css('left', parseInt(currentPos.left)-250);
						x.css('top', parseInt(currentPos.top)-150);
						x.attr('class', 'window '+ui.helper.attr('data-nodetype'));
						x.attr('id', 'flowchartWindow'+ui.helper.attr('data-nodeid')+'pipe'+selectedPipeId+n);
						//x.attr('id', ui.helper.attr('data-nodetype'));
						//x.attr('data-nodetype', 'flowchartWindow'+selectedPipeId+i);
                    ui.helper.remove();
                    x.draggable({
                        helper: 'original',
                        containment: '#flowchart-demo',
                        tolerance: 'fit'
                    });
                    
                    x.appendTo('#flowchart-demo');
					//console.log(x);
					instance.draggable(jsPlumb.getSelector(".window"), { grid: [20, 20] });
					_addEndpoints("Window"+ui.helper.attr('data-nodeid')+'pipe'+selectedPipeId+n, ["TopCenter", "BottomCenter"]);
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
        paintStyle: { strokeStyle: "red", lineWidth: 4 },
        hoverPaintStyle: { strokeStyle: "blue" },
        overlays: [
            "Arrow"
        ]
    };
    instance.registerConnectionType("basic", basicType);
	
    // this is the paint style for the connecting lines..
    var connectorPaintStyle = {
            lineWidth: 4,
            strokeStyle: "#61B7CF",
            joinstyle: "round",
            outlineColor: "white",
            outlineWidth: 2
        },
    // .. and this is the hover style.
        connectorHoverStyle = {
            lineWidth: 4,
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
                strokeStyle: "#7AB02C",
                fillStyle: "transparent",
                radius: 5,
                lineWidth: 3
            },
            isSource:true, 
            isTarget:true,
            connector: [ "Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true } ],
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
        },
    // the definition of target endpoints (will appear when the user drags a connection)
        targetEndpoint = {
            endpoint: "Dot",
            paintStyle: { fillStyle: "#7AB02C", radius: 5 },
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
            instance.addEndpoint("flowchart" + toId, sourceEndpoint, {
                anchor: sourceAnchors[i], uuid: sourceUUID
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
        instance.draggable(jsPlumb.getSelector(".flowchart-demo .window"), { grid: [20, 20] });
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
        	//console.log(conn);
        	var sourceName = $('#'+conn.sourceId).html();
        	var targetName = $('#'+conn.targetId).html();
        	//console.log(sourcename);
            if (confirm("Delete connection from " + sourceName + " to " + targetName + "?")){
            	 instance.detach(conn);
            	 $("#saveall").trigger("click");
            }
               
            conn.toggleType("basic");
           
        });
        instance.bind("connectionDrag", function (connection) {
        	
            console.log("connection " + connection.id + " is being dragged. suspendedElement is ", connection.sourceId, " of type ", connection.targetId);
        });

        instance.bind("connectionDragStop", function (connection) {
        	console.log(connection);
        	var sourceName = $('#'+connection.sourceId).html();
        	var targetName = $('#'+connection.targetId).html();
        	//console.log(sourcename);
            console.log("connection " + connection.id + " was dragged");
            $("#saveall").trigger("click");
        });

        instance.bind("connectionMoved", function (params) {
            console.log("connection " + params.connection.id + " was moved");
        });
        

    });

    //jsPlumb.fire("jsPlumbDemoLoaded", instance);
   
$('#saveall').click(function(e) {
    saveFlowchart();
  });
 $('#loadChat').click(function(e) {
    loadFlowchart();
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
 $(document).on('click','.window',function(){
	 
	 if($(this).attr('data-nodetype') == 'Dataset'){
			// document.getElementById("prpertyTD").innerHTML='<object type="type/html" data="views/dataSet.html" ></object>';
			 	var dataSetID = $(this).attr('id');
			 	 dataSetID =  sourceID.substr(0, sourceID.indexOf('pipe'));
				dataSetID = dataSetID.replace('flowchartWindow','');
				//console.log(dataSetID);
		}
		else {//if($(this).attr('data-nodetype') == 'Column Filter')
			 targetIDtemp = $(this).attr('id');
			var flowChartJson = $('#jsonOutput').val();
			var flowChart = JSON.parse(flowChartJson);
			var connections = flowChart.connections;
			var datanodetype = $(this).attr('data-nodetype');
				$.each(connections, function( index, elem ) {
					if(elem.targetId == targetIDtemp){
						sourceID = elem.sourceId;
					}
						
				});
				
				var dataSetID =  sourceID.substr(0, sourceID.indexOf('pipe'));
				dataSetID = dataSetID.replace('flowchartWindow','');
				if(dataSetID == 'sampleid'){
					alert('Please Configure the source transformation');
					return false;
				}
				var scope = angular.element(document.getElementById("pipeGraph")).scope();
			    scope.$apply(function () {
			    	scope.editData.filterColumn = '';
			    scope.getColumnNameByTabID(dataSetID,datanodetype);
			    });
			  //  $('#prpertyTD').show();
			    //document.getElementById("prpertyTD").innerHTML='<object type="type/html" data="views/filtercol.html" ></object>';
		}
		
		 /*if(){
			 
		 }*/
		
		   
		    //other logic goes here...
		});
 $(document).on('dblclick','.window',function(){
	 if (confirm("Delete stage " + $(this).context.firstChild.data + " from flowchart?")){
	 instance.remove($(this));
	saveFlowchart();
	 }
	});
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
  function addTask(id,name,i,nodetype){
  //alert(id);
  var instance=window.instance;
	if(typeof id === "undefined"){
		numberOfElements++;
		id = "flowchartWindow"+selectedPipeId + numberOfElements;
	}
	i = id.slice(-1);
//	console.log(i);
	//$('<span class="window" id="' + id + '" data-nodetype="task" style="position: absolute;">').appendTo('#flowchart-demo').html(name);
	var  x = $('<span class="window" id="' + id + '" data-nodetype="'+nodetype+'">').text(name).appendTo($('#flowchart-demo'));
	//x = ui.helper.clone();
	//x.css('position', 'absolute');
	x.attr('class', 'window '+nodetype+'');
	x.attr('id', id);
	
	//ui.helper.remove();
	x.draggable({
	    helper: 'original',
	    containment: '#flowchart-demo',
	    tolerance: 'fit'
	});
	 x.appendTo('#flowchart-demo');
//	instance.draggable(instance.getSelector(".window"), { grid: [20, 20] });
	
	
	 
	
      //  jsPlumb.draggable($('#' + id));
        return id;
}
  
  window.instance=instance;
function saveFlowchart(){
//console.log(window.instance.getAllConnections());
        var instance=window.instance;
        if (pipeArray.indexOf(selectedPipeId) === -1) {
			pipeArray[pipeArray.length] = selectedPipeId;
		}
	var nodes = []
	$('span[id^="flowchartWindow"]').each(function (idx, elem) {
	var $elem = $(elem);
	var endpoints = instance.getEndpoints($elem.attr('id'));
//	console.log('endpoints of '+$elem.context.firstChild.data);
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
	 connections.push({
                connectionId: connection.id,
                sourceId: connection.sourceId,
                targetId: connection.targetId,
                anchors: $.map(connection.endpoints, function (endpoint) {

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
			$.each(instance.getAllConnections(), function (idx, connection) {
					stageList.push({
						stageName: connection.source.textContent,
		                output: connection.target.textContent,
		                input:'',
		               
		            });
					if(k > 0){
						for(j=k;j>=0;j--){
							if(stageList[j].output == stageList[k].stageName){
								if(stageList[k].input  != ''){
									if (stageList[k].input.indexOf(stageList[j].stageName) === -1)
									 stageList[k].input +=',' +stageList[j].stageName;
								}
								else{
									stageList[k].input = stageList[j].stageName;
								}
								
								//delete sourcedestDetails['stages'][i];
							}
						}
					}
					
					k++;
					
		        });
			if(k>0){
				stageList.push({
					stageName: stageList[stageList.length - 1].output,
	                output: '',
	                input:stageList[stageList.length - 1].stageName,
	               
	            });
			}
			
			//console.log(stageList);
			//console.log(stageList[0].stageName);
			/*for(j=i;j>=0;j--){
				if(stageList[j].output == stageList[i].stageName){
					
							stageList[i].input +=',' +stageList[j].stageName;
					
					//delete sourcedestDetails[i];
				}
				 
				
			}*/
			for(i = 1;i<stageList.length;i++){
				for(j=i;j>=0;j--){
					if(stageList[j].stageName == stageList[i].stageName){
						if(stageList[j].output != stageList[i].output){
							
							if(stageList[j].output != ''){
								if(stageList[i].output != undefined)
								var stageTemp = stageList[j].output;
								//console.log(stageTemp);
								var inputTemp = stageList[j].stageName;
								//if (stageList[i].output.indexOf(stageList[i].output) === -1)
								stageList[j].output += ','+stageList[i].output;
								
							}
							else{
								if(stageList[i].output != undefined)
								stageList[j].output = stageList[i].output;
								var stageTemp = stageList[i].output;
								//console.log(stageTemp);
								var inputTemp = stageList[i].stageName;
								}
							if(stageList[j].input != ''){
								if(stageList[j].input != stageList[i].input){
									if(stageList[i].input != undefined){
										//if (stageList[j].input.indexOf(stageList[i].input) === -1)
											stageList[j].input += ','+stageList[i].input;
									}
									
								}
								
							}
							else{
								if(stageList[i].input != undefined)
								stageList[j].input = stageList[i].input;
								
							}
							
							
							stageList[i].input = inputTemp;
							stageList[i].output = '';
							stageList[i].stageName = stageTemp;
							
						} 
						
					}
					if(stageList[j].output == stageList[i].stageName){
						if(stageList[j].stageName != stageList[i].input){
							//if (stageList[i].input.indexOf(stageList[j].stageName) === -1)
						stageList[i].input +=',' +stageList[j].stageName;
						}
				
				//delete sourcedestDetails[i];
					}
					
				}
			}
			
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
		var scope = angular.element(document.getElementById("pipeGraph")).scope();
	    scope.$apply(function () {
	    scope.saveGraph();
	    });
		//$scope.saveGraph();
		//$scope.removeDataArr();
}

function loadFlowchart(){
	//alert('hiiiii');
	var posArray = new Array();
	$('#flowchart-demo').html('');
	//jsPlumb.fire("jsPlumbDemoLoaded", instance);
	var instance=window.instance;
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
				var id = addTask(elem.blockId,elem.name,i,elem.nodetype);
				//alert(id)
				
				repositionElement(id, elem.positionX, elem.positionY);
				posArray[i] = new Array();
				posArray[i]['x'] = elem.positionX;
				posArray[i]['y'] = elem.positionY;
				var j = id.slice(-1);
				var tempID = id.replace('flowchartWindow','');
				//alert(tempID);
				_addEndpoints("Window"+tempID, ["TopCenter", "BottomCenter"]);	
				instance.draggable(instance.getSelector(".window"), { grid: [20, 20] });
			i++;
		});
		
								
		var connections = flowChart.connections;
		$.each(connections, function( index, elem ) {
			 var connection = instance.connect({
				source: elem.sourceId,
				target: elem.targetId,
				anchors: elem.anchors
				, editable: false,
				 connector: [ "Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true } ],
				endpointStyles:[ 
				{ strokeStyle: "#7AB02C",
	             fillStyle: "transparent" },
				{ fillStyle:"#7AB02C" }
				],
				paintStyle:{ lineWidth: 4,
	            strokeStyle: "#61B7CF",
	            joinstyle: "round",
	            outlineColor: "white",
	            outlineWidth: 2
	           },
				hoverPaintStyle: {
	            lineWidth: 4,
	            strokeStyle: "#216477",
	            outlineWidth: 2,
	            outlineColor: "white"
	        },
			 connectorPaintStyle: {
	            endpoint: "Dot",
	            paintStyle: {
	                strokeStyle: "#7AB02C",
	                fillStyle: "transparent",
	                radius: 5,
	                lineWidth: 3
	            },
	        },
	  
	        
	    
			});
			 var i=0;
			// console.log(posArray[i]);
			//repositionElement(elem.connectionId,posArray[i]['x'],posArray[i]['y']);
			i++;
		});
		
		numberOfElements = flowChart.numberOfElements;
	}
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

});
