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
    
    var xhr = $.ajax(
    {
      url: host + '/passwordReset?uuid='+uuid.toLowerCase()+'&path='+window.location.protocol + '//' + window.location.host + '/change_password.html',
      statusCode: {
        400: function() {
          $("#alertDiv").show();
          $("#successDiv").hide();
          $("#alertMessage").html("<strong>Wachtwoord resetten is mislukt!</strong><br>Wachwoord resetten email is niet verzonden. Probeer nogmaals.");
          $("#ajaxLoader").hide();
        },
        409: function() {
          $("#alertDiv").show();
          $("#successDiv").hide();
          $("#alertMessage").html("<strong>Wachtwoord resetten is mislukt!</strong><br>Er is geen gebruiker met deze emailadres gevonden.");
          $("#ajaxLoader").hide();
        },
				200: function(data) {
          $("#alertDiv").hide();
          $("#successDiv").show();
          $("#successMessage").html("<strong>Wachtwoord resetten is succes!</strong><br>Er is een email met een wachtwoord reset link gestuurd naar " + uuid);
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
        $("#alertMessage").html("<strong>Wachtwoord resetten is mislukt!</strong><br>Er is een onbekende fout opgetreden. Probeer nogmaals.");
        $("#ajaxLoader").hide();
      },
      complete: function(xhr, status) {
      }
    });
    
  });
  
});