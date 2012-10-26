'use strict';
/* Controllers */

function appCtrl($scope)
{

	var session = new ask.session(relogin);
	function relogin() {
		//window.location = "login.html";
	}
	
	webpaige = new webpaige();
	
	$scope.username = 'Cengiz Ulusoy';
		
}
appCtrl.$inject = ['$scope'];