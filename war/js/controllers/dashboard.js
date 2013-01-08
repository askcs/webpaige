'use strict';
/* Dashboard controller */

var dashboardCtrl = function($rootScope, $scope, $location, Session, App, Resources)
{
  // prevent deeplinking
  if (!Session.check($rootScope.session))
    App.returnHome();
  
  var planboard = this;
  this.callbacks = {};
  //var root = $scope.$parent.$parent;
  
  $scope.validLogin = true;

  $('a[href=#dashboard]').parent().addClass('active');
  $('a[href=#messages]').parent().removeClass('active');
  $('a[href=#groups]').parent().removeClass('active'); 

  this.register('planboard', this.render, $scope);

  /*
  if (!localStorage.getItem('slots')  &&
      !localStorage.getItem('wishes') &&
      !localStorage.getItem('aggs')
    )
  */

  if (!localStorage.getItem('slots'))
  {
    $('#planboardLoading').show();
    planboard.sync.call(planboard);
  }

  var planboardTimer = $.timer(function()
  {
    planboard.sync.call(planboard)
  }).set(
  {
    time: config.data.planboard.syncInterval,
    autostart: true 
  })





  Resources.get( $rootScope );
  $rootScope.$watch('resources', function()
  {
    console.log('----> resources', $rootScope.resources );
  })
  
  //console.log('----> scope', $scope );
  //console.log('----> rootScope', $rootScope );
  //console.log('----> resources', $rootScope.resources );

}


dashboardCtrl.prototype = {

	constructor: dashboardCtrl,
	
	callbacks: {},
	
	register: function(key, callback)
	{
		if (!this.callbacks[key])
		{
			this.callbacks[key] = [];
		}
    this.callbacks[key].push(callback);

    //console.log('---> scope in register', $scope);
    // this.callbacks[scope].push($scope);
	},
  
  render: function()
  {

    //console.log('-------> scope', scope);

    // user slots
    var timedata = [],
        user = JSON.parse(localStorage.getItem('resources')),
        slots = JSON.parse(localStorage.getItem('slots'));
    
    /*
    timedata.push({
      start: Math.round(1),
      end: Math.round(1),
      group: 'Wekelijkse planning',
      content: 'empty'
    }) 
    timedata.push({
      start: Math.round(1),
      end: Math.round(1),
      group: 'Planning',
      content: 'empty'
    })
    */
    
    //console.log('-> scope in render', this.$scope); 
      
    $.each(slots[user.uuid].default, function(index, slot)
    {
      timedata.push({
        start: Math.round(slot.start * 1000),
        end: Math.round(slot.end * 1000),
        group: (slot.recursive) ? 'Wekelijkse planning' : 'Planning',
        content: slot.text,
        className: states[slot.text].className,
        editable: true
      })  
    })

    //console.log('-> timedata', timedata);
     
    $('#planboardLoading').hide();
    var timeline = new links.Timeline(document.getElementById('mytimeline'));
    timeline.draw(timedata, config.timeline.options); 
    // end user slots
	},


	sync: function()
	{ 
  
    //console.log('---> scope in sync', $scope);
     	
		var sync = this,	
		    trigger = 'planboard';

    async.parallel(
    {

      user: function(callbackUserSlots)
      {
        setTimeout(function()
        {
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
            // callback
            callbackUserSlots(null, results)
          })

        }, 100)
      },

      groups: function(callbackGroupSlots)
      {
        setTimeout(function()
        {
          callbackGroupSlots(null, true)
        }, 300)
      },

      members: function(callbackMemberSlots)
      {
        setTimeout(function()
        {
          callbackMemberSlots(null, true)
        }, 500)
      }

    },
    function(err, results)
    {  
      var callback = sync.callbacks[trigger];

      // console.log('---> callback:', callback);

      if (callback)
      {
        $.each(callback, function(key, value)
        {
          //console.log('---> key, value, arguments:', key, value, arguments);
          //console.log('---> arguments:', arguments);

          value.apply(this, arguments);
        })
      }
    })
		
	}


}

dashboardCtrl.$inject = ['$rootScope', '$scope', '$location', 'Session', 'App', 'Resources'];