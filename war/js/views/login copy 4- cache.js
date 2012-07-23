$(document).ready(function()
{
	
 	pageInit('login', 'false');
 	
	/*
 	if (cache.get('login'))
 	{
 		var login = JSON.parse();
 	}
 	else
 	{
 		var login = null;
 	}
	*/
 	
 	var login = JSON.parse(local.get('login'));
 	
 	if (login != null)
 	{
	  $('#username').val(login.user);
	  $('#password').val(login.pass);
	  $('#remember').attr('checked', login.remember);
 	}
  
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
	      
	  //document.location = "dashboard.html";
  });
  
});




var session = new ask.session();





function loginAsk (user, pass, r)
{
	webpaige.con(
		options = {
			path: '/login?uuid=' + user + '&pass=' + MD5(pass),
			loading: 'Logging in..',
			400: function()
			{
        $("#alertDiv").show();
        $("#alertMessage").html("<strong>Login failed!</strong><br>Invalid username or password.");
        $("#ajaxLoader").hide();
			}	
		},
		function(data, label)
	  {  	
      if (r != null)
      {
      	var login = {};
      	login.user = user;
      	login.pass = pass;
      	login.remember = r;
      	local.set('login', JSON.stringify(login));
      }
      else
      {
      	cache.remove('login');
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
	var cache = new ASKCache("resources", '/resources', null, 'uuid', session);
	setupProfile(profiles, 'default');	
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
	window.nav = window.data.profile.modules;
	loadModules(window.data.profile.data);
}



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
	var cache = new ASKCache(label, '/'+url, null, 'uuid', session);
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


  
function loginSense()
{
	var sense = {};
	setPreloader('Logging in Sense OS..');
 	var login = JSON.parse(local.get('login'));
 	if (login != null)
 	{
		webpaige.con(
			options = {
				host: 'http://api.sense-os.nl',
				// Steven's account
				path: '/login?username=steven@sense-os.nl&password=81dc9bdb52d04dc20036dbd8313ed055',
				//path: '/login?username=' + user + '&password=' + MD5(pass),
				type: 'post',
				credentials: false,
				loading: 'Logging Sense OS..',
				label: 'sense'
				,session: session.getSession()	
			},
			function(data, label)
		  {  
	      sense.session = data["session_id"];
	      local.set('sense', JSON.stringify(sense));
	      loadSenseSensors();
			}
		);
 	}
}



function loadSenseSensors()
{
	var sense = local.get('sense');
	sense = sense ? JSON.parse(sense) : undefined;
	//console.log("sense session: ", sense.session);
	
	setPreloader('Loading Sense sensors..');
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
			local.set(label, JSON.stringify(data));
			
      //var data = JSON.parse(data);
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
      //var json = JSON.parse(xhr.responseText);
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
					var config = {};
		      config.latestPosition = date;
		      local.set('config', JSON.stringify(config));
		      // End config
		      
					
					// remember the sensor ID!
					window.latestSensor = position.sensor_id;
					window.latestPosition = position;
					
					
					local.set(label, JSON.stringify(position));
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
    
      //var json = JSON.parse(xhr.responseText);
      var data = data["data"];
      //renderLocationData(data);
      
			local.set(label, JSON.stringify(data));
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
			local.set(label, JSON.stringify(data));
		}
	);
}




























function showPreloader()
{
	window.loaderTotal = 5;
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
	
	var btn = $('<a href="dashboard.html" class="btn">Continue to dashboard</a><br><br>');
	$('#prestat').append(btn);
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
	var btn = $('<a href="dashboard.html" class="btn">Continue to dashboard</a>');
	$('#prestat').append(btn);
}