$(document).ready(function()
{
/*
	jQuery.i18n.properties({
    name:'Login', 
    path:'local/', 
    mode:'both',
    language:'nl_NL', 
    callback: function()
    {
    	jQuery.i18n.prop('login_title');
    	$('title').html(login_title);
    	
    	jQuery.i18n.prop('login_h2');
    	$('#login_h2').html(login_h2);
    	
    	jQuery.i18n.prop('login_enter_email');
    	$('#login_enter_email').html(login_enter_email);
    	
    	jQuery.i18n.prop('login_password');
    	$('#login_password').html(login_password);
    	
    	jQuery.i18n.prop('login_remember');
    	$('#login_remember').html(login_remember);
    	
    	jQuery.i18n.prop('login_login');
    	$('#login_login').html(login_login);
    	
    	jQuery.i18n.prop('login_forgot');
    	$('#login_forgot').html(login_forgot);
    }
	});
*/

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
  loginAsk (user.toLowerCase(), pass, r);
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
		case 'teamleider':
			//user = '4170durinck';
			//pass = 'f5212ff3f9bac5439368462f2e791558';
			user = '4058fok';
			pass = '288116504f5e303e4be4ff1765b81f5d';
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
			//loading: 'Logging in..'
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
					//loading: 'Loading resources..',
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
				  trange.start = Date.today().add({ days: -5 });
				  trange.end = new Date();
				  trange.end = Date.today().add({ days: 5 });
				  
				  webpaige.config('trange', trange);	
				  webpaige.config('treset', trange);		
				  
				  	
					// logging in Sense
					/*
					var sense = {};
					
					webpaige.con(
						options = {
							host: 'http://api.sense-os.nl',
							path: '/login?username=' + user + '&password=' + MD5(pass),
							type: 'post',
							credentials: false,
							loading: 'Logging Sense OS..',
							label: 'sense'
							,session: session.getSession()	
						},
						function(data, label)
					  {  
				      sense.session = data["session_id"];
				      webpaige.set('sense', JSON.stringify(sense));
				      */
							
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
						      // finally redirect
						       //debugger;
									document.location = "dashboard.html";
								}
							);
					
					
							/*
						}
					);
					*/
					// end of sense login	 
					
					
					
					
					
					/*
					// Changed order
					// logging in Sense
					var sense = {};
					
					webpaige.con(
						options = {
							host: 'http://api.sense-os.nl',
							path: '/login?username=' + user + '&password=' + MD5(pass),
							type: 'post',
							credentials: false,
							loading: 'Logging Sense OS..',
							label: 'sense'
							,session: session.getSession()	
						},
						function(data, label)
					  {  
				      sense.session = data["session_id"];
				      webpaige.set('sense', JSON.stringify(sense));
				      
				      // finally redirect
							document.location = "dashboard.html";
						}
					);
					*/
					
					
 	
 	
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
				  trange.start = Date.today().add({ days: -5 });
				  trange.end = new Date();
				  trange.end = Date.today().add({ days: 5 });
				  
				  webpaige.config('trange', trange);	
				  webpaige.config('treset', trange);		
				  
				  	
					// logging in Sense
					/*
					var sense = {};
					
					webpaige.con(
						options = {
							host: 'http://api.sense-os.nl',
							path: '/login?username=' + user + '&password=' + MD5(pass),
							type: 'post',
							credentials: false,
							loading: 'Logging Sense OS..',
							label: 'sense'
							,session: session.getSession()	
						},
						function(data, label)
					  {  
				      sense.session = data["session_id"];
				      webpaige.set('sense', JSON.stringify(sense));
				      */
				      
				      var url = (data.role < 3) ? '/network' : '/parent';				      				      
				      
							//debugger;
							
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
								  
								  //debugger;								  
						      // finally redirect
									document.location = "dashboard.html";
								}
							);
					
					
							/*
						}
					);
					*/
					// end of sense login	 
					
					
					
					
					
					/*
					// Changed order
					// logging in Sense
					var sense = {};
					
					webpaige.con(
						options = {
							host: 'http://api.sense-os.nl',
							path: '/login?username=' + user + '&password=' + MD5(pass),
							type: 'post',
							credentials: false,
							loading: 'Logging Sense OS..',
							label: 'sense'
							,session: session.getSession()	
						},
						function(data, label)
					  {  
				      sense.session = data["session_id"];
				      webpaige.set('sense', JSON.stringify(sense));
				      
				      // finally redirect
							document.location = "dashboard.html";
						}
					);
					*/
					
					
 	
 	
				}
			);
		}
	);
}



// These codes are depreciated

function loginAskOriginal (user, pass, r)
{
	webpaige.set('config', '{}');
	webpaige.con(
		options = {
			path: '/login?uuid=' + user + '&pass=' + MD5(pass),
			loading: 'Logging in..'
			/*
			,
			400: function()
			{
        $("#alertDiv").show();
        $("#alertMessage").html("<strong>Login failed!</strong><br>Invalid username or password.");
        $("#ajaxLoader").hide();
			}	
			*/
		},
		function(data, label)
	  {  	
      if (r != null)
      {
      	var login = {};
      	login.user = user;
      	//login.pass = pass;
      	login.remember = r;
      	webpaige.set('login', JSON.stringify(login));
      }
      else
      {
      	webpaige.remove('login');
      }
      session.setSession(data["X-SESSION_ID"]);
      document.cookie = "sessionId=" + session;
      showPreloader();
      loadProfiles();
		}
	);
}



function loadProfiles()
{
	setPreloader('Loading profiles..');
	
	// here we are going to get profiles	
	var profiles = '[{"knrm":{"homepage":"dashboard.html","modules":["messages","groups"],"data":[{"label":"messages","url":"question/"}]},"default":{"homepage":"dashboard.html","modules":["messages","groups"],"data":[{"label":"slots","url":"askatars/ulusoy.cengiz@gmail.com/slots?start=1334305782&end=1348820982"},{"label":"messages","url":"question"},{"label":"groups","url":"network"}]}}]';
	
	loadResources(profiles);
}



function loadResources(profiles)
{
	setPreloader('Loading resources..');
	webpaige.con(
		options = {
			path: '/resources',
			loading: 'Loading resources..',
			label: 'resources',
			session: session.getSession()	
		},
		function(data, label)
	  {  	
			webpaige.set(label, JSON.stringify(data));
			// here comes the profile type to be passed to loadProfile
			setupProfile(profiles, 'default');
		}
	);	
}



function setupProfile(profiles, user)
{
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
	window.nav = window.data.profile.modules;
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
		if (calls[i].label == 'messages')
		{
			var inboxes = {
				inbox: 'question?0=dm',
				outbox: 'question?0=sent',
				pinbox: 'question'
			};
			for (var n in inboxes)
			{
				loadModule(n, inboxes[n]);
			}
		}
		else
		{
			loadModule(calls[i].label, calls[i].url);
		}	
	}
	loginSense();
}



function loadModule(label, url)
{
	setPreloader('Loading '+label+'..'); 
	webpaige.con(
		options = {
			path: '/'+url,
			loading: 'Loading '+label+'..',
			label: label
			,session: session.getSession()	
		},
		function(data, label)
	  {  	
			switch (label)
			{
				case 'groups':
					webpaige.set(label, JSON.stringify(data));
	  			loadMembers();
	  			loadContacts();
	  			// ready to launch
      		continueToDashboard();
				break;
				case 'resources':
					webpaige.set(label, JSON.stringify(data));
				break;
				default:
					webpaige.set(label, data);
			}
		}
	);
}	



function countUnreadMessages()
{
	var messages = JSON.parse(webpaige.get('inbox'));
	
	console.log('messages :', messages);
	
	//messages = messages ? JSON.parse(messages) : undefined;
	var count = 0;
	for (var i in messages)
	{
		if (messages[i].state === "NEW")
		{
			count++;
		}
	}
	webpaige.config('unreadMessages', count);
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


  
function loginSense()
{
	var sense = {};
	setPreloader('Logging in Sense OS..');
 	var login = JSON.parse(webpaige.get('login'));
 	if (login != null)
 	{
		webpaige.con(
			options = {
				host: 'http://api.sense-os.nl',
				// Steven's account
				//path: '/login?username=steven@sense-os.nl&password=81dc9bdb52d04dc20036dbd8313ed055',
				path: '/login?username=' + login.user + '&password=' + MD5(login.pass),
				type: 'post',
				credentials: false,
				loading: 'Logging Sense OS..',
				label: 'sense'
				,session: session.getSession()	
			},
			function(data, label)
		  {  
	      sense.session = data["session_id"];
	      webpaige.set('sense', JSON.stringify(sense));
	      loadSenseSensors();
			}
		);
 	}
}



function loadSenseSensors()
{
	setPreloader('Loading Sense sensors..');
	var sense = webpaige.get('sense');
	sense = sense ? JSON.parse(sense) : undefined;
	webpaige.con(
		options = {
			host: 'http://api.sense-os.nl',
			path: '/sensors?per_page=1000',
			loading: 'Loading Sense sensors..',
			session: sense.session,
			credentials: false,
			label: 'sensors'
		},
		function(data, label)
	  {  
			webpaige.set(label, JSON.stringify(data));
      var sensors = data["sensors"];
      var latest = -1;
      window.positionSensors = [];
      $.each(sensors, 
      function(i, item)
      {
        if (item.name == "Location")
        {
          loadLocationData(item.id, sense.session);
        }
        else if (item.name == "Activity")
        {
          loadActivityData(item.id, sense.session);
        }
        else if (item.name == "position")
        {
          window.positionSensors.push(item.id);
        }
      });
			setPreloader('Loading position data..');
      $.each(window.positionSensors, 
      function(i, item)
      {
        loadPositionData(item, sense.session);
      });
		}
	);
}



function loadPositionData(sensorID, session)
{
	//setPreloader('Loading position data..');
	webpaige.con(
		options = {
			host: 'http://api.sense-os.nl',
			path: '/sensors/' + sensorID + '/data.json?last=1',
			loading: 'Loading position data..',
			session: session,
			credentials: false,
			label: 'position'
		},
		function(data, label)
	  {  
    	// ? check later
      var data = data["data"];      
      // remove sensor ID from global list of uitstaande requests      
      //console.log("response from ", sensorID);
      window.positionSensors.splice(window.positionSensors.indexOf(sensorID), 1);
      // check if data is latest
      if (data.length > 0)
      {   	
	      var position = data.pop();    
	      var date = position.date;
				if (undefined == window.latest || date > window.latest)
				{			        
			    //console.log("this sensor is now the latest: " , sensorID, " ", date);
					// this sensor is the latest
					window.latest = date;
					
					
					// INIT config	
					//var config = webpaige.get('config');
					//config.unread = count;
					//webpaige.set('config', config);
	
					//var config = {};
		      //config.latestPosition = date;
		      //webpaige.set('config', JSON.stringify(config));
		      webpaige.config('latestPosition', date);
		      // End config
		      
		      
		      
					// remember the sensor ID!
					window.latestSensor = position.sensor_id;
					window.latestPosition = position;
					webpaige.set(label, JSON.stringify(position));
	      }
	      else
	      {
			  	// this sensor is not the latest
	      }	
      }             
      // check if all sensors have responded       
      //console.log("wp ", window.positionSensors);
      if (window.positionSensors.length == 0)
      {
       // KLAAR
       //window.latestSensor;
	   		var value;
	      value = JSON.parse(window.latestPosition.value);
      }
		}
	);
}



function loadLocationData(sensorID, session)
{
	setPreloader('Loading location data..');
	webpaige.con(
		options = {
			host: 'http://api.sense-os.nl',
			path: '/sensors/' + sensorID + '/data.json?last=1',
			loading: 'Loading location data..',
			session: session,
			credentials: false,
			label: 'location'
		},
		function(data, label)
	  {  
      var data = data["data"];
			webpaige.set(label, JSON.stringify(data));
		}
	);
}



function loadActivityData(sensorID, session)
{
	setPreloader('Loading activity data..');
	webpaige.con(
		options = {
			host: 'http://api.sense-os.nl',
			path: '/sensors/' + sensorID + '/data.json?last=1',
			loading: 'Loading activity data..',
			session: session,
			credentials: false,
			label: 'activity'
		},
		function(data, label)
	  {  
      var data = data["data"];
			webpaige.set(label, JSON.stringify(data));
		}
	);
}



function showPreloader()
{
	window.loaderTotal = 2;
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



function continueToDashboard()
{
	countUnreadMessages();
	var btn = $('<br><a href="dashboard.html" class="btn">Continue to dashboard</a>');
	$('#prestat').append(btn);
}