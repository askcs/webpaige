'use strict';


// Declare app level module which depends on filters, and services

angular.module('webPaige', ['webPaige.filters', 'webPaige.services', 'webPaige.directives']).
  config(['$routeProvider',function($routeProvider)
  {
  
    $routeProvider.when('/login', 			{templateUrl: 'js/views/login.html', 				Ctrl: login});
    $routeProvider.when('/dashboard', 	{templateUrl: 'js/views/dashboard.html', 		Ctrl: dashboard});
    $routeProvider.when('/messages', 		{templateUrl: 'js/views/messages.html', 		Ctrl: messages});
    $routeProvider.when('/groups', 			{templateUrl: 'js/views/groups.html', 			Ctrl: groups});
    $routeProvider.when('/profile', 		{templateUrl: 'js/views/profile.html', 			Ctrl: profile});
    $routeProvider.when('/settings', 		{templateUrl: 'js/views/settings.html', 		Ctrl: settings});
    $routeProvider.when('/forgot_pass', {templateUrl: 'js/views/forgot_pass.html', 	Ctrl: forgotPass});
    $routeProvider.when('/change_pass', {templateUrl: 'js/views/change_pass.html', 	Ctrl: changePass});
    
    $routeProvider.otherwise({redirectTo: '/login'});
  }]);



// App controller

function app($scope)
{

	var session = new ask.session(relogin);
	function relogin() {
		//window.location = "login.html";
	}
	
	webpaige = new webpaige();
	
	$scope.username = ' Cengiz ';
		
}
app.$inject = ['$scope'];