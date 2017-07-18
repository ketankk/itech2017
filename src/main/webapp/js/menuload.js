var menu;

// PushMenu._reset();
			//PLEASE CLEAR LOGS BEFORE MOVING OUT OF DEVELOPMENT . if thats gonna happen. -Z
			//Attempting to make the menu dynamic. hotfix for now.. will revamp this later.  -Zee 
			$(document).ready(function() {
				
				//The menu code is injected by angular .. so the code to bind the menu wrapper with the pushing mechanism is to be delayed a bit.. instead we check every 100ms untill the element is in the DOM.. 
				var checkExist = setInterval(function() {
					// console.log('waiting for menu');
					if ($('#mp-menu').length && !$('#mp-menu').parents().hasClass( "ng-hide" ) ) {
						// console.log("menu can now be bound!");
						if(menu==null){
							menu=new PushMenu( document.getElementById( 'mp-menu' ),
							{	
								closeOnClick:true,
								openOnPageLoad:true
							}
							);

							//console.log('menu is ready. clearing menu detection stage.');
							clearInterval(checkExist);
						}/*else{
							clearInterval(checkExist);
						//	console.log('menu is already up. clearing menu detection stage.');
						}*/
						
					}
				}, 100); // check every 100ms
				
				/*if(document.getElementById("leftmenuDiv")){
					var scope = angular.element(document.getElementById("leftmenuDiv")).scope();
					//console.log(scope);
				   // scope.$apply(function () {
				    	//scope.editData.filterColumn = '';
				    	scope.callSubMenu();
				//   });
					
				}*/
				
				/*$.getJSON( "data/menu.json", function( data ) {
					  var items = [];
					  
					  	$.each( data.menu, function( key,val ) {
							// console.log(key);
							// $( "#menu-top-level" ).append( "<li id="+key+"><a class='icon icon-"+val.icon+"' href='"+val.link+"'>"+key+"</a></li>" );
							// if(val.submenu===undefined){
							// 	$( "#menu-top-level" ).append("</li>");
							// }
							if(val.submenu!==undefined){
								
								// $( "#"+key ).append("<div class='mp-level' data-level='2'><h2 class='icon icon-news'>"+val.desc+"</h2><ul id="+key+"></ul></div>");
								$.each( val.submenu, function( k, v ) {
							    items.push( "<li><a  class=\"icon icon-"+v.icon+"\" href='" + v.link + "'>" + k + "</a></li>" );
							  }	);
								 
							}
							$( "#"+key+"-submenu" ).append( items );
							items=[];
						  });
				});*/

			});
			
			
			