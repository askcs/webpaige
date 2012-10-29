(function()
{
	'use strict';
	
	var Workspace = Backbone.Router.extend(
	{
		routes:{
			'messages/:box'				: 'filter',
			'message/view/:id'		:	'view',
			'message/reply/:id'		:	'reply',
			'message/compose'			:	'compose',
			'message/delete/:id'	:	'delete'
		},
		
		filter: function(box)
		{
			window.app.MessageFilter = box.trim() || "";
			window.app.Messages.trigger('reset');
		},
		
		view: function(id)
		{
			window.app.MessageID = id.trim() || "";
			window.app.Messages.trigger('view');
		},
		
		reply: function(id)
		{
			window.app.MessageID = id.trim() || "";
			window.app.Messages.trigger('reply');
		},
		
		compose: function()
		{
			window.app.Messages.trigger('compose');
		},
		
		delete: function(id)
		{
			window.app.MessageID = id.trim() || "";
			window.app.Messages.trigger('delete');
		}
		
	});
	
	window.app.MessageRouter = new Workspace;
	
	Backbone.history.start();
})();