function pageInit(active, logged)
{
	webpaige = new webpaige();	
	
	$('body').append('<div id="status"></div>');
	$('body').append('<div id="alert"></div>');
	
	var menuItems = new Array;		
	var menuItems = ['dashboard', 'messages', 'groups'];
	 	
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
		userdrop.append('<li><a href="profile.html"><i class="icon-user"></i> Profile</a></li>');
		userdrop.append('<li><a href="settings.html"><i class="icon-cog"></i> Settings</a></li>');
		userdrop.append('<li class="divider"></li>');
		userdrop.append('<li><a onclick="webpaige.logout()"><i class="icon-off"></i> Sign Out</a></li>');
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
			nav.append(highlighter + '<a href="' + menuItems[i] + '.html">' + menu + '</a></li>');
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
  
  $('title').html('WebPaige :: ' + active.charAt(0).toUpperCase() + active.slice(1));
}







var session = new ask.session();



webpaige = function()
{
  this.options = {
  	host: host,
  	path: null,
  	json: null,
  	type: 'get',
  	session: session,
  	credentials: true,
  	loading: 'Loading..',
  	message: 'Success!',
  	label: 'not_labeled',
  	400: null,
  };  
	window.data = [];
	if (localStorage)
	{
		// localStorage is supported..
	}
	else
	{
		// localStorage is not supported at all..
	}
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
	/*
	if (webpaige.get('config') == null)
	{
		webpaige.set('config', '{}');
		console.log('there was no config');
	}
	else
	{
	*/
		//console.log(key, value);
			
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
/* 	} */
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
    	callback(data, options.label);
    },
    error: function(jqXHR, exception)
    {
      if (jqXHR.status === 0)
      {
      	webpaige.alert('Not connected. Verify Network.');
      }
      else if (jqXHR.status == 400)
      {
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
}


webpaige.prototype.alert = function(message)
{
	$('#message').remove();
	$('#alert').append('<div id="message">Error! ' + message + "</div>");
	$('#alert').show();
}


webpaige.prototype.logout = function()
{
	webpaige.con(
		options = {
			path: '/logout',
			loading: 'Logging out..'
			,session: session.getSession()	
		},
		function(data)
	  {
	  	var login = webpaige.get('login');  
			webpaige.clear();
			webpaige.set('login', login);
			document.location = "login.html";
		}
	); 
}










