$(function()
{
	'use strict';
	
	window.app.MessagesView = Backbone.View.extend(
	{
		tagName:  "tr",
		
		template: _.template($('#message-row-template').html()),
		
		render: function() 
		{
			var $el = $(this.el);
			$el.html(this.template(this.model.toJSON()));
			return this;
		}
		
	});
});