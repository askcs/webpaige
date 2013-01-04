'use strict';


angular.module('WebPaige.factories', [], 
  function($provide)
  {
    $provide.factory('Notify', 
      ['$window', '$rootScope',
        function(win, rootScope)
        {
          var msgs = [];
          return {
            me: function(msg)
            {
              msgs.push(msg);
              if (msgs.length == 3)
              {
                rootScope.messages = msgs;
                msgs = [];
              }
            },
            test: function(msg)
            {
              console.log('----> ', msg)
            }
          }
        }
      ]
    )
  }
)


/*
angular.module('WebPaige.factories', [], 
  function($provide)
  {

    $provide.factory('Notify', 
      ['$window', '$rootScope',
        function(win, rootScope)
        {
          var msgs = [];
          return function(msg)
          {
            msgs.push(msg);
            if (msgs.length == 3)
            {
              //win.alert(msgs.join("\n"));
              rootScope.messages = msgs;
              msgs = [];
            }
          }
        }
      ]
    )
    
  }
)
*/

/* Services */
angular.module('WebPaige.services', [])

  //
  // Session handler
  .service('Session', function()
  {
    return {

      //
      // check session
      check: function(session)
      {
        if( !session )
          session = this.cookie;
        if( session.id == null )
          return false;
        var time  = new Date();
        var now   = time.getTime();
        if( (now - session.time) > (60 * 60 * 1000) )
        {   
          return false;
        }
        return true;
      },

      // 
      // read session from cookie
      cookie: function(session)
      {
        var values;
        var pairs = document.cookie.split(";");
        for(var i=0; i<pairs.length; i++)
        {
          values = pairs[i].split("=");
          if(values[0].trim() == "ask")
          {
            return JSON.parse(values[1]);
          }
        }
      },

      // get session
      // prolong session by checking
      get: function(session)
      {
        this.check(session);
        this.set(session.id);
        return session.id
      },

      //
      // set session
      set: function(sessionId)
      {
        var session     = new Object();
        var time        = new Date();
        session.id      = sessionId;
        session.time    = time;
        document.cookie = "ask=" + JSON.stringify(session);
        return session
      }

    }
  })

  //
  // localStorage service
  .service('Store', function()
  {
    return {

      //
      // localStorage getter
      get: function(item)
      {
        return JSON.parse(localStorage.getItem(item) || '[]')
      },

      //
      // localStorage setter
      set: function(key, value)
      {
        localStorage.setItem(key, JSON.stringify(value))
      }
    }
  })

  //
  // general App functions
  .service('App', function()
  {

    return {

      //
      // check browser
      checkBrowser: function(blacklisted)
      {
        var N = navigator.appName,
            ua = navigator.userAgent,
            tem;
        var browser = ua.match( /(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i );
        if (browser && ( tem = ua.match(/version\/([\.\d]+)/i)) != null )
        {
          browser[2] = tem[1];
        }
        browser = browser ? [ browser[1], browser[2] ] : [ N, navigator.appVersion, '-?' ];
        browser = browser[0].toLowerCase();
        return ( _.contains(blacklisted, browser) ) ? true : false;
      },

      //
      // return home
      returnHome: function()
      {
        window.location = "index.html";
      },


    }
  })

  //
  // Resources
  .service('Resources', function()
  {

    return {

      //
      // get Resources
      get: function(options)
      {
        async.series(
        [
          function(callback)
          {
            $.ajax(
            {
              url: host + '/resources',
            })
            .success(
              function(data)
              {
                callback( null, data );
              }
            )
            .fail(
              function(jqXHR, exception, options)
              {
                callback( {jqXHR: jqXHR, exception: exception}, null )
              }
            )
          }
        ],
        function(err, results)
        {
          root.resources = (err) ? err : results
        })
      }

    }
  })









