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

function loginCtrl()
{
}
loginCtrl.$inject = [];


function dashboardCtrl()
{
}
dashboardCtrl.$inject = [];


function messagesCtrl()
{
}
messagesCtrl.$inject = [];


function groupsCtrl()
{
}
groupsCtrl.$inject = [];


function profileCtrl()
{
}
profileCtrl.$inject = [];


function settingsCtrl()
{
}
settingsCtrl.$inject = [];


function forgotPassCtrl()
{
}
forgotPassCtrl.$inject = [];


function changePassCtrl()
{
}
changePassCtrl.$inject = [];
