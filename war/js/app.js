'use strict';

// Declare app level module which depends on filters, and services
angular.module('webPaige', 
  ['webPaige.filters', 'webPaige.services', 'webPaige.directives']).
  config(['$routeProvider',function($routeProvider)
  {
    $routeProvider.when( '/login',        {templateUrl: 'views/login.html',       Ctrl: login} );
    $routeProvider.when( '/logout',       {templateUrl: 'views/logout.html',      Ctrl: logout} );
    $routeProvider.when( '/preloader',    {templateUrl: 'views/preloader.html',   Ctrl: preloader} );
    $routeProvider.when( '/dashboard', 	  {templateUrl: 'views/dashboard.html', 	Ctrl: dashboard} );
    $routeProvider.when( '/messages',     {templateUrl: 'views/messages.html', 	  Ctrl: messages} );
    $routeProvider.when( '/groups',       {templateUrl: 'views/groups.html',      Ctrl: groups} );
    $routeProvider.when( '/profile',      {templateUrl: 'views/profile.html',     Ctrl: profile} );
    $routeProvider.when( '/settings',     {templateUrl: 'views/settings.html',    Ctrl: settings} );
    
    $routeProvider.otherwise( {redirectTo: '/login'} );
  }]);


// App controller
var app = function($scope)
{
  // TODO
  // display only after logging in
  $scope.username = ' Cengiz ';
  //

  $scope.config = config;
  $scope.ui = ui[$scope.config.lang];

  $scope.setLang = function(language)
  {
    $scope.ui = ui[language];
  }


  $scope.checkSession = function()
  {
    if($scope.sessionId == null)
    {
      var values;
      var pairs = document.cookie.split(";");

      for(var i=0; i<pairs.length; i++)
      {
        values = pairs[i].split("=");

        if(values[0].trim() == "ask")
        {
          var session         = JSON.parse(values[1]);
          $scope.sessionId    = session.id;
          $scope.sessionTime  = session.time;
          break;
        }
      }
    }

    if($scope.sessionId == null)
      return false;

    var time  = new Date();
    var now   = time.getTime();

    if( (now - $scope.sessionTime) > (60 * 60 * 1000) )
    {   
      return false;
    }
    return true;
  }
  
  $scope.getSession = function()
  {
    $scope.checkSession();
    $scope.setSession($scope.sessionId);
    return $scope.sessionId;
  }

  $scope.setSession = function(sessionId)
  {      
    var time            = new Date();
    $scope.sessionId    = sessionId;
    $scope.sessionTime  = time.getTime();
    var session         = new Object();
    session.id          = $scope.sessionId;
    session.time        = $scope.sessionTime;
    document.cookie     = "ask=" + JSON.stringify(session);
  }

  $scope.preventDeepLink = function()
  {
    if (!$scope.checkSession())
      window.location = "index.html";
  }


}

app.$inject = ['$scope'];