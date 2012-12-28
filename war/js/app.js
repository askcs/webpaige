'use strict';

// Declare app level module which depends on filters, and services
angular.module('webPaige', 
  [ 'webPaige.filters', 
    'webPaige.services', 
    'webPaige.directives' ]).
  config(['$routeProvider',
  function($routeProvider)
  {
    $routeProvider.when( '/login',      {templateUrl: 'views/login.html',     Ctrl: login} );
    $routeProvider.when( '/logout',     {templateUrl: 'views/logout.html',    Ctrl: logout} );
    $routeProvider.when( '/preloader',  {templateUrl: 'views/preloader.html', Ctrl: preloader} );
    $routeProvider.when( '/dashboard', 	{templateUrl: 'views/dashboard.html', Ctrl: dashboard} );
    $routeProvider.when( '/messages',   {templateUrl: 'views/messages.html', 	Ctrl: messages} );
    $routeProvider.when( '/groups',     {templateUrl: 'views/groups.html',    Ctrl: groups} );
    $routeProvider.when( '/profile',    {templateUrl: 'views/profile.html',   Ctrl: profile} );
    $routeProvider.when( '/settings',   {templateUrl: 'views/settings.html',  Ctrl: settings} );
    
    $routeProvider.otherwise( {redirectTo: '/login'} );
  }]
)



// App controller
var app = function($scope)
{
  window.app.calls = {};

  // position notifications
  $('.notifications').addClass( config.notifier.position );
  
  // defaults for validator
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

  // defaults for notifier
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

  // set language
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
  
  // init app
  $scope.initApp = function()
  {
    $('#menu').show();
    document.location = "#/dashboard";
  }

  // ajax error handler
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

  // notifier
  $scope.notify = function(options)
  {
    $('.notifications').notify(options).show()
  }

  // check session
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
  
  // get session
  $scope.getSession = function()
  {
    $scope.checkSession();
    $scope.setSession($scope.sessionId);
    return $scope.sessionId;
  }

  // set session
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

  // deeep link preventer
  $scope.preventDeepLink = function()
  {
    if (!$scope.checkSession())
      window.location = "index.html";
  }



  // fetch user resources
  $scope.fetchDependencies = function()
  {
    // TODO
    //
    $('#preloader span')
      .text('Loading user information..');
    // call
    $.ajax(
    {
      url: host + '/resources',
    })
    .success(
    function(data)
    {
      // init
      window.app.resources = $scope.user = data;
      // save
      localStorage.setItem('resources', JSON.stringify(data));
      // TODO
      //
      $('#preloader .progress .bar')
        .css({
          width: '35%'
      })
      // TODO
      //
      window.app.calls.resources = true;
      // groups
      $scope.fetchGroups();
      $scope.fetchMessages();
    }).fail(function()
    {
      // TODO
      //
      window.app.calls.resources = false;
    })
    
  }











  // fetch user groups
  $scope.fetchGroups = function()
  {
    // TODO
    // what if user has no groups under network?
    // switch to parent call
    // TODO
    //
    $('#preloader span')
     .text('Loading groups..');
    // call
    $.ajax(
    {
      url: host + '/network',
    }).success(
    function(data)
    {
      // init
      window.app.groups = data;
      // save
      localStorage.setItem('groups', JSON.stringify(data));
      // TODO
      //
      window.app.calls.network = true;
      // TODO
      //
      $('#preloader .progress .bar').css(
      {
        width: '70%'
      })
      // members
      $scope.fetchMembers();
    }).fail(function()
    {
      // TODO
      //
      window.app.calls.network = false;
    })
  }

  // fetch members data
  // and process an unique list
  $scope.fetchMembers = function()
  {
    // TODO
    //
    $('#preloader span').text('Loading members..');
    // variables
    var members = {},
        tmp = {};
    // TODO
    // here or later should be checked
    // if the user already in the list ?
    // loop
    $.each(window.app.groups, function(index, group)
    {
      // TODO
      //
      window.app.calls.members = {};
      // array objects
      (function(index)
      {
        tmp[group.uuid] = function(callback, index)
        {
          setTimeout(function()
          {
            // TODO
            //
            $('#preloader span').text('Loading members.. (' + group.name + ')');
            // call
            $.ajax(
            {
              url: host + '/network/' + group.uuid + '/members?fields=[role]',
            }).success(
            function(data)
            {
              // save
              localStorage.setItem(group.uuid, JSON.stringify(data));
              // TODO
              //
              window.app.calls.members[group.uuid] = true;
              // callbacks
              callback(null, true);
            }).fail(function()
            {
              // TODO
              // 
              window.app.calls.members[group.uuid] = false;
            })
          }, (index * 100) + 100)
        }
        $.extend(members, tmp)
      })(index)
    })

    async.series(members, function(err, results)
    {
      var members = {};
      // loop
      $.each(window.app.groups, function(index, group)
      {
        var groupList = JSON.parse(localStorage.getItem(group.uuid));
        // not empty
        if (groupList.length > 0 || 
            groupList != null || 
            groupList != undefined)
        {
          $.each(groupList, function(index, member)
          {
            // init
            members[member.uuid] = member;
          })
        }
      })
      // init
      window.app.members = members;
      // save
      localStorage.setItem('members', JSON.stringify(members));
      // redirect
      $scope.initApp();
    })
    
  }








  // fetch group calc timeline
  $scope.fetchGroupTimelines = function()
  {

    var params = [];

    if (divisions.length > 0)
    {
      $.each(divisions, function(index, value)
      {
        var param = '&stateGroup=' + value;
        params.push(param);
      })
    }

    params.unshift(null);

    var groups = {},
      tmp = {},
      aggs = {},
      key, stateGroup, ikey;

    $.each(window.app.groups, function(index, group)
    {
      aggs[group.uuid] = {};

      // TODO
      //
      window.app.calls.aggs = {};
      
      $.each(params, function(index, param)
      {
        if (param)
        {
          var key = param.substr(12);
          var stateGroup = param;
        }
        else
        {
          var key = 'default';
          var stateGroup = '';
        }
        ikey = group.uuid + "_" + key;
        (function(ikey, stateGroup, key, index)
        {
          tmp[ikey] = function(callback, index)
          {
            setTimeout(function()
            {
              // TODO
              //
              $('#preloader span').text('Loading aggregrated timelines.. (' + group.name + ')');
              
              $.ajax(
              {
                url: host  + '/calc_planning/' 
                           + group.uuid 
                           + '?start=' 
                           + config.timeline.settings.ranges.period.bstart 
                           + '&end=' 
                           + config.timeline.settings.ranges.period.bend 
                           + stateGroup
              }).success(
              function(data)
              {
                aggs[group.uuid][key] = data;

                // TODO
                //
                window.app.calls.aggs[group.uuid] = true;

                callback(null, true);
              }).fail(function()
              {
                // TODO
                //
                window.app.calls.aggs[group.uuid] = false;

              })
            }, (index * 100) + 100)
          }
          $.extend(groups, tmp)
        })(ikey, stateGroup, key, index)
      })
    })

    async.series(groups, function(err, results)
    {
      window.app.aggs = aggs;
      localStorage.setItem('aggs', JSON.stringify(aggs));
      callback(null, 'done');
    });
    
  }


  // fetch indv. timeline data
  $scope.fetchMemberTimelines = function()
  {
    // TODO
    //
    $('#preloader .progress .bar').css(
    {
      width: '90%'
    });

    var members = {},
        tmp = {},
        slots = {},
        key, 
        itype, 
        ikey, 
        params = ['&type=both'];

    params.unshift(null);

    $.each(window.app.members, function(index, member)
    {
      slots[member.uuid] = {};

      // TODO
      //
      window.app.calls.slots = {};

      $.each(params, function(index, param)
      {
        if (param)
        {
          key = param.substr(6);
          itype = param;
        }
        else
        {
          key = 'default';
          itype = '';
        }

        ikey = member.uuid + "_" + key;

        (function(ikey, itype, key, index)
        {
          tmp[ikey] = function(callback, index)
          {
            setTimeout(function()
            {
              // TODO
              //
              $('#preloader span').text('Loading timeslots.. (' + member.name + ')');

              $.ajax(
              {
                url: host  + '/askatars/' 
                           + member.uuid 
                           + '/slots?start=' 
                           + window.app.settings.ranges.period.bstart 
                           + '&end=' 
                           + window.app.settings.ranges.period.bend 
                           + itype
              }).success(
              function(data)
              {
                slots[member.uuid][key] = data;

                // TODO
                //
                window.app.calls.slots[member.uuid] = true;

                callback(null, true);

              }).fail(function()
              {
                // TODO
                //
                window.app.calls.slots[member.uuid] = false;
              })
            }, (index * 100) + 100)
          }

          $.extend(members, tmp)

        })(ikey, itype, key, index)

      })

    })

    async.series(members, function(err, results)
    {
      window.app.slots = slots;

      localStorage.setItem('slots', JSON.stringify(slots));

      // TODO
      //
      $('#preloader .progress .bar').css(
      {
        width: '100%'
      })

      // document.location = "#/dashboard";
    })
    
  }












  // fetch messages
  $scope.fetchMessages = function()
  {
    $.ajax(
    {
      url: host + '/question?0=dm',
    }).success(
    function(data)
    {
      // init
      window.app.messages = data;
      // save
      localStorage.setItem('messages', JSON.stringify(data));
      // TODO
      //
      window.app.calls.messages = true;
      // count
      $scope.countUnreadMessages(data)
    }).fail(function()
    {
      // TODO
      window.app.calls.messages = false;
    })    
  }

  // count unread messages
  // TODO
  // needs to be filtered and optimized
  $scope.countUnreadMessages = function(messages)
  {
    var count = 0;
    for (var i in messages)
    {
      if (messages[i].state === "NEW")
      {
        count++;
      }
    }
    $scope.unreadMessages = count    
  }






}

app.$inject = ['$scope'];