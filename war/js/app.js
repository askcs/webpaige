'use strict';


// general ajax sttings for ask back-end
$.ajaxSetup(
{
  contentType: 'application/json',
  xhrFields: { 
  	withCredentials: true
  },
  beforeSend: function(xhr)
  {
  	xhr.setRequestHeader('X-SESSION_ID', session.getSession());
  }		
})



// Declare app level module which depends on filters, and services
angular.module('webPaige', ['webPaige.filters', 'webPaige.services', 'webPaige.directives']).
  config(['$routeProvider',function($routeProvider)
  {
    $routeProvider.when( '/preloader', 	{templateUrl: 'views/preloader.html', 		Ctrl: preloader} );
    $routeProvider.when( '/dashboard', 	{templateUrl: 'views/dashboard.html', 		Ctrl: window.dashboard} );
    $routeProvider.when( '/messages', 		{templateUrl: 'views/messages.html', 	Ctrl: messages} );
    $routeProvider.when( '/groups', 			{templateUrl: 'views/groups.html', 		Ctrl: groups} );
    $routeProvider.when( '/profile', 		{templateUrl: 'views/profile.html', 			Ctrl: profile} );
    $routeProvider.when( '/settings', 		{templateUrl: 'views/settings.html', 	Ctrl: settings} );
    
    $routeProvider.otherwise( {redirectTo: '/dashboard'} );
  }]);




// App controller
function app($scope)
{

	//var user = {};
	
	$scope.username = ' Cengiz ';
	// $scope.username = window.app.resources.name;

	var session = new ask.session(relogin);
	
	// TODO //
	function relogin()
	{
		window.location = "login.html";
	}
	
	//webpaige = new webpaige();
		
}
app.$inject = ['$scope'];