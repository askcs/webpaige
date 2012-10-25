'use strict';


// Declare app level module which depends on filters, and services

angular.module('webPaige', ['webPaige.filters', 'webPaige.services', 'webPaige.directives']).
  config(['$routeProvider',function($routeProvider)
  {
  
    $routeProvider.when('/login', 			{templateUrl: 'js/views/login.html', 				Ctrl: loginCtrl});
    $routeProvider.when('/dashboard', 	{templateUrl: 'js/views/dashboard.html', 		Ctrl: dashboardCtrl});
    $routeProvider.when('/messages', 		{templateUrl: 'js/views/messages.html', 		Ctrl: messagesCtrl});
    $routeProvider.when('/groups', 			{templateUrl: 'js/views/groups.html', 			Ctrl: groupsCtrl});
    $routeProvider.when('/profile', 		{templateUrl: 'js/views/profile.html', 			Ctrl: profileCtrl});
    $routeProvider.when('/settings', 		{templateUrl: 'js/views/settings.html', 		Ctrl: settingsCtrl});
    $routeProvider.when('/forgot_pass', {templateUrl: 'js/views/forgot_pass.html', 	Ctrl: forgotPassCtrl});
    $routeProvider.when('/change_pass', {templateUrl: 'js/views/change_pass.html', 	Ctrl: changePassCtrl});
    
    $routeProvider.otherwise({redirectTo: '/login'});
  }]);
