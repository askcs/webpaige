'use strict';
/* Dashboard controller */

var dashboardCtrl = function($scope)
{	  
  $scope.preventDeepLink();
  
  var planboard = this;
  this.callbacks = {};
  //var root = $scope.$parent.$parent;
  
  $scope.validLogin = true;

  $('a[href=#dashboard]').parent().addClass('active');
  $('a[href=#messages]').parent().removeClass('active');
  $('a[href=#groups]').parent().removeClass('active');

  // TODO: some checks ?
  /*
  if (!localStorage.getItem('slots') &&
      !localStorage.getItem('wishes') &&
      !localStorage.getItem('aggs'))
  {
    //this.sync();
  }
  else
  {
    //this.load();
  }
  */

  //this.render();  

  this.register('planboard', this.render);

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


  /*
  timer.set(options);
  timer.play(reset);  // Boolean. Defaults to false.
  timer.pause();
  timer.stop();  // Pause and resets
  timer.toggle(reset);  // Boolean. Defaults to false.
  timer.once(time);  // Number. Defaults to 0.
  timer.isActive  // Returns true if timer is running
  timer.remaining // Remaining time when paused
  */


  /*
    var planboard = this;
    setInterval(function()
    {
      planboard.sync.call( planboard )
    }, config.data.planboard.sync);
  */

  
  /*
  this.callbacks = {};

  var that = this;
  setInterval(function() { that.sync.call( that ); }, config.data.planboard.sync);
  */



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
	},

	
	render: function()
	{
    // user slots
    var timedata = [],
        user = JSON.parse(localStorage.getItem('resources')),
        slots = JSON.parse(localStorage.getItem('slots'));
      
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
     
    $('#planboardLoading').hide();
    var timeline = new links.Timeline(document.getElementById('mytimeline'));
    timeline.draw(timedata, config.timeline.options); 
    // end user slots
	},


	sync: function($scope)
	{	
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
              params = ['&type=both'];
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
      //
      // core callback registerer     
      var callback = sync.callbacks[trigger];
      if (callback)
      {
        $.each(callback, function(key, value)
        {
          value.apply(this, arguments);
        })
      }
      // end callback registerer
      //
      console.log('-> results of calls: ', results);
    })

		
	}






}

dashboardCtrl.$inject = ['$scope'];