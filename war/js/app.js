'use strict';

// Declare app level module which depends on filters, and services
angular.module('webPaige', ['webPaige.filters', 'webPaige.services', 'webPaige.directives']).
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

  //$scope.app.settings = window.app.settings;
  //$scope.ui = ui[$scope.app.settings.lang];

  $scope.ui = ui.nl;

  console.log('print me', app.settings)

  $scope.setLang = function(language)
  {
    $scope.ui = ui[language];
  }


  $scope.checkSession = function()
  {
    if(this.sessionId == null)
    {
      var values;
      var pairs = document.cookie.split(";");

      for(var i=0; i<pairs.length; i++)
      {
        values = pairs[i].split("=");

        if(values[0].trim() == "ask-session")
        {
          var session       = JSON.parse(values[1]);
          this.sessionId    = session.id;
          this.sessionTime  = session.time;
          break;
        }
      }
    }

    if(this.sessionId == null)
      return false;

    var time  = new Date();
    var now   = time.getTime();

    if( (now-this.sessionTime) > (60 * 60 * 1000) )
    {   
      return false;
    }
    return true;
  }
  
  $scope.getSession = function()
  {
    $scope.checkSession();
    $scope.setSession(this.sessionId);
    return this.sessionId;
  }

  $scope.setSession = function(sessionId)
  {      
    var time          = new Date();
    this.sessionId    = sessionId;
    this.sessionTime  = time.getTime();
    var session       = new Object();
    session.id        = this.sessionId;
    session.time      = this.sessionTime;
    document.cookie   = "ask-session=" + JSON.stringify(session);
  }

  $scope.clearSession = function()
  {
    this.sessionId    = null;
    this.sessionTime  = null;
    document.cookie   = "ask-session=''; expires=Thu, 01-Jan-1970 00:00:01 GMT";
  }


}
app.$inject = ['$scope'];