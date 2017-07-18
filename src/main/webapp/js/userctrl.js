var userDetailsCtrl = function($scope, $rootScope, $location, $http) {

	$scope.userEditAction=false;
	$scope.usernamenotok = false
	$scope.usernameOk = false
	//$("#userDName").text(localStorage.getItem('itc.dUsername'));
	showuserdetails($scope, $rootScope, $location, $http);
	$scope.grpnamenotok = false;
	$scope.grpnameOk = false;
	$scope.genders=['Male','Female'];
	
	$scope.checkedGrp=[];
	getHeader($scope,$location);
	showGroupDetails($scope, $rootScope, $location, $http);
	$scope.clearuser = function() {
		$scope.userEditAction=false;
		$scope.usernamenotok = false
		$scope.usernameOk = false
		delete $scope.edituserData;
		$scope.edituserData = new Object();
		$scope.edituserData.role = $scope.role[0];
		$scope.edituserData.gender = $scope.genders[0]; 
		$scope.checkedGrp=[];
		showGroupDetails($scope, $rootScope, $location, $http);
		//alert($scope.edituserData.userId);
	}
	$scope.chkuser = function(edituserName) {
		$scope.usernamenotok = false
		$scope.usernameOk = false
		if (edituserName == undefined){
		//	console.log("return");
			return
		}
		$scope.method = 'POST';
		$scope.url = 'rest/service/CheckUserNameAvailability/' + edituserName;
		$http({
			method : $scope.method,
			url : $scope.url,
			// cache : $templateCache
			headers : headerObj
		}).success(function(data, status) {
			if (data == 'true') {
				$scope.usernamenotok = true
				$scope.usernameOk = false
			} else {
				$scope.usernamenotok = false
				$scope.usernameOk = true
			}
		}).error(function(data, status) {
			if (status == 401) {
				$location.path('/');
			}
			$scope.data = data || "Request failed";
			$scope.status = status;
		});
	}

	$scope.getUser = function(userName,isGroup) {
		if(isGroup != undefined){
			$scope.method = 'GET';
			$scope.url = 'rest/service/usergroup/getGroup/' + userName;
			$scope.edituserData = new Object();
			// console.log(userRole);

			$http({
				method : $scope.method,
				url : $scope.url,
				// cache : $templateCache
				headers : headerObj
			}).success(function(data, status) {
				$scope.status = status;
				$scope.editgroupData = new Object();
				$scope.editgroupData.grpname = data.groupName;
				$scope.editgroupData.grpdesc = data.description;
				$scope.editgroupData.isEdit = true;
				$scope.userEditAction=true;
				//console.log("$scope.editgroupData");
			//	console.log($scope.editgroupData);
				
				//$scope.edituserData.role = $scope.edituserData.roles.rolesName;
				
				$('#groupAddMethod').modal('show');
			}).error(function(data, status) {
				if (status == 401) {
					$location.path('/');
				}
				$scope.data = data || "Request failed";
				$scope.status = status;
			});
		}
		else{
			$scope.method = 'GET';
			$scope.url = 'rest/service/usergroup/getUser/' + userName;
			$scope.edituserData = new Object();
			// console.log(userRole);

			$http({
				method : $scope.method,
				url : $scope.url,
				// cache : $templateCache
				headers : headerObj
			}).success(function(data, status) {
				$scope.status = status;
				$scope.edituserData = data;
				//console.log("$scope.edituserData");
				//console.log($scope.edituserData);
				//$scope.edituserData.role = $scope.edituserData.roles.rolesName;
				if ($scope.edituserData.name != undefined) {
					var dispName = $scope.edituserData.name;
					var dispNameArray = dispName.split(' ');
					$scope.edituserData.firstName = dispNameArray[0];
					$scope.edituserData.lastName = dispNameArray[1];
					//delete $scope.edituserData.displayName;
				}
				$scope.userEditAction=true;
				$('#userAddMethod').modal('show');
			}).error(function(data, status) {
				if (status == 401) {
					$location.path('/');
				}
				$scope.data = data || "Request failed";
				$scope.status = status;
			});
		}
		
	}
	$scope.userAddMethodBack = function(){
		$('#userAddMethod2').modal('hide');
		$('#userAddMethod').modal('show');
	}
	$scope.grpSelectCheckboxToggle = function(grpName){
		if ($scope.checkedGrp.indexOf(grpName) === -1) {
			$scope.checkedGrp.push(grpName);
			$scope.userGrpPerm[grpName].push('r');
	       } else {
	    	   $scope.checkedGrp.splice($scope.checkedGrp.indexOf(grpName), 1);
	    	   $scope.userGrpPerm[grpName]=new Array();
	    }
	}
	$scope.grpCheckboxPermToggle = function(grpName,permType){
		if (permType == "w") {
			if ($scope.userGrpPerm[grpName].indexOf('w') === -1) {
		           $scope.userGrpPerm[grpName].push('w');
		       } else {
		            $scope.userGrpPerm[grpName].splice($scope.userGrpPerm[grpName].indexOf('w'), 1);
		    }
		}
		else if (permType == "x") {
			if ($scope.userGrpPerm[grpName].indexOf('x') === -1) {
		           $scope.userGrpPerm[grpName].push('x');
		       } else {
		            $scope.userGrpPerm[grpName].splice($scope.userGrpPerm[grpName].indexOf('x'), 1);
		    }
		}
	}
	$scope.checkPermDisable = function(grpName){
		if ($scope.checkedGrp.indexOf(grpName) === -1) {
			return true
		}
		else {
			return false 
		}
	}
	$scope.checkWriteContains = function(grpName){
		if ($scope.userGrpPerm[grpName].indexOf('w') === -1){
			return false;
		}
		else{ 
			return true;
		}
	}
	$scope.checkExContains = function(grpName){
		if ($scope.userGrpPerm[grpName].indexOf('x') === -1){
			return false;
		}
		else{ 
			return true;
		}
	}
	$scope.checkGroupContains = function(grpName){
		if ($scope.checkedGrp.indexOf(grpName) === -1) {
			return false
		}
		else {
			return true;
		}
	}
	$scope.checkPermContains = function(grpName){
		if ($scope.checkedGrp.indexOf(grpName) === -1) {
			return false
		}
	}
	$scope.saveuserDetailsModal1 = function(edituserData) {
		if ($scope.userEditAction != true){
			edituserData.haveWritePermissionOnDataset=false;
			edituserData.haveExecutePermissionOnDataset=false;
			edituserData.haveWritePermissionOnProject=false;
			edituserData.haveExecutePermissionOnProject=false;
		}
		else if ($scope.userEditAction == true){
			$scope.checkedGrp=[];
			$scope.userGrpPerm={};
			$scope.tempUserGroupDetails=new Array();
			angular.forEach(edituserData.userGroupList, function(value,key){
				tempUserObj=new Object();
				tempUserObj.groupName=value.groupName;
				tempUserObj.permissionLevevl=value.permissionLevevl;
				$scope.tempUserGroupDetails.push(tempUserObj);
				$scope.checkedGrp.push(value.groupName);
				$scope.userGrpPerm[value.groupName]=new Array();
				$scope.userGrpPerm[value.groupName].push('r');
				switch(value.permissionLevevl){
					case 7: {
						$scope.userGrpPerm[value.groupName].push('w');
						$scope.userGrpPerm[value.groupName].push('x');
						break;
					}
					case 6: {
						$scope.userGrpPerm[value.groupName].push('w');
						break;
					}
					case 5: {
						$scope.userGrpPerm[value.groupName].push('x');
						break;
					}
				}
			});
			var grpFound=0;
			angular.forEach($scope.userGroupDetails,function(value1,key1){
				angular.forEach($scope.tempUserGroupDetails,function(value2,key2){
					if (value1.groupName == value2.groupName){
						grpFound=1;
					}
				});
				if (grpFound == 0){
					tempUserObj=new Object();
					tempUserObj.groupName=value1.groupName;
					tempUserObj.permissionLevevl=0;
					$scope.tempUserGroupDetails.push(tempUserObj);
					$scope.userGrpPerm[value1.groupName]=new Array();
				}
				grpFound=0;
			});
			$scope.userGroupDetails=$scope.tempUserGroupDetails;
		}
		$scope.edituserData.name = '';
		if (edituserData.firstName != undefined) {
			edituserData.name = $scope.edituserData.firstName
		}
		if (edituserData.lastName != undefined) {
			edituserData.name = edituserData.name + ' '
					+ edituserData.lastName;
		}
		$scope.edituserData.name=edituserData.name;
		if($scope.edituserData.gender == "")
			delete $scope.edituserData.gender;
		if($scope.edituserData.dateOfBirth == "")
			delete $scope.edituserData.dateOfBirth;
		if($scope.edituserData.address == "")
			delete $scope.edituserData.address;
		if($scope.edituserData.contactNumber == "" || $scope.edituserData.contactNumber == undefined)
			$scope.edituserData.contactNumber = 0;
		delete $scope.edituserData.address;
		if($scope.edituserData.lastName == "")
			delete $scope.edituserData.lastName;
		//console.log($scope.edituserData);
		$('#userAddMethod').modal('hide');
		$('#userAddMethod2').modal('show');
	}
	$scope.saveuserDetailsModal2 = function(edituserData) {
		userGroupList=[];
		angular.forEach($scope.userGrpPerm, function(value,key){
			//console.log(key);
			//console.log(value);
			if (value.length != 0){
				var tempObj = new Object();
				tempObj.groupName=key;
				permCount=0;
				angular.forEach(value,function(value2){
					switch(value2){
						case 'r': permCount+=4; break;
						case 'w': permCount+=2; break;
						case 'x': permCount+=1; break;
					}
				})
				tempObj.permissionLevevl=permCount;
				userGroupList.push(tempObj);
			}
		})
//		console.log($scope.edituserData.dateOfBirth);
		if($scope.edituserData.dateOfBirth){
			var dateArr=$scope.edituserData.dateOfBirth.split("-");
			var dob = new Date(dateArr[2],dateArr[0], dateArr[1]);
			$scope.edituserData.dateOfBirth=dob.getTime();
		}
		
		//console.log($scope.edituserData.dateOfBirth);
		$scope.edituserData.userGroupList=userGroupList;
		$scope.method = 'POST';
		if ($scope.userEditAction != true){
			$scope.url = 'rest/service/usergroup/addUser';
		}
		else if ($scope.userEditAction == true){
			$scope.url = 'rest/service/usergroup/updateUser';
		}

		$http({
			method : $scope.method,
			url : $scope.url,
			data : $scope.edituserData,

			headers : headerObj
		}).success(function(data, status) {
			//console.log("Success");
			$scope.status = status;
			showuserdetails($scope, $rootScope, $location, $http);
			$('#userAddMethod2').modal('hide');
		}).error(function(data, status) {
			if (status == 401) {
				$location.path('/');
			}
			$scope.data = data || "Request failed";
			$scope.status = status;
		});

	}
	$scope.userPermShowMethod = function(){
		$('#detailModal').modal('hide');
		$('#userPermShow').modal('show');
	}
	$scope.saveGroupDetails =  function(editgroupData){
		if (editgroupData.grpname == undefined || editgroupData.grpname == "" ){
			return
		}

		if (editgroupData.grpdesc == undefined || editgroupData.grpdesc == "" ){
			return
		}
		if (editgroupData.isEdit !== true){
			$scope.url = 'rest/service/usergroup/creategroup';
		}
		else if ($scope.userEditAction === true){
			$scope.url = 'rest/service/usergroup/updategroup/';
		}

		
			$scope.data = new Object();
			$scope.data.groupName = editgroupData.grpname
			$scope.data.description = editgroupData.grpdesc;
			$scope.method = 'POST';
			//$scope.url = 'rest/service/usergroup/creategroup/';
			$http({
				method : $scope.method,
				url : $scope.url,
				data:$scope.data,
				headers : headerObj
			}).success(function(data, status) {
				//console.log("data");
				//console.log(data);
				$scope.status = status;
				showGroupDetails($scope, $rootScope, $location, $http);
				$('#groupAddMethod').modal('hide');
			}).error(function(data, status) {
				if (status == 401) {
					$location.path('/');
				}
				$scope.data = data || "Request failed";
				$scope.status = status;
				//console.log(data);
			});
		
		
	}
	$scope.switchTabUser = function(){
		$scope.tabname="userSection";
	}
	$scope.switchTabGroup = function(){
		$scope.tabname="groupSection";
	}
	$scope.clearGroup = function() {
		$scope.grpnamenotok = false;
		$scope.grpnameOk = false;
		delete $scope.editgroupData;
		$scope.editgroupData = new Object();
	}
	$scope.chkgrp = function(editGroupName) {
		if(editGroupName == '' || editGroupName == undefined){
			return false;
		}
	//	console.log(editGroupName);
		$scope.grpnamenotok = false
		$scope.grpnameOk = false
		$scope.method = 'GET';
		$scope.url = 'rest/service/usergroup/checkgroupnameavailability/' + editGroupName;
		$http({
			method : $scope.method,
			url : $scope.url,
			headers : headerObj
		}).success(function(data, status) {
		//	console.log("success");
		//	console.log(data);
			if (data == 'true') {
				$scope.grpnamenotok = true
				$scope.grpnameOk = false
			} else {
				$scope.grpnamenotok = false
				$scope.grpnameOk = true
			}
		}).error(function(data, status) {
			if (status == 401) {
				$location.path('/');
			}
			$scope.data = data || "Request failed";
			$scope.status = status;
		});
	}
	$scope.delete1 = function() {
		//console.log("In delete1");
		objDel = $scope.DelObj;
		if ($scope.delType == 'usr'){
			$scope.method = 'GET';
			$scope.url = 'rest/service/usergroup/disableUserAccount/' + $scope.Deluser;
			$http({
				method : $scope.method,
				url : $scope.url,
				headers : headerObj
			}).success(function(data, status) {
				showuserdetails($scope, $rootScope, $location, $http);
				$('#deleteConfirmModal').modal('hide');
			}).error(function(data, status) {
				if (status == 401) {
					$location.path('/');
				}
				if (status == 403) {
					$location.path('/');
				}
				$scope.data = data || "Request failed";
				$scope.status = status;
			});
		}
		else if ($scope.delType == 'grp'){
		//	console.log("calling deleterecord..");
			currentGrp = $scope.Delgrp;

			$scope.deleteRecord(currentGrp, objDel);
		} 
	};
	$scope.restoreuser = function(userName) {
		//console.log("In delete1");
		objDel = $scope.DelObj;
		
			$scope.method = 'GET';
			$scope.url = 'rest/service/usergroup/enableUserAccount/' + userName;
			$http({
				method : $scope.method,
				url : $scope.url,
				headers : headerObj
			}).success(function(data, status) {
				showuserdetails($scope, $rootScope, $location, $http);
			}).error(function(data, status) {
				if (status == 401) {
					$location.path('/');
				}
				if (status == 403) {
					$location.path('/');
				}
				$scope.data = data || "Request failed";
				$scope.status = status;
			});
		 
	};
	$scope.showconfirm = function(id, obj, type) {
	//	console.log("In showconfirm");
		if (obj != undefined){
			if (type == 'usr'){
				//console.log(id);
			//	console.log("user");
				$scope.Deluser = id;
				$scope.delType='usr';
			}
			else if (type == 'grp'){
			//	console.log("grp");
				$scope.Delgrp = id;
				$scope.delType='grp';
			}
			$scope.DelObj = obj;
			$('#deleteConfirmModal').modal('show');
		}
	};
}