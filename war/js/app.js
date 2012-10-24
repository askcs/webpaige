'use strict';


// Declare app level module which depends on filters, and services

angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider',function($routeProvider)
  {
  
    $routeProvider.when('/login', 			{templateUrl: 'partials/login.html', 				Ctrl: loginCtrl});
    $routeProvider.when('/dashboard', 	{templateUrl: 'partials/dashboard.html', 		Ctrl: dashboardCtrl});
    $routeProvider.when('/messages', 		{templateUrl: 'partials/messages.html', 		Ctrl: messagesCtrl});
    $routeProvider.when('/groups', 			{templateUrl: 'partials/groups.html', 			Ctrl: groupsCtrl});
    $routeProvider.when('/profile', 		{templateUrl: 'partials/profile.html', 			Ctrl: profileCtrl});
    $routeProvider.when('/settings', 		{templateUrl: 'partials/settings.html', 		Ctrl: settingsCtrl});
    $routeProvider.when('/forgot_pass', {templateUrl: 'partials/forgot_pass.html', 	Ctrl: forgotPassCtrl});
    $routeProvider.when('/change_pass', {templateUrl: 'partials/change_pass.html', 	Ctrl: changePassCtrl});
    
    $routeProvider.otherwise({redirectTo: '/login'});
  }]);
