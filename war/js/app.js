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

  

  window.app.calls = {};
  
  

  $('.notifications').addClass( config.notifier.position );
  jQuery.validator.setDefaults(
  {
    errorClass: config.validator.errorClass,
    validClass: config.validator.validClass,
    errorElement: config.validator.errorElement,
    focusInvalid: config.validator.focusInvalid,
    errorContainer: $( config.validator.errorContainer ),
    errorLabelContainer: $( config.validator.errorLabelContainer ),
    onsubmit: config.validator.onsubmit,
    ignore: config.validator.ignore,
    ignoreTitle: config.validator.ignoreTitle,
  })

  jQuery.fn.notify.defaults = {
    type: config.notifier.type,
    closable: config.notifier.closable,
    transition: config.notifier.transition,
    fadeOut: {
      enabled: config.notifier.fadeOut.enabled,
      delay: config.notifier.fadeOut.delay
    },
    message: config.notifier.message,
    onClose: function () 
    {
    },
    onClosed: function () 
    {      
    }
  }

  //$scope.config = config;
  $scope.ui = ui[config.lang];

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
    switch (jqXHR.status)
    {
      case 0:
        $scope.notify( { message: $scope.ui.error.ajax.noConnection } )
      break;
      case 400:
        $scope.notify( { message: $scope.ui.error.ajax.badRequest } )
      break;
      case 404:
        $scope.notify( { message: $scope.ui.error.ajax.notFound } )
      break;
      case 500:
        $scope.notify( { message: $scope.ui.error.ajax.serverError } )
      break;
      default:
        switch (exception)
        {
          case 'parser error':
            $scope.notify( { message: $scope.ui.error.ajax.parserError } )
          break;
          case 'timeout':
            $scope.notify( { message: $scope.ui.error.ajax.timeout } )
          break;
          case 'abort':
            $scope.notify( { message: $scope.ui.error.ajax.abort } )
          break;
          default:
            $scope.notify( { message: $scope.ui.error.ajax.uncaughtError + jqXHR.responseText } )
        }
    }
  }






  $scope.notify = function(options)
  {
    $('.notifications').notify(options).show()
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





















  $scope.fetchDependencies = function()
  {

    $('#preloader span')
      .text('Loading user information..');

    $.ajax(
    {
      url: host + '/resources',
    })
    .success(
    function(user)
    {
      window.app.resources = user;

      localStorage.setItem('resources', JSON.stringify(user));

      $('#preloader .progress .bar')
        .css({
          width: '20%'
      })

      window.app.calls.resources = true;

    }).fail(function()
    {
      window.app.calls.resources = false;
    })
    
  }



  $scope.fetchGroups = function()
  {
    
  }




  $scope.fetchTimelines = function()
  {
    
  }



  $scope.fetchMessages = function()
  {
    
  }






}

app.$inject = ['$scope'];