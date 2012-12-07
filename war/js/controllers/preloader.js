'use strict';
/* Preloader controller */

var preloader = function($scope)
{	
	this.initSettings();	
	this.setupRanges();
	
	$.ajaxSetup(
	{
    contentType: 'application/json',
    xhrFields: { 
    	withCredentials: true
    },
    beforeSend: function(xhr)
    {
    	xhr.setRequestHeader('X-SESSION_ID', session.getSession());
    }		
	})
	
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
			
				localStorage.setItem('resources', JSON.stringify(user));
				$('#preloader .progress .bar').css({ width : '20%'});	
				$('#preloader span').text('Resources loaded');		
								      
    		callback(null, user);
			})
			.fail(function()
			{
			})
    },
    
    function(user, callback)
    {
    	async.series({
		    
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
							
							localStorage.setItem('contacts', data);
							$('#preloader .progress .bar').css({ width : '40%'});	
							$('#preloader span').text('Contacts loaded');		
							
			    		callback(null, 'done');
						})
						.fail(function()
						{
						})
	        }, 100);
		    },
		    
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
		    
			},
			function(err, results)
			{
				//console.log('results of parallel calls: ', results);
				document.location = "#/dashboard"; 
			});	
			
    }
	], function (err, results)
	{
		console.log('something went wrong with resources call..');   
	});
}
	
preloader.prototype = {

	constructor: preloader,
	
	initSettings: function()
	{
		webpaige.set('config', '{}');
	},

	setupRanges: function()
	{				
		var trange = {};	
		
	  var now = parseInt((new Date()).getTime() / 1000);
	  
	  trange.bstart = (now - 86400 * 7 * 1);
	  trange.bend = (now + 86400 * 7 * 1);					
		
	  trange.start = new Date();
	  trange.start = Date.today().add({ days: -5 });
	  trange.end = new Date();
	  trange.end = Date.today().add({ days: 5 });
	  
	  webpaige.config('trange', trange);	
	  webpaige.config('treset', trange);
	}
}
preloader.$inject = ['$scope'];