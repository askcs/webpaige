$(function()
{
	'use strict';
	
	window.app.MessageView = Backbone.View.extend(
	{
		tagName:  "div",
		
		template: _.template($('#message-template').html()),
		
		render: function() 
		{
			var $el = $(this.el);
			this.options.parentbox = window.app.MessageFilter;
			$el.html(this.template(this.options));
			return this;
		}
		
	});
});