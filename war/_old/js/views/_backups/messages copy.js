$(document).ready(function()
{
 	pageInit('messages', 'true');
 	
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
    
    $('#message')[0].reset();
    
		sendMessage(receivers, title, message);
  });
	
  loadUsers(); 
	loadMessages();
	
});


var session = new ask.session();



function sendMessage(receivers, subject, content)
{
	for(var n in receivers) receivers[n] = '"' + receivers[n] + '"'; 
  var json = '{"members":['+receivers+'],"content":"'+content+'","subject":"'+subject+'"}';
  //console.log("json :", json);
	webpaige.con('post', '/question/sendDirectMessage', json, 'Sending message..', 'Message successfully sent!',
	function(data)
  {
  	loadMessages('inbox');
	});
}

function replyMessage(uuid)
{
	webpaige.con('get', '/question/' + uuid, null, 'Grabbing message..', null,
	function(data)
  {
  	console.log("message:", data);
	});
}



function loadMessages(type)
{
	switch(type)
	{
	case 'inbox':
		var url = '/question?0=dm';
		var btn = $('#inboxBtn');
		var status = 'Loading inbox..';
	break;
	case 'outbox':
		var url = '/question?0=sent';
		var btn = $('#outboxBtn');
		var status = 'Loading outbox..';
	break;
	case 'modules':
		var url = '/question';
		var btn = $('#modulesBtn');
		var status = 'Loading Paige messages..';
	break;
	default:
		var url = '/question?0=dm';
		var btn = $('#inboxBtn');
		var status = 'Loading inbox..';
		var type = 'inbox';
	}
	
	$('.nav-tabs li').removeClass('active');
	btn.addClass('active');
	
	webpaige.con('get', url, null, status, null,
	function(data)
  {  
  	var filtered = [];
  	
  	var data = data ? JSON.parse(data) : undefined;
  	
  	var user = JSON.parse(localStorage.getItem('user')); 	
  
		switch(type)
		{
		case 'inbox':
			for(var n in data)
			{
				if (data[n].module == 'message' && data[n].requester != user.uuid)
				{
					filtered.push(data[n]);
				}
			}
  		renderMessages(filtered, type);
		break;
		case 'outbox':
  		renderMessages(data, type);
		break;
		case 'modules':
			for(var n in data)
			{
				if (data[n].module != 'message')
				{
					filtered.push(data[n]);
				}
			}
  		renderMessages(filtered, type);
		break;
		default:
			for(var n in data)
			{
				if (data[n].module == 'message' && data[n].requester != user.uuid)
				{
					filtered.push(data[n]);
				}
			}
  		renderMessages(filtered, type);
		}
	});
	
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
		
		var direction = (type == 'outbox') ?  'To' : 'From';
		
		theadtr.append('<th></th>');
		theadtr.append('<th>'+direction+'</th>');
		theadtr.append('<th>Date</th>');
		theadtr.append('<th>Subject</th>');
		theadtr.append('<th></th>');
		thead.append(theadtr);
		table.append(thead);
		var tbody = $('<tbody></tbody>');
    for(var n in data)
    { 			
    	var tbodytr = $('<tr></tr>');
			tbodytr.append('<td><input type="checkbox" class="checkbox" value="'+data[n].uuid+'" /></td>');
		
			var stateLabel = (data[n].state == 'NEW') ?  '<span class="label label-info">New</span>' : '';
			var moduleLabel = (data[n].module == 'alarm') ?  '<span class="label label-warning"><i class="icon-bell icon-white"></i> Alarm</span>' : '';
			var state = stateLabel + moduleLabel;
			tbodytr.append('<td>'+state+'</td>');
			
			var person = (type == 'outbox') ?  data[n].responder : data[n].requester;
			tbodytr.append('<td>'+person+'</td>');
			
		  var date = new Date(data[n].creationTime * 1000);
			tbodytr.append('<td>'+date.toString("dd-MMM-yyyy HH:mm")+'</td>');
			
			var subject = (data[n].subject == null) ? 'No subject' : data[n].subject;
			
			tbodytr.append('<td>'+subject+'</td>');
			tbodytr.append('<td><div class="btn-group"><a class="btn btn-mini" onclick="replyMessage(\''+data[n].uuid+'\');"><i class="icon-share-alt"></i></a><a class="btn btn-mini" onclick="removeMessage(\''+data[n].uuid+'\');"><i class="icon-trash"></i></a></div></td>');
			tbody.append(tbodytr);
    }
    tbody.append('<tr><td colspan="6"><a class="btn" onclick="removeMessages(\''+type+'\');"><i class="icon-trash"></i> Remove selected</a></td></tr>');
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
  var json = '{"key":""}';
	webpaige.con('post', '/network/searchPaigeUser', json, 'Loading users..', null,
	function(data)
  {
  	renderUsers(data);
	});
}

function renderUsers(data)
{
  var data = data ? JSON.parse(data) : undefined;
  
	if (data && data.length > 0)
	{
    for(var n in data)
    {
    	$('.chzn-select').append("<option value=" + data[n].id + ">" + data[n].name + "</option>");
    }
    $(".chzn-select").trigger("liszt:updated");
	}  
}

	
function toggleChecked(uuid, status)
{
	var ids = "#tb-" + uuid.replace(/([@.:#])/g, '\\$1') + " input"; 
	$(ids).each( function()
	{
		$(this).attr("checked",status);
	})
}





