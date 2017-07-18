$("#menu-toggle").click(function(e) {
	e.preventDefault();
	$("#wrapper").toggleClass("toggled");
});

$("#menu-toggle-2").click(function(e) {
	e.preventDefault();

	$("#wrapper").toggleClass("toggled-2");
	var togSrc = [ "images/leftarrow.png", "images/rightarrow.png" ];

	this.src = togSrc[this.src.match('leftarrow') ? 1 : 0];
	if (this.src.match('leftarrow')) {
		$('#menu-toggle-2').css('margin-left', '92%');
		$('#content').css('padding-left', '125px');
	} else {
		$('#menu-toggle-2').css('margin-left', '75%');
		$('#content').css('padding-left', '10px');
	}
	$('#menu ul').hide();
});

// $("#wrapper").toggleClass("toggled-2");
$("#wrapper").show();

function initMenu() {
	//$(".menu-bar").hide();
	
	$('#content').css('padding-left', '125px');
	
	var flag = true;
	
	$(".menu-button").click(function() {
		/*$('#content').css('padding-left', '235px');
		$(".menu-bar").toggleClass("subMenuOpen");
		console.log("show me");*/
	});
	
	$(".menu-button-hide").click(function() {
		if($(".menu-bar").hasClass('subMenuOpen')){
			$('#content').css('padding-left', '125px');
			$(".menu-bar").removeClass('subMenuOpen');
		  }
		
	});
	
	
	$('#menu ul').hide();
	$('#menu ul').children('.current').parent().show();
	//$('#menu ul:first').show();
	
	$('#subMenuCls').click(function(){
		
		$('#content').css('padding-left', '125px');
		$(".menu-bar").removeClass('subMenuOpen');
	});
	$('#menu li a').click(function() {
		var checkElement = $(this).next();
		if ((checkElement.is('ul')) && (checkElement.is(':visible'))) {
			return false;
		}
		if ((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
			$('#menu ul:visible').slideUp('normal');
			checkElement.slideDown('normal');
			return false;
		}
	});
}
$(document).ready(function() {
	initMenu();
	
	

});