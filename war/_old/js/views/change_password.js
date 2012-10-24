$(document).ready(function()
{
 	pageInit('change password', 'false');
 		
	var href = window.location.href.split('?')[1];
	href = href && href.split('&'), args = {};
	for (var h in href)
	{
		h = href[h].split('=');
		args[h[0]] = h[1];
	}

  $('#email').val(args.uuid);
  
  var uuid = args.uuid;
  
  $("#alertClose").click(function()
  {
    $("#alertDiv").hide();
  });
  
  $("#resetPasswordBtn").click(function()
  {
    $("#ajaxLoader").show();

  	var pass1 = $('#pass1').val();
  	var pass2 = $('#pass2').val();
    
    if (uuid == '' || pass1 == '' || pass2 == '')
    {
      $("#alertDiv").show();
      $("#alertMessage").html("<strong>Password reset failed!</strong><br>Please fill the compulsory fields.");
      $("#ajaxLoader").hide();
      return false;
    }
    
    if (pass1 != pass2)
    {
      $("#alertDiv").show();
      $("#alertMessage").html("<strong>Password reset failed!</strong><br>Passwords do not match. Please try again.");
      $("#ajaxLoader").hide();
      return false;
    }
    else
    {
    	var pass = pass1;
    }
    
    var xhr = $.ajax(
    {
      url: host + '/passwordReset?uuid='+uuid.toLowerCase()+'&pass='+MD5(pass)+'&key='+args.key,
      statusCode: {
        400: function() {
          $("#alertDiv").show();
          $("#alertMessage").html("<strong>Reset password failed!</strong><br>This combination of e-mail address and reset key is not valid.");
          $("#ajaxLoader").hide();
        },
        409: function() {
          $("#alertDiv").show();
          $("#alertMessage").html("<strong>Reset password failed!</strong><br>No user with this e-mail was registered.");
          $("#ajaxLoader").hide();
        },
        400: function() {
          $("#alertDiv").show();
          $("#alertMessage").html("<strong>Reset password failed!</strong><br>This combination of e-mail address and reset key is not valid.");
          $("#ajaxLoader").hide();
        },
				200: function(data) {
          $("#alertDiv").hide();
          $("#successDiv").show();
          $("#successMessage").html("<strong>Reset password succeeded!</strong><br>Your password was successfully changed, you can now login.");
          $("#ajaxLoader").hide();
          $("#resetPasswordFormFields").hide();
          $("#goToLoginBtn").show();
          localStorage.setItem("loginPass", pass);
				}
      },
      xhrFields: { withCredentials: true },
      success: function(jsonData, status, xhr) {
      },
      error: function(xhr, status) {
          $("#alertDiv").show();
          $("#alertMessage").html("<strong>Reset password failed!</strong><br>An unknown error occurred, please try again.");
          $("#ajaxLoader").hide();
      },
      complete: function(xhr, status) {
      }
    });
    
  });
  
});