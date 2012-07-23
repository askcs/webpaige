$(document).ready(function()
{
 	pageInit('register', 'false');
	    
  //$("#registrationForm").validate();
  
  $("#alertClose").click(function()
  {
    $("#alertDiv").hide();
  });
  
  $("#registerBtn").click(function()
  {
    $("#ajaxLoader").show();
    
    var name = $('#name').val();
    var tel = $('#tel').val();
    var uuid = $('#email').val();
    var pass1 = $('#pass1').val();
    var pass2 = $('#pass2').val();
    
    if (name == '' || tel == '' || uuid == '' || pass1 == '' || pass2 == '')
    {
      $("#alertDiv").show();
      $("#alertMessage").html("<strong>Registration failed!</strong><br>Please fill the compulsory fields.");
      $("#ajaxLoader").hide();
      return false;
    }

		/*
    if (!$("#registrationForm").validate().element( "#name" ))
    {
      $("#alertDiv").show();
      $("#alertMessage").html("<strong>Registration failed!</strong><br>Please fill your name.");
      $("#ajaxLoader").hide();
      return false;
    }
		*/
    
    if (pass1 != pass2)
    {
      $("#alertDiv").show();
      $("#alertMessage").html("<strong>Registration failed!</strong><br>Passwords do not match. Please try again.");
      $("#ajaxLoader").hide();
      return false;
    }
    else
    {
    	var pass = pass1;
    }
    
    registerUser(name, tel, uuid, pass);
  });
    
  function registerUser(name, tel, uuid, pass)
  {
    console.log('name', name);
    console.log('tel', tel);
    console.log('uuid', uuid);
    console.log('pass', pass);
    console.log('Pass MD5: ' + MD5(pass));
    
    var xhr = $.ajax(
    {
      url: host + '/register?uuid=' + uuid + '&pass=' + MD5(pass) + '&name=' + name + '&phone=' + tel + '&direct=true&module=default',
      //dataType: 'jsonp',
      statusCode: {
        400: function() {
          $("#alertDiv").show();
          $("#alertMessage").html("<strong>Registration failed!</strong><br>Status code 400.");
          $("#ajaxLoader").hide();
        },
        409: function() {
          $("#alertDiv").show();
          $("#alertMessage").html("<strong>Email address is already used</strong><br>Status code 409.");
          $("#ajaxLoader").hide();
        }
      },
      xhrFields: { withCredentials: true },
      success: function(jsonData, status, xhr) {
        loginAsk(uuid, pass);
      },
      error: function(xhr, status) {
        console.log('Error!');
      },
      complete: function(xhr, status) {
      }
    });
  }
   
  function loginAsk(uuid, pass)
  {
    var xhr = $.ajax(
    {
      url: host + '/login?uuid=' + uuid + '&pass=' + MD5(pass),
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
        loginSense(uuid, pass);
        document.location = "dashboard.html";
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
    var xhr = $.ajax(
    {
      //url: 'http://api.sense-os.nl/login?username=' + uuid + '&password=' + MD5(pass),
      url: 'http://api.sense-os.nl/login?username=steven@sense-os.nl&password=81dc9bdb52d04dc20036dbd8313ed055',
      type: 'POST',
      statusCode: {
        400: function() {
        }
      },
      xhrFields: {
        withCredentials: false
      },
      success: function(jsonData, status, xhr) {
        var json = JSON.parse(xhr.responseText);
        var senseSessionId = json["session_id"];
      	console.log('senseSession ID', senseSessionId);
        localStorage.setItem("senseSessionId", senseSessionId);
      },
      error: function(xhr, status) {
        console.log('Error!');
      },
      complete: function(xhr, status) {
        
      }
    });	
  }
  
});