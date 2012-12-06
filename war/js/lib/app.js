/* 
CONFIG
*/
//var host='http://10.200.200.102:9000';
var host = 'http://localhost:9000/ns_knrm';
//var host='http://3rc2.ask-services.appspot.com/ns_knrm';




/* 
SESSION
*/
if (ask == undefined)
  var ask = {};

/* Initialize functions */
ask.session = function(callback)
{
	this.callback = callback;
	this.name="";
	this.checkSession = function()
	{
		if(this.sessionId==null)
			return false;
		var time = new Date();
		var now = time.getTime();
		if((now-this.sessionTime) > (60 * 60 * 1000))
		{		
			return false;
		}
		return true;
	}	
	var values;
	var pairs = document.cookie.split(";");
	for(var i=0; i<pairs.length;i++)
	{
		values=pairs[i].split("=");
		if(values[0].trim()=="ask-session")
		{
			var session=JSON.parse(values[1]);
			this.sessionId = session.id;
			this.sessionTime = session.time;
			break;
		}
	}
}

ask.session.prototype.getSession = function()
{
	if(!this.checkSession())
		this.callback();
	this.setSession(this.sessionId);
	return this.sessionId;
}

ask.session.prototype.setSession = function(sessionId)
{
	var time = new Date();
	this.sessionId=sessionId;
	this.sessionTime=time.getTime();
	var session=new Object();
	session.id = this.sessionId;
	session.time = this.sessionTime;
	document.cookie="ask-session="+JSON.stringify(session);
}

ask.session.prototype.clear = function()
{
	this.sessionId=null;
	this.sessionTime=null;
	document.cookie="ask-session='';expires=Thu, 01-Jan-1970 00:00:01 GMT";
}

ask.session.prototype.isSession = function()
{	
	return this.checkSession();
}








/* 
WEBPAIGE
*/
var session = new ask.session(relogin);
function relogin() {
	window.location = "login.html";
}


function pageInit(active, logged)
{
	webpaige = new webpaige();	
	$('body').append('<div id="status"></div>');
	$('body').append('<div id="alert"></div>');
	var menuItems = new Array;		
	//var menuItems = ['dashboard', 'messages', 'groups'];
	var menuItems = ['planboard', 'berichten', 'groepen'];
	var menuLinks = ['dashboard', 'messages', 'groups'];
  var resources = JSON.parse(webpaige.get('resources'));
	var navbar = $('<div class="navbar navbar-inner container-fluid"></div>');
	if (logged == 'true')
	{
		navbar.append('<a class="btn btn-navbar" data-target=".nav-collapse" data-toggle="collapse"></a> <a class="brand" href="dashboard.html">KNRM</a>');
		var usermenu = $('<div class="btn-group pull-right"></div>');
		usermenu.append('<a class="btn dropdown-toggle" data-toggle="dropdown" href="#"><i class="icon-user"></i> ' + resources.name + ' <span class="caret"></span></a>');
		navbar.append(usermenu);
		var userdrop = $('<ul class="dropdown-menu"></ul>');
		userdrop.append('<li><a href="profile.html"><i class="icon-user"></i> Profiel</a></li>');
		if (webpaige.getRole() == 1)
			userdrop.append('<li><a href="settings.html"><i class="icon-cog"></i> Instellingen</a></li>');
		userdrop.append('<li class="divider"></li>');
		userdrop.append('<li><a onclick="webpaige.logout()"><i class="icon-off"></i> Uitloggen</a></li>');
		usermenu.append(userdrop);
		var navcollapse = $('<div class="nav-collapse"></div>');
		var nav = $('<ul class="nav"></ul>');
		var highlighter;
		for(var i in menuItems)
		{
			if (menuItems[i] != 'groups' || webpaige.config('userRole') < 2)
			{
				if (active == menuItems[i])
					highlighter = '<li class="active">'; else highlighter = '<li>';
				var menu = menuItems[i].charAt(0).toUpperCase() + menuItems[i].slice(1);
				nav.append(highlighter + '<a href="' + menuLinks[i] + '.html">' + menu + '</a></li>');
			}
		}
		navcollapse.append(nav);
	  navbar.append(navcollapse);
	  // setup user name
  	$(".d_username").html(resources.name);
	}
	else
	{
		navbar.append('<a class="btn btn-navbar" data-target=".nav-collapse" data-toggle="collapse"></a> <a class="brand" href="login.html">WebPaige</a>');
	}
	$('#navbar').html(navbar);
  //$('title').html('WebPaige :: ' + active.charAt(0).toUpperCase() + active.slice(1));
}







webpaige = function()
{
  this.options = {
  	host: host,
  	path: null,
  	json: null,
  	type: 'get',
  	session: session,
  	credentials: true,
  	loading: 'Laden..',
  	message: 'Succes!',
  	label: 'not_labeled',
  	400: null,
  };  
	window.data = [];
}


webpaige.prototype.get = function(label)
{
	return localStorage.getItem(label);
}


webpaige.prototype.set = function(label, data)
{
	window.data[label] = data;
	localStorage.setItem(label, data);
}


webpaige.prototype.config = function(key, value)
{
	var config = JSON.parse(webpaige.get('config'));
	if (value != null)
	{
		config[key] = value;
		webpaige.set('config', JSON.stringify(config));
		return true;
	}
	else
	{
		return config[key];
	}
}


webpaige.prototype.remove = function(label)
{
	localStorage.removeItem(label);
}


webpaige.prototype.clear = function(label)
{
	localStorage.clear();
}


webpaige.prototype.con = function(options, callback)
{
	var w = this;
	options = $.extend({}, this.options, options);
  $.ajax(
  {
    url: options.host + options.path,
	  type: options.type,
		data: options.json,
    beforeSend: function(xhr)
    {
    	w.stats(options.loading);
    	if (options.session != null)
    	{
      	xhr.setRequestHeader('X-SESSION_ID', options.session);
    	}
      return true;
    },
    contentType: 'application/json',
    xhrFields: { 
    	withCredentials: options.credentials
    },
    success: function(data)
    {    
    	webpaige.loaded();
    	if (options.message != null)
    	{
    		webpaige.message(options.message);
    	}
      if(data && typeof data == 'string' && data != 'ok')
      	data = JSON.parse(data);
    	callback(data, options.label);
    },
    error: function(jqXHR, exception, options)
    {
      if (jqXHR.status === 0)
      {
      	webpaige.alert('Not connected. Verify Network.');
      }
      else if (jqXHR.status == 400)
      {
      	var rerror = jqXHR.responseText.split('<title>')[1].split('</title>')[0];
      	if (rerror === '400 bad credentials')
      	{
			    $("#alertDiv").show();
			    $("#alertMessage").html("<strong>Login failed!</strong><br>Wrong username or password.");
			    $("#ajaxLoader").hide();
			    $('#status').hide();
      	}
      	webpaige.alert('Bad request. [400]');
      }
      else if (jqXHR.status == 404)
      {
        webpaige.alert('Requested page not found. [404]');
      }
      else if (jqXHR.status == 500)
      {
       	webpaige.alert('Internal server error. [500]');
      }
      else if (exception === 'parser error')
      {
        webpaige.alert('Requested JSON parse failed.');
      }
      else if (exception === 'timeout')
      {
        webpaige.alert('Time out error.');
      }
      else if (exception === 'abort')
      {
        webpaige.alert('Ajax request aborted.');
      }
      else
      {
        webpaige.alert('Uncaught Error. ' + jqXHR.responseText);
      }
    }
  });
}


webpaige.prototype.stats = function(loading)
{
	$('#loading').remove();
	var loading = '<div id="loading"><img alt="Loading" src="img/ajax-loader-snake.gif"><span id="loading">' + loading + '</span></div>';
	$('#status').append(loading);
	$('#status').show();
}


webpaige.prototype.loaded = function()
{
	$('#status').hide();
}


webpaige.prototype.message = function(message)
{
	$('#message').remove();
	$('#alert').append('<div id="message">Success! ' + message + "</div>");
	$('#alert').show();
	$('#alert').delay(900).fadeOut(400);
}


webpaige.prototype.alert = function(message)
{
	$('#message').remove();
	$('#alert').append('<div id="message">Error! ' + message + "</div>");
	$('#alert').show();
	$('#alert').delay(900).fadeOut(400);
}


webpaige.prototype.logout = function()
{
	webpaige.con(
		options = {
			path: '/logout',
			loading: 'Uitloggen..'
			,session: session.getSession()	
		},
		function(data)
	  {
	  	var login = webpaige.get('login');  
			webpaige.clear();
			webpaige.set('login', login);
			session.clear();
			window.location = "login.html";
		}
	); 
}


webpaige.prototype.getRole = function()
{
	return webpaige.config('userRole');		
}


webpaige.prototype.i18n = function(local)
{
	this.local = {
		language: 'nl_NL'
	}
	local = $.extend({}, this.local, local);
	jQuery.i18n.properties(
	{
	  name: 'Local', 
	  path: 'local/', 
	  mode:'both',
	  language: local.language, 
	  callback: function()
	  {
	  	var statics = local.statics;
	  	for(var i in statics)
	  	{
	  		jQuery.i18n.prop(statics[i]);
	  		$('.'+statics[i]).html(eval(statics[i]));
	  	}
  		jQuery.i18n.prop(local.title);
  		$('title').html(eval(local.title));
	  }
	});
}








/* 
LOGIN
*/
$(document).ready(function()
{
 	pageInit('login', 'false');
 	var login = JSON.parse(webpaige.get('login'));
 	if (login != null)
 	{
	  $('#username').val(login.user);
	  //$('#password').val(login.pass);
	  $('#remember').attr('checked', login.remember);
 	}
  $("#alertClose").click(function()
  {
    $("#alertDiv").hide();
  });
  $("#loginBtn").click(function()
  {
  	loginHandler();
  });
	window.addEventListener( 'keypress', KeyPressHandler );
	var local = {
		title: 'login_title',
		statics: ['login_login', 'login_enter_email', 'login_password', 'login_remember', 'login_forgot']		
	}
	webpaige.i18n(local);
});


function KeyPressHandler( event ) {
	if ( event.keyCode === 13 ) {
		loginHandler();
	}
}


function loginHandler()
{
  $("#ajaxLoader").show();
  var userDef = "Username";
  var passDef = "password";
  var user = $('#username').val();
  var pass = $('#password').val();
  var r = $('#remember:checked').val();
  if (user == '' || user == userDef)
  {
    $("#alertDiv").show();
	  jQuery.i18n.prop('login_error_username');
    $("#alertMessage").html(login_error_username);
    $("#ajaxLoader").hide();
    return false;
  }
  if (pass == '' || pass == passDef)
  {
    $("#alertDiv").show();
	  jQuery.i18n.prop('login_error_password');
    $("#alertMessage").html(login_error_password);
    $("#ajaxLoader").hide();
    return false;
  }
  loginAsk (user, pass, r);
}

	
// new version
function loginAs(type)
{
	var user, pass=MD5('askask');
	switch (type)
	{
		case 'planner':
			user = 'beheer';
			pass = '319fcaa585c17eff5dcc2a57e8fc853f';
		break;
		case 'schipper':
			user = '4170durinck';
			pass = 'f5212ff3f9bac5439368462f2e791558';
		break;
		case 'volunteer':
			user = '4780aldewereld';
			pass = 'd9a6c9bad827746190792cf6f30d5271';
		break;		
	}
	loginAskWithOutMD5 (user, pass, true);
}


function loginAsk (user, pass, r)
{
	webpaige.set('config', '{}');
	// logging in ask
	webpaige.con(
		options = {
			path: '/login?uuid=' + user + '&pass=' + MD5(pass),
			loading: 'Inloggen..'
		},
		function(data, label)
	  {  	
      if (r != null)
      {
      	var login = {};
      	login.user = user;
      	login.remember = r;
      	webpaige.set('login', JSON.stringify(login));
      }
      else
      {
      	webpaige.remove('login');
      }
      session.setSession(data["X-SESSION_ID"]);
      document.cookie = "sessionId=" + session;
      // loading resources
			webpaige.con(
				options = {
					path: '/resources',
					loading: 'Persoonlijke gegevens aan het laden..',
					label: 'resources',
					session: session.getSession()	
				},
				function(data, label)
			  {  	
					webpaige.set(label, JSON.stringify(data));
					webpaige.config('userRole', data.role);	
					var trange = {};	
				  now = parseInt((new Date()).getTime() / 1000);
				  trange.bstart = (now - 86400 * 7 * 1);
				  trange.bend = (now + 86400 * 7 * 1);	
				  trange.start = new Date();
				  trange.start = Date.today().addWeeks(-1);
				  trange.end = new Date();
				  trange.end = Date.today().addWeeks(1);
				  webpaige.config('trange', trange);	
		      var url = (data.role < 3) ? '/network' : '/parent';
					webpaige.con(
						options = {
							path: url,
							loading: 'Groep & contacten informatie aan het laden..',
							label: 'groups'
							,session: session.getSession()	
						},
						function(data, label)
					  { 
						  for(var i in data)
						  {
						  	if (i == 0)
						  	{
						  		webpaige.config('firstGroupUUID', data[i].uuid);
						  		webpaige.config('firstGroupName', data[i].name);
						  	}	 	    
						  }
							document.location = "dashboard.html";
						}
					);
				}
			);
		}
	);
}

function loginAskWithOutMD5 (user, pass, r)
{
	webpaige.set('config', '{}');
	// logging in ask
	webpaige.con(
		options = {
			path: '/login?uuid=' + user + '&pass=' + pass,
			label: 'login',
			loading: 'Inloggen..'
		},
		function(data, label)
	  {  	
      if (r != null)
      {
      	var login = {};
      	login.user = user;
      	login.remember = r;
      	webpaige.set('login', JSON.stringify(login));
      }
      else
      {
      	webpaige.remove('login');
      }
      session.setSession(data["X-SESSION_ID"]);
      document.cookie = "sessionId=" + session;
      // loading resources
			webpaige.con(
				options = {
					path: '/resources',
					loading: 'Persoonlijke gegevens aan het laden..',
					label: 'resources',
					session: session.getSession()	
				},
				function(data, label)
			  {  	
					webpaige.set(label, JSON.stringify(data));
					webpaige.config('userRole', data.role);	
					var trange = {};	
				  now = parseInt((new Date()).getTime() / 1000);
				  trange.bstart = (now - 86400 * 7 * 1);
				  trange.bend = (now + 86400 * 7 * 1);	
				  trange.start = new Date();
				  trange.start = Date.today().addWeeks(-1);
				  trange.end = new Date();
				  trange.end = Date.today().addWeeks(1);
				  webpaige.config('trange', trange);	
		      var url = (data.role < 3) ? '/network' : '/parent';	
					webpaige.con(
						options = {
							path: url,
							loading: 'Groep & contacten informatie aan het laden..',
							label: 'groups'
							,session: session.getSession()	
						},
						function(data, label)
					  { 
						  for(var i in data)
						  {
						  	if (i == 0)
						  	{
						  		webpaige.config('firstGroupUUID', data[i].uuid);
						  		webpaige.config('firstGroupName', data[i].name);
						  	}	 	    
						  }
							document.location = "dashboard.html";
						}
					);
				}
			);
		}
	);
}



function loadContacts()
{
	setPreloader('Loading contacts..');
	webpaige.con(
		options = {
			type: 'post',
			path: '/network/searchPaigeUser',
			json: '{"key":""}',
			loading: 'Loading contacts..',
			label: 'contacts'
			,session: session.getSession()	
		},
		function(data, label)
	  {  
			webpaige.set(label, data);
		}
	);
}



function loadMembers()
{
	setPreloader('Loading members..');
	var groups = webpaige.get('groups');
	groups =  JSON.parse(groups);
	for (var i in groups)
	{
		webpaige.con(
			options = {
				path: '/network/'+groups[i].uuid+'/members',
				loading: 'Loading members..',
				label: groups[i].uuid
				,session: session.getSession()	
			},
			function(data, label)
		  {  
				webpaige.set(label, data);
			}
		);
	}
}



/* 
DASHBOARD
*/
$(document).ready(function()
{
 	pageInit('dashboard', 'true');
  var trange = webpaige.config('trange');
  window.range =	'start=' + trange.bstart + 
  								'&end=' + trange.bend;
  renderGroupsList();	 
  $('#planningFrom').datetimepicker();
  $('#planningTill').datetimepicker();
  $('#eplanningFrom').datetimepicker();
  $('#eplanningTill').datetimepicker();
  $("#planningAllDay").click(function()
  {
    if ($('input#planningAllDay:checkbox:checked').val() == "true")
    	$('#plTill').hide();
    else
    	$('#plTill').show();
  });
  timelineInit();
	var guuid = webpaige.config('firstGroupUUID');
	var gname = webpaige.config('firstGroupName');
	groupTimelineInit(guuid, gname);
  if (webpaige.getRole() < 3)
	  membersTimelineInit(guuid);	
  $('#groupAvBtn').addClass('active');
  $("#groupsList").change(function()
  {
  	timelineInit();
		var guuid = $(this).find(":selected").val();
		var gname = $(this).find(":selected").text();
	  groupTimelineInit(guuid, gname);
	  if (webpaige.getRole() < 3)  
	  	membersTimelineInit(guuid);
	});
  $(window).bind('resize', function () {
	  timeline.redraw();
	  timeline2.redraw();
	  timeline3.redraw();
  });
	var local = {
		title: 'dashboard_title',
		statics: ['dashboard_today', 'dashboard_new_availability', 'dashboard_status', 'dashboard_available', 'dashboard_unavailable', 'dashboard_from', 'dashboard_till', 'dashboard_weekly', 'dashboard_cancel', 'dashboard_save_planning', 'dashboard_edit_availability', 'dashboard_delete_planning', 'dashboard_save_planning', 'dashboard_planboard']		
	}
	webpaige.i18n(local);
});


var timeline;
var timeline2;
var timeline3;
var timeline_selected = null;



// Submitters
function planSubmit()
{
  $('#newEvent').modal('hide');
  var planningType = $('input#planningType[name="planningType"]:checked').val();
  var planningFrom = $('#planningFrom').val();
  var planningTill = $('#planningTill').val();
  var planningReoccuring = $('input#planningReoccuring:checkbox:checked').val();
  var planningAllDay = $('input#planningAllDay:checkbox:checked').val();
  if (planningReoccuring == "true") planningReoccuring = "true";
  else planningReoccuring = "false";
  var planningFrom = Date.parse(planningFrom, "dd-MMM-yyyy HH:mm");
  var planningFrom = planningFrom.getTime();
  var planningTill = Date.parse(planningTill, "dd-MMM-yyyy HH:mm");
  var planningTill = planningTill.getTime();
  addSlot(planningFrom, planningTill, planningReoccuring, planningType);
  $('#newEventForm')[0].reset();
}

function editPlanSubmit()
{
  $('#editEvent').modal('hide');
  var enewType = $('input#eplanningType[name="eplanningType"]:checked').val();
  var enewFrom = $('#eplanningFrom').val();
  var enewTill = $('#eplanningTill').val();
  var enewReoccuring = $('input#eplanningReoccuring:checkbox:checked').val();
  if (enewReoccuring == "true") enewReoccuring = "true"; else enewReoccuring = "false";
  var enewFrom = Date.parse(enewFrom, "dd-MMM-yyyy HH:mm");
  var enewFrom = enewFrom.getTime();
  var enewTill = Date.parse(enewTill, "dd-MMM-yyyy HH:mm");
  var enewTill = enewTill.getTime();
	window.newslot = {
		from:	Math.round(enewFrom/1000),
		till: Math.round(enewTill/1000),
		reoc: enewReoccuring,
		type: enewType
	};
	updateSlotModal();
  $('#editEventForm')[0].reset();
}

function deletePlanSubmit()
{
  $('#editEvent').modal('hide');
  deleteSlotModal(oldslot.from, oldslot.till, oldslot.reoc, oldslot.type);
  $('#editEventForm')[0].reset();
}

// Timeline initators
function timelineInit()
{
  timeline_data = [];
  timeline = new links.Timeline(document.getElementById('mytimeline'));
  // Add event listeners
  google.visualization.events.addListener(timeline, 'edit', 	timelineOnEdit);
  google.visualization.events.addListener(timeline, 'add', 		timelineOnAdd);
  google.visualization.events.addListener(timeline, 'delete', timelineOnDelete);
  google.visualization.events.addListener(timeline, 'change', timelineOnChange);
  google.visualization.events.addListener(timeline, 'select', timelineOnSelect);
  google.visualization.events.addListener(timeline, 'rangechange', onRangeChanged1);
  getSlots();
}

function groupTimelineInit(guuid, gname)
{
  getGroupSlots(guuid, gname);
}

function membersTimelineInit(uuid)
{
  timeline_data3 = [];
  var options = {
  	'groupsWidth': '100px'
  };
  timeline3 = new links.Timeline(document.getElementById('memberTimeline'));
  google.visualization.events.addListener(timeline3, 'rangechange', onRangeChanged3);
	timeline3.setVisibleChartRange( window.tstart, window.tend ); 
  timeline3.draw(timeline_data3, options);
  getMemberSlots(uuid);
}

function onRangeChanged1() 
{
  var range = timeline.getVisibleChartRange();
  timeline2.setVisibleChartRange(range.start, range.end);
  if (webpaige.getRole() != 3)
  {
  timeline3.setVisibleChartRange(range.start, range.end);
  }
}  
      
function onRangeChanged2() 
{
  var range = timeline2.getVisibleChartRange();
  timeline.setVisibleChartRange(range.start, range.end);
  if (webpaige.getRole() != 3)
  {
  	timeline3.setVisibleChartRange(range.start, range.end);
  }
} 
     
function onRangeChanged3() 
{
  var range = timeline3.getVisibleChartRange();
  timeline.setVisibleChartRange(range.start, range.end);
  timeline2.setVisibleChartRange(range.start, range.end);
}

// Timeline events
function timelineOnAdd()
{
}

function timelineOnEdit()
{
  var sel = timeline.getSelection();
  var row = sel[0].row;
  var curItem = timeline.getItem(row);
  var content = timeline_data.getValue(row, 2);
  editSlotModal(curItem.start, curItem.end, curItem.group, timeline_helper_html2state(content));
}

function timelineOnDelete()
{
  var sel = timeline.getSelection();
  var row = sel[0].row;
  var oldItem = timeline.getItem(row);
  deleteSlot(oldItem.start / 1000, oldItem.end / 1000, oldItem.group, oldItem.content);
  timeline.cancelDelete();
}

function timelineOnSelect()
{
  var sel = timeline.getSelection();  
  var row = sel[0].row;
  timeline_selected = timeline.getItem(row);
}

function timelineOnChange()
{
  var sel = timeline.getSelection();
  var row = sel[0].row;
  var newItem = timeline.getItem(row);
  updateSlot(timeline_selected, newItem);
}

// Timeline CRUD's
function addSlot(from, till, reoc, value)
{
	var resources = JSON.parse(webpaige.get('resources'));
  var body = 	'{"end":' + (till / 1000) + 
  						',"recursive":' + reoc + 
  						',"start":' + (from / 1000) + 
  						',"text":"' + value + '"}';
	webpaige.con(
		options = {
			type: 'post',
			path: '/slots',
			json: body,
			loading: 'Nieuwe beschiekbaarheid aan het toevoegen..'
			,session: session.getSession()	
		},
		function(data)
	  {  
			getSlots();
		}
	); 
}

// check delete slot
function deleteSlot(from, till, reoc, value)
{
	var resources = JSON.parse(webpaige.get('resources'));
  var path = 	'/askatars/' 
  						+ resources.uuid + '/slots?start=' 
  						+ from + '&end=' 
  						+ till + '&text=' 
  						+ timeline_helper_html2state2(value) 
  						+ '&recursive=' 
  						+ (reoc == 'Re-occuring');
	webpaige.con(
		options = {
			type: 'delete',
			path: path,
			loading: 'De beschiekbaarheid wordt verwijderd..'
			,session: session.getSession()	
		},
		function(data)
	  {  
			getSlots();
		}
	); 
}

function deleteSlotModal(from, till, reoc, value)
{
	var resources = JSON.parse(webpaige.get('resources'));
  var path = 	'/askatars/' 
  						+ resources.uuid + '/slots?start=' 
  						+ from + '&end=' 
  						+ till + '&text=' 
  						+ value 
  						+ '&recursive=' 
  						+ (reoc == 'Re-occuring');
	webpaige.con(
		options = {
			type: 'delete',
			path: path,
			loading: 'De beschiekbaarheid wordt verwijderd..'
			,session: session.getSession()	
		},
		function(data)
	  {  
			getSlots();
		}
	); 
}

function updateSlotModal()
{
	var endof = Math.round(oldslot.till / 1000);
	var now = parseInt((new Date()).getTime() / 1000);
	if (oldslot.till > now)
	{
		var resources = JSON.parse(webpaige.get('resources'));
	  var query =	'start=' + newslot.from + 
	  						'&end=' + newslot.till + 
	  						'&text=' + newslot.type + 
	  						'&recursive=' + newslot.reoc; 
	  var body = '{"color":null' + 
	  						',"count":0' + 
	  						',"end":' + oldslot.till + 
	  						',"recursive":' + oldslot.reoc + 
	  						',"start":' + oldslot.from + 
	  						',"text":"' + oldslot.type + 
	  						'","wish":0}';
		webpaige.con(
			options = {
				type: 'put',
				path: '/askatars/'+resources.uuid+'/slots?'+query,
				json: body,
				loading: 'De beschiekbaarheid wordt gewijzigd..'
				,session: session.getSession()	
			},
			function(data)
		  { 
		  	if (data)
		  	{
		  		webpaige.message("De beschiekbaarheid is gewijzigd!");
		  	} 
				getSlots();
			}
		);
	}
	else
	{
		timeline.cancelChange();
		alert('Het is niet toegestaan ??om gebeurtenissen uit het verleden te veranderen.');
	}
}

function updateSlot(oldSlot, newSlot)
{
	var endof = Math.round(oldSlot.end / 1000);
	var now = parseInt((new Date()).getTime() / 1000);
	if (endof > now)
	{
	  var oldState = oldSlot.content.split('>')[1].split('<')[0];
	  var newState = newSlot.content.split('>')[1].split('<')[0];
		var resources = JSON.parse(webpaige.get('resources'));
	  var query =	'start=' + Math.round(newSlot.start / 1000) + 
	  						'&end=' + Math.round(newSlot.end / 1000) + 
	  						'&text=' + newState + 
	  						'&recursive=' + (newSlot.group == 'Re-occuring');
	  var body = 	'{"color":null' + 
	  						',"count":0' + 
	  						',"end":' + Math.round(oldSlot.end / 1000) + 
	  						',"recursive":' + (oldSlot.group=='Re-occuring') + 
	  						',"start":' + Math.round(oldSlot.start/1000) + 
	  						',"text":"' + oldState + '"' +
	  						',"wish":0}';
		webpaige.con(
			options = {
				type: 'put',
				path: '/askatars/'+resources.uuid+'/slots?'+query,
				json: body,
				loading: 'De beschiekbaarheid wordt gewijzigd..'
				,session: session.getSession()	
			},
			function(data)
		  {  
				getSlots();
			}
		);
	}
	else
	{
		timeline.cancelChange();
		alert('Het is niet toegestaan ??om gebeurtenissen uit het verleden te veranderen.');
	}
}

function editSlotModal(efrom, etill, ereoc, evalue)
{
  var eoldSlotValue;
  var eoldRecursive;
  var eoldSlotFrom;
  var eoldSlotTill;
  $('#editEvent').modal('show');
  if (evalue == 'ask.state.1')
  {
    $('input#eplanningType')[0].checked = true;
  	eoldSlotValue = 'available';
  }
  else if (evalue == 'ask.state.2')
  {
    $('input#eplanningType')[1].checked = true;
  	eoldSlotValue = 'unavailable';
  }
  efrom = new Date(efrom.getTime());
  eoldSlotFrom = Math.round(efrom/1000);
  efrom = efrom.toString("dd-MMM-yyyy HH:mm");
  $('#eplanningFrom').val(efrom);
  etill = new Date(etill.getTime());
  eoldSlotTill = Math.round(etill/1000);
  etill = etill.toString("dd-MMM-yyyy HH:mm");
  $('#eplanningTill').val(etill);
  if (ereoc == 'Re-occuring')
  {
    $('input#eplanningReoccuring')[0].checked = true;
    eoldRecursive = true;
  }
  else if (ereoc == 'Plan')
  {
    $('input#eplanningReoccuring')[0].checked = false;
    eoldRecursive = false;
  }
	window.oldslot = {
		from: eoldSlotFrom,
		till: eoldSlotTill,
		reoc: eoldRecursive,
		type: eoldSlotValue
	};
}

// Timeline slots
function getSlots()
{
	var resources = JSON.parse(webpaige.get('resources'));					
	webpaige.con(
		options = {
			path: '/askatars/'+resources.uuid+'/slots?'+window.range,
			loading: 'De beschiekbaarheiden worden opgeladen..',
			label: 'slots'
			,session: session.getSession()	
		},
		function(data, label)
	  {
	  	var slots = data;  
			timeline_data = new google.visualization.DataTable();
			timeline_data.addColumn('datetime', 'start');
			timeline_data.addColumn('datetime', 'end');
			timeline_data.addColumn('string', 'content');
			timeline_data.addColumn('string', 'group');
			for (var i in slots)
			{
			  var content = colorState(slots[i].text);
			  timeline_data.addRow([
			  	new Date(slots[i].start * 1000), 
			  	new Date(slots[i].end * 1000), 
			  	content, 
			  	slots[i].recursive ? 'Periodiek' : 'Plan'
			  ]);
			}  
		  var options = {
		    'selectable': true,
		    'editable': true,
		  	'height': 'auto',
		  	'groupsWidth': '100px',
        'min': new Date(2012, 0, 1),                 // lower limit of visible range
        'max': new Date(2012, 11, 31),               // upper limit of visible range
        'intervalMin': 1000 * 60 * 60 * 24,          // one day in milliseconds
        'intervalMax': 1000 * 60 * 60 * 24 * 31 * 3  // about three months in milliseconds
		  };
			timeline.draw(timeline_data, options); 
		  var trange = webpaige.config('trange');
		  timeline.setVisibleChartRange(trange.start, trange.end);
		}
	); 
}

function getGroupSlots(guuid, gname)
{
	var resources = JSON.parse(webpaige.get('resources'));
	webpaige.con(
		options = {
			path: '/calc_planning/'+guuid+'?'+window.range,
			loading: 'Groepsbeschiekbaarheid wordt geladen..',
			label: gname
			,session: session.getSession()	
		},
		function(data, label)
	  {
	  	var ndata = [];
			var maxh = 0;
			for (var i in data)
			{
				if(data[i].wish>maxh)
					maxh=data[i].wish;
			}
			for (var i in data)
			{
	      var maxNum = maxh;
	      var num = data[i].wish;
	      var xwish = num;
		    var height = Math.round(num / maxNum * 80 + 20); // a percentage, with a lower bound on 20%
	      var minHeight = height;
	      var style = 'height:' + height + 'px;';
	              'title="Minimum requirement: ' + num + ' people"><span>' + num + '</span></div>';
	      var requirement = '<div class="requirement" style="' + style + '" ' +
	              'title="Minimum requirement: ' + num + ' people"></div>';
				num = data[i].wish + data[i].diff;
				var xcurrent = num;
				
				// a percentage, with a lower bound on 20%
		    height = Math.round(num / maxNum * 80 + 20);
		    
	      if (xcurrent < xwish)
	      {
	      	var color = '#a93232';
	      }
	      else if (xcurrent == xwish)
	      {
		      var color = '#e0c100';
	      }
	      else if (xcurrent > xwish)
	      {
		      var color = '#4f824f';
	      }
	      
	      if (xcurrent > xwish) {
	      	height = minHeight;
	      }
	      
	      style = 'height:' + height + 'px;' + 'background-color: ' + color + ';';
	      var actual = '<div class="bar" style="' + style + '" ' +
	              ' title="Actual: ' + num + ' people"><span class="badge badge-inverse">' + num + '</span></div>';
	      var item = {
	          'group': label,
	          'start': Math.round(data[i].start * 1000),
	          'end': Math.round(data[i].end * 1000),
	          'content': requirement + actual
	      };
	      ndata.push(item);
			} 
		  var options = {
		      "width":  "100%",
		      "height": 'auto',
		      "style": "box",
		      'selectable': false,
		      'editable': false,
		      'groupsWidth': '100px',
		      'eventMarginAxis': 0,
	        'min': new Date(2012, 0, 1),                 // lower limit of visible range
	        'max': new Date(2012, 11, 31),               // upper limit of visible range
	        'intervalMin': 1000 * 60 * 60 * 24,          // one day in milliseconds
	        'intervalMax': 1000 * 60 * 60 * 24 * 31 * 3  // about three months in milliseconds
		  };
		  timeline2 = new links.Timeline(document.getElementById('groupTimeline'));
		  google.visualization.events.addListener(timeline2, 'rangechange', onRangeChanged2);
			
		  timeline2.draw(ndata, options);
		  var trange = webpaige.config('trange');
		  timeline2.setVisibleChartRange(trange.start, trange.end);
		  
		  //console.log('grp :', JSON.stringify(trange));
  
		}
	); 
}

function getMemberSlots(uuid)
{
	webpaige.con(
		options = {
			path: '/network/'+uuid+'/members',
			loading: 'De groep lidden beschiekbaarheiden worden opgeladen..',
			label: uuid
			,session: session.getSession()	
		},
		function(data, label)
	  {  
			timeline_data3 = new google.visualization.DataTable();
			timeline_data3.addColumn('datetime', 'start');
			timeline_data3.addColumn('datetime', 'end');
			timeline_data3.addColumn('string', 'content');
			timeline_data3.addColumn('string', 'group');
	  	//var members = JSON.parse(data);
	  	var members = data;
	  	for (var i in members)
	  	{
				renderMemberSlots(members[i], members[i].name);
	  	}
			var options = {
		    'selectable': false,
		    'editable': false,
		    'snapEvents': false,
		    'groupChangeable': false,
        'min': new Date(2012, 0, 1),                 // lower limit of visible range
        'max': new Date(2012, 11, 31),               // upper limit of visible range
        'intervalMin': 1000 * 60 * 60 * 24,          // one day in milliseconds
        'intervalMax': 1000 * 60 * 60 * 24 * 31 * 3  // about three months in milliseconds
		  };
			
			timeline3.draw(timeline_data3, options);
		  var trange = webpaige.config('trange');
		  timeline3.setVisibleChartRange(trange.start, trange.end);
		  
		  //console.log('mem :', JSON.stringify(trange));
		}
	);
}

function renderMemberSlots(member, name)
{  
	webpaige.con(
		options = {
			path: '/askatars/'+member.uuid+'/slots?'+window.range,
			loading: 'De beschiebaarheiden worden opgeladen..',
			label: name
			,session: session.getSession()	
		},
		function(data, label)
	  {
	  	var slots = data; 
				timeline3.addItem({
					'start':new Date(0),
					'end':new Date(0),
					'content':'available',
					'group': label + ' (periodiek)'
				});
				timeline3.addItem({
					'start':new Date(0),
					'end':new Date(0),
					'content':'available',
					'group': label + ' (plan)'
				});
			for (var i in slots)
			{
			  var content = colorState(slots[i].text);
				timeline3.addItem({
					'start':new Date(slots[i].start * 1000),
					'end':new Date(slots[i].end * 1000),
					'content':content,
					'group':slots[i].recursive ? label + ' (periodiek)' : label + ' (plan)'
				});
			}  
		}
	);     
}




// Slot makeups
function colorState(state)
{
  var content = '?';
  if (state == 'available') return '<div class="available">' + state + '</div>';
  if (state == 'unavailable') return '<div class="unavailable">' + state + '</div>';
}

function timeline_helper_state2html(state)
{
  var state_map = {
	    'ask.state.1': ['available', 'green'],
	    'ask.state.2': ['unavailable', 'red']
	 };
  var content = '?';
  if (state_map[state])
  	return '<div style="background-color:' + state_map[state][1] + '">' + state_map[state][3] + '</div>';
}

function timeline_helper_html2state(content)
{
  var state_map = {
	    'ask.state.1': ['available', 'green'],
	    'ask.state.2': ['unavailable', 'red']
	 };
  var state = content.split('>')[1].split('<')[0];
  //reverse map search..
  for (var i in state_map)
  {
    if (state == state_map[i][0]) return i;
  }
  return state;
}

function timeline_helper_html2state2(content)
{
  var state_map = {
	    'ask.state.1': ['available', 'green'],
	    'ask.state.2': ['unavailable', 'red']
	 };
  var state = content.split('>')[1].split('<')[0];
  //reverse map search..
  for (var i in state_map)
  {
    if (state == state_map[i][0]) return state_map[i][0];
  }
  return state;
}
    
    
    
        

// Group list producers
function renderGroupsList()
{			
	if (webpaige.getRole() < 3)
	{
		webpaige.con(
			options = {
				path: '/network',
				loading: 'De groep informatie wordt opgeladen..',
				label: 'groups'
				,session: session.getSession()	
			},
			function(data, label)
		  { 
			  for(var i in data)
			  {
		  		$('#groupsList').append('<option value="'+data[i].uuid+'">'+data[i].name+'</option>'); 	    
			  }
			}
		);
	}
	else
	{
		webpaige.con(
			options = {
				path: '/parent',
				loading: 'Parent groep informatie wordt opgeladen..',
				label: 'parent group: '
				,session: session.getSession()	
			},
			function(data, label)
		  {
			  //var data = JSON.parse(data);	
		  	for (var i in data)
		  	{	  		
		  		$('#groupsList').append('<option value="'+data[i].uuid+'">'+data[i].name+'</option>'); 		  	
		  	}
			}
		); 
	}			
	
}




function goToday()
{
  var trange = webpaige.config('trange');
  timeline.setVisibleChartRange(trange.start, trange.end);
  timeline2.setVisibleChartRange(trange.start, trange.end);
  timeline3.setVisibleChartRange(trange.start, trange.end);
}



// Timeline navigations
function timelineZoomIn()
{
  links.Timeline.preventDefault(event);
  links.Timeline.stopPropagation(event);
  timeline.zoom(0.4);
  timeline.trigger("rangechange");
  timeline.trigger("rangechanged");
}

function timelineZoomOut()
{
  links.Timeline.preventDefault(event);
  links.Timeline.stopPropagation(event);
  timeline.zoom(-0.4);
  timeline.trigger("rangechange");
  timeline.trigger("rangechanged");
}

function timelineMoveLeft()
{
  links.Timeline.preventDefault(event);
  links.Timeline.stopPropagation(event);
  timeline.move(-0.2);
  timeline.trigger("rangechange");
  timeline.trigger("rangechanged");
}

function timelineMoveRight()
{
  links.Timeline.preventDefault(event);
  links.Timeline.stopPropagation(event);
  timeline.move(0.2);
  timeline.trigger("rangechange");
  timeline.trigger("rangechanged");
}









/* 
MESSAGES
*/
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

		
	  loadUsers(); 
	  //loadGroups(); 
		loadMessages();
		addEventListeners();
  

		var local = {
			title: 'messages_title',
			statics: ['messages_compose', 'messages_compose_a_message', 'messages_message_type', 'messages_sms', 'messages_intern_message', 'messages_email', 'messages_receiver', 'messages_subject', 'messages_message', 'messages_cancel', 'messages_send_message', 'messages_reply_message', 'messages_date', 'messages_messages', 'messages_inbox', 'messages_outbox', 'messages_trash']		
		}
		webpaige.i18n(local);

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
	  
		webpaige.con(
			options = {
				type: 'post',
				path: '/question/sendDirectMessage',
				json: query,
				loading: 'Het bericht wordt verstuurd..',
				message: 'Het bericht is verstuurd!'
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
		    $('#replyMessage').modal('show');
		    
		    var requester = messages[n].requester.split('personalagent/')[1].split('/')[0];
		    
		    console.log('to whom: ', requester);
		    
		    $('#replyMessage .receivers .chzn-select').append(
			    $('<option></option>')
					        .val(requester)
					        .html(requester)
					        .attr("selected", "selected"));
				$("#replyMessage .receivers .chzn-select").trigger("liszt:updated");
			}
		}
	}
	
	
	function displayMessage(uuid, type)
	{
		
		$('#displayMessageActions').remove();
		var actions = $('<div id="displayMessageActions" class="modal-footer"></div>');
		
		actions.append('<a class="btn" data-dismiss="modal" href="#"><i class="icon-remove"></i> Sluiten</a>');
		
		actions.append('<a class="btn btn-danger" onclick="removeMessage(\''+uuid+'\');"><i class="icon-white icon-trash"></i> Bericht verwijderen</a>');
		
		actions.append('<a class="btn btn-success" onclick="replyMessage(\''+uuid+'\');"><i class="icon-white icon-ok"></i> Bericht antwoorden</a>');
		
		$('#displayMessageModal').append(actions);
		
		
		$('#displayMessageModal').modal('show');
		
		var messages = JSON.parse(webpaige.get('messages'));
	  //var messages = messages ? JSON.parse(messages) : undefined;
	  
		for (var n in messages)
		{
			if (messages[n].uuid == uuid)
			{
				if (messages[n].state == 'NEW')
				{
					var query = '{"ids":[' + messages[n].uuid + '],"state":"SEEN"}';
					webpaige.con(
						options = {
							type: 'post',
							path: '/question/changeState',
							json: query,
							loading: 'Berichtstatus wordt verandert..'
							,session: session.getSession()	
						},
						function(data)
					  {  
							loadMessages(type);
						}
					); 
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
	  var query = '{"ids":[' + uuid + '],"state":"TRASH"}';
		webpaige.con(
			options = {
				type: 'post',
				path: '/question/changeState',
				json: query,
				loading: 'Het bericht wordt naar prullenbak verplaatst..'
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
		
	  var query = '{"ids":[' + ids + '],"state":"TRASH"}';
	  						
		webpaige.con(
			options = {
				type: 'post',
				path: '/question/changeState',
				json: query,
				loading: 'De berichten worden naar prullenbak verplaatst..'
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
				loading: 'Het bericht wordt verwijdert..'
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
				loading: 'De prullenbak wordt leegmaakt..'
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
				var status = 'Inbox wordt opgeladen..';
			break;
			case 'outbox':
				var url = '/question?0=sent';
				var btn = $('#outbox');
				var status = 'Outbox wordt opgeladen..';
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
			options = {
				path: url,
				loading: status,
				label: type
				,session: session.getSession()	
			},
			function(data, label)
		  {  
		  	// needing this for replying messages 
		  	//webpaige.set('messages', ''); 
		  	webpaige.set('messages', JSON.stringify(data)); 
		  	
		  	//console.log('msg stored');
		  		
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
		  	
		  	var resources = JSON.parse(webpaige.get('resources'));
		  
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
				theadtr.append('<th>Van</th>');
				theadtr.append('<th>Naar</th>');
			}
			else
			{
				var direction = (type == 'outbox') ?  'Naar' : 'Van';
				if (type == 'inbox')
					theadtr.append('<th></th>');
					
				theadtr.append('<th>'+direction+'</th>');
			}
			
			theadtr.append('<th>Onderwerp</th>');
			theadtr.append('<th>Datum</th>');
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
					var state = (data[n].state == 'NEW') ?  '<span class="label label-info">Nieuw</span>' : '';
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
						responders = '<i>Meerdere ontvangers</i>';
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
	    	tbody.append('<tr><td colspan="6"><a class="btn btn-danger" onclick="emptyTrash();"><i class="icon-trash icon-white"></i> Verwijder definitief</a></td></tr>');
	    }
	    else
	    {
	    	tbody.append('<tr><td colspan="6"><a class="btn" onclick="removeMessages(\''+type+'\');"><i class="icon-trash"></i> Verwijder geselecteerde berichten</a></td></tr>');
	    }
	    
	    table.append(tbody);
	    $(live).append(table);
	  }			      
	 	else
	 	{
			$(live).append('<p>Er zijn geen berichten.</p>');
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
				loading: 'Zoeken naar gebruikers in uw netwerk..'
				,session: session.getSession()	
			},
			function(data)
		  {  
			  //var data = data ? JSON.parse(data) : undefined;
			  
			  //console.log('loaded users :', data)
			  //debugger;
			  
			  var users = $('<optgroup label="USERS"></optgroup>');
			  
				if (data && data.length > 0)
				{
				
					//webpaige.set('users', JSON.stringify(data));
					
			    for(var n in data)
			    {
			    	$(users).append("<option value=" + data[n].id + ">" + data[n].name + "</option>");
			    }
			    $(".receivers .chzn-select").append(users);
			    //$("#receivers .chzn-select").trigger("liszt:updated");
			    
			    //
				} 
			}
		);
		
		
		webpaige.con(
			options = {
				path: '/network',
				loading: 'De groepenlijst wordt opgeladen..'
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
			    $(".receivers .chzn-select").append(groups);
			    $(".receivers .chzn-select").trigger("liszt:updated");
				} 
			}
		); 
		
		
	}
	
		
	function toggleChecked(uuid, status)
	{
		var ids = "#tb-" + uuid.replace(/([@.:#])/g, '\\$1') + " input"; 
		$(ids).each( function()
		{
			$(this).attr("checked",status);
		})
	}












/* 
GROUPS
*/


$(document).ready(function()
{
 	pageInit('groups', 'true');
 	
 	loadGroups();
 	
 	$("#searchResults").hide();
  $("#alertDiv").hide();
 	
 	$('#groupsList').click(function()
 	{
 		$("#members").show();
 		$("#searchResults").hide();
  	$("#alertDiv").hide();
  	$('#q').val("");
 	});
 	
 	$("#searchMemberBtn").click(function()
 	{
 		var value = $('#q').val();
 		searchMembers(value);
 	});

	$('#groupSubmit').click(function()
  {
  	addGroup();
  });

	$('#saveNewMember').click(function()
  {
  	saveNewMember();
  });

	$('#editMemberBtn').click(function()
  {
  	editMember();
  });
	

  $('#editGroupSubmitter').click(function()
  {
    $('#editGroup').modal('hide');
    var editGroupName = $('#editGroupName').val();
    var uuid = $('#editGroupUUID').val();
    $('#editGroupForm')[0].reset();
		updateGroup(editGroupName, uuid);
  });

  $('#deleteGroupBtn').click(function()
  {
    $('#editGroup').modal('hide');
    var editGroupUUID = $('#editGroupUUID').val();
    $('#editGroupForm')[0].reset();
    deleteGroup(editGroupUUID);
  });
	 	
	$(".chzn-select").chosen();
	$(".chzn-select-deselect").chosen(
	{
		allow_single_deselect:true
	});


	var local = {
		title: 'groups_title',
		statics: ['groups_search_members', 'groups_search', 'groups_new_member', 'groups_role', 'groups_groups', 'groups_first_name', 'groups_last_name', 'groups_phone_number', 'groups_email_address', 'groups_password', 'groups_cancel', 'groups_save_member', 'groups_edit_member', 'groups_firstlast_name', 'groups_address', 'groups_postcode', 'groups_city', 'groups_new_group', 'groups_group_name', 'groups_save_group', 'groups_edit_group', 'groups_delete_group']		
	}
	webpaige.i18n(local);
  
});


var session = new ask.session();


function loadGroups(uuid, name)
{
	webpaige.con(
		options = {
			path: '/network',
			loading: 'De groepen worden opgeladen..',
			label: 'groups'
			,session: session.getSession()	
		},
		function(data, label)
	  {  
    	renderGroups(data, uuid, name);
    	renderGroupsList(data);
		}
	);
	/*
	var cache = ASKCache("getGroups",'/network',null, 'uuid', session);
	cache.addRenderer('group.html',function(json, oldData, data){
			renderGroups(json, uuid, name);
	});
	*/
}


function addGroup()
{
  $('#newGroup').modal('hide');
  var name = $('#newGroupName').val();
  $('#newGroupForm')[0].reset();
  var resources = JSON.parse(localStorage.getItem('resources')); 	
  var body = '{"name": "' + name + '"}';	
	webpaige.con(
		options = {
			type: 'post',
			path: '/network/'+resources.uuid,
			loading: 'Nieuwe groep wordt toegevoegd..',
			json: body,
			message: 'Groep is toegevoegd.',
			label: 'addGroup'
			,session: session.getSession()	
		},
		function(data, label)
	  {  
    	console.log(data, label);
    	loadGroups(data, label);
		}
	);
}


function updateGroup(name, uuid)
{
  var body = '{"name": "' + name + '"}';	
	webpaige.con(
		options = {
			type: 'put',
			path: '/network/'+uuid,
			loading: 'Groep wordt gewijzigd..',
			json: body,
			message: 'Groep gewijzigd.',
			label: 'groups'
			,session: session.getSession()	
		},
		function(data, label)
	  {  
    	loadGroups(uuid, name);
		}
	);
}


function editGroupModalInit(name, uuid)
{
  $('#editGroup').modal('show');
  var editGroupName = $('#editGroupName').val(name);	
  var editGroupUUID = $('#editGroupUUID').val(uuid);			
}


function deleteGroup(uuid)
{
	webpaige.con(
		options = {
			type: 'delete',
			path: '/network/'+uuid,
			loading: 'Groep wordt verwijderd..',
			message: 'Groep is verwijderd.',
			label: 'groups'
			,session: session.getSession()	
		},
		function(data, label)
	  {  
	  	loadGroups();
		}
	);
}


function searchMembers(value)
{
  var body = '{"key":"' + value + '"}';
	webpaige.con(
		options = {
			type: 'post',
			path: '/network/searchPaigeUser',
			json: body,
			loading: 'Zoeken naar contacten in uw netwerk..',
			label: 'searched'
			,session: session.getSession()	
		},
		function(data, label)
	  {  
			renderSearch(data);
  		renderAddGroupsList(window.groups);
		}
	); 
}


function loadMembers(name, uuid)
{
	webpaige.con(
		options = {
			path: '/network/'+uuid+'/members',
			loading: 'Contacten worden opgeladen..',
			label: 'members'
			,session: session.getSession()	
		},
		function(data, label)
	  {  
  		$('#live').remove();
	  	renderMembers(data, name, uuid);
		}
	);
}


function addMembers()
{
	var uuid = $('#groupsAddList option:selected').val();
  var values = $('.search input:checkbox:checked').map(function ()
  {
	  if (this.value != 'on')
	  {
			webpaige.con(
				options = {
					type: 'post',
					path: '/network/'+uuid+'/members/'+this.value,
					loading: 'Nieuwe contact(en) toegevoegd..',
					label: 'Contact(en) is toegevoegd.'
					,session: session.getSession()	
				},
				function(data, label)
			  {  
		  		loadGroups(uuid);
				}
			); 
	  }
	}).get();
}


function addNewMember()
{
	$('#groupsListNew .chzn-select').html('');
	
	renderGroupsList(window.groups);
	
	//$('#newMember').modal('show');
}


function addNewMemberToGroup(name, uuid)
{
	//$('#groupsListNew .chzn-select option:selected').removeAttr('selected');
	$('#groupsListNew .chzn-select').html('');
	
	renderGroupsList(window.groups);
	
	$('#newMember').modal('show');
	//$('#newMember h3').html('New member (' + name + ')');
	
	//$('#newMember #guuid').val(uuid);
	
  $('#groupsListNew .chzn-select').append(
    $('<option></option>')
		        .val(uuid)
		        .html(name)
		        .attr("selected", "selected"));
	$("#groupsListNew .chzn-select").trigger("liszt:updated");
}


function saveNewMember()
{
	$('#newMember').modal('hide');
	var role = $('#newMember #roles').val();
	var fname = $('#newMember #fname').val();
	var lname = $('#newMember #lname').val();
	var name = fname + ' ' + lname;
	var tel = $('#newMember #tel').val();
	var uuid = $('#newMember #email').val();
	var pass = $('#newMember #pass').val();
	var guuids = $('#groupsListNew select').val();
	
	console.log('role', role);
	console.log('name', name);
	console.log('tel', tel);
	console.log('uuid', uuid);
	console.log('pass', pass);
	console.log('guuids', guuids);
	
	// register user in ask

	webpaige.con(
		options = {
			path: '/register?uuid=' + uuid + '&pass=' + MD5(pass) + '&name=' + name + '&phone=' + tel + '&direct=true&module=default',
			loading: 'Registering new user..',
			label: 'New member'
			,session: session.getSession()	
		},
		function(data, label)
	  {
	  	// register role of the user	
		  var tags = '{' +
		  	'"role":"' + role + '"' +
		  	'}';
		
			webpaige.con(
				options = {
					type: 'put',
					path: '/node/'+uuid+'/resource',
					json: tags,
					loading: 'Contact informatie wordt opgeslagen..',
					message: 'Contact informatie is opgeslagen.',
					label: 'member'
					,session: session.getSession()	
				},
				function(data, label)
			  { 
					console.log('member role usccesfully added, ', role);
				}
			);
						
			// register user in sense environment
			var body = {};
			var user = {};
			user.email = uuid;
			user.username = uuid;
			user.name = fname;
			user.surname = lname;
			user.mobile = tel;
			user.password = MD5(pass);
			body.user = user;
			var body = JSON.stringify(body);
			var sense = JSON.parse(webpaige.get('sense'));
			webpaige.con(
				options = {
					host: 'http://api.sense-os.nl',
					path: '/users.json',
					type: 'post',
					json: body,
					loading: 'Gebruiker account wordt geregistreerd in Sense environment..',
					message: 'Gebruiker account is registered in Sense.',
					session: null,
					credentials: false,
					label: 'Sense account'
				},
				function(data, label)
			  {
			  	console.log('Sense registration is successful..');  
				}
			);
			
			// register user to given groups
	  	for (var h in guuids)
	  	{
		    // add user to the group
				webpaige.con(
					options = {
						type: 'post',
						path: '/network/'+guuids[h]+'/members/'+uuid,
						loading: 'Contact wordt toegevoegd in groep..',
						label: 'Contact is toegevoegd in groep.'
						,session: session.getSession()	
					},
					function(data, label)
				  {  
			  		loadGroups();
					}
				); // end of add user to groups 
	  	} // end of adding to group loop
		}
	); 
	// end of register in ask
}


function editMemberModalInit(guuid, uuid)
{
	webpaige.con(
		options = {
			path: '/node/'+uuid+'/resource',
			loading: 'Contact informatie wordt opgehaald..',
			message: 'Contact informatie is opgeladen.',
			label: 'resource'
			,session: session.getSession()	
		},
		function(data, label)
	  {
	  	  
			$('form#editMemberForm')[0].reset();
	  
	  	var roles = [
	  		{
		  		name: 'Volunteer',
		  		value: 3
	  		},
	  		{
		  		name: 'Schipper',
		  		value: 2
	  		},
	  		{
		  		name: 'Planner',
		  		value: 1
	  		}
	  	];
	  	
	  	for (var i in roles)
	  	{
		  	if (data.role == roles[i].value)
		  	{
			  	$('#editMember #roles').val(data.role).attr('selected',true);
		  	}
	  	}
  		$('#editMember').modal('show');
  		$('#editMember #name').val(data.name);	
  		$('#editMember #tel').val(data.PhoneAddress);	
  		$('#editMember #email').val(data.EmailAddress);	
  		$('#editMember #address').val(data.PostAddress);	
  		$('#editMember #postcode').val(data.PostZip);	
  		$('#editMember #city').val(data.PostCity);	
  		$('#editMember #country').val(data.PostCountry);	
  		$('#editMember #uuid').val(data.uuid);	
  		$('#editMember #guuid').val(guuid);	
		}
	);	
}



function editMember()
{
	$('#editMember').modal('hide');
	
	var role = $('#editMember #roles').val();
	var name = $('#editMember #name').val();	
	var tel = $('#editMember #tel').val();	
	var email = $('#editMember #email').val();
	var address = $('#editMember #address').val();
	var postcode = $('#editMember #postcode').val();
	var city = $('#editMember #city').val();
	var uuid = $('#editMember #uuid').val();
	var guuid = $('#editMember #guuid').val();
  	
  var tags = '{' +
  	'"role":"' + role + '", ' +
  	'"name":"' + name + '", ' +
  	'"PhoneAddress":"' + tel + '", ' +
  	'"EmailAddress":"' + email + '", ' +
  	'"PostAddress":"' + address + '", ' +
  	'"PostZip":"' + postcode + '", ' +
  	'"PostCity":"' + city + '"' +
  	'}';
  	
  //console.log('role :', role);
		
	webpaige.con(
		options = {
			type: 'put',
			path: '/node/'+uuid+'/resource',
			json: tags,
			loading: 'Contact informatie wordt opgeslagen..',
			message: 'Contact informatie is gewijzigd.',
			label: 'member'
			,session: session.getSession()	
		},
		function(data, label)
	  { 
			// get group name for displaying later
			webpaige.con(
				options = {
					path: '/network/'+guuid,
					loading: 'Contacten worden opgeladen..',
					label: 'members'
					,session: session.getSession()	
				},
				function(data, label)
			  {
			  	data = JSON.parse(data);			  	
	  			loadGroups(guuid, data.name); 
			  }
			);
		}
	);	
}



function removeMembers(name, uuid)
{
	var specificTable = '#tb-' + uuid + ' input:checkbox:checked';
  var values = $(specificTable).map(function ()
  {
	  if (this.value != 'on')
	  {
	  	removeMember(name, uuid, this.value);
	  }
	}).get();
}	


function removeMember(name, uuid, memberUuid)
{
	webpaige.con(
		options = {
			type: 'delete',
			path: '/network/'+uuid+'/members/'+memberUuid,
			loading: 'Contact wordt verwijderd..',
			label: 'Contact is verwijderd.'
			,session: session.getSession()	
		},
		function(data, label)
	  { 
	  	//debugger; 
  		loadGroups(uuid, name);
		}
	);
}

	
function toggleChecked(uuid, status)
{
	var ids = "#tb-" + uuid.replace(/([@.:#])/g, '\\$1') + " input"; 
	$(ids).each( function()
	{
		$(this).attr("checked",status);
	})
}











function renderGroups(data, uuid, name)
{
	window.groups = data;
	
	$('#groupsList').remove();
	
	var groupsList = $('<ul id="groupsList" class="nav nav-list"></ul>');
  $(groupsList).append('<li class="nav-header">Groepen</li>');
   
  for (var i in data)
  {
  	if (uuid == null && name == null && i==0)
  	{
  		$(groupsList).append('<li class="active"><a onClick="loadGroups(\''+data[i].uuid+'\', \''+data[i].name+'\')">'+data[i].name+'</a></li>');
  		var uuid = data[i].uuid;
  		var name = data[i].name;
  	}
  	else
  	{
  		if (uuid == data[i].uuid)
  		{
  			var active = ' class="active"';
  		}
  		else
  		{
  			var active = '';
  		}
  		$(groupsList).append('<li'+active+'><a onClick="loadGroups(\''+data[i].uuid+'\', \''+data[i].name+'\')">'+data[i].name+'</a></li>');
			var uuid = uuid;
			var name = name;	
  	}
  }
  
  $('#groupsNav').html(groupsList);
  loadMembers(name, uuid);
}



function renderMembers(json, name, uuid)
{
 	//var data = json ? JSON.parse(json) : undefined;
 	var data = json;
 	
 	$('#live').remove();
 	
	var live = $('<div id="live"></div>');
	
  var btnGroup = $('<div class="btn-group btn-hanging"></div>');
  
  //$(btnGroup).append('<a onClick="addNewMemberToGroup(\''+name+'\', \''+uuid+'\')" class="btn"><i class="icon-user"></i> Add new member</a>');
  
  $(btnGroup).append('<a data-toggle="modal" href="#newGroup" class="btn"><i class="icon-plus"></i> Nieuwe groep</a>');
  
  $(btnGroup).append('<a onClick="editGroupModalInit(\''+name+'\', \''+uuid+'\')" class="btn"><i class="icon-edit"></i> Bewerk groep</a>');
  
  $(btnGroup).append('<a onClick="deleteGroup(\''+uuid+'\')" class="btn"><i class="icon-remove"></i> Verwijder groep</a>');
  
  $(live).append(btnGroup);
  
  $(live).append('<div class="btn-group btn-hanging"><a data-toggle="modal" href="#newMember" onclick="addNewMember()" class="btn"><i class="icon-user"></i> Nieuwe contact</a></div>');
  
  var title = $('<h2><span class="entypo eMedium">,</span> '+name+'</h2><br>');  
  
  $(live).append(title);
  
 	if (data && data.length > 0)
 	//if (data)
 	{
		var table = $('<table id="tb-'+uuid+'" class="table table-striped"></table>');
		var thead = $('<thead><tr></tr></thead>');
		thead.append('<th><input type="checkbox" onclick="toggleChecked(\''+uuid+'\', this.checked)" /></th>');
		thead.append('<th>Naam</th>');
		
		thead.append('<th>Role</th>');
		//thead.append('<th>UUID</th>');
		
		thead.append('<th>Emailadres</th>');
		thead.append('<th>Telefoonnummer</th>');
		thead.append('<th></th>');
		table.append(thead);
		var tbody = $('<tbody></tbody>');
    for(var n in data)
    {
    	var tbodytr = $('<tr></tr>');
			tbodytr.append('<td><input type="checkbox" class="checkbox" value="'+data[n].uuid+'" /></td>');
			tbodytr.append('<td><a onclick="editMemberModalInit(\''+uuid+'\', \''+data[n].uuid+'\');">'+data[n].name+'</a></td>');
			
	  	var roles = [
	  		{
		  		name: 'Volunteer',
		  		value: 3
	  		},
	  		{
		  		name: 'Schipper',
		  		value: 2
	  		},
	  		{
		  		name: 'Planner',
		  		value: 1
	  		}
	  	];
	  	
	  	for (var i in roles)
	  	{
		  	if (data[n].resources.role == roles[i].value)
		  	{
			  	var role = roles[i].name;
		  	}
	  	}
			tbodytr.append('<td>'+ role +'</td>');
			
			//tbodytr.append('<td>'+data[n].uuid+'</td>');
			
			tbodytr.append('<td>'+data[n].resources.EmailAddress+'</td>');
			tbodytr.append('<td>'+data[n].resources.PhoneAddress+'</td>');
			tbodytr.append('<td><a class="btn btn-mini" onclick="removeMember(\''+name+'\', \''+uuid+'\', \''+data[n].uuid+'\');"><i class="icon-trash"></i></a></td>');
			tbody.append(tbodytr);
    }
    tbody.append('<tr><td colspan="6"><a class="btn" onclick="removeMembers(\''+name+'\', \''+uuid+'\');"><i class="icon-trash"></i> Verwijder geselecteerde contacten</a></td></tr>');
    table.append(tbody);
    $(live).append(table);
  }			      
 	else
 	{
		$(live).append('<p>Er zijn geen contacten.</p>');
 	}
 	
 	$('#content').html(live);
}


function renderSearch(data)
{
	//var data = data ? JSON.parse(data) : undefined;
	
	$('#groupsList li').removeClass('active');
 	
	var live = $('<div id="live"></div>');
	live.addClass('search');
  
  var title = $('<h2><span class="entypo eMedium">,</span> Zoek resultaten</h2><br>Trefwoorden: "<span id="searchQuery">{Search Query}</span>". Gevonden resultaten: <span id="searchResultsTotal">{Search Results Total}</span><br>');
  
  $(live).append(title);  
	
	if (data && data.length > 0)
	{		
		var table = $('<table id="tb-searchResultsTable" class="table table-striped"></table>');
		var thead = $('<thead><tr></tr></thead>');
		thead.append('<th><input type="checkbox" onclick="toggleChecked(\'searchResultsTable\', this.checked)" /></th>');
		thead.append('<th>Naam</th>');
		table.append(thead);
		var tbody = $('<tbody></tbody>');
    for(var n in data)
    {
    	var tbodytr = $('<tr></tr>');
			tbodytr.append('<td><input type="checkbox" class="checkbox" value="'+data[n].id+'" /></td>');
			tbodytr.append('<td>'+data[n].name+'</td>');
			tbody.append(tbodytr);
    }
    tbody.append('<tr><td><form class="form-inline"><div class="control-group"><div class="controls docs-input-sizes"><select id="groupsAddList"></select> <a onclick="addMembers();" class="btn"><i class="icon-plus"></i> Toeveogen aan de groep</a></div></div></form></td></tr>');
    table.append(tbody);
    $(live).append(table);
	}
	else
	{
		$(live).append('<p>Er zijn geen resultaten.</p>');
	}
 	$('#content').html(live);
	$('#searchQuery').html($('#q').val());
	$('#searchResultsTotal').html(data.length);	
}



function renderAddGroupsList(groups)
{
  for(var i in groups)
  {		    
  	$('#groupsAddList').append('<option value="'+groups[i].uuid+'">'+groups[i].name+'</option>');
  }
}



function renderGroupsList(groups)
{
  for(var n in groups)
  {		
  	$('#groupsListNew .chzn-select').append("<option value=" + groups[n].uuid + ">" + groups[n].name + "</option>");
  }
	$("#groupsListNew .chzn-select").trigger("liszt:updated");
}















/* 
PROFILE
*/

	window.addEventListener( 'load', windowInit, false );
	
	function windowInit()
	{
	 	pageInit('profile', 'true');
	  renderProfile();
	  addEventListeners();	


		var local = {
			title: 'profile_title',
			statics: ['profile_edit_profile', 'profile_change_password', 'profile_update_profile', 'profile_profile_name', 'profile_email_address', 'profile_phone_number', 'profile_address', 'profile_postcode', 'profile_city', 'profile_cancel', 'profile_save_profile', 'profile_old_password', 'profile_new_password', 'profile_new_password_repeat', 'profile_close', 'profile_changed']		
		}
		webpaige.i18n(local);
		
	}

	function addEventListeners()
	{
		document.getElementById('alertClose').addEventListener('click', closeAlerts, false);
		document.getElementById('updateProfileTrigger').addEventListener('click', updateProfile, false);
	}
	
	function closeAlerts()
	{
		$("#alertDiv").hide();		
	}
	
	
	function renderProfile()
	{ 
		webpaige.con(
			options = {
				path: '/resources',
				loading: 'Gebruiker informatie wordt opgeladen..',
				label: 'resources',
				session: session.getSession()	
			},
			function(data, label)
		  {  	
			 	var name = (data.name != undefined) ? data.name : 'Er is nog geen namen toegevoegd.';
			 	var email = (data.EmailAddress != undefined) ? data.EmailAddress : 'Er is nog geen adres toegevoegd.';
			 	var phone = (data.PhoneAddress != undefined) ? data.PhoneAddress : 'Er is nog geen telefoonnummer toegevoegd.';
			 	var address = (data.fullPostAddress != undefined) ? data.fullPostAddress : 'Er is nog geen adres toegevoegd.';
			 	$('#live').remove();
				var live = $('<div id="live"></div>');
				var para = $('<p></p>');
				var dl = $('<dl></dl>');
				dl.append('<dt>Emailadres:</dt>');
				dl.append('<dd>'+email+'</dd>');
				dl.append('<dt>Telefoonnummer:</dt>');
				dl.append('<dd>'+phone+'</dd>');
				dl.append('<dt>Straat:</dt>');
				dl.append('<dd>'+data.PostAddress+'</dd>');
				dl.append('<dt>Postcode:</dt>');
				dl.append('<dd>'+data.PostZip+'</dd>');
				dl.append('<dt>Stad:</dt>');
				dl.append('<dd>'+data.PostCity+'</dd>');
				para.append(dl);
				$(live).append(para);
				$('#content').html(live);
			}
		);	
	}
	
	function updateProfile()
	{
		webpaige.con(
			options = {
				path: '/resources',
				loading: 'Gebruiker informatie wordt opgeladen..',
				label: 'resources',
				session: session.getSession()	
			},
			function(data, label)
		  {  	
	  		$('#updateProfile').modal('show');
			  $('#name').val(data.name); 
			  $('#email').val(data.EmailAddress); 
			  $('#phone').val(data.PhoneAddress); 
			  $('#address').val(data.PostAddress); 
			  $('#postcode').val(data.PostZip); 
			  $('#city').val(data.PostCity); 
			}
		);	
	}
	
	function changePassword()
	{
		var old_pass = $('#pass').val();
		var pass1 = $('#pass1').val();
		var pass2 = $('#pass2').val();
	  
	  if (pass1 == '' || pass2 == '')
	  {
	    $("#changePassword #alertDiv").show();
	    $("#changePassword #alertMessage").html("<strong>Wachtwoord wijzigen is mislukt!</strong><br>Graag vul de alle verplichte velden.");
	    return false;
	  }
	  
	  if (pass1 != pass2)
	  {
	    $("#changePassword #alertDiv").show();
	    $("#changePassword #alertMessage").html("<strong>Wachtwoord wijzigen is mislukt!</strong><br>Wachtwoorden komen niet overeen. Probeer het opnieuw.");
	    return false;
	  }
	  else
	  {
	  	var pass = pass1;
	  }
	  
		webpaige.con(
			options = {
				path: '/resources',
				loading: 'Gebruiker informatie wordt opgeladen..',
				label: 'resources',
				session: session.getSession()	
			},
			function(data, label)
		  {  	
	  		if (data.askPass == MD5(old_pass))
	  		{
				  var tags = '{' + '"askPass":"' + MD5(pass) + '"' + '}';
					webpaige.con(
						options = {
							type: 'post',
							path: '/resources?tags=' + tags,
							loading: 'Wachtwoord wordt gewijzigd..',
							message: 'Wachtwoord is gewijzigd.',
							label: 'resources'
							,session: session.getSession()	
						},
						function(data, label)
					  {
					  	var body = '{' +				  		
								'"current_password":"' + MD5(old_pass) + '",' +
								'"new_password":"' + MD5(pass) + '"' +
					  	'}'; 
							var sense = webpaige.get('sense');
							sense = sense ? JSON.parse(sense) : undefined;
							webpaige.con(
								options = {
									host: 'http://api.sense-os.nl',
									path: '/change_password.json',
									type: 'post',
									json: body,
									loading: 'Sense Wachtwoord wordt gewijzigd..',
									message: 'Sense Wachtwoord is gewijzigd..',
									session: sense.session,
									credentials: false,
									label: 'sensors'
								},
								function(data, label)
							  {
					    		$("#changePassword #successDiv").show();
					    		$("#changePassword #successMessage").html("<strong>Wachtwoord is gewijzigd!</strong><br>Uw nieuwe wachtwoord is ingesteld.");
					    		$('#changePassword #changePasswordButtons').hide();
					    		$('#changePassword #passwordChangedButton').show();
								}
							);
						}
					);
	  		}
	  		else
	  		{
	    		$("#changePassword #alertDiv").show();
	    		$("#changePassword #alertMessage").html("<strong>Wachtwoord wijzigen is mislukt!</strong><br>U hebt een verkeerd wachtwoord getypt.");
	  		}
			}
		);
			
	}
	
	function changeResources()
	{
	  var name = $('#name').val(); 
	  var phone = $('#phone').val(); 
	  var address = $('#address').val(); 
	  var postcode = $('#postcode').val(); 
	  var city = $('#city').val(); 
	  $('#updateProfile').modal('hide');
	  var tags = '{' +
	  	'"name":"' + name + '", ' +
	  	'"PhoneAddress":"' + phone + '", ' +
	  	'"PostAddress":"' + address + '", ' +
	  	'"PostZip":"' + postcode + '", ' +
	  	'"PostCity":"' + city + '"' +
	  	'}';
		webpaige.con(
			options = {
				type: 'post',
				path: '/resources?tags=' + tags,
				loading: 'Gebruiker informatie wordt gewijzigd..',
				message: 'Gebruiker informatie is gewijzigd.',
				label: 'resources'
				,session: session.getSession()	
			},
			function(data, label)
		  {  
	      $("#profileChanged").show();
	    	renderProfile();
			}
		);
	}











/* 
SETTINGS
*/

window.addEventListener( 'load', windowInit, false );

function windowInit()
{
 	pageInit('settings', 'true');	

 	renderGroupsList();
  
  $('#from').datetimepicker();
  $('#till').datetimepicker();
  $('#efrom').datetimepicker();
  $('#etill').datetimepicker();
  
  wishesTimelineInit(); 

		var local = {
			title: 'settings_title',
			statics: ['settings_today', 'settings_new_wish', 'settings_group', 'settings_from', 'settings_till', 'settings_wish', 'settings_cancel', 'settings_save_wish', 'settings_edit_wish', 'settings_settings']		
		}
		webpaige.i18n(local); 
 	
}
    

	
var session = new ask.session();
var timeline;
var timeline_selected = null;



// Submitters
function wishSubmit()
{
  $('#newWish').modal('hide');
  
  var group = $('#groupsList option:selected').val();
  
  var from = $('#from').val();
  var till = $('#till').val();
  
  var wish = $('#wish').val();
  
  var from = Date.parse(from, "dd-MMM-yyyy HH:mm");
  var from = from.getTime();
  
  var till = Date.parse(till, "dd-MMM-yyyy HH:mm");
  var till = till.getTime();
  
  addWish(from, till, wish, group);
  
  $('#newWishForm')[0].reset();
}



function editPlanSubmit()
{
  $('#editEvent').modal('hide');
  
  var enewType = $('input#eplanningType[name="eplanningType"]:checked').val();
  var enewFrom = $('#eplanningFrom').val();
  var enewTill = $('#eplanningTill').val();
  var enewReoccuring = $('input#eplanningReoccuring:checkbox:checked').val();
  //var newAllDay = $('input#planningAllDay:checkbox:checked').val();
  
  if (enewReoccuring == "true") enewReoccuring = "true"; else enewReoccuring = "false";
  
  var enewFrom = Date.parse(enewFrom, "dd-MMM-yyyy HH:mm");
  var enewFrom = enewFrom.getTime();
  
  var enewTill = Date.parse(enewTill, "dd-MMM-yyyy HH:mm");
  var enewTill = enewTill.getTime();
  
	window.newslot = {
		from:	Math.round(enewFrom/1000),
		till: Math.round(enewTill/1000),
		reoc: enewReoccuring,
		type: enewType
	};

	updateSlotModal();
	
  $('#editEventForm')[0].reset();
}



function deletePlanSubmit()
{
  $('#editEvent').modal('hide');
  deleteSlotModal(oldslot.from, oldslot.till, oldslot.reoc, oldslot.type);
  $('#editEventForm')[0].reset();
}





function editWishModal(start, end, group, wish)
{
  $('#editWish').modal('show');
  $('#editWish span#groupName').html(group);  
  start = new Date(start.getTime());
  start = start.toString("dd-MMM-yyyy HH:mm");
  $('#editWish #efrom').val(start);
  end = new Date(end.getTime());
  end = end.toString("dd-MMM-yyyy HH:mm");
  $('#editWish #etill').val(end);
  $('#editWish #ewish').val(wish);
}



function editWishSubmit()
{
  $('#editWish').modal('hide');
  var group = $('#editWish span#groupName').html();  
  var start = $('#editWish #efrom').val();
  var end = $('#editWish #etill').val();
  var wish = $('#editWish #ewish').val();
  
  start = Date.parse(start, "dd-MMM-yyyy HH:mm");
  start = start.getTime();
  
  end = Date.parse(end, "dd-MMM-yyyy HH:mm");
  end = end.getTime();
  
	var groups = JSON.parse(webpaige.get('groups'));
  
  for (var i in groups)
  {
	  if (groups[i].name == group)
	  {
		  var guuid = groups[i].uuid;
	  }	  
  }
  
  addWish(start, end, wish, guuid);
}



function addWish(from, till, wish, group)
{
  var body = 	'{"end":' + (till / 1000) + 
  						',"start":' + (from / 1000) + 
  						',"wish":"' + wish + '"}';
	webpaige.con(
		options = {
			type: 'put',
			path: '/network/'+group+'/wish',
			json: body,
			loading: 'Nieuwe beschiekbaarheid wordt toegevoegd..'
			,session: session.getSession()	
		},
		function(data)
	  {  
			getWishes();
		}
	); 
} 



// Timneline initators
function wishesTimelineInit()
{
  timeline_data = [];
  var options = { 
  };
  timeline = new links.Timeline(document.getElementById('wishesTimeline'));
  
  // Add event listeners
  google.visualization.events.addListener(timeline, 'edit', 	timelineOnEdit);
  google.visualization.events.addListener(timeline, 'add', 		timelineOnAdd);
  google.visualization.events.addListener(timeline, 'delete', timelineOnDelete);
  google.visualization.events.addListener(timeline, 'change', timelineOnChange);
  google.visualization.events.addListener(timeline, 'select', timelineOnSelect);
  
  getWishes();
}

function getWishes()
{
	
  var now = parseInt((new Date()).getTime() / 1000);
	//var resources = JSON.parse(webpaige.get('resources'));
  var range =	'start=' + (now - 86400 * 7 * 4 * 4) + 
  						'&end=' + (now + 86400 * 7 * 4 * 4);  
	
	timeline_data = new google.visualization.DataTable();
	timeline_data.addColumn('datetime', 'start');
	timeline_data.addColumn('datetime', 'end');
	timeline_data.addColumn('string', 'content');
	timeline_data.addColumn('string', 'groups');
						 						
	webpaige.con(
		options = {
			path: '/network',
			loading: 'Groepen worden opgeladen..',
			label: 'groups'
			,session: session.getSession()	
		},
		function(data, label)
	  { 		
		  for(var i in data)
		  { 						
				webpaige.con(
					options = {
						path: '/network/'+data[i].uuid+'/wish?'+range,
						//path: '/parent/availability?'+range,
						loading: data[i].name+' beschiekbaarheid wordt opgeladen..',
						label: data[i].name
						,session: session.getSession()	
					},
					function(data, label)
				  {
						for (var i in data)
						{
						  var content = '<div class="wishslot c-' + data[i].count + '">' + data[i].count + '</div>';
						  timeline_data.addRow([
						  	new Date(data[i].start * 1000), 
						  	new Date(data[i].end * 1000), 
						  	content, 
						  	label
						  ]
						  );
						}        
					  var options = {
					      'selectable': true,
					      'editable': true,
					      'groupsWidth': '100px'
					  };
						timeline.draw(timeline_data, options); 
					}
				); 
		  }
		}
	);
	
	
}

















// Timeline events
function timelineOnAdd()
{
}

function timelineOnEdit()
{
  var sel = timeline.getSelection();
  var row = sel[0].row;
  var item = timeline.getItem(row);
  var wish = timeline_data.getValue(row, 2).split('>')[1].split('<')[0];
  
  editWishModal(item.start, item.end, item.group, wish);
}

function timelineOnDelete()
{
	timeline.cancelChange();
}

function timelineOnSelect()
{
  var sel = timeline.getSelection();
  var row = sel[0].row;
  timeline_selected = timeline.getItem(row);
}

function timelineOnChange()
{
	timeline.cancelChange();
}















// Timeline navigations
function timelineZoomIn()
{
  links.Timeline.preventDefault(event);
  links.Timeline.stopPropagation(event);
  timeline.zoom(0.4);
  timeline.trigger("rangechange");
  timeline.trigger("rangechanged");
}

function timelineZoomOut()
{
  links.Timeline.preventDefault(event);
  links.Timeline.stopPropagation(event);
  timeline.zoom(-0.4);
  timeline.trigger("rangechange");
  timeline.trigger("rangechanged");
}

function timelineMoveLeft()
{
  links.Timeline.preventDefault(event);
  links.Timeline.stopPropagation(event);
  timeline.move(-0.2);
  timeline.trigger("rangechange");
  timeline.trigger("rangechanged");
}

function timelineMoveRight()
{
  links.Timeline.preventDefault(event);
  links.Timeline.stopPropagation(event);
  timeline.move(0.2);
  timeline.trigger("rangechange");
  timeline.trigger("rangechanged");
}



// Group list producers
function renderGroupsList()
{
	webpaige.con(
		options = {
			path: '/network',
			loading: 'Loading groups..',
			label: 'groups'
			,session: session.getSession()	
		},
		function(data, label)
	  {
	  	webpaige.set(label, JSON.stringify(data)); 
		  for(var i in data)
		  {  
		  	$('#groupsList').append('<option value="'+data[i].uuid+'">'+data[i].name+'</option>');		    
		  }
		}
	);
}