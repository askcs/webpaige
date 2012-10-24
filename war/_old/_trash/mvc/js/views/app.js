$(function($)
{
	'use strict';
	
	window.app.AppView = Backbone.View.extend(
	{
		// Main element
		el: $("#container"),
		
		
		
		
		// Counter template
		statsTemplate: _.template( $('#stats').html() ),
		
		
		
		
		// Declare events
		events: {
			'click h1'					:	'initialize',
			'keypress #search'	: 'search',
			'submit #compose'		: 'sendMsg',
			'submit #reply'			: 'replyMsg'
		},
		
		
		
		
		// Initialize main view
		initialize: function() 
		{
			//$('header h1').text(window.app.config.ui.lang.nl.header);
			
			this.table = $('<table id="messages-list"></table>');
			
			window.app.Messages.on('reset', this.addAll, this);
			window.app.Messages.on('all', this.render, this);
			window.app.Messages.on('view', this.view, this);
			window.app.Messages.on('reply', this.reply, this);
			window.app.Messages.on('compose', this.compose, this);
			window.app.Messages.on('delete', this.delete, this);
			
			window.app.MessageRouter.navigate('/messages/inbox', {trigger: true});
			
			var status = '<img src="img/ajax-loader.gif" style="vertical-align:middle;" /> Loading messages..';
				
			new Status(status);
			
			window.app.Messages.fetch({
		   xhrFields: { withCredentials: true },
		   success: function()
		   {
			   new Status('Messages loaded successfully. ✔');
		   },
		   error: function(xhr, response)
		   {
		   	 new Error({
		   	 	response:	response,
		   	 	message: 	'There was a problem with loading messages.' 
		   	 });
		   }
			});
			
			//window.app.Messages.graball();
			
			this.$statcount = $('#statcount');
			
			//window.app.Messages.sort('uuid');
		},
		
		
		
		
		// Render main view
		render: function()
		{
			
			this.$('nav ul li a')
				.removeClass('selected')
				.filter("[href='#/messages/" + (window.app.MessageFilter || "") + "']")
				.addClass('selected');
			
			if (window.app.MessageFilter == 'trash')
			{
				this.$('#secondary-nav').append('  |  <a href="#">Empty trash</a>');
			}
			else
			{
				this.$('#secondary-nav').html('').append('<a href="#/message/compose">New message</a>');				
			}
			
			var count = window.app.Messages.unread().length;
			this.$statcount.html( this.statsTemplate( { count: count } ) );
		},
		
		
		
		
		// Needs development
		search: function(e)
		{
			if ( e.keyCode === window.app.config.keys.enter ){
				console.log('search inited with: ', $('#search input').val());
				return false;
			}
		},
		
		
		
		
		
		// Change languages
		/*
		language: function()
		{
			//var language = $('#languages').val();
			console.log('language: ');
		},
		*/
		
		
		
		
		// Add individual messages
		addOne: function(message)
		{
			var view = new window.app.MessagesView({model: message});
			$("#messages-list").append(view.render().el);
		},
		
		
		
		
		// Add'em all
		addAll: function()
		{
			this.$('#content').html('').append(this.table);
			this.$("#messages-list").html('');
			
			var messages = window.app.Messages.group(window.app.MessageFilter);
			(_.size(messages) > 0) ? _.each(messages, this.addOne) : $("#messages-list").html('<p>There is no messages in this box.</p>');
		},
		
		
		
		
		// View message
		view: function()
		{
			this.$('#messages-list').html('');
			//this.$('#box-btns').html('');			
					
			var message = window.app.Messages.grab(window.app.MessageID);
			
			if (message.state == 'new')
			{
				window.app.Messages.fetch({
			   xhrFields: { withCredentials: true },
			   type: 'post',
			   url: window.app.Config.rest.host + 'question/changeState',
			   data: '{"ids":[' + message.uuid + '],"state":"SEEN"}',
			   success: function() { },
			   error: function(xhr, response) { }
				});
			}
			
			var view = new window.app.MessageView(message);
			$("#content").html(view.render().el);
		},
		
		
		
		
		// Reply message
		reply: function()
		{
			this.$('#messages-list').html('');	
						
			var message = window.app.Messages.grab(window.app.MessageID);
			var view = new window.app.ReplyView(message);
			$("#content").html(view.render().el);
		},
		
		replyMsg: function()
		{
		  var data = '{"members":[' + 
		  						'"beheer"' + 
		  						'],"content":"' + 
		  						$('#reply .content').val().trim() + 
		  						'","subject":"' + 
		  						$('#reply .subject').val().trim() +
		  						'","types":[' + 
		  						'"paige"' + 
		  						']}';
		  
			window.app.Messages.fetch({
		   xhrFields: { withCredentials: true },
		   type: 'post',
		   url: window.app.Config.rest.host + 'question/sendDirectMessage',
		   data: data,
		   success: function()
		   {
		   },
		   error: function(xhr, response)
		   {
		   	 new Error({
		   	 	response:	response,
		   	 	message: 	'There was a problem with sending the message.' 
		   	 });
		   }
			});
			
			window.app.MessageRouter.navigate('/messages/inbox', {trigger: true});
			
		},
		
		
		
		
		// Compose a message
		compose: function()
		{
			this.$('#messages-list').html('');	
						
			var view = new window.app.ComposeView();
			$("#content").html(view.render().el);
		},
		
		sendMsg: function()
		{
		  var data = '{"members":[' + 
		  						'"beheer"' + 
		  						'],"content":"' + 
		  						$('#compose .content').val().trim() + 
		  						'","subject":"' + 
		  						$('#compose .subject').val().trim() +
		  						'","types":[' + 
		  						'"paige"' + 
		  						']}';
		  						
			window.app.Messages.fetch({
		   xhrFields: { withCredentials: true },
		   type: 'post',
		   url: window.app.Config.rest.host + 'question/sendDirectMessage',
		   data: data,
		   success: function()
		   {
		   },
		   error: function(xhr, response)
		   {
		   	 new Error({
		   	 	response:	response,
		   	 	message: 	'There was a problem with sending the message.' 
		   	 });
		   }
			});
			
			window.app.MessageRouter.navigate('/messages/inbox', {trigger: true});
			
		},
		
		
		delete: function()
		{					
			var message = window.app.Messages.grab(window.app.MessageID);
			
			window.app.Messages.fetch({
		   xhrFields: { withCredentials: true },
		   type: 'post',
		   url: window.app.Config.rest.host + 'question/changeState',
		   data: '{"ids":[' + message.uuid + '],"state":"trash"}',
		   success: function() { },
		   error: function(xhr, response) { }
			});
			
			// How to redirect to inbox
		}
		
		
		
	});
	
	
	
	
	
	
	
	// Setting interval for periodicly grabbing data from back-end
	setInterval(function()
	{
		new Status('<img src="img/ajax-loader.gif" style="vertical-align:middle" /> Loading messages..');
		
		//window.app.Messages.graball();
		
		window.app.Messages.fetch({
	   xhrFields: { withCredentials: true },
	   success: function()
	   {
		   new Status('Messages loaded successfully. ✔');
	   },
	   error: function(xhr, response)
	   {
	   	 new Error({
	   	 	response:	response,
	   	 	message: 	'There was a problem with loading messages.' 
	   	 });
	   },
	   silent: true
		});
		
	}, 1000 * 60 * 1);
	
	
	
	
	
	
	
	
	// Handle displaying status message
	var Status = function(status)
	{
		$("#status").html(status);
	}
	
	
	
	
	
	
	
	// Handle displaying error messages
	var Error = function(error)
	{
		$("#status").html(error.message + ' <span style="color:red">' + error.response.status + ' (' + error.response.statusText + ')</span>');
	}
	
	
	
	
	
	
	
});