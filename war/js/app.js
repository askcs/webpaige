'use strict';

// Declare app level module which depends on filters, and services
angular.module('webPaige', ['webPaige.filters', 'webPaige.services', 'webPaige.directives']).
  config(['$routeProvider',function($routeProvider)
  {
    $routeProvider.when( '/dashboard', 	{templateUrl: 'js/views/dashboard.html', 		Ctrl: dashboard} );
    $routeProvider.when( '/messages', 		{templateUrl: 'js/views/messages.html', 	Ctrl: messages} );
    $routeProvider.when( '/groups', 			{templateUrl: 'js/views/groups.html', 		Ctrl: groups} );
    $routeProvider.when( '/profile', 		{templateUrl: 'js/views/profile.html', 			Ctrl: profile} );
    $routeProvider.when( '/settings', 		{templateUrl: 'js/views/settings.html', 	Ctrl: settings} );
    
    $routeProvider.otherwise( {redirectTo: '/dashboard'} );
  }]);

// App controller
function app($scope)
{
	$scope.username = ' Cengiz ';

	var session = new ask.session(relogin);
	
	// TODO //
	function relogin()
	{
		window.location = "login.html";
	}
	
	//webpaige = new webpaige();
		
}
app.$inject = ['$scope'];