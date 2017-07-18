selectedPipeId = '';
selectedversion = '';
//selectColumn = false;
var chartDataModel = {};
// this.data = [];
//
// Code for the delete key.
//
var deleteKeyCode = 46;  

//
// Code for control key.
//
var ctrlKeyCode = 65;

//
// Set to true when the ctrl key is down.
//
var ctrlDown = false;

//
// Code for A key.
//
var aKeyCode = 17;

//
// Code for esc key.
//
var escKeyCode = 27;
//
// Selects the next node id.
//
var nextNodeID = 10;

//
var datapreview = new Array();
var newSchemaName;
var backbutton ;
if (prevMenu == undefined) {
	var prevMenu = 'one';
}
var prevClass = '';

var headerObj = {'X-Auth-Token' : localStorage.getItem('itc.authToken'), 'Cache-Control':"no-cache"}; 
//console.log('headerObj');
//console.log(headerObj);


function changeMClass(menuID) {
	//alert(prevMenu);
	//alert(menuID)
	// $('#'+menuID).addClass($('#'+menuID).attr('class')+"selected");
	/*if (prevMenu != undefined) {
		if ($('#' + prevMenu)) {
			prevClass = $('#' + prevMenu).attr('class')
			// alert(prevClass);
			if (prevClass) {
				var newprevClass = prevClass.replace('active', '');
				// alert(newprevClass);
				$('#' + prevMenu).removeClass(prevClass).addClass(newprevClass);
			}

		}

	}
*/
	var newMenuClass = $('#' + menuID).attr('class');
	if (newMenuClass != undefined) {
		var newMenuClass1 = newMenuClass.replace('active', '');
		// alert(newMenuClass1);
		$('#' + menuID).removeClass(newMenuClass).addClass(
				newMenuClass1 + " active");
	}

	prevMenu = menuID;
}

(function( $ ) {
	$.widget( "custom.combobox", {
		_create: function() {
			this.wrapper = $( "<span>" )
				.addClass( "custom-combobox" )
				.insertAfter( this.element );

			this.element.hide();
			this._createAutocomplete();
			this._createShowAllButton();
		},

		_createAutocomplete: function() {
			var selected = this.element.children( ":selected" ),
				value = selected.val() ? selected.text() : "";

			this.input = $( "<input>" )
				.appendTo( this.wrapper )
				.val( value )
				.attr( "title", "" )
				.addClass( "custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left" )
				.autocomplete({
					delay: 0,
					minLength: 0,
					source: $.proxy( this, "_source" )
				})
				.tooltip({
					tooltipClass: "ui-state-highlight"
				});

			this._on( this.input, {
				autocompleteselect: function( event, ui ) {
					ui.item.option.selected = true;
					this._trigger( "select", event, {
						item: ui.item.option
					});
				},

				autocompletechange: "_removeIfInvalid"
			});
		},

		_createShowAllButton: function() {
			var input = this.input,
				wasOpen = false;

			$( "<a>" )
				.attr( "tabIndex", -1 )
				.attr( "title", "Show All Items" )
				.tooltip()
				.appendTo( this.wrapper )
				.button({
					icons: {
						primary: "ui-icon-triangle-1-s"
					},
					text: false
				})
				.removeClass( "ui-corner-all" )
				.addClass( "custom-combobox-toggle ui-corner-right" )
				.mousedown(function() {
					wasOpen = input.autocomplete( "widget" ).is( ":visible" );
				})
				.click(function() {
					input.focus();

					// Close if already visible
					if ( wasOpen ) {
						return;
					}

					// Pass empty string as value to search for, displaying all results
					input.autocomplete( "search", "" );
				});
		},

		_source: function( request, response ) {
			var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
			response( this.element.children( "option" ).map(function() {
				var text = $( this ).text();
				if ( this.value && ( !request.term || matcher.test(text) ) )
					return {
						label: text,
						value: text,
						option: this
					};
			}) );
		},

		_removeIfInvalid: function( event, ui ) {

			// Selected an item, nothing to do
			if ( ui.item ) {
				return;
			}

			// Search for a match (case-insensitive)
			var value = this.input.val(),
				valueLowerCase = value.toLowerCase(),
				valid = false;
			this.element.children( "option" ).each(function() {
				if ( $( this ).text().toLowerCase() === valueLowerCase ) {
					this.selected = valid = true;
					return false;
				}
			});

			// Found a match, nothing to do
			if ( valid ) {
				return;
			}

			// Remove invalid value
			this.input
				.val( "" )
				.attr( "title", value + " didn't match any item" )
				.tooltip( "open" );
			this.element.val( "" );
			this._delay(function() {
				this.input.tooltip( "close" ).attr( "title", "" );
			}, 2500 );
			this.input.autocomplete( "instance" ).term = "";
		},

		_destroy: function() {
			this.wrapper.remove();
			this.element.show();
		}
	});
})( jQuery );

$(function() {
	$( "#combobox" ).combobox();
	$( "#toggle" ).click(function() {
		$( "#combobox" ).toggle();
	});
});

function iconHover(element, source) {
    element.setAttribute('src', 'images/'+source);
}

function iconUnHover(element, source) {
   element.setAttribute('src', 'images/'+source);
}
