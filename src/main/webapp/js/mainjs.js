google.setOnLoadCallback(function() {
	angular.bootstrap(document.body, [ 'userApp' ]);
});
google.load('visualization', '1', {
	packages : [ 'corechart' ]
});

var userApp = angular.module("userApp", [ "ngRoute", 'tableSort',
		'ui.bootstrap', "googlechart",  'angularFileUpload',
		'scrollable-table' ]).run(function($rootScope, $location) {
		    $rootScope.location = $location;
});
var proj_prefix = '/iTech/';  
userApp.config(function($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true).hashPrefix('!#');
	$routeProvider.when('/', {
		templateUrl : proj_prefix+'views/login.html'
	}).when('/Topics/', {
		templateUrl : proj_prefix+'views/topics.html',
		activetab : 'dataSchema'
	}).when('/Devices/', {
		templateUrl : proj_prefix+'views/devices.html',
		// controller : 'userApp.DatapipeWorkbench',
		activetab : 'DatapipeWorkbench'
	}).when('/Menu3/', {
		templateUrl : proj_prefix+'views/workinprogress.html',
		activetab : 'DatapipeWorkbench'
	}).when('/workinprogress/', {
		templateUrl : proj_prefix+'views/workinprogress.html',
		reloadOnSearch : false,
		activetab : 'dataSchema'
	}).otherwise({
		redirectTo : '/'
	});

});






