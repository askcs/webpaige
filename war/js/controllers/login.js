$(document).ready(function()
{
/*
	var session = new ask.session(relogin);
	// TODO //
	function relogin() { window.location = "login.html"; }
	
	
	console.log('session:', session);
	
	webpaige = new webpaige();
*/
	
	//var webpaige = new webpaige();
	 	
 	var login = JSON.parse(webpaige.get('login'));
 	
 	if (login != null)
 	{
	  $('#username').val(login.user);
	  $('#remember').attr('checked', login.remember);
 	};
 	
  $("#alertClose").click(function()
  {
    $("#alertDiv").hide();
  });
  
  $("#loginBtn").click(function()
  {
  
  	log('login inited');
  	
	  $("#ajaxLoader").show();
	  
	  var userDef = "Username";
	  var passDef = "password";
	  var user = $('#username').val();
	  var pass = $('#password').val();
	  var r = $('#remember:checked').val();
	  
	  if (user == '' || user == userDef)
	  {
	    $("#alertDiv").show();
	    $("#alertMessage").html('<strong>Login mislukt!</strong><br>Geen gebruikersnaam opgegeven.');
	    $("#ajaxLoader").hide();
	    return false;
	  }
	  
	  if (pass == '' || pass == passDef)
	  {
	    $("#alertDiv").show();
	    $("#alertMessage").html('<strong>Login mislukt!</strong><br>Geen wachtwoord opgegeven.');
	    $("#ajaxLoader").hide();
	    return false;
	  }
	  
	  loginAsk (user.toLowerCase(), MD5(pass), r);
  });
  
  /*
	window.addEventListener( 'keypress', function (event)
	{
		if ( event.keyCode === 13 ) loginHandler();		
	});
	*/
	
});


function loginAsk (user, pass, r)
{
	webpaige.set('config', '{}');
	
	
	console.log('session outside ajax :', session);
	
	
	// logging in ask
	webpaige.con(
		options = {
			path: '/login?uuid=' + user + '&pass=' + pass,
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
      
      console.log('session in ajax call: ', session);
      
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
							
							
							document.location = "index.html#/dashboard";
							
							//console.log('logged successfully. session: ', session.getSession());
						}
					);
 	
				}
			);
		}
	);
}

	
function loginAs(type)
{
	switch (type)
	{
		case 'planner':
			user = 'beheer';
			pass = '319fcaa585c17eff5dcc2a57e8fc853f';
		break;
		case 'teamleider':
			user = '4058fok';
			pass = '288116504f5e303e4be4ff1765b81f5d';
		break;
		case 'volunteer':
			user = '4780aldewereld';
			pass = 'd9a6c9bad827746190792cf6f30d5271';
		break;		
	}
	loginAsk (user, pass, true);
}