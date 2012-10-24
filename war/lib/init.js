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







