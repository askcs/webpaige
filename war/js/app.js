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

  //


// App controller
var app = function($scope)
{
  // TODO
  // display only after logging in
  $scope.username = ' Cengiz '; 
  

  $scope.config = config;
  $scope.ui = ui[$scope.config.lang];

  $scope.setLang = function(language)
  {
    $scope.ui = ui[language];

    jQuery.extend(
      jQuery.validator, 
      {
        messages: {
          required: $scope.ui.error.required,
          remote: $scope.ui.error.remote,
          email: $scope.ui.error.email,
          url: $scope.ui.error.url,
          date: $scope.ui.error.date,
          dateISO: $scope.ui.error.dateISO,
          number: $scope.ui.error.number,
          digits: $scope.ui.error.digits,
          creditcard: $scope.ui.error.creditcard,
          equalTo: $scope.ui.error.equalTo,
          accept: $scope.ui.error.accept,
          maxlength: jQuery.validator.format( $scope.ui.error.maxlength ),
          minlength: jQuery.validator.format( $scope.ui.error.minlength ),
          rangelength: jQuery.validator.format( $scope.ui.error.rangelength ),
          range: jQuery.validator.format( $scope.ui.error.range ),
          max: jQuery.validator.format( $scope.ui.error.max ),
          min: jQuery.validator.format( $scope.ui.error.min )        
        }
      }
    )
  }





  $scope.ajaxErrorHandler = function(jqXHR, exception, options)
  {
    // TODO
    // expand error handling
    switch (jqXHR.status)
    {
      case 0:
        console.log($scope.ui.error.ajax.noConnection)
      break;
      case 400:
        console.log('Bad request!')
      break;
      case 404:
        console.log('Requested page not found!')
      break;
      case 500:
        console.log('Internal server error')
      break;
      default:
        switch (exception)
        {
          case 'parser error':
            console.log('Requested JSON parse failed')
          break;
          case 'timeout':
            console.log('Timeout error!')
          break;
          case 'abort':
            console.log('Ajax request aborted.')
          break;
          default:
            console.log('Uncaught Error. ' + jqXHR.responseText)
        }
    }
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