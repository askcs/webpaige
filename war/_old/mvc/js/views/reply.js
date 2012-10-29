$(function()
{
	'use strict';
	
	window.app.ReplyView = Backbone.View.extend(
	{
		tagName:  "div",
		
		template: _.template($('#message-reply-template').html()),
		
		render: function() 
		{
			var $el = $(this.el);
			this.options.parentbox = window.app.MessageFilter;
			$el.html(this.template(this.options));
			return this;
		}
		
	});
});