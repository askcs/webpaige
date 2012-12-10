'use strict';
/* Dashboard controller */

var dashboard = function($scope)
{	
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
	
	this.callbacks = {};
	this.register( host + '/parent', this.render );
	
	var that = this;
	setInterval(function() { that.sync.call( that ); }, 2000000);
}

dashboard.prototype = $.extend({}, app.prototype, {

	constructor: dashboard,
	
	render: function()
	{
		console.log('load inited');		
	},
	
	callbacks: {},
	
	register : function(key, callback)
	{
		if (!this.callbacks[key])
		{
			this.callbacks[key] = [];
		}
		this.callbacks[key].push(callback);
	},
	
	sync: function()
	{		
		var that = this;
		
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
						var cb = that.callbacks[url];
						if (cb)
						{
							$.each(cb, function(k, v)
							{
								v.apply(this, arguments);
							});
		    		}
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
		
	}

})

dashboard.$inject = ['$scope'];