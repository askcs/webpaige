/* (function(){ */
	//'use strict';

	window.addEventListener( 'load', windowInit, false );
	
	function windowInit()
	{
	 	pageInit('messages', 'true');	
 	
	 	$('a[rel=tooltip]').tooltip();
	 	
	 	if (webpaige.getRole() != 1)
	 	{
		 	$('#smsCheck').hide();
	 	}
	 	
		$(".chzn-select").chosen();
		$(".chzn-select-deselect").chosen(
		{
			allow_single_deselect:true
		});
	
		$('#messageSender').click(function()
	  {
	    $('#composeMessage').modal('hide');
	    var receivers = $('#receivers').val();
	    var title = $('#title').val();
	    var message = $('textarea#message').val();
	    resetForms();
			sendMessage(receivers, title, message);
	  });
	  
	  
/*
	  $('#sms').click(function () {
			if(this.checked)
			{
				$('#subjectDiv').hide();
				$('.counter').show();
			}
			else
			{
				$('#subjectDiv').show();
				$('.counter').hide();
			}
		});
*/
		
		
		
		/*
		$("#groups .chzn-select").chosen().change(
			function() {
				console.log('groups changed');
			}
		);
		*/
		
		
		//default usage
		//$("#msgcontent").charCount();
		//custom usage
/*
		$("#msgcontent").charCount({
			allowed: 160,		
			warning: 20,
			counterText: 'Characters left: '	
		});
*/

		
	  loadUsers(); 
	  //loadGroups(); 
		loadMessages();
		addEventListeners();
		
/*
		if(confirmUser('ulusoy.cengiz@gmail.com'))
		{
			console.log('returned true');
		}
		else
		{
			console.log('returned false');			
		}
*/

	}


	function addEventListeners()
	{
		$('#inbox a').click(function(){ loadMessages('inbox'); });
		$('#outbox a').click(function(){ loadMessages('outbox'); });
		$('#trash a').click(function(){ loadMessages('trash'); });
		
		
		
	}


	function composeMessage()
	{
		resetForms();
		$('#composeMessage').modal('show');
	}
	
	
	function sendMessage()
	{
	  $('#composeMessage').modal('hide');
	  
	  var receivers = $('#compose select').val(); 
		
	  var subject = $('#compose #title').val();
	  //var content = $('#compose textarea').val().replace( /\r?\n/g, "\r\n" );
	  var content = $('#compose textarea').val();
	  
	  
	  //console.log('message',content);
	  
	  //resetForms();
	  
	  /*  
		for(var n in receivers)
			receivers[n] = '"' + receivers[n] + '"';
		*/ 
		
/*
		var receivers = [];
		
		console.log(rawReceivers);
		
		
		for(var n in rawReceivers)
		{
			if (confirmGroup(rawReceivers[n]))
			{
				
			}
			else
			{
				console.log(rawReceivers[n]);
			}
		}
*/
		
		var sms = $('input#sms[name="sms"]:checked').val();
		var paigem = $('input#paigem[name="paigem"]:checked').val();
		var email = $('input#email[name="email"]:checked').val();
		
		var types = [];
		
		if (sms) types.push('sms');
		if (paigem) types.push('paige');
		if (email) types.push('email');
		
		for(var n in types)
			types[n] = '"' + types[n] + '"';
		
		for(var n in receivers)
			receivers[n] = '"' + receivers[n] + '"';
			
	  var query = '{"members":[' + 
	  						receivers + 
	  						'],"content":"' + 
	  						content + 
	  						'","subject":"' + 
	  						subject +
	  						'","types":[' + 
	  						types + 
	  						']}';
	  
	  //console.log('query :', query);
	  
		webpaige.con(
			options = {
				type: 'post',
				path: '/question/sendDirectMessage',
				json: query,
				loading: 'Sending message(s)..',
				message: 'Message sent!'
				,session: session.getSession()	
			},
			function(data)
		  {  
				loadMessages('inbox');
			}
		); 
		
		
		
		
	}
	
	function replyMessage(uuid)
	{
		$('#displayMessageModal').modal('hide');
		
		resetForms();
		var messages = localStorage.getItem('messages');
	  var messages = messages ? JSON.parse(messages) : undefined;
		for (var n in messages)
		{
			if (messages[n].uuid === uuid)
			{
		    $('#composeMessage').modal('show');
		    
		    $('#receivers').append(
			    $('<option></option>')
					        .val(messages[n].requester)
					        .html(messages[n].requester)
					        .attr("selected", "selected"));
				$("#receivers").trigger("liszt:updated");
	
		    //$('#receivers:selected').val(messages[n].requester); 
	    	//$(".chzn-select").trigger("liszt:updated");
			}
		}
	}
	
	
	function displayMessage(uuid, type)
	{
		
		$('#displayMessageActions').remove();
		var actions = $('<div id="displayMessageActions" class="modal-footer"></div>');
		
		actions.append('<a class="btn" data-dismiss="modal" href="#"><i class="icon-remove"></i> Close</a>');
		
		actions.append('<a class="btn btn-danger" onclick="removeMessage(\''+uuid+'\');"><i class="icon-white icon-trash"></i> Delete Message</a>');
		
		actions.append('<a class="btn btn-success" onclick="replyMessage(\''+uuid+'\');"><i class="icon-white icon-ok"></i> Reply Message</a>');
		
		$('#displayMessageModal').append(actions);
		
		
		$('#displayMessageModal').modal('show');
		
		var messages = localStorage.getItem('messages');
	  var messages = messages ? JSON.parse(messages) : undefined;
		for (var n in messages)
		{
			if (messages[n].uuid === uuid)
			{
				if (messages[n].state == 'NEW')
				{
					var query = '{"ids":[' + 
				  						messages[n].uuid + 
				  						'],"state":"SEEN"}';
					webpaige.con(
						options = {
							type: 'post',
							path: '/question/changeState',
							json: query,
							loading: 'Changing state..'
							,session: session.getSession()	
						},
						function(data)
					  {  
							loadMessages('inbox');
						}
					); 
				}
				if (type == 'inbox')
				{
					$('#messageDirection').html('From');
					$('#messageReceiver').html(messages[n].requester.split('personalagent/')[1].split('/')[0]);
				}
				else
				{
					$('#messageDirection').html('To');
					$('#messageReceiver').html(messages[n].responder);
				}
				
				var datetime = new Date(messages[n].creationTime);
				//var date = new Date(messages[n].creationTime * 1000);
				$('#messageDate').html(datetime.toString("ddd dd MMM yyyy HH:mm"));
				
				if (messages[n].subject != null)
				{
					var subject = messages[n].subject;
				}
				else
				{
					var subject = 'No subject';
				}
				$('.messageSubject').html(subject);
				$('#messageContent').html(messages[n].question_text);			
			}
		}
	}
	
	
	
	function removeMessage(uuid, type)
	{
		$('#displayMessageModal').modal('hide');
	  var query = '{"ids":[' + 
	  						uuid + 
	  						'],"state":"TRASH"}';
		webpaige.con(
			options = {
				type: 'post',
				path: '/question/changeState',
				json: query,
				loading: 'Changing state..'
				,session: session.getSession()	
			},
			function(data)
		  {  
				loadMessages(type);
			}
		); 
	}
	
	
	
	function removeMessages(type)
	{
		var ids = [];
		
	  var values = $('#tb-' + type + ' input:checkbox:checked').map(function ()
	  {
		  if (this.value != 'on')
		  {
		  	ids.push(this.value); 
		  }
		}).get();
		
	  var query = '{"ids":[' + 
	  						ids + 
	  						'],"state":"TRASH"}';
	  						
		webpaige.con(
			options = {
				type: 'post',
				path: '/question/changeState',
				json: query,
				loading: 'Moving messages to trash..'
				,session: session.getSession()	
			},
			function(data)
		  {  
				loadMessages(type);
			}
		); 
	}
	
	
	
	function deleteMessage(uuid, type)
	{
	  var query = '{"members":["' + uuid + '"]}';
	  						
		webpaige.con(
			options = {
				type: 'post',
				path: '/question/deleteQuestions',
				json: query,
				loading: 'Deleting message..'
				,session: session.getSession()	
			},
			function(data)
		  {  
				loadMessages('trash');
			}
		);
	}
	
	
	function emptyTrash()
	{
		var ids = [];
		
	  var values = $('#tb-trash input:checkbox:checked').map(function ()
	  {
		  if (this.value != 'on')
		  {
		  	ids.push('"' + this.value + '"'); 
		  }
		}).get();
		
	  var query = '{"members":[' + 
	  						ids + 
	  						']}';
	  						
		webpaige.con(
			options = {
				type: 'post',
				path: '/question/deleteQuestions',
				json: query,
				loading: 'Emptying trash..'
				,session: session.getSession()	
			},
			function(data)
		  {  
				loadMessages('trash');
			}
		); 
	}
	
	
	function resetForms()
	{
		//$('form')[0].reset();
		//$('form')[1].reset();
		$('.chzn-select option:selected').removeAttr('selected');
	  $(".chzn-select").trigger("liszt:updated");
	}
	
	
	
	function loadMessages(type)
	{
		switch(type)
		{
			case 'inbox':
				var url = '/question?0=dm';
				var btn = $('#inbox');
				var status = 'Loading inbox..';
			break;
			case 'outbox':
				var url = '/question?0=sent';
				var btn = $('#outbox');
				var status = 'Loading outbox..';
			break;
			case 'trash':
				var url = '/question';
				var btn = $('#trash');
				var status = 'Loading trash..';
			break;
			default:
				var url = '/question?0=dm';
				var btn = $('#inbox');
				var status = 'Loading inbox..';
				var type = 'inbox';
		}
		
		$('.nav-tabs li').removeClass('active');
		btn.addClass('active');
		
		webpaige.con(
			options = {
				path: url,
				loading: status,
				label: type
				,session: session.getSession()	
			},
			function(data, label)
		  {  
		  	// needing this for replying messages 
		  	localStorage.setItem("messages", JSON.stringify(data)); 
		  		
		  	var filtered = [];
				/*
		  	var uniquesIdx = {};
		  	var uniques = [];
				*/
		  	
		  	//var data = data ? JSON.parse(data) : undefined;
				
				data.reverse(
					data.sort(
						function(a,b)
						{
							return (a.creationTime - b.creationTime);
						}
					)
				);
		  	
		  	var resources = JSON.parse(localStorage.getItem('resources'));
		  
				switch(type)
				{
				
					case 'inbox':
						for(var n in data)
						{
							//if (data[n].module == 'message' && data[n].requester != resources.uuid && data[n].state != 'TRASH')
							if (data[n].box == 'inbox' && data[n].requester != resources.uuid && data[n].state != 'TRASH')
							{
								filtered.push(data[n]);
								/*
								for (var i in filtered)
								{
									if (!uniquesIdx[filtered[i].requester])
									{
										uniquesIdx[filtered[i].requester] = filtered[i];
										uniques.push(filtered[i]);
									}
								}
								*/
							}
						}
			  		renderMessages(filtered, type);
					break;
					
					case 'outbox':
			  		//renderMessages(data, type);
						for(var n in data)
						{
							//if (data[n].module == 'message' && data[n].state != 'TRASH')
							if (data[n].box == 'outbox' && data[n].state != 'TRASH')
							{
								filtered.push(data[n]);
							}
						}
			  		renderMessages(filtered, type);
					break;
					
					case 'trash':
			  		//renderMessages(data, type);
						for(var n in data)
						{
							if (data[n].state == 'TRASH')
							{
								filtered.push(data[n]);
							}
						}
			  		renderMessages(filtered, type);
					break;
					
					default:
						for(var n in data)
						{
							if (data[n].box == 'inbox' && data[n].requester != resources.uuid)
							//if (data[n].module == 'message' && data[n].requester != resources.uuid)
							{
								filtered.push(data[n]);
							}
						}
			  		renderMessages(filtered, type);
				}
			}
		);
		
	}
	
	
	function renderMessages(data, type)
	{
	  //console.log(data);
	 	
	 	$('#live').remove();
	 	
		var live = $('<div id="live"></div>');
	  
	 	if (data && data.length > 0)
	 	{                     
			var table = $('<table id="tb-' + type + '" class="table table-striped"></table>');
			var thead = $('<thead></thead>');
			var theadtr = $('<tr></tr>');
			theadtr.append('<th><input type="checkbox" onclick="toggleChecked(\'' + type + '\', this.checked)" /></th>');
			
			if (type == 'trash')
			{
				theadtr.append('<th>From</th>');
				theadtr.append('<th>To</th>');
			}
			else
			{
				var direction = (type == 'outbox') ?  'To' : 'From';
				if (type == 'inbox')
					theadtr.append('<th></th>');
					
				theadtr.append('<th>'+direction+'</th>');
			}
			
			theadtr.append('<th>Subject</th>');
			theadtr.append('<th>Date</th>');
			theadtr.append('<th></th>');
			thead.append(theadtr);
			table.append(thead);
			var tbody = $('<tbody></tbody>');
			
	    for(var n in data)
	    { 			
	    	var tbodytr = $('<tr></tr>');
				tbodytr.append('<td><input type="checkbox" class="checkbox" value="'+data[n].uuid+'" /></td>');
			
				if (type == 'inbox')
				{
					var state = (data[n].state == 'NEW') ?  '<span class="label label-info">New</span>' : '';
					tbodytr.append('<td>'+state+'</td>');
				}
				
				if (type == 'trash')
				{
					tbodytr.append('<td>'+data[n].responder[0].split('personalagent/')[1].split('/')[0]+'</td>');
					tbodytr.append('<td>'+data[n].requester.split('personalagent/')[1].split('/')[0]+'</td>');
				}
				else
				{
					var responders = '';
					
					if (data[n].responder.length > 1)
					{
						responders = 'More than one user';
						/*
						for (var m in data[n].responder)
						{
							responders = responders + ', ' + data[n].responder[m].split('personalagent/')[1].split('/')[0];
						}
						*/
					}
					else
					{
						responders = data[n].responder[0].split('personalagent/')[1].split('/')[0];
						/*
						var groups = JSON.parse(webpaige.get('groups'));
						for (var d in groups)
						{
							if (groups[d].uuid == responders)
							{
								responders = groups[d].name;
							}
						}
						*/
					}
					
					var person = (type == 'outbox') ?  responders : data[n].requester.split('personalagent/')[1].split('/')[0];
					
					/*
					var person = (type == 'outbox') ?  data[n].responder.split('personalagent/')[1].split('/')[0] : data[n].requester.split('personalagent/')[1].split('/')[0];
					*/

					tbodytr.append('<td>'+person+'</td>');
				}			
				
				var subject = (data[n].subject == null) ? 'No subject' : data[n].subject;
				tbodytr.append('<td><a onclick="displayMessage(\''+data[n].uuid+'\', \''+type+'\');" rel="tooltip" title="'+data[n].question_text+'">'+subject+'</a></td>');
				
				var datetime = new Date(data[n].creationTime);
				datetime = datetime.toString("ddd dd MMM yyyy HH:mm");
				tbodytr.append('<td>'+datetime+'</td>');
				
				tdbtns = $('<td></td>');
				btngroup = $('<div class="btn-group"></div>');
				
				if (type == 'inbox')
				{
					btngroup.append('<a class="btn btn-mini" onclick="replyMessage(\''+data[n].uuid+'\');"><i class="icon-share-alt"></i></a>');
				}
				
		    if (type == 'trash')
		    {
					btngroup.append('<a class="btn btn-mini" onclick="deleteMessage(\''+data[n].uuid+'\');"><i class="icon-trash"></i></a>');
		    }
		    else
		    {
					btngroup.append('<a class="btn btn-mini" onclick="removeMessage(\''+data[n].uuid+'\', \''+type+'\');"><i class="icon-trash"></i></a>');
		    }
		    
				tdbtns.append(btngroup);
				tbodytr.append(tdbtns);
				
				tbody.append(tbodytr);
	    }
	    
	    if (type == 'trash')
	    {
	    	tbody.append('<tr><td colspan="6"><a class="btn btn-danger" onclick="emptyTrash();"><i class="icon-trash icon-white"></i> Delete permanently</a></td></tr>');
	    }
	    else
	    {
	    	tbody.append('<tr><td colspan="6"><a class="btn" onclick="removeMessages(\''+type+'\');"><i class="icon-trash"></i> Remove selected</a></td></tr>');
	    }
	    
	    table.append(tbody);
	    $(live).append(table);
	  }			      
	 	else
	 	{
			$(live).append('<p>There are no messages.</p>');
	 	}
	 	
	 	$('#content').html(live);
		
	}
	
	
	
	function loadUsers()
	{ 
	  var query = '{"key":""}';
		webpaige.con(
			options = {
				type: 'post',
				path: '/network/searchPaigeUser',
				json: query,
				loading: 'Searching for users in network..'
				,session: session.getSession()	
			},
			function(data)
		  {  
			  var data = data ? JSON.parse(data) : undefined;
			  
			  var users = $('<optgroup label="USERS"></optgroup>');
			  
				if (data && data.length > 0)
				{
				
					//webpaige.set('users', JSON.stringify(data));
					
			    for(var n in data)
			    {
			    	$(users).append("<option value=" + data[n].id + ">" + data[n].name + "</option>");
			    }
			    $("#receivers .chzn-select").append(users);
			    //$("#receivers .chzn-select").trigger("liszt:updated");
			    
			    //
				} 
			}
		);
		
		
		webpaige.con(
			options = {
				path: '/network',
				loading: 'Loading group lists..'
				,session: session.getSession()	
			},
			function(data)
		  {  
			  //var data = data ? JSON.parse(data) : undefined;
			  var groups = $('<optgroup label="GROUPS"></optgroup>');
			  
				if (data && data.length > 0)
				{
					// this is needed for checking group uuid's for sending messages
					webpaige.config('groups', data);
					
			    for(var n in data)
			    {
			    	$(groups).append("<option value=" + data[n].uuid + ">" + data[n].name + "</option>");
			    }
			    $("#receivers .chzn-select").append(groups);
			    $("#receivers .chzn-select").trigger("liszt:updated");
				} 
			}
		); 
		
		
	}
	
	
	
/*
	function loadUsers()
	{
	  var query = '{"key":""}';
		webpaige.con(
			options = {
				type: 'post',
				path: '/network/searchPaigeUser',
				json: query,
				loading: 'Searching for users in network..'
				,session: session.getSession()	
			},
			function(data)
		  {  
				renderUsers(data);
			}
		); 
	}
	
	function renderUsers(data)
	{
	  var data = data ? JSON.parse(data) : undefined;
	  
		if (data && data.length > 0)
		{
	    for(var n in data)
	    {
	    	$('#receivers .chzn-select').append("<option value=" + data[n].id + ">" + data[n].name + "</option>");
	    }
	    $("#receivers .chzn-select").trigger("liszt:updated");
		}  
	}
	
	function loadGroups()
	{
		webpaige.con(
			options = {
				path: '/network',
				loading: 'Loading group lists..'
				,session: session.getSession()	
			},
			function(data)
		  {  
				renderGroups(data);
			}
		); 
	}
	
	function renderGroups(data)
	{
	  //var data = data ? JSON.parse(data) : undefined;
	  
		if (data && data.length > 0)
		{
	    for(var n in data)
	    {
	    	$('#groups .chzn-select').append("<option value=" + data[n].uuid + ">" + data[n].name + "</option>");
	    }
	    $("#groups .chzn-select").trigger("liszt:updated");
		}  
	}
*/
	
		
	function toggleChecked(uuid, status)
	{
		var ids = "#tb-" + uuid.replace(/([@.:#])/g, '\\$1') + " input"; 
		$(ids).each( function()
		{
			$(this).attr("checked",status);
		})
	}
	
	
/*
	function confirmGroup(guuid)
	{
	
		//debugger;
		
		var groups = webpaige.config('groups');
		
		for (var i in groups)
		{
			if (groups[i].uuid == guuid)
			{					
				webpaige.con(
					options = {
						path: '/network/'+groups[i].uuid+'/members',
						loading: 'Loading members..',
						label: 'members'
						,session: session.getSession()	
					},
					function(data, label)
				  {
				  	data = JSON.parse(data);
				  	  
			  		//console.log('group members :', JSON.parse(data));
			  		
			  		for (var m in data)
			  		{
				  		//receivers.push(data[m].uuid);
				  		
				  		console.log(data[m].uuid);
			  		}
					}
				);
				
				return true;				
			}
			else
			{
				return false;
			}
		}		
	}
*/
	
	
	
/*
	function confirmUser(uuid)
	{
		var users = JSON.parse(webpaige.get('users'));
		
		console.log(users);
		
		for (var i in users)
		{
			//console.log(users[i].id);
			if (users[i].id == uuid)
			{
				return true;
			}
			else
			{
				return false;
			}
		}
	}
*/

	
/* })(); */









/*
 * 	Character Count Plugin - jQuery plugin
 * 	Dynamic character count for text areas and input fields
 *	written by Alen Grakalic	
 *	http://cssglobe.com/post/7161/jquery-plugin-simplest-twitterlike-dynamic-character-count-for-textareas
 *
 *	Copyright (c) 2009 Alen Grakalic (http://cssglobe.com)
 *	Dual licensed under the MIT (MIT-LICENSE.txt)
 *	and GPL (GPL-LICENSE.txt) licenses.
 *
 *	Built for jQuery library
 *	http://jquery.com
 *
 */
 
/*
(function($) {

	$.fn.charCount = function(options){
	  
		// default configuration properties
		var defaults = {	
			allowed: 140,		
			warning: 25,
			css: 'counter',
			counterElement: 'span',
			cssWarning: 'warning',
			cssExceeded: 'exceeded',
			counterText: ''
		}; 
			
		var options = $.extend(defaults, options); 
		
		function calculate(obj){
			var count = $(obj).val().length;
			var available = options.allowed - count;
			if(available <= options.warning && available >= 0){
				$(obj).next().addClass(options.cssWarning);
			} else {
				$(obj).next().removeClass(options.cssWarning);
			}
			if(available < 0){
				$(obj).next().addClass(options.cssExceeded);
			} else {
				$(obj).next().removeClass(options.cssExceeded);
			}
			$(obj).next().html(options.counterText + available);
		};
				
		this.each(function() {  			
			$(this).after('<'+ options.counterElement +' class="' + options.css + '">'+ options.counterText +'</'+ options.counterElement +'>');
			calculate(this);
			$(this).keyup(function(){calculate(this)});
			$(this).change(function(){calculate(this)});
		});
	  
	};

})(jQuery);
*/

