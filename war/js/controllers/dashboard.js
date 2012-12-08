//'use strict';
/* Dashboard controller */

var dashboard = function($scope)
{
	this.sync();
	//this.load;
	
	if (!localStorage.getItem('slots') &&
			!localStorage.getItem('wishes') &&
			!localStorage.getItem('aggs'))
	{
		console.log('no slots');
	}
}

dashboard.prototype = {

	constructor: dashboard,
	
	sync: function()
	{		
		async.series({
	    
	    slots_seperate: function(callback, uuid)
	    {
	      setTimeout(function()
	      {
				  $.ajax(
					{
						url: host + '/askatars/' + window.app.resources.uuid + '/slots?start=' + window.app.ranges.period.bstart + '&end=' + window.app.ranges.period.bend
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
		
	}

}
dashboard.$inject = ['$scope'];