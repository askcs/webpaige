//'use strict';
/* Dashboard controller */

var dashboard = function($scope)
{
		
	//this.load;
	
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
	
}

dashboard.prototype = {

	constructor: dashboard,
	
	load: function()
	{
		console.log('load inited');
	},
	
	sync: function()
	{		
		async.series({
		    
		    
		    
	    /*
	    aggs: function(callback)
	    {
        
        setTimeout(function()
        {
	    		
					// magic of loading group members
					// by producing an array of functional objects
					var groups = {},
					tmp = {};
				
					$.each(window.app.groups, function (index, group)
					{
						tmp[group.uuid] = function(callback, index)
						{
							setTimeout(function()
							{
							  $.ajax(
								{
									url: host + '/calc_planning/' 
														+ group.uuid 
														+ '?start=' 
														+ window.app.settings.ranges.period.bstart 
														+ '&end=' 
														+ window.app.settings.ranges.period.bend
								})
								.success(
								function(data)
								{			
								
									//localStorage.setItem(group.uuid, JSON.stringify(data));
									
									//window.app.calls[group.uuid] = true;	
									
					    		callback(null, true);
								})
								.fail(function()
								{
									//window.app.calls[group.uuid] = false;	
								}) 
				
							}, (index * 100) + 100) 
						}					
						$.extend(groups, tmp)
					})
					
					async.series(groups,
					function(err, results)
					{			
											
					});		
        }, 200);			
	
	    }
	    */
	    
		},
		function(err, results)
		{
			//console.log('results of parallel calls: ', results);
		})
		
		this.load();
	},
	
	// following functions

}
dashboard.$inject = ['$scope'];