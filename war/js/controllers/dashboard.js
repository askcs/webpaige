//'use strict';
/* Dashboard controller */

var dashboard = function($scope)
{
		
	//this.load;
	
	if (!localStorage.getItem('slots') &&
			!localStorage.getItem('wishes') &&
			!localStorage.getItem('aggs'))
	{
		this.sync();
	}
	else
	{
		this.load();
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
	    
	    slots: function(callback, uuid)
	    {
	      setTimeout(function()
	      {	
					// magic of loading group members
					// by producing an array of functional objects
					var members = {},
					tmp = {},
					slots = {};
	
					$.each(JSON.parse(localStorage.getItem('members')), function (index, member)
					{
						tmp[member.uuid] = function(callback, index)
						{
							setTimeout(function()
							{
							  $.ajax(
								{
									url: host + '/askatars/' 
														+ member.uuid 
														+ '/slots?start=' 
														+ window.app.settings.ranges.period.bstart 
														+ '&end=' 
														+ window.app.settings.ranges.period.bend
								})
								.success(
								function(data)
								{			
									//console.log(member.uuid, data);
									
									slots[member.uuid] = data;
									
					    		callback(null, true);
								})
								.fail(function()
								{
								}) 
			
							}, (index * 100) + 100) 
						}					
						$.extend(members, tmp)

					})
					
					async.parallel(members,
					function(err, results)
					{			
					
						//console.log('slots', slots);
						
						window.app.slots = slots;
						
						// TODO: come back to here later
						//localStorage.setItem('slots', JSON.stringify(slots));
						
						console.log(results);
					
					});
					
	      }, 100);
	    },
		    
		    
		    
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
		
	},
	
	// following functions

}
dashboard.$inject = ['$scope'];