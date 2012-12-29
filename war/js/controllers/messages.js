'use strict';
/* Messages controller */

var messagesCtrl = function($scope)
{


	$('a[href=#dashboard]').parent().removeClass('active');
	$('a[href=#messages]').parent().addClass('active');
	$('a[href=#groups]').parent().removeClass('active');
	
	this.render();  
	
	this.callbacks = {};
	
	this.register('messages', this.render );
	
	var that = this;
	setInterval(function() { that.sync.call( that ); }, 500000);
	
}

//messages.prototype = $.extend({}, app.prototype, {
messagesCtrl.prototype = {

	constructor: messagesCtrl,
	
	callbacks: {},
	
	register: function(key, callback)
	{
		if (!this.callbacks[key])
		{
			this.callbacks[key] = [];
		}
		this.callbacks[key].push(callback);
	},
	
	render: function()
	{
		var mesdata = JSON.parse(localStorage.getItem('messages'));
		console.log(mesdata);
	},
	
	sync: function()
	{			
		var that = this;	
	  
		async.series({
		    
	    parent: function(callback)
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
			var cb = that.callbacks.messages;
			if (cb)
			{
				$.each(cb, function(k, v)
				{
					v.apply(this, arguments);								
				})
  		}
		})
		
	}
	
	

}
//)

messagesCtrl.$inject = ['$scope'];