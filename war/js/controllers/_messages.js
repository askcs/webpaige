'use strict';
/* Messages controller */

var messages = function($scope)
{
	
  //$('a[rel=tooltip]').tooltip();
  
  // TODO: only planners
  /*
  if (webpaige.getRole() > 2)
  {
    $('#smsCheck').hide();
  }
  */
  
  //$(".chzn-select").chosen();
  /*
  $(".chzn-select-deselect").chosen(
  {
    allow_single_deselect: true
  });
  */
  
/*
  $('#messageSender').click(function ()
  {
    $('#composeMessage').modal('hide');
    var receivers = $('#receivers').val();
    var title = $('#title').val();
    var message = $('textarea#message').val();
    this.resetForms();
    this.sendMessage(receivers, title, message);
  });
*/
  
  
/*
  $('#inbox a').click(function ()
  {
    this.loadMessages('inbox');
  });
  $('#outbox a').click(function ()
  {
    this.loadMessages('outbox');
  });
  $('#trash a').click(function ()
  {
    this.loadMessages('trash');
  });
*/
	  
	  
/*
  this.loadUsers();
  this.loadMessages();
*/
}

messages.prototype = $.extend({}, app.prototype, {

	constructor: messages,
	
	/*
	composeMessage: function()
	{
	  this.resetForms();
	  $('#composeMessage').modal('show');
	},
	*/
	
	/*
	sendMessage: function()
	{
	  $('#composeMessage').modal('hide');
	  var receivers = $('#compose select').val();
	  var subject = $('#compose #title').val();
	  var content = $('#compose textarea').val();
	  var sms = $('input#sms[name="sms"]:checked').val();
	  var paigem = $('input#paigem[name="paigem"]:checked').val();
	  var email = $('input#email[name="email"]:checked').val();
	  var types = [];
	  if (sms) types.push('sms');
	  if (paigem) types.push('paige');
	  if (email) types.push('email');
	  for (var n in types)
	  types[n] = '"' + types[n] + '"';
	  for (var n in receivers)
	  receivers[n] = '"' + receivers[n] + '"';
	  var query = '{"members":[' + receivers + '],"content":"' + content + '","subject":"' + subject + '","types":[' + types + ']}';
	  webpaige.con(
	  {
	    type: 'post',
	    path: '/question/sendDirectMessage',
	    json: query,
	    loading: 'Het bericht wordt verstuurd..',
	    message: 'Het bericht is verstuurd!',
	    session: session.getSession()
	  },
	
	  function (data)
	  {
	    this.loadMessages('inbox');
	  });
	},
	*/
	
	/*
	replyMessage: function(uuid)
	{
	  $('#displayMessageModal').modal('hide');
	  this.resetForms();
	  var messages = localStorage.getItem('messages');
	  var messages = messages ? JSON.parse(messages) : undefined;
	  for (var n in messages)
	  {
	    if (messages[n].uuid === uuid)
	    {
	      $('#replyMessage').modal('show');
	      var requester = messages[n].requester.split('personalagent/')[1].split('/')[0];
	      $('#replyMessage .receivers .chzn-select').append(
	      $('<option></option>')
	        .val(requester)
	        .html(requester)
	        .attr("selected", "selected"));
	      $("#replyMessage .receivers .chzn-select").trigger("liszt:updated");
	    }
	  }
	},
	*/
	
	/*
	displayMessage: function(uuid, type)
	{
	  $('#displayMessageActions').remove();
	  var actions = $('<div id="displayMessageActions" class="modal-footer"></div>');
	  actions.append('<a class="btn" data-dismiss="modal" href="#"><i class="icon-remove"></i> Sluiten</a>');
	  actions.append('<a class="btn btn-danger" onclick="removeMessage(\'' + uuid + '\');"><i class="icon-white icon-trash"></i> Bericht verwijderen</a>');
	  actions.append('<a class="btn btn-success" onclick="replyMessage(\'' + uuid + '\');"><i class="icon-white icon-ok"></i> Bericht antwoorden</a>');
	  $('#displayMessageModal').append(actions);
	  $('#displayMessageModal').modal('show');
	  var messages = JSON.parse(webpaige.get('messages'));
	  for (var n in messages)
	  {
	    if (messages[n].uuid == uuid)
	    {
	      if (messages[n].state == 'NEW')
	      {
	        var query = '{"ids":[' + messages[n].uuid + '],"state":"SEEN"}';
	        webpaige.con(
	        {
	          type: 'post',
	          path: '/question/changeState',
	          json: query,
	          loading: 'Berichtstatus wordt verandert..',
	          session: session.getSession()
	        },
	
	        function (data)
	        {
	          this.loadMessages(type);
	        });
	      }
	      if (type == 'inbox')
	      {
	        $('#messageDirection').html('Van');
	        $('#messageReceiver').html(messages[n].requester.split('personalagent/')[1].split('/')[0]);
	      }
	      else
	      {
	        $('#messageDirection').html('Naar');
	        var responders = '';
	        if (messages[n].responder.length > 1)
	        {
	          responders = 'Meerdere gebruikers';
	        }
	        else
	        {
	          responders = messages[n].responder[0].split('personalagent/')[1].split('/')[0];
	        }
	        $('#messageReceiver').html(responders);
	      }
	      var datetime = new Date(messages[n].creationTime);
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
	},
	*/
	
	/*
	removeMessage: function(uuid, type)
	{
	  $('#displayMessageModal').modal('hide');
	  var query = '{"ids":[' + uuid + '],"state":"TRASH"}';
	  webpaige.con(
	  {
	    type: 'post',
	    path: '/question/changeState',
	    json: query,
	    loading: 'Het bericht wordt naar prullenbak verplaatst..',
	    session: session.getSession()
	  },
	
	  function (data)
	  {
	    this.loadMessages(type);
	  });
	},
	*/
	
	/*
	removeMessages: function(type)
	{
	  var ids = [];
	  var values = $('#tb-' + type + ' input:checkbox:checked').map(function ()
	  {
	    if (this.value != 'on')
	    {
	      ids.push(this.value);
	    }
	  }).get();
	  var query = '{"ids":[' + ids + '],"state":"TRASH"}';
	  webpaige.con(
	  {
	    type: 'post',
	    path: '/question/changeState',
	    json: query,
	    loading: 'De berichten worden naar prullenbak verplaatst..',
	    session: session.getSession()
	  },
	
	  function (data)
	  {
	    this.loadMessages(type);
	  });
	},
	*/
	
	/*
	deleteMessage: function(uuid, type)
	{
	  var query = '{"members":["' + uuid + '"]}';
	  webpaige.con(
	  {
	    type: 'post',
	    path: '/question/deleteQuestions',
	    json: query,
	    loading: 'Het bericht wordt verwijdert..',
	    session: session.getSession()
	  },
	
	  function (data)
	  {
	    this.loadMessages('trash');
	  });
	},
	*/
	
	/*
	emptyTrash: function()
	{
	  var ids = [];
	  var values = $('#tb-trash input:checkbox:checked').map(function ()
	  {
	    if (this.value != 'on')
	    {
	      ids.push('"' + this.value + '"');
	    }
	  }).get();
	  var query = '{"members":[' + ids + ']}';
	  webpaige.con(
	  {
	    type: 'post',
	    path: '/question/deleteQuestions',
	    json: query,
	    loading: 'De prullenbak wordt leegmaakt..',
	    session: session.getSession()
	  },
	
	  function (data)
	  {
	    this.loadMessages('trash');
	  });
	},
	*/
	
	/*
	resetForms: function()
	{
	  $('.chzn-select option:selected').removeAttr('selected');
	  $(".chzn-select").trigger("liszt:updated");
	},
	*/
	
	loadMessages: function(type)
	{
	  switch (type)
	  {
	    case 'inbox':
	      var url = '/question?0=dm';
	      var btn = $('#inbox');
	      var status = 'Inbox wordt opgeladen..';
	      break;
	    case 'trash':
	      var url = '/question';
	      var btn = $('#trash');
	      var status = 'Prullenbak wordt opgeladen..';
	      break;
	    default:
	      var url = '/question?0=dm';
	      var btn = $('#inbox');
	      var status = 'Inbox wordt opgeladen..';
	      var type = 'inbox';
	  }
	  $('.nav-tabs li').removeClass('active');
	  btn.addClass('active');
	  webpaige.con(
	  {
	    path: url,
	    loading: status,
	    label: type,
	    session: session.getSession()
	  },
	  function (data, label)
	  {
	  	// TODO: check this later on
	    //webpaige.set('messages', JSON.stringify(data));
	    
	    var filtered = [];
	    data.reverse(
	    data.sort(
	
	    function (a, b)
	    {
	      return (a.creationTime - b.creationTime);
	    }));
	    
	    var resources = JSON.parse(webpaige.get('resources'));
	    
	    switch (type)
	    {
	      case 'inbox':
	        for (var n in data)
	        {
	          if (data[n].box == 'inbox' && data[n].requester != resources.uuid && data[n].state != 'TRASH')
	          {
	            filtered.push(data[n]);
	          }
	        }
	        this.renderMessages(filtered, type);
	        break;
	      case 'trash':
	        for (var n in data)
	        {
	          if (data[n].state == 'TRASH')
	          {
	            filtered.push(data[n]);
	          }
	        }
	        this.renderMessages(filtered, type);
	        break;
	      default:
	        for (var n in data)
	        {
	          if (data[n].box == 'inbox' && data[n].requester != resources.uuid)
	          {
	            filtered.push(data[n]);
	          }
	        }
	        this.renderMessages(filtered, type);
	    }
	  });
	},
	
	renderMessages: function(data, type)
	{
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
	      theadtr.append('<th>Van</th>');
	      theadtr.append('<th>Naar</th>');
	    }
	    else
	    {
	      var direction = (type == 'outbox') ? 'Naar' : 'Van';
	      if (type == 'inbox') theadtr.append('<th></th>');
	      theadtr.append('<th>' + direction + '</th>');
	    }
	    theadtr.append('<th>Onderwerp</th>');
	    theadtr.append('<th>Datum</th>');
	    theadtr.append('<th></th>');
	    thead.append(theadtr);
	    table.append(thead);
	    var tbody = $('<tbody></tbody>');
	    for (var n in data)
	    {
	      var tbodytr = $('<tr></tr>');
	      tbodytr.append('<td><input type="checkbox" class="checkbox" value="' + data[n].uuid + '" /></td>');
	      if (type == 'inbox')
	      {
	        var state = (data[n].state == 'NEW') ? '<span class="label label-info">Nieuw</span>' : '';
	        tbodytr.append('<td>' + state + '</td>');
	      }
	      if (type == 'trash')
	      {
	        tbodytr.append('<td>' + data[n].responder[0].split('personalagent/')[1].split('/')[0] + '</td>');
	        tbodytr.append('<td>' + data[n].requester.split('personalagent/')[1].split('/')[0] + '</td>');
	      }
	      else
	      {
	        var responders = '';
	        if (data[n].responder.length > 1)
	        {
	          responders = '<i>Meerdere ontvangers</i>';
	        }
	        else
	        {
	          responders = data[n].responder[0].split('personalagent/')[1].split('/')[0];
	        }
	        var person = (type == 'outbox') ? responders : data[n].requester.split('personalagent/')[1].split('/')[0];
	        tbodytr.append('<td>' + person + '</td>');
	      }
	      var subject = (data[n].subject == null) ? 'No subject' : data[n].subject;
	      tbodytr.append('<td><a onclick="displayMessage(\'' + data[n].uuid + '\', \'' + type + '\');" rel="tooltip" title="' + data[n].question_text + '">' + subject + '</a></td>');
	      var datetime = new Date(data[n].creationTime);
	      datetime = datetime.toString("ddd dd MMM yyyy HH:mm");
	      tbodytr.append('<td>' + datetime + '</td>');
	      var tdbtns = $('<td></td>');
	      var btngroup = $('<div class="btn-group"></div>');
	      if (type == 'inbox')
	      {
	        btngroup.append('<a class="btn btn-mini" onclick="replyMessage(\'' + data[n].uuid + '\');"><i class="icon-share-alt"></i></a>');
	      }
	      if (type == 'trash')
	      {
	        btngroup.append('<a class="btn btn-mini" onclick="deleteMessage(\'' + data[n].uuid + '\');"><i class="icon-trash"></i></a>');
	      }
	      else
	      {
	        btngroup.append('<a class="btn btn-mini" onclick="removeMessage(\'' + data[n].uuid + '\', \'' + type + '\');"><i class="icon-trash"></i></a>');
	      }
	      tdbtns.append(btngroup);
	      tbodytr.append(tdbtns);
	      tbody.append(tbodytr);
	    }
	    if (type == 'trash')
	    {
	      tbody.append('<tr><td colspan="6"><a class="btn btn-danger" onclick="emptyTrash();"><i class="icon-trash icon-white"></i> Verwijder definitief</a></td></tr>');
	    }
	    else
	    {
	      tbody.append('<tr><td colspan="6"><a class="btn" onclick="removeMessages(\'' + type + '\');"><i class="icon-trash"></i> Verwijder geselecteerde berichten</a></td></tr>');
	    }
	    table.append(tbody);
	    $(live).append(table);
	  }
	  else
	  {
	    $(live).append('<p>Er zijn geen berichten.</p>');
	  }
	  $('#content').html(live);
	},
	
	loadUsers: function()
	{
	  var query = '{"key":""}';
	  webpaige.con(
	  {
	    type: 'post',
	    path: '/network/searchPaigeUser',
	    json: query,
	    loading: 'Zoeken naar gebruikers in uw netwerk..',
	    session: session.getSession()
	  },
	  function (data)
	  {
	  	$('#composeBtn').show();
	    var users = $('<optgroup label="GEBRUIKERS"></optgroup>');
	    if (data && data.length > 0)
	    {
	      for (var n in data)
	      {
	        $(users).append("<option value=" + data[n].id + ">" + data[n].name + "</option>");
	      }
	      $(".receivers .chzn-select").append(users);
	    }
	  });
	  
	  webpaige.con(
	  {
	    path: '/network',
	    loading: 'De groepenlijst wordt opgeladen..',
	    session: session.getSession()
	  },
	
	  function (data)
	  {
	    var groups = $('<optgroup label="GROEPEN"></optgroup>');
	    if (data && data.length > 0)
	    {
	      webpaige.config('groups', data);
	      for (var n in data)
	      {
	        $(groups).append("<option value=" + data[n].uuid + ">" + data[n].name + "</option>");
	      }
	      $(".receivers .chzn-select").append(groups);
	      $(".receivers .chzn-select").trigger("liszt:updated");
	    }
	  });
	},
	
	toggleChecked: function(uuid, status)
	{
	  var ids = "#tb-" + uuid.replace(/([@.:#])/g, '\\$1') + " input";
	  $(ids).each(function ()
	  {
	    $(this).attr("checked", status);
	  })
	}





})

messages.$inject = ['$scope'];