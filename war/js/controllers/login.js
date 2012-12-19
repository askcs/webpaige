$(document).ready(function()
{ 	
 	var login = JSON.parse(webpaige.get('login'));
 	
 	if (login != null)
 	{
		$('#username').val(login.user);
		$('#password').val(login.pass);
		$('#remember').attr('checked', login.remember);
 	}
 	
	$("#alertClose").click(function()
	{
		$("#alertDiv").hide();
	})

	$("#loginBtn").click(function()
	{
		$("#ajaxLoader").show();

		var userDef 	= "Username";
		var passDef 	= "password";
		var user 		= $('#username').val();
		var pass 		= $('#password').val();
		var r 			= $('#remember:checked').val();

		// TODO: check this part later
		if (user == '' || user == userDef)
		{
			$("#alertDiv").show();
			$("#alertMessage").html('<strong>Login mislukt!</strong><br>Geen gebruikersnaam opgegeven.');
			$("#ajaxLoader").hide();
			return false;
		}

		// TODO: same here as well
		if (pass == '' || pass == passDef)
		{
			$("#alertDiv").show();
			$("#alertMessage").html('<strong>Login mislukt!</strong><br>Geen wachtwoord opgegeven.');
			$("#ajaxLoader").hide();
			return false;
		}

		loginAsk(user.toLowerCase(), pass, r);
	})
	
})

function loginAsk(user, pass, r)
{		
  	$.ajax(
	{
		url: host 	+ '/login?uuid=' 
					+ user 
					+ '&pass=' 
					+ MD5(pass),
		contentType: 'application/json',
		xhrFields: { 
			withCredentials: true
		}	
	})
	.success(
	function(data)
	{
		saveUser(user, pass, r);

		saveCookie(data);
		
		document.location = "index.html#/preloader";
	})
}

function saveCookie(data)
{
	session.setSession(data["X-SESSION_ID"]);
	document.cookie = "sessionId=" + session;
}

function saveUser(user, pass, r)
{
	if (r != null)
	{
		webpaige.set('login', 
		JSON.stringify({
		  	user: user,
		  	pass: pass,
		  	remember: r
		}))
	}
	else
	{
		webpaige.remove('login')
	}
}

