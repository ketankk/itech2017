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
	}).when('/DataSchema/', {
		templateUrl : proj_prefix+'views/dataschema.html',
		activetab : 'dataSchema'
	}).when('/DataSchemaPreview/', {
		templateUrl : proj_prefix+'views/schemapreview.html',
		activetab : 'dataSchema'
	}).when('/ValidationRule/', {
		templateUrl : proj_prefix+'views/validationtable.html',
		reloadOnSearch : false,
		activetab : 'dataSchema'
	}).when('/workintrainprogress/', {
		templateUrl : proj_prefix+'views/workinprogress.html',
		reloadOnSearch : false,
		activetab : 'dataSchema'
	}).when('/workinprogress/', {
		templateUrl : proj_prefix+'views/workinprogress.html',
		reloadOnSearch : false,
		activetab : 'dataSchema'
	}).when('/dataLiniage/', {
		templateUrl : proj_prefix+'views/dataliniage.html',
		reloadOnSearch : false,
		activetab : 'dataSchema'
	}).when('/IngestionSummary/', {
		templateUrl : proj_prefix+'views/ingestionsummary.html',
		activetab : 'dataSchema'
	}).when('/Streaming/', {
		templateUrl : proj_prefix+'views/streaming.html',
		activetab : 'dataSchema'
	}).when('/userDetails/', {
		templateUrl : proj_prefix+'views/userdetails.html',
		activetab : 'admin'
	}).when('/archiveDetails/', {
		templateUrl : proj_prefix+'views/archiveddetails.html',
		activetab : 'admin'
	}).when('/project/', {
		templateUrl : proj_prefix+'views/project.html',
		// controller : 'userApp.DatapipeWorkbench',
		activetab : 'DatapipeWorkbench'
	}).when('/Dashboard/', {
		templateUrl : proj_prefix+'views/dashboard.html',
		activetab : 'Dashboard'
	}).when('/bulkIngestionPreview/', {
		templateUrl : proj_prefix+'views/bulkingestion.html',
		activetab : 'dataSchema'
	}).when('/bulkJobsPreview/', {
		templateUrl : proj_prefix+'views/bulkjobs.html',
		activetab : 'dataSchema'
	}).when('/dataLineage/', {
		templateUrl : proj_prefix+'views/DataLineage.html',
		activetab : 'dataSchema'
	}).when('/SchedularPreview/', {
		templateUrl : proj_prefix+'views/schedular.html',
		activetab : 'dataSchema'
	}).otherwise({
		redirectTo : '/'
	});

});






