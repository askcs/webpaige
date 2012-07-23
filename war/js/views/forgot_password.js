$(document).ready(function()
{
 	pageInit('forgot password', 'false');
 	
  $("#alertClose").click(function()
  {
    $("#alertDiv").hide();
  });
  
  $("#successClose").click(function()
  {
    $("#successDiv").hide();
  });
  
  $("#sendPasswordLinkBtn").click(function()
  {
    $("#ajaxLoader").show();

  	var uuid = $('#email').val();
    
    var xhr = $.ajax
    {
      url: host + '/passwordReset?uuid='+uuid.toLowerCase()+'&path='+window.location.protocol + '//' + window.location.host + '/change_password.html',
      statusCode: {
        400: function() {
          $("#alertDiv").show();
          $("#successDiv").hide();
          $("#alertMessage").html("<strong>Reset password failed!</strong><br>Failed to send e-mail, please try again.");
          $("#ajaxLoader").hide();
        },
        409: function() {
          $("#alertDiv").show();
          $("#successDiv").hide();
          $("#alertMessage").html("<strong>Reset password failed!</strong><br>No user with this e-mail address was registered.");
          $("#ajaxLoader").hide();
        },
				200: function(data) {
          $("#alertDiv").hide();
          $("#successDiv").show();
          $("#successMessage").html("<strong>Reset password succeeded!</strong><br>An e-mail with a password reset link was sent to " + uuid);
          $("#ajaxLoader").hide();
          $("#inputFieldEmail").hide();
          $("#sendPasswordLinkBtn").hide();
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