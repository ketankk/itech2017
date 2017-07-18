/*
filedrag.js - HTML5 File Drag & Drop demonstration
Featured on SitePoint.com
Developed by Craig Buckler (@craigbuckler) of OptimalWorks.net
*/
(function() {

	// getElementById
	function $id(id) {
		return document.getElementById(id);
	}


	// output information
	function Output(msg) {
		var m = $("#messages");
		var preMsg = $("#messages").html();
		$("#messages").html(msg + preMsg);
	}


	// file drag hover
	function FileDragHover(e) {
		e.stopPropagation();
		e.preventDefault();
		e.target.className = (e.type == "dragover" ? "hover" : "");
	}


	// file selection
	function FileSelectHandler(e) {

		// cancel event and hover styling
		FileDragHover(e);

		// fetch FileList object$.event.props.push('dataTransfer');


		var files = e.target.files || e.originalEvent.dataTransfer.files;

		// process all File objects
		for (var i = 0, f; f = files[i]; i++) {
			ParseFile(f);
		}

	}


	// output file information
	function ParseFile(file) {
	console.log(file);
		Output(
			"<p>File information: <strong>" + file.name +
			"</strong> type: <strong>" + file.type +
			"</strong> size: <strong>" + file.size +
			"</strong> bytes</p>"
		);
		//alert(file.type);
		// display an image
		if (file.type.indexOf("image") == 0) {
			var reader = new FileReader();
			reader.onload = function(e) {
				Output(
					"<p><strong>" + file.name + ":</strong><br />" +
					'<img src="' + e.target.result + '" /></p>'
				);
			}
			reader.readAsDataURL(file);
		}

		// display text
		else if (file.type.indexOf("text") == 0 || file.type.indexOf("javascript") != -1) {
			var reader = new FileReader();
			reader.onload = function(e) {
				Output(
					"<p><strong>" + file.name + ":</strong></p><pre>" +
					e.target.result.replace(/</g, "&lt;").replace(/>/g, "&gt;") +
					"</pre>"
				);
			}
			reader.readAsText(file);
		}
		else if (file.type.indexOf("application") == 0) {
			var reader = new FileReader();
			reader.onload = function(e) {
				Output(
					"<p><strong>" + file.name + ":</strong></p><pre>" +
					e.target.result.replace(/</g, "&lt;").replace(/>/g, "&gt;") +
					"</pre>"
				);
			}
			reader.readAsText(file);
		}

	}


	// initialize
	function Init() {

		var fileselect = $("#fileselect"),
			filedrag = $("#filedrag"),
			submitbutton = $("#submitbutton");

		// file select
		$( "#fileselect" ).bind( "change", function( event ) {
			FileSelectHandler(event);
		});
	//	fileselect.addEventListener("change", FileSelectHandler, false);
		
		
		// is XHR2 available?
		var xhr = new XMLHttpRequest();
		if (xhr.upload) {
			$( "#filedrag" ).bind( "dragover", function( event ) {
				FileDragHover(event);
			});
			$( "#filedrag" ).bind( "dragleave", function( event ) {
				FileDragHover(event);
			});
			$( "#filedrag" ).bind( "drop", function( event ) {
				FileSelectHandler(event);
			});
			// file drop
			//$("#filedrag").addEventListener("dragover", FileDragHover, false);
		//	$("#filedrag").addEventListener("dragleave", FileDragHover, false);
			//$("#filedrag").addEventListener("drop", FileSelectHandler, false);
			$("#filedrag").show();

			// remove submit button
			$("#submitbutton").hide();
		}

	}

	// call initialization file
	if (window.File && window.FileList && window.FileReader) {
		Init();
	}


})();