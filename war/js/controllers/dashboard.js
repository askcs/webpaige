//'use strict';
/* Dashboard controller */

var dashboard = function($scope)
{
							
	this.uniqueMembers();
	
/*
		var members = {};
		$.each(window.app.groups, function(index, group)
		{
			var groupList = JSON.parse(localStorage.getItem(group.uuid));
			if (groupList.length > 0)
			{
				$.each(groupList, function(index, member)
				{
					members[member.uuid] = member;
				})
			}
		})
		window.app.members = members;
*/
		//console.log('uniqueMembers: ', window.app.members);
		
	//this.load;
	
	/*
	if (!localStorage.getItem('slots') &&
			!localStorage.getItem('wishes') &&
			!localStorage.getItem('aggs'))
	{
		console.log('no slots');
	}
	*/
}

dashboard.prototype = {

	constructor: dashboard,
	
	sync: function()
	{		
		async.series({
	    
	    slots: function(callback, uuid)
	    {
	      setTimeout(function()
	      {
							
					// magic of loading group members
					// by producing an array of functional objects
					/*
					var members = {},
					tmp = {};
	
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
									console.log(member.uuid, data);
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
					});
					*/
	      
	      
/*
				  $.ajax(
					{
						url: host + '/askatars/' 
											+ window.app.resources.uuid 
											+ '/slots?start=' 
											+ window.app.settings.ranges.period.bstart 
											+ '&end=' 
											+ window.app.settings.ranges.period.bend
					})
					.success(
					function(data)
					{		
						
						localStorage.setItem('slots', JSON.stringify(data));	
						
		    		callback(null, 'done');
					})
					.fail(function()
					{
					})
*/
					
					
					//console.log('uniqueMembers: ', window.app.members);
					
					
					
	      }, 100);
	    },
	    
/*
	    messages: function(callback)
	    {
	      setTimeout(function()
	      {
				  $.ajax(
					{
						url: host + '/question?0=dm',
					})
					.success(
					function(data)
					{	
					
						localStorage.setItem('messages', JSON.stringify(data));
						$('#preloader .progress .bar').css({ width : '60%'});	
						$('#preloader span').text('Messages loaded');		
								
		    		callback(null, 'done');
					})
					.fail(function()
					{
					})
	      }, 200);
	    },
*/
		
/*
	    network: function(callback)
	    {
	      setTimeout(function()
	      {
				  $.ajax(
					{
						url: host + '/network',
					})
					.success(
					function(data)
					{				
					
						localStorage.setItem('groups', JSON.stringify(data));
						$('#preloader .progress .bar').css({ width : '80%'});	
						$('#preloader span').text('Groups loaded');	
							
		    		callback(null, 'done');
					})
					.fail(function()
					{
					})
	      }, 300);
	    },
*/
	    
/*
	    parent: function(callback)
	    {
	      setTimeout(function()
	      {
				  $.ajax(
					{
						url: host + '/parent',
					})
					.success(
					function(data)
					{			
					
						localStorage.setItem('parent', JSON.stringify(data));
						$('#preloader .progress .bar').css({ width : '100%'});	
						$('#preloader span').text('Groups loaded');		
						
		    		callback(null, 'done');
					})
					.fail(function()
					{
					})
	      }, 400);
	    }
*/
	    
		},
		function(err, results)
		{
			//console.log('results of parallel calls: ', results);
			document.location = "#/dashboard"; 
		})
		
	},
	
	// following functions
	
	uniqueMembers: function()
	{
							
		// magic of loading group members
		// by producing an array of functional objects
		var members = {},
		tmp = {};
	
		$.each(window.app.groups, function (index, group)
		{
			tmp[group.uuid] = function(callback, index)
			{
				setTimeout(function()
				{
				  $.ajax(
					{
						url: host + '/network/' + group.uuid + '/members?fields=[role]',
					})
					.success(
					function(data)
					{			
					
						localStorage.setItem(group.uuid, JSON.stringify(data));
						
						window.app.calls[group.uuid] = true;	
						
		    		callback(null, true);
					})
					.fail(function()
					{
						window.app.calls[group.uuid] = false;	
					}) 
	
				}, (index * 100) + 100) 
			}					
			$.extend(members, tmp)
		})
		
		async.series(members,
		function(err, results)
		{			
			// process unique members
			var members = {};
			$.each(window.app.groups, function(index, group)
			{
				var groupList = JSON.parse(localStorage.getItem(group.uuid));
				
				console.log(group.uuid, groupList);
				
				if (groupList.length > 0 || 
						groupList != null ||
						groupList != undefined)
				{
					$.each(groupList, function(index, member)
					{
						members[member.uuid] = member;
					})
				}
				
			})
			window.app.members = members;			
			localStorage.setItem(JSON.stringify('members', members));			
		});
	
	}

}
dashboard.$inject = ['$scope'];