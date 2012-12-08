'use strict';
/* Preloader controller */

var preloader = function($scope)
{
	// TODO: is this needed anymore?
	this.initSettings();	
	
	// setup ranges 
	this.setupRanges();
	
	async.waterfall([
    
    function(callback)
    {
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
				$('#preloader span').text('Resources loaded');
				
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
		   
/*
		    contacts: function(callback)
		    {
	        setTimeout(function()
	        {
					  $.ajax(
						{
							url: host + '/network/searchPaigeUser',
							type: 'post',
							data: '{"key":""}' 
						})
						.success(
						function(data)
						{		
						
							window.app.contacts = data;
							
							localStorage.setItem('contacts', data);
							
							$('#preloader .progress .bar').css({ width : '40%'});	
							$('#preloader span').text('Contacts loaded');
							
							window.app.calls['contacts'] = true;		
							
			    		callback(null, 'done');
						})
						.fail(function()
						{
							window.app.calls['contacts'] = false;
						})
	        }, 100);
		    },
*/
		    
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
						
							window.app.messages = data;
						
							localStorage.setItem('messages', JSON.stringify(data));
							
							$('#preloader .progress .bar').css({ width : '60%'});	
							$('#preloader span').text('Messages loaded');		
							
							window.app.calls['messages'] = true;
									
			    		callback(null, 'done');
						})
						.fail(function()
						{
							window.app.calls['messages'] = false;
						})
	        }, 200);
		    },
    	
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
						
							window.app.groups = data;			
						
							localStorage.setItem('groups', JSON.stringify(data));
								
							window.app.calls['network'] = true;	
							
							$('#preloader .progress .bar').css({ width : '80%'});	
							$('#preloader span').text('Groups loaded');	
								
			    		callback(null, 'done');
						})
						.fail(function()
						{			
							window.app.calls['network'] = true;	
						})
	        }, 300);
		    },
		    
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
						
							window.app.parent = data;
						
							localStorage.setItem('parent', JSON.stringify(data));
							
							$('#preloader .progress .bar').css({ width : '100%'});	
							$('#preloader span').text('Groups loaded');
							
							window.app.calls['parent'] = true;		
							
			    		callback(null, 'done');
						})
						.fail(function()
						{
							window.app.calls['parent'] = true;
						})
	        }, 400);
		    }
		    
			},
			function(err, results)
			{
				// TODO: perform some checks
				//console.log('results of parallel calls: ', results);
				
				//window.results = results;
								
				document.location = "#/dashboard"; 
			});	
			
    }
	], function (err, results)
	{
		// TODO: what to do here?
		console.log('something went wrong with resources call..');   
	})
}
	
preloader.prototype = {

	constructor: preloader,
	
	// TODO: is this needed anymore?
	initSettings: function()
	{
		webpaige.set('config', '{}');
	},

	// TODO: make this one efficient working
	setupRanges: function()
	{				
		//var trange = {};	
		
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