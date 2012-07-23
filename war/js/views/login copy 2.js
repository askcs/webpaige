$(document).ready(function()
{

 	pageInit('login', 'false');
 	
 	var login = JSON.parse(cache.get('login'));
  $('#username').val(login.user);
  $('#password').val(login.pass);
  $('#remember').attr('checked', login.remember);
  
  $("#alertClose").click(function()
  {
    $("#alertDiv").hide();
  });
  
  $("#loginBtn").click(function()
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
      $("#alertMessage").html("<strong>Login failed!</strong><br>No username given.");
      $("#ajaxLoader").hide();
      return false;
    }
    
    if (pass == '' || pass == passDef)
    {
      $("#alertDiv").show();
      $("#alertMessage").html("<strong>Login failed!</strong><br>No password given.");
      $("#ajaxLoader").hide();
      return false;
    }
    
    loginAsk (user, pass, r);
  });
  
});

var session = new ask.session();

function loginAsk (user, pass, r)
{
  $.ajax(
  {
    url: host + '/login?uuid=' + user + '&pass=' + MD5(pass),
    statusCode: {
      400: function()
      {
        $("#alertDiv").show();
        $("#alertMessage").html("<strong>Login failed!</strong><br>Invalid username or password.");
        $("#ajaxLoader").hide();
      }
    },
    xhrFields: { withCredentials: true },
    success: function(jsonData, status, xhr)
    {
      //localStorage.setItem('loggedIn', '1');
      if (r != null)
      {
      	var login = {};
      	login.user = user;
      	login.pass = pass;
      	login.remember = r;
      	cache.set('login', JSON.stringify(login));
      }
      else
      {
      	cache.remove('login');
      }
      //loginSense(user, pass);
    },
    error: function(xhr, status)
    {
      console.log('Error!');
    },
    complete: function(xhr, status)
    {
      var json = JSON.parse(xhr.responseText);
      var sessionId = json["X-SESSION_ID"];
      var session = new ask.session();
      session.setSession(sessionId);
      document.cookie = "sessionId=" + session;
      
      showPreloader();
      loadProfiles();
    }
  });
}



function loadProfiles()
{
	setPreloader('Loading profiles..');
	// here we are going to get profiles	
	//var profiles = '[{"default":{"homepage":"_dashboard.html","modules":["messages","groups"],"data":[{"label":"_messages","url":"question"},{"label":"_groups","url":"network"}]}}]';
	var profiles = '[{"knrm":{"homepage":"dashboard.html","modules":["messages","groups"],"data":[{"label":"messages","url":"question/"}]},"default":{"homepage":"dashboard.html","modules":["messages","groups"],"data":[{"label":"slots","url":"askatars/ulusoy.cengiz@gmail.com/slots?start=1334305782&end=1348820982"},{"label":"messages","url":"question"},{"label":"groups","url":"network"}]}}]';
	
	loadResources(profiles);
}




function loadResources(profiles)
{
	setPreloader('Loading resources..');  
	webpaige.con('get', '/resources', null, 'Loading resources..', null,
	function(data)
  {  	
		window.data.resources = data;
		// here comes the profile type to be passed to loadProfile
		setupProfile(profiles, 'default');
	}, 'resources');
}



function setupProfile(profiles, user)
{
	//setPreloader('Setting up user modules..');
	var profiles = JSON.parse(profiles);
	for (var m in profiles)
	{
		var profile = profiles[m][user];
		for (var i in profile)
		{
			window.data.profile = profile;
		}
	}
	
	//loadMenu(window.data.profile.modules);
	window.data.nav = window.data.profile.modules;
	
	loadModules(window.data.profile.data);
}



/*
function loadMenu(modules)
{
	setPreloader('Loading navigation..');
	for (var i in modules)
	{
		console.log("menu item: ", modules[i]);
	}
}
*/



function loadModules(calls)
{
	for (var i in calls)
	{
		webpaige.con(
			'get', 
			'/'+calls[i].url, 
			null, 
			'Loading '+calls[i].label+'..', 
			null,
			function(data, label)
		  {		
			},
			calls[i].label);
	  	setPreloader('Loading '+calls[i].label+'..');
	  	
	  	switch (calls[i].label)
	  	{
	  		case 'messages':
	  			countUnreadMessages();
	  			loadContacts();
	  		break;
	  		case 'groups':
	  			loadMembers();
	  		break;
	  	}
	}
}



function countUnreadMessages()
{
	var messages = cache.get('messages');
	messages = messages ? JSON.parse(messages) : undefined;
	
	var count = 0;
	for (var i in messages)
	{
		if (messages[i].state === "NEW")
		{
			count++;
		}
	}
	console.log("Unread messages: ", count);
}



function loadContacts()
{
	setPreloader('Loading contacts..');
  var json = '{"key":""}';
	webpaige.con(
		'post', 
		'/network/searchPaigeUser', 
		json, 
		'Loading contacts..', 
		null,
		function(data, label)
	  {		  	 	
			cache.set('contacts', data);
		});
}



function loadMembers()
{
	setPreloader('Loading members..');
	
	var groups = cache.get('groups');
	groups =  JSON.parse(groups);
	
	for (var i in groups)
	{
		
		//console.log(groups[i]);
		/*
		webpaige.con('get', '/network/'+groups[i].uuid+'/members', null, 'Loading members..', null,
		function(data)
	  {
	  	console.log(data);
		});
		*/
	}
}




function showPreloader()
{
	window.loaderTotal = 7;
 	$('#live').remove();
	var live = $('<div id="live"></div>');
	var well = $('<div class="span3 well">');
	var title = $('<h3><span class="entypo eMedium">+</span> Personalizing WebPaige</h3><hr>');
	well.append(title);
	var progress = $('<div class="progress progress-striped active"></div>');
	var bar = $('<div class="bar" style="width: 0%;"></div>');
	progress.append(bar);
	well.append(progress);
	var loading = $('<p><span id="prestat"></span></p>');
	well.append(loading);
	live.append(well);
	$('#content').html(live);
}

function setPreloader(status)
{
	window.current = (window.current == undefined) ? 1 : window.current;
	$('#prestat').append(status + '<br>');
	var progress = (100/window.loaderTotal)*(Math.round(++window.current));
	$('.bar').width(progress); 
}






  
function loginSense(user, pass)
{
  var xhr = $.ajax(
  {
    //url: 'http://api.sense-os.nl/login?username=' + user + '&password=' + MD5(pass),
    url: 'http://api.sense-os.nl/login?username=steven@sense-os.nl&password=81dc9bdb52d04dc20036dbd8313ed055',
    type: 'POST',
    statusCode:{
      400: function()
      {
      }
    },
    xhrFields: { withCredentials: false },
    success: function(jsonData, status, xhr)
    {
      var json = JSON.parse(xhr.responseText);
      var senseSessionId = json["session_id"];
      localStorage.setItem("senseSessionId", senseSessionId);
      
      document.location = "dashboard.html";
    },
    error: function(xhr, status)
    {
      console.log('Error!');
    },
    complete: function(xhr, status)
    {
    }
  });	
}