var session = new ask.session(relogin);
function relogin() {
	//window.location = "login.html";
}






/* 
WEBPAIGE
*/
//var session = new ask.session(relogin);
/*
function relogin() {
	window.location = "login.html";
}
*/


function pageInit__(active, logged)
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
  	//session: session,
  	session: '6ae2d6e8b89bb894162d960dce5791b0de3ca6bf1e8372d97e5da085b7ad967d',
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

webpaige = new webpaige();	


function pageInit_(active, logged)
{
	webpaige = new webpaige();	
	
	$('body').append('<div id="status"></div>');
	$('body').append('<div id="alert"></div>');
	
	var menuItems = new Array;		
	//var menuItems = ['dashboard', 'messages', 'groups'];
	var menuItems = ['planboard', 'berichten', 'groepen'];
	var menuLinks = ['dashboard', 'messages', 'groups']
	 	
  //var user = JSON.parse(localStorage.getItem('user'));
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
		
		/*
		var unread = webpaige.config('unreadMessages');
		if (unread != undefined)
		{
			if (unread != 0)
			{
				unread =  ' <span class="badge badge-warning">' + unread + '</span>';
			}
		}
		else
		{
			unread = '';
		}
		*/
		
		for(var i in menuItems)
		{
			if (menuLinks[i] != 'groups' || webpaige.config('userRole') < 2)
			{
				if (active == menuItems[i])
					highlighter = '<li class="active">'; else highlighter = '<li>';
					/*
					if (menuItems[i] == 'messages')
					{
						var menu = menuItems[i].charAt(0).toUpperCase() + menuItems[i].slice(1) + ' ' + unread;
					}
					else
					{
					*/
						var menu = menuItems[i].charAt(0).toUpperCase() + menuItems[i].slice(1);
					/* 				
					}
					*/
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







