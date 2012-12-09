'use strict';
/* Preloader controller */

var preloader = function($scope)
{	
	// setup ranges 
	this.setupRanges();
	
	async.waterfall([
	
	
    
    function(callback)
    {
			$('#preloader span').text('Loading user information..');
				
		  $.ajax(
			{
				url: host + '/resources',
			})
			.success(
			function(user)
			{
				// deploy resources in dom
				window.app.resources = user;
			
				// cache resources in localStorage
				localStorage.setItem('resources', JSON.stringify(user));
				
				// inform user
				$('#preloader .progress .bar').css({ width : '20%'});	
				
				// keep track of resource call
				window.app.calls = {};	
				window.app.calls['resources'] = true;
				
    		callback(null, user);
			})
			.fail(function()
			{
				window.app.calls['resources'] = false;	
			})
    },
    
    
    
    
    function(user, callback)
    {
    	async.series({
		    
		    
    	
		    network: function(callback)
		    {
	        setTimeout(function()
	        {
						$('#preloader span').text('Loading groups..');	
					  
					  $.ajax(
						{
							url: host + '/network',
						})
						.success(
						function(data)
						{	
						
							window.app.groups = data;			
						
							localStorage.setItem('groups', JSON.stringify(data));
								
							window.app.calls['network'] = true;	
							
							$('#preloader .progress .bar').css({ width : '40%'});	
							
							
							// map the divisions
							var params = [];
							if (divisions.length > 0)
							{
								$.each(divisions, function(index, value)
								{
									var param = '&stateGroup=' + value;
									params.push(param);
								})
							}
							params.unshift(null);
							
							
							// magic of loading group members
							// by producing an array of functional objects
							var groups = {},
							tmp = {},
							aggs = {},
							key,
							stateGroup,
							ikey;
						
							// here run the loop for stateGroups
							
							$.each(window.app.groups, function (index, group)
							{
							
								aggs[group.uuid] = {};
								
								for (var i in params)
								{
									
									if (params[i])
									{
										var key = params[i].substr(12);
										var stateGroup = params[i];
									}
									else
									{
										var key = 'default';
										var stateGroup = '';
									}
									
									//console.log('outside', 'param', params[i], 'key', key, 'stateGroup', stateGroup);
									
									ikey = group.uuid + "_" + key;
									
									tmp[ikey] = function(callback, index)
									{
										setTimeout(function()
										{
										
											$('#preloader span').text('Loading aggregrated timeline of \'' + group.name + '\'..');
											
											
									
											console.log('inside', 'param', params[i], 'key', key, 'stateGroup', stateGroup, eval(key));
											
										  $.ajax(
											{
												url: host + '/calc_planning/' 
																	+ group.uuid 
																	+ '?start=' 
																	+ window.app.settings.ranges.period.bstart 
																	+ '&end=' 
																	+ window.app.settings.ranges.period.bend
																	+ stateGroup
											})
											.success(
											function(data)
											{			
												
												aggs[group.uuid][key] = data;
												
								    		callback(null, true);
											})
											.fail(function()
											{
												//window.app.calls[group.uuid] = false;	
											}) 
							
										}, (index * 100) + 100) 
									}													
									$.extend(groups, tmp)
								
								}
								
							})
							
							//console.log(groups);
							
							async.series(groups,
							function(err, results)
							{
								
								window.app.aggs = aggs;
								
								localStorage.setItem('aggs', JSON.stringify(aggs));			
								
								callback(null, 'done');
													
							});	
					
						})
						.fail(function()
						{			
							window.app.calls['network'] = true;	
						})
	        }, 100);
		    },
		    
		    
		    
		    parent: function(callback)
		    {
	        setTimeout(function()
	        {
	        	$('#preloader span').text('Loading parent group..');
	        	
					  $.ajax(
						{
							url: host + '/parent',
						})
						.success(
						function(data)
						{			
						
							window.app.parent = data;
						
							localStorage.setItem('parent', JSON.stringify(data));
							
							$('#preloader .progress .bar').css({ width : '60%'});	
							
							window.app.calls['parent'] = true;		
							
			    		callback(null, 'done');
						})
						.fail(function()
						{
							window.app.calls['parent'] = true;
						})
	        }, 200);
		    },
    	
    	
		    
		    messages: function(callback)
		    {
					$('#preloader span').text('Loading messages..');	
	        
	        setTimeout(function()
	        {
					  $.ajax(
						{
							url: host + '/question?0=dm',
						})
						.success(
						function(data)
						{	
						
							window.app.messages = data;
						
							localStorage.setItem('messages', JSON.stringify(data));
							
							$('#preloader .progress .bar').css({ width : '80%'});		
							
							window.app.calls['messages'] = true;
									
			    		callback(null, 'done');
						})
						.fail(function()
						{
							window.app.calls['messages'] = false;
						})
	        }, 300);
		    },
		    
		    
		    
		    members: function(callback)
		    {
		    	$('#preloader span').text('Loading members..');
	        
	        setTimeout(function()
	        {
		    		
						// magic of loading group members
						// by producing an array of functional objects
						var members = {},
						tmp = {};
						
						// TODO: here or later should be checked
						// if the user already in the list ?
					
						$.each(window.app.groups, function (index, group)
						{
							tmp[group.uuid] = function(callback, index)
							{
								setTimeout(function()
								{
									
									$('#preloader span').text('Loading members of \'' + group.name + '\'..');
		    	
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
								
							localStorage.setItem('members', JSON.stringify(members));								
								
							$('#preloader .progress .bar').css({ width : '90%'});	
							
							
							// magic of loading group members
							// by producing an array of functional objects
							var members = {},
							tmp = {},
							slots = {},
							key,
							itype,
							ikey,
							params = ['&type=both'];
							
							params.unshift(null);
							
							//console.log('params: ', params);
			
							$.each(window.app.members, function (index, member)
							{
							
								slots[member.uuid] = {};
							
								$.each(params, function(index, param)
								{
									if (param != null)
									{
										key = param.substr(6);
										itype = param;
									}
									else {
										key = 'default';
										itype = '';
									}
									
									ikey = member.uuid + "_" + key;
							
									tmp[ikey] = function(callback, index)
									{
										setTimeout(function()
										{
											
											$('#preloader span').text('Loading timeslots of \'' + member.name + '\'..');
											
										  $.ajax(
											{
												url: host + '/askatars/' 
																	+ member.uuid 
																	+ '/slots?start=' 
																	+ window.app.settings.ranges.period.bstart 
																	+ '&end=' 
																	+ window.app.settings.ranges.period.bend
																	+ itype
											})
											.success(
											function(data)
											{			
												//console.log(member.uuid, data);
												
												slots[member.uuid][key] = data;
												
								    		callback(null, true);
											})
											.fail(function()
											{
											}) 
						
										}, (index * 100) + 100) 
									}					
									$.extend(members, tmp)
								
								})
		
							})
							
							console.log(members);
							
							async.series(members,
							function(err, results)
							{			
							
								//console.log('slots', slots);
								
								window.app.slots = slots;
								
								// TODO: come back to here later
								localStorage.setItem('slots', JSON.stringify(slots));				
									
								$('#preloader .progress .bar').css({ width : '100%'});	
								
								
								// console.log('slots:', window.app.slots);
							
								document.location = "#/dashboard"; 
								
							})
							
							
						})
					
	        }, 400);				
		
		    },
		    
			},
			function(err, results)
			{
				// TODO: perform some checks
			});	
			
			
			
    }
	], function (err, results)
	{
		// TODO: what to do here?
	})
	
	
}
	
preloader.prototype = {

	constructor: preloader,

	// TODO: make this one efficient working
	setupRanges: function()
	{						
	  var now = parseInt((new Date()).getTime() / 1000);
	  
	  var period = {
		  bstart: (now - 86400 * 7 * 1),
		  bend: (now + 86400 * 7 * 1),
		  start: Date.today().add({ days: -5 }),
		  end: Date.today().add({ days: 5 })
	  }
	  
	  window.app.settings = { 
	  	ranges: {
			  period: period,
			  reset: period
		  }
	  }
	},
	
}
preloader.$inject = ['$scope'];