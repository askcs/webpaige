$(function()
{
	'use strict';
	
	window.app.ComposeView = Backbone.View.extend(
	{
		tagName:  "div",
		
		template: _.template($('#message-compose-template').html()),
		
		render: function() 
		{
			var $el = $(this.el);
			this.options.parentbox = window.app.MessageFilter;
			$el.html(this.template(this.options));
			return this;
		}
		
	});
});