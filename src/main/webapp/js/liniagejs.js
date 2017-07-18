jsPlumb.ready(function () {
	  var instance = jsPlumb.getInstance({
	        // default drag options
	      /*  DragOptions: { cursor: 'pointer', zIndex: 2000 },*/
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
	       // jsPlumb.draggable(document.querySelectorAll(".window"), { grid: [20, 20] });
	        
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
$('#loadChat').click(function(e) {
    loadFlowchart();
  });
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

	x.attr('class', 'window '+nodetype.replace(/\ /g,'')+'');
	x.attr('id', id);
	x.attr('title', x.html());
	//ui.helper.remove();
	/*x.draggable({
	    helper: 'original',
	    containment: '#flowchart-demo',
	    tolerance: 'fit'
	});*/
//	 x.appendTo('#flowchart-demo');
//	instance.draggable(instance.getSelector(".window"), { grid: [20, 20] });
	
	
	 
	
      //  jsPlumb.draggable($('#' + id));
        return id;
}
window.instance=instance;
function loadFlowchart(){
	//alert('hiiiii');

	var posArray = new Array();
	$('#flowchart-demo').html('');
	//jsPlumb.fire("jsPlumbDemoLoaded", instance);
	var instance=window.instance;
	instance.setSuspendDrawing(true);
	//console.log(instance)
	 instance.deleteEveryEndpoint();
	var flowChartJson = $('#jsonOutput').val();
	//alert(flowChartJson);
	if(flowChartJson != '{}'){
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
				
				//instance.draggable(instance.getSelector(".window"), { grid: [20, 20] });
				if(elem.nodetype == "Dataset" || elem.nodetype == "Linear Regression" || elem.nodetype == "Binary Logistic Regression" || elem.nodetype == "MultiClass Logistic Regression")
					_addEndpoints("Window"+tempID, ["BottomCenter"]);
				else if(elem.nodetype == 'Hive')
				_addEndpoints("Window"+tempID, ["TopLeft","TopCenter","TopRight","BottomCenter"]);
				else if(elem.nodetype == "Join" || elem.nodetype == "Train" || elem.nodetype == "Test")
					_addEndpoints("Window"+tempID, ["TopLeft","TopRight","BottomCenter"]);
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
		instance.setSuspendDrawing(false, true);
	}
	else{
		alert('No Garph to display');
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