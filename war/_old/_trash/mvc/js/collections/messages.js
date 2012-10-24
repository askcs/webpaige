(function()
{
	'use strict';
	
	var MessagesList = Backbone.Collection.extend(
	{
		model: window.app.Message,
		
		url: function()
		{
			return window.app.Config.rest.host + 'question';
		},
		
		// webpaige: new Connect(),
		
		group: function(box)
		{
			switch(box)
			{
				case 'inbox':
					return this.filter(
						function(message)
						{
							return message.get('box') === 'inbox' && message.get('state') !== 'trash'; 
						}
					);
				break
				case 'outbox':
					return this.filter(
						function(message)
						{
							return message.get('box') === 'outbox';
						}
					);
				break
				case 'trash':
					return this.filter(
						function(message)
						{
							return message.get('state') === 'trash'; 
						}
					);
				break
			}
		},
		
		grab: function()
		{
			return this.get(window.app.MessageID).attributes;
		},
		
		unread: function()
		{
			return this.filter(
				function(message)
				{
					return message.get('box') === 'inbox' && message.get('state') === 'new'; 
				}
			);
		},
		
/*
		graball: function()
		{
			console.log(this.webpaige.fetch);
		},
*/
		
		comparator: function(message)
		{
			//return message.get('creationTime');
		}
		
	});
	
	window.app.Messages = new MessagesList;
	
})();
