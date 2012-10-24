$(document).ready(function()
{
 	pageInit('login', 'false');
 	
  $('#username').val(localStorage.getItem('loginUser'));
  $('#password').val(localStorage.getItem('loginPass'));
  $('#remember').attr('checked', localStorage.getItem('loginRemember'));
  
  $("#alertClose").click(function()
  {
    $("#alertDiv").hide();
  });
  
  $("#loginBtn").click(function()
  {
    $("#ajaxLoader").show();
    
    var userDef = "Username"; //$('#username').attr('value');
    var passDef = "password"; //$('#password').attr('value');
    var user = $('#username').val();
    var pass = $('#password').val();
    var r = $('#remember:checked').val();
    
    //console.log(pass);
    //console.log('Pass: ' + MD5(pass));
    
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



function loginAsk (user, pass, r)
{
  var xhr = $.ajax(
  {
    url: host + '/login?uuid=' + user + '&pass=' + MD5(pass),
    statusCode: {
      400: function() {
        $("#alertDiv").show();
        $("#alertMessage").html("<strong>Login failed!</strong><br>Invalid username or password.");
        $("#ajaxLoader").hide();
      }
    },
    xhrFields: { withCredentials: true },
    success: function(jsonData, status, xhr) {
      localStorage.setItem('loggedIn', '1');
      if (r != null)
      {
        localStorage.setItem("loginUser", user);
        localStorage.setItem("loginPass", pass);
        localStorage.setItem("loginRemember", r);
      }
      else
      {
        localStorage.removeItem("loginUser");
        localStorage.removeItem("loginPass");
        localStorage.removeItem("loginRemember");
      }
      loginSense(user, pass);
    },
    error: function(xhr, status) {
      console.log('Error!');
    },
    complete: function(xhr, status) {
      var json = JSON.parse(xhr.responseText);
      var sessionId = json["X-SESSION_ID"];
      var session = new ask.session();
      session.setSession(sessionId);
      document.cookie = "sessionId=" + session;
      console.log('Session ID: ', sessionId);
    }
  });
}

    
function loginSense(user, pass)
{
	//console.log('loginsense', user,pass);
	
  var xhr = $.ajax(
  {
    //url: 'http://api.sense-os.nl/login?username=' + user + '&password=' + MD5(pass),
    url: 'http://api.sense-os.nl/login?username=steven@sense-os.nl&password=81dc9bdb52d04dc20036dbd8313ed055',
    type: 'POST',
    statusCode: {
      400: function() {
      }
    },
    xhrFields: { withCredentials: false },
    success: function(jsonData, status, xhr) {
      var json = JSON.parse(xhr.responseText);
      var senseSessionId = json["session_id"];
    	console.log('senseSession ID', senseSessionId);
      localStorage.setItem("senseSessionId", senseSessionId);
      document.location = "dashboard.html";
    },
    error: function(xhr, status) {
      console.log('Error!');
    },
    complete: function(xhr, status) {
    }
  });	
}