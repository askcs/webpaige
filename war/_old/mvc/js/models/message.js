(function()
{
	'use strict';
	
	window.app.Message = Backbone.Model.extend(
	{
  	idAttribute: "uuid",
  	
		defaults: 
		{
			question_text: 'no subject'
		},
		
		initialize: function()
		{
			this.set({ 'subject': 			this.get('subject') ? this.get('subject').charAt(0).toUpperCase() + this.get('subject').slice(1) : 'No subject' });
			this.set({ 'question_text': this.get('question_text').charAt(0).toUpperCase() + this.get('question_text').slice(1) });
			this.set({ 'creationTime': 	(new Date(this.get('creationTime'))).toString('ddd dd MMM yyyy HH:mm') });
			this.set({ 'state': 				this.get('state').toLowerCase() });
			this.set({ 'requester': 		this.get('requester').split('personalagent/')[1].split('/')[0] });
		}
		
	});
})();