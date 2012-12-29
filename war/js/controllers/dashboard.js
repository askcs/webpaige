'use strict';
/* Dashboard controller */

var dashboardCtrl = function($scope)
{	
	$scope.preventDeepLink();

	$scope.validLogin = true;


	$('a[href=#dashboard]').parent().addClass('active');
	$('a[href=#messages]').parent().removeClass('active');
	$('a[href=#groups]').parent().removeClass('active');

	console.log('planboard');


	this.fetchPlanboards();

	
	//this.render();  
	
	this.callbacks = {};
	
	//this.register( 'planboard', this.rerender );
	
	//var that = this;
	//setInterval(function() { that.sync.call( that ); }, 600000);





}

//dashboard.prototype = $.extend({}, app.prototype, {
dashboardCtrl.prototype = {

	constructor: dashboardCtrl,
	
	callbacks: {},
	
	register : function(key, callback)
	{
		if (!this.callbacks[key])
		{
			this.callbacks[key] = [];
		}
		this.callbacks[key].push(callback);
	},
	
	rerender: function()
	{
		console.log('load inited');		
	},
	
	processer: function()
	{
		// good idea to seperate process from timeline rendering?
	},
	
	render: function()
	{
		var timedata = [];
		
		var slots = JSON.parse(localStorage.getItem('slots'));
		
		$.each(slots, function(name, member)
		{	
			$.each(member.both, function(index2, slot)
			{
				timedata.push({
					start: Math.round(slot.start * 1000),
					end: Math.round(slot.end * 1000),
					group: name,
					content: slot.text,
					className: states[slot.text].className,
					editable: true
				})	
			})
		})
		
		window.app.timedata = timedata;
		
		// sorter comes here in play?
	
	  var options = {
	    'axisOnTop': true,
	    'width': '100%',
	    'height': 'auto',
	    'selectable': true,
	    'editable': true,
	    'style': 'box',
	    'groupsWidth': '150px',
	    'eventMarginAxis': 0,
	    /*
	    'min': new Date(trange.start), 
	    'max': new Date(trange.end),
	    */
	    'intervalMin': 1000 * 60 * 60 * 1,
	    'intervalMax': 1000 * 60 * 60 * 24 * 7 * 2
	  };
	  
	  var timeline;
	  
	  timeline = new links.Timeline(document.getElementById('mytimeline'));
	  timeline.draw(timedata, options);
		
	},
	
	sync: function()
	{	
		// TODO: work on this !!	
		var that = this;	
		
		var url = 'planboard';
		
		var cb = that.callbacks[url];
		if (cb)
		{
			$.each(cb, function(k, v)
			{
				v.apply(this, arguments);
			})
		}
		
		/*
		async.series({
		    
	    parent: function(callback)
	    {
	    var url = host + '/parent';
	      setTimeout(function()
	      {
	      	
				  $.ajax(
					{
						url: url,
					})
					.success(
					function(data)
					{
					
						//
						// core callback registerer			
						var cb = that.callbacks[url];
						if (cb)
						{
							$.each(cb, function(k, v)
							{
								v.apply(this, arguments);
							});
		    		}
		    		// end callback registerer
		    		//
		    		
		    		
		    		callback(null, 'done');
					})
					.fail(function()
					{
					})
	      }, 200);
	    },
	    
		},
		function(err, results)
		{
			//console.log('results of parallel calls: ', results);
		})
		*/
		
	},


  // fetch plaboards
  fetchPlanboards: function()
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
    })
  }

}
//)

dashboardCtrl.$inject = ['$scope'];