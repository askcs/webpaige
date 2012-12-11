'use strict';
/* Dashboard controller */

var dashboard = function($scope)
{	
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

	
	this.render();  
	
	
	this.callbacks = {};
	
	this.register( 'planboard', this.rerender );
	
	var that = this;
	setInterval(function() { that.sync.call( that ); }, 600000);
	
}

dashboard.prototype = $.extend({}, app.prototype, {


	constructor: dashboard,
	
	
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
		
	}

})

dashboard.$inject = ['$scope'];