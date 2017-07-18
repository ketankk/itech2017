userApp.service('uploadsService', function($http, $rootScope) {

	var code = '';
	var fileName = '';

	this.uploadFile = function(files, mapclass, reducer,dataSetName,stageName) {

		var fd = new FormData();

		// Take the first selected file
		fd.append("file", files[0]);
		fd.append("mapper", mapclass);
		fd.append("reducer", reducer);
		fd.append("dataSetName", dataSetName);
		fd.append("stageName", stageName);
		var promise = $http.post('rest/service/uploadAndTestRun/', fd, {
			withCredentials : true,
			headers : {
				'X-Auth-Token' : localStorage.getItem('itc.authToken'),
				'Content-Type' : undefined,
				'Cache-Control':"no-cache"

			},

			transformRequest : angular.identity
		}).then(function(response) {

			code = response.data.code;
			fileName = response.data.fileName;

			return {
				code : function() {
					return code;
				},
				fileName : function() {
					return fileName;
				},
				response : response,
			};
		});
		return promise;
	};

});
userApp.filter('orderObjectBy', function() {
	return function(items, field, reverse) {
		var filtered = [];
		angular.forEach(items, function(item) {
			filtered.push(item);
		});
		filtered.sort(function(a, b) {
			if (a[field] > b[field])
				return 1;
			if (a[field] < b[field])
				return -1;
			return 0;
		});
		if (reverse)
			filtered.reverse();
		return filtered;
	};
});
userApp.service('modalService', [ '$modal', function($modal) {

	var modalDefaults = {
		backdrop : true,
		keyboard : true,
		modalFade : true,
		templateUrl : '/app/partials/modal.html'
	};

	var modalOptions = {
		closeButtonText : 'Close',
		actionButtonText : 'OK',
		headerText : 'Proceed?',
		bodyText : 'Perform this action?'
	};

	this.showModal = function(customModalDefaults, customModalOptions) {
		if (!customModalDefaults)
			customModalDefaults = {};
		customModalDefaults.backdrop = 'static';
		return this.show(customModalDefaults, customModalOptions);
	};

	this.show = function(customModalDefaults, customModalOptions) {
		// Create temp objects to work with since we're in a singleton service
		var tempModalDefaults = {};
		var tempModalOptions = {};

		// Map angular-ui modal custom defaults to modal defaults defined in
		// service
		angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

		// Map modal.html $scope custom properties to defaults defined in
		// service
		angular.extend(tempModalOptions, modalOptions, customModalOptions);

		if (!tempModalDefaults.controller) {
			tempModalDefaults.controller = function($scope, $modalInstance) {
				$scope.modalOptions = tempModalOptions;
				$scope.modalOptions.ok = function(result) {
					$modalInstance.close(result);
				};
				$scope.modalOptions.close = function(result) {
					$modalInstance.dismiss('cancel');
				};
			}
		}

		return $modal.open(tempModalDefaults).result;
	};

} ]);