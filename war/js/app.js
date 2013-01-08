/*jslint node: true */
'use strict';

// let's declare app and dependencies and run initials
var WebPaige = angular.module('WebPaige', ['App.filters', 'App.services', 'App.factories']);
  
  //
  // configure app
  WebPaige.config(['$routeProvider','$locationProvider',
  function($routeProvider, $location)
  {
    // TODO
    // turn this on later
    //$location.html5Mode(true);

    $routeProvider.when('/login',
    {
      templateUrl: 'views/login.html',
      Ctrl: loginCtrl
    });

    $routeProvider.when('/logout',
    {
      templateUrl: 'views/logout.html',
      Ctrl: logoutCtrl
    });

    $routeProvider.when('/dashboard',
    {
      templateUrl: 'views/dashboard.html',
      Ctrl: dashboardCtrl
    });

    $routeProvider.when('/messages',
    {
      templateUrl: 'views/messages.html',
      Ctrl: messagesCtrl
    });

    $routeProvider.when('/groups',
    {
      templateUrl: 'views/groups.html',
      Ctrl: groupsCtrl
    });

    $routeProvider.when('/profile',
    {
      templateUrl: 'views/profile.html',
      Ctrl: profileCtrl
    });

    $routeProvider.when('/settings',
    {
      templateUrl: 'views/settings.html',
      Ctrl: settingsCtrl
    });
    
    $routeProvider.otherwise(
    {
      redirectTo: '/login'
    });

  }]);




  //
  // run initials
  WebPaige.run(['$rootScope', 
  function($rootScope)
  {
    window.app.calls = {};

    $rootScope.config = config;

    // position notifications
    $('.notifications').addClass( config.notifier.position );
    
    // DEFAULTS -------------------------------------------------------------------
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
      ignoreTitle: config.validator.ignoreTitle
    });

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
      onClose: function () {},
      onClosed: function () {}
    };

    //$scope.config = config;
    $rootScope.ui = ui[config.lang];

    // set language
    $rootScope.setLang = function(language)
    {
      $rootScope.ui = ui[language];
      // re-set validation messages
      jQuery.extend(
        jQuery.validator, 
        {
          messages: {
            required: $rootScope.ui.error.required,
            remote: $rootScope.ui.error.remote,
            email: $rootScope.ui.error.email,
            url: $rootScope.ui.error.url,
            date: $rootScope.ui.error.date,
            dateISO: $rootScope.ui.error.dateISO,
            number: $rootScope.ui.error.number,
            digits: $rootScope.ui.error.digits,
            creditcard: $rootScope.ui.error.creditcard,
            equalTo: $rootScope.ui.error.equalTo,
            accept: $rootScope.ui.error.accept,
            maxlength: jQuery.validator.format( $rootScope.ui.error.maxlength ),
            minlength: jQuery.validator.format( $rootScope.ui.error.minlength ),
            rangelength: jQuery.validator.format( $rootScope.ui.error.rangelength ),
            range: jQuery.validator.format( $rootScope.ui.error.range ),
            max: jQuery.validator.format( $rootScope.ui.error.max ),
            min: jQuery.validator.format( $rootScope.ui.error.min )       
          }
        }
      )
    };

  
    // ajax error handler
    $rootScope.ajaxErrorHandler = function(jqXHR, exception, options)
    {
      switch (jqXHR.status)
      {
        case 0:
          $rootScope.notify( { message: $rootScope.ui.error.ajax.noConnection } )
        break;
        case 400:
          $rootScope.notify( { message: $rootScope.ui.error.ajax.badRequest } )
        break;
        case 404:
          $rootScope.notify( { message: $rootScope.ui.error.ajax.notFound } )
        break;
        case 500:
          $rootScope.notify( { message: $rootScope.ui.error.ajax.serverError } )
        break;
        default:
          switch (exception)
          {
            case 'parser error':
              $rootScope.notify( { message: $rootScope.ui.error.ajax.parserError } )
            break;
            case 'timeout':
              $rootScope.notify( { message: $rootScope.ui.error.ajax.timeout } )
            break;
            case 'abort':
              $rootScope.notify( { message: $rootScope.ui.error.ajax.abort } )
            break;
            default:
              $rootScope.notify( { message: $rootScope.ui.error.ajax.uncaughtError + jqXHR.responseText } )
          }
      }
    }

    // notifier
    $rootScope.notify = function(options)
    {
      $('.notifications').notify(options).show()
    }

  }]);




















/**
 * This main controller is depreciated
 */
// App controller
var app = function($rootScope, $scope)
{
  /*
  window.app.calls = {};

  $scope.config = config;

  // position notifications
  $('.notifications').addClass( config.notifier.position );
  
  // DEFAULTS -------------------------------------------------------------------
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
    ignoreTitle: config.validator.ignoreTitle
  });

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
    onClose: function () {},
    onClosed: function () {}
  };

  //$scope.config = config;
  $scope.ui = ui[config.lang];
  */

  // APP ------------------------------------------------------------------------
  // set language
  /*
  $scope.setLang = function(language)
  {
    $scope.ui = ui[language];
    // re-set validation messages
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
  };
  */

  
  // ajax error handler
  /*
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
  */

  // notifier
  /*
  $scope.notify = function(options)
  {
    $('.notifications').notify(options).show()
  }
  */































  // PRELOAD DEPENDENCIES ---------------------------------------------------------
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


      // $scope.fetchMessages();


    }).fail(function()
    {
      // TODO
      //
      window.app.calls.resources = false;
    })
    
  }

  // GROUPS & USERS ----------------------------------------------------------------
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

      // TODO
      // redirect
      $('#menu').show();
      document.location = "#/dashboard";
    })
    
  }





















  // TIMELINES --------------------------------------------------------------------





















  $scope.fetchPlanboards = function()
  {
    $scope.planboardLoading = true;
    var results = {};


    // TODO
    //window.app.results = {};
    //window.app.results.slots = {};
    //

    async.parallel(
    {

      user: function(callbackUserSlots)
      {
        setTimeout(function()
        {
          //var userSlotsResult = $scope.fetchUserTimeline();

          //console.log('-> 4. fetchPlanboards:user', JSON.stringify(userSlotsResult));

          // init vars
          var user,
              members = {},
              tmp = {},
              slots = {},
              key, 
              itype, 
              ikey, 
              params = [];
              //params = ['&type=both'];
          params.unshift(null);

          // REMOVE
          /*
          window.app.resources = {};
          window.app.resources.uuid = "4780aldewereld";
          //var sessie = '1335b29a48a378c24a571e796d1a5ff9f54b76e0035b4d4baded22352cb0dfcc';
            $.ajaxSetup(
            {
              contentType: 'application/json',
              xhrFields: { 
                withCredentials: true
              },
              beforeSend: function (xhr)
              {
                xhr.setRequestHeader('X-SESSION_ID', $scope.getSession())
              } 
            })
          */
          // REMOVE

          slots[window.app.resources.uuid] = {};

          // TODO
          //
          // register call
          window.app.calls.slots = {};

          // loop through params
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
            ikey = window.app.resources.uuid + "_" + key;

            (function(ikey, itype, key, index)
            {
              tmp[ikey] = function(callback, index)
              {
                setTimeout(function()
                {
                  // call
                  $.ajax(
                  {
                    url: host  + '/askatars/' 
                               + window.app.resources.uuid 
                               + '/slots?start=' 
                               + config.timeline.settings.ranges.period.bstart 
                               + '&end=' 
                               + config.timeline.settings.ranges.period.bend 
                               + itype
                  }).success(
                  function(data)
                  {
                    slots[window.app.resources.uuid][key] = data;
                    // TODO
                    //
                    window.app.calls.slots[window.app.resources.uuid] = true;
                    // callback
                    callback(null, true);
                  }).fail(function()
                  {
                    // TODO
                    //
                    window.app.calls.slots[window.app.resources.uuid] = false;
                  })
                }, (index * 100) + 100)
              }
              $.extend(members, tmp)
            })(ikey, itype, key, index)
          })

          async.series(members, function(err, results)
          {
            window.app.slots = slots;
            // save
            localStorage.setItem('slots', JSON.stringify(slots));

            //console.log('-> 1. fetchUserTimeline', results);

            callbackUserSlots(null, results)
          })

        }, 100)
      },

      groups: function(callback)
      {
        setTimeout(function()
        {
          //$scope.fetchGroupTimelines();

          callback(null, true)
        }, 300)
      },

      members: function(callback)
      {
        setTimeout(function()
        {
          //$scope.fetchMemberTimelines();

          callback(null, true)
        }, 500)
      }

    },
    function(err, results)
    {
      console.log('-> 5. fetchPlanboards', JSON.stringify(results))
      return results
      document.location = "#/dashboard";
    })
  }






















  // fetch members slots
  $scope.fetchUserTimeline = function()
  {

    // TODO
    window.app.results.slots.user = {};
    //

    // init vars
    var user,
        members = {},
        tmp = {},
        slots = {},
        key, 
        itype, 
        ikey, 
        params = [];
        //params = ['&type=both'];
    params.unshift(null);

    // REMOVE
    window.app.resources = {};
    window.app.resources.uuid = "4780aldewereld";
    //var sessie = '1335b29a48a378c24a571e796d1a5ff9f54b76e0035b4d4baded22352cb0dfcc';
      $.ajaxSetup(
      {
        contentType: 'application/json',
        xhrFields: { 
          withCredentials: true
        },
        beforeSend: function (xhr)
        {
          xhr.setRequestHeader('X-SESSION_ID', $scope.getSession())
        } 
      })
    // REMOVE

    slots[window.app.resources.uuid] = {};

    // TODO
    //
    // register call
    window.app.calls.slots = {};

    // loop through params
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
      ikey = window.app.resources.uuid + "_" + key;

      (function(ikey, itype, key, index)
      {
        tmp[ikey] = function(callback, index)
        {
          setTimeout(function()
          {
            // call
            $.ajax(
            {
              url: host  + '/askatars/' 
                         + window.app.resources.uuid 
                         + '/slots?start=' 
                         + config.timeline.settings.ranges.period.bstart 
                         + '&end=' 
                         + config.timeline.settings.ranges.period.bend 
                         + itype
            }).success(
            function(data)
            {
              slots[window.app.resources.uuid][key] = data;
              // TODO
              //
              window.app.calls.slots[window.app.resources.uuid] = true;
              // callback
              callback(null, true);
            }).fail(function()
            {
              // TODO
              //
              window.app.calls.slots[window.app.resources.uuid] = false;
            })
          }, (index * 100) + 100)
        }
        $.extend(members, tmp)
      })(ikey, itype, key, index)
    })

    async.series(members, function(err, results)
    {
      window.app.slots = slots;
      // save
      localStorage.setItem('slots', JSON.stringify(slots));

      // TODO
      window.app.results.slots.user = results;
      //

      console.log('-> 1. fetchUserTimeline', results);
    })

    //console.log('-> 2. results', results);

    console.log('-> 3. returning', JSON.stringify(window.app.results.slots.user));
    return window.app.results.slots.user

  }





































  // fetch plaboards
  $scope.fetchPlanboards_ = function()
  {
    async.waterfall([

      // get user slots
      function(callback)
      {
        callback(null, 'user');
      },

      // fetch group slots
      function(user, callback)
      {
        // reset en init params
        var params = [];
        // process divisions
        if (divisions.length > 0)
        {
          $.each(divisions, function(index, value)
          {
            var param = '&stateGroup=' + value;
            params.push(param);
          })
        }
        params.unshift(null);
        // init vars
        var groups = {},
          tmp = {},
          aggs = {},
          key, stateGroup, ikey;
        // loop through the groups
        $.each(window.app.groups, function(index, group)
        {
          aggs[group.uuid] = {};
          // TODO
          //
          window.app.calls.aggs = {};
          //
          // loop through params
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
                  // call
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
                    // callback
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
          // save
          localStorage.setItem('aggs', JSON.stringify(aggs));
          // callback
          callback(null, 'group');
        })
      },

      // fetch members slots
      function(group, callback)
      {
        // init vars
        var members = {},
            tmp = {},
            slots = {},
            key, 
            itype, 
            ikey, 
            params = ['&type=both'];
        params.unshift(null);
        //
        // loop through members
        $.each(window.app.members, function(index, member)
        {
          slots[member.uuid] = {};
          // TODO
          //
          window.app.calls.slots = {};
          // loop through params
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
                  // call
                  $.ajax(
                  {
                    url: host  + '/askatars/' 
                               + member.uuid 
                               + '/slots?start=' 
                               + config.timeline.settings.ranges.period.bstart 
                               + '&end=' 
                               + config.timeline.settings.ranges.period.bend 
                               + itype
                  }).success(
                  function(data)
                  {
                    slots[member.uuid][key] = data;
                    // TODO
                    //
                    window.app.calls.slots[member.uuid] = true;
                    // callback
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
          // save
          localStorage.setItem('slots', JSON.stringify(slots));
          // callback
          callback(null, 'members');
        })
      }

    ], function (err, result)
    {
       console.log('result', result)   
    })
    
  }




  // fetch plaboards
  /*
  $scope.fetchPlanboards = function()
  {
    async.waterfall([

      function(callback)
      {
        callback(null, 'user');
      },

      // fetch group slots
      function(user, callback)
      {
        // reset en init params
        var params = [];
        // process divisions
        if (divisions.length > 0)
        {
          $.each(divisions, function(index, value)
          {
            var param = '&stateGroup=' + value;
            params.push(param);
          })
        }
        params.unshift(null);
        // init vars
        var groups = {},
          tmp = {},
          aggs = {},
          key, stateGroup, ikey;
        // loop through the groups
        $.each(window.app.groups, function(index, group)
        {
          aggs[group.uuid] = {};
          // TODO
          //
          window.app.calls.aggs = {};
          //
          // loop through params
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
                  // call
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
                    // callback
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
          // save
          localStorage.setItem('aggs', JSON.stringify(aggs));
          // callback
          callback(null, 'group');
        })
      },

      // fetch members slots
      function(group, callback)
      {
        // init vars
        var members = {},
            tmp = {},
            slots = {},
            key, 
            itype, 
            ikey, 
            params = ['&type=both'];
        params.unshift(null);
        //
        // loop through members
        $.each(window.app.members, function(index, member)
        {
          slots[member.uuid] = {};
          // TODO
          //
          window.app.calls.slots = {};
          // loop through params
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
                  // call
                  $.ajax(
                  {
                    url: host  + '/askatars/' 
                               + member.uuid 
                               + '/slots?start=' 
                               + config.timeline.settings.ranges.period.bstart 
                               + '&end=' 
                               + config.timeline.settings.ranges.period.bend 
                               + itype
                  }).success(
                  function(data)
                  {
                    slots[member.uuid][key] = data;
                    // TODO
                    //
                    window.app.calls.slots[member.uuid] = true;
                    // callback
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
          // save
          localStorage.setItem('slots', JSON.stringify(slots));
          // callback
          callback(null, 'members');
        })
      }

    ], function (err, result)
    {
       console.log('result', result)   
    });
  }
  */





  // fetch group calc timeline
  $scope.fetchGroupTimelines_ = function()
  {
    // reset en init params
    var params = [];
    // process divisions
    if (divisions.length > 0)
    {
      $.each(divisions, function(index, value)
      {
        var param = '&stateGroup=' + value;
        params.push(param);
      })
    }
    params.unshift(null);
    // init vars
    var groups = {},
      tmp = {},
      aggs = {},
      key, stateGroup, ikey;
    // loop through the groups
    $.each(window.app.groups, function(index, group)
    {
      aggs[group.uuid] = {};
      // TODO
      //
      window.app.calls.aggs = {};
      //
      // loop through params
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
              // call
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
                // callback
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
    })
  }

  // fetch indv. timeline data
  $scope.fetchMemberTimelines_ = function()
  {
    // TODO
    //
    /*
    $('#preloader .progress .bar').css(
    {
      width: '90%'
    });
    */
    // init vars
    var members = {},
        tmp = {},
        slots = {},
        key, 
        itype, 
        ikey, 
        params = ['&type=both'];
    params.unshift(null);
    //
    // loop through members
    $.each(window.app.members, function(index, member)
    {
      slots[member.uuid] = {};
      // TODO
      //
      window.app.calls.slots = {};
      // loop through params
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
                // callback
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
      // save
      localStorage.setItem('slots', JSON.stringify(slots));
      // TODO
      //
      /*
      $('#preloader .progress .bar').css(
      {
        width: '100%'
      })
      */
      // document.location = "#/dashboard";
    })
    
  }





  // MESSAGES ----------------------------------------------------------------------
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

app.$inject = ['$rootScope', '$scope']